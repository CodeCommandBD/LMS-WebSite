import Stripe from "stripe";
import Purchase from "../Models/purchase.model.js";
import Course from "../Models/course.model.js";
import User from "../Models/user.model.js";

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

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Check if user is already enrolled
    const user = await User.findById(userId);
    if (user.enrolledCourses.includes(courseId)) {
      return res
        .status(400)
        .json({ success: false, message: "Already enrolled" });
    }

    // Create session
    const stripe = getStripe();
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
      success_url: `${process.env.FRONTEND_URL}/purchase-success?courseId=${courseId}`,
      cancel_url: `${process.env.FRONTEND_URL}/course-detail/${courseId}`,
      metadata: {
        courseId: courseId.toString(),
        userId: userId.toString(),
      },
    });

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
    console.error("Stripe Session Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const stripe = getStripe();
    const payloadString = JSON.stringify(req.body);
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: process.env.STRIPE_WEBHOOK_SECRET,
    });

    // In production, we use req.rawBody or similar.
    // Here we'll handle the event directly for now assuming it's passed through correctly.
    event = req.body;
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
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
      if (user && !user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        await user.save();
      }

      // 3. Add user to course students
      const course = await Course.findById(courseId);
      if (course && !course.enrolledStudents.includes(userId)) {
        course.enrolledStudents.push(userId);
        await course.save();
      }

      console.log("Enrollment fulfilled for user:", userId);
    } catch (error) {
      console.error("Webhook Fulfillment Error:", error);
    }
  }

  res.status(200).json({ received: true });
};
