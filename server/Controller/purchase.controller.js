import Stripe from "stripe";
import Purchase from "../models/purchase.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

// Helper to get Stripe instance
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY is not defined in environment variables",
    );
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    console.log("Creating checkout session:", { courseId, userId });

    const course = await Course.findById(courseId);
    if (!course) {
      console.log("Checkout failed: Course not found", courseId);
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Check if user is already enrolled
    const user = await User.findById(userId);
    if (!user) {
      console.log("Checkout failed: User not found", userId);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.enrolledCourses?.some((id) => id.toString() === courseId)) {
      console.log("Checkout failed: User already enrolled", {
        userId,
        courseId,
      });
      return res
        .status(400)
        .json({ success: false, message: "Already enrolled" });
    }

    // Create session
    const stripe = getStripe();
    console.log("Initializing Stripe checkout...");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: course.courseTitle,
              description: course.subTitle || "Course enrollment",
            },
            unit_amount: Math.round(course.price * 100), // convert to cents/paisa
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?courseId=${courseId}`,
      cancel_url: `${process.env.CLIENT_URL}/course-detail/${courseId}`,
      metadata: {
        courseId: courseId.toString(),
        userId: userId.toString(),
      },
    });

    console.log("Stripe session created successfully:", session.id);

    // Create a pending purchase record
    await Purchase.create({
      courseId,
      userId,
      amount: course.price,
      status: "pending",
      paymentId: session.id,
    });

    return res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Stripe Session Error Details:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const stripeWebhook = async (req, res) => {
  let event;
  const stripe = getStripe();

  try {
    // If we're using express.raw, req.body is a Buffer
    const payload = req.body;
    const sig = req.headers["stripe-signature"];

    if (process.env.STRIPE_WEBHOOK_SECRET && sig) {
      // Production mode with signature verification
      event = stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } else {
      // Fallback/Testing mode: parse the buffer directly
      event = JSON.parse(payload.toString());
      console.log("Webhook received (parsed from Buffer):", event.type);
    }
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { courseId, userId } = session.metadata;

    try {
      // 1. Update purchase status
      await Purchase.findOneAndUpdate(
        { paymentId: session.id },
        { status: "completed" },
      );

      // 2. Enroll user in course
      const user = await User.findById(userId);
      console.log("Found user for enrollment:", user?._id);

      if (user) {
        const isAlreadyEnrolled = user.enrolledCourses.some(
          (id) => id.toString() === courseId,
        );
        if (!isAlreadyEnrolled) {
          user.enrolledCourses.push(courseId);
          await user.save();
          console.log("Successfully enrolled user in course:", courseId);
        } else {
          console.log("User already enrolled in course:", courseId);
        }
      }

      // 3. Add user to course students
      const course = await Course.findById(courseId);
      if (course) {
        const isAlreadyStudent = course.enrolledStudents.some(
          (id) => id.toString() === userId,
        );
        if (!isAlreadyStudent) {
          course.enrolledStudents.push(userId);
          await course.save();
          console.log("Successfully added user to course student list");
        }
      }

      console.log("Enrollment fulfillment complete for user:", userId);
    } catch (error) {
      console.error("Webhook Fulfillment Error:", error);
    }
  }

  res.status(200).json({ received: true });
};

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = {};
    if (userRole === "teacher") {
      // Teachers only see their own courses
      const courses = await Course.find({ creator: userId });
      const courseIds = courses.map((course) => course._id);
      query = { courseId: { $in: courseIds } };
    }
    // Admins see everything (empty query)

    const purchases = await Purchase.find({
      ...query,
      status: "completed",
    }).populate("courseId");

    const totalRevenue = purchases.reduce((acc, curr) => acc + curr.amount, 0);
    const totalSales = purchases.length;

    // Aggregate stats by course
    const courseStatsMap = {};
    purchases.forEach((purchase) => {
      const courseId = purchase.courseId?._id?.toString();
      const courseTitle = purchase.courseId?.courseTitle || "Unknown Course";

      if (!courseStatsMap[courseId]) {
        courseStatsMap[courseId] = {
          name: courseTitle,
          revenue: 0,
          sales: 0,
        };
      }
      courseStatsMap[courseId].revenue += purchase.amount;
      courseStatsMap[courseId].sales += 1;
    });

    const courseStats = Object.values(courseStatsMap);

    return res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalSales,
        courseStats,
      },
    });
  } catch (error) {
    console.error("Stats Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
