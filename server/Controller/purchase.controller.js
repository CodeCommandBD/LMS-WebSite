import Stripe from "stripe";
import Purchase from "../models/purchase.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import CourseProgress from "../models/courseProgress.model.js";

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

    let courseQuery = {};
    let purchaseQuery = {};
    if (userRole === "teacher") {
      // Teachers only see their own courses
      const teacherCourses = await Course.find({ creator: userId });
      const courseIds = teacherCourses.map((course) => course._id);
      purchaseQuery = { courseId: { $in: courseIds } };
      courseQuery = { creator: userId };
    }
    // Admins see everything (empty query)

    // --- Existing: Revenue & Sales ---
    const purchases = await Purchase.find({
      ...purchaseQuery,
      status: "completed",
    }).populate("courseId");

    const totalRevenue = purchases.reduce((acc, curr) => acc + curr.amount, 0);
    const totalSales = purchases.length;

    // Aggregate stats by course
    const courseStatsMap = {};
    purchases.forEach((purchase) => {
      const cId = purchase.courseId?._id?.toString();
      const courseTitle = purchase.courseId?.courseTitle || "Unknown Course";
      if (!courseStatsMap[cId]) {
        courseStatsMap[cId] = { name: courseTitle, revenue: 0, sales: 0 };
      }
      courseStatsMap[cId].revenue += purchase.amount;
      courseStatsMap[cId].sales += 1;
    });
    const courseStats = Object.values(courseStatsMap);

    // --- NEW: Total Students ---
    const totalStudents = await User.countDocuments({ role: "student" });

    // --- NEW: Active (Published) Courses ---
    const activeCourses = await Course.countDocuments({
      ...courseQuery,
      isPublished: true,
    });

    // --- NEW: Completion Rate ---
    const allCourses = await Course.find(courseQuery).select("_id");
    const allCourseIds = allCourses.map((c) => c._id);
    const totalProgressEntries = await CourseProgress.countDocuments({
      courseId: { $in: allCourseIds },
    });
    const completedProgressEntries = await CourseProgress.countDocuments({
      courseId: { $in: allCourseIds },
      isCompleted: true,
    });
    const completionRate =
      totalProgressEntries > 0
        ? Math.round((completedProgressEntries / totalProgressEntries) * 100)
        : 0;

    // --- NEW: Engagement Data (enrollment trend last 30 days) ---
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPurchases = await Purchase.find({
      ...purchaseQuery,
      status: "completed",
      createdAt: { $gte: thirtyDaysAgo },
    }).select("createdAt");

    // Group by date
    const engagementMap = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      const key = d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
      engagementMap[key] = 0;
    }
    recentPurchases.forEach((p) => {
      const key = new Date(p.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
      if (engagementMap[key] !== undefined) {
        engagementMap[key]++;
      }
    });
    const engagementData = Object.entries(engagementMap).map(
      ([name, value]) => ({
        name,
        value,
      }),
    );

    // --- NEW: Recent Activity (last 5 enrollments) ---
    const recentEnrollments = await Purchase.find({
      ...purchaseQuery,
      status: "completed",
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name profilePicture")
      .populate("courseId", "courseTitle");

    const recentCompletions = await CourseProgress.find({
      courseId: { $in: allCourseIds },
      isCompleted: true,
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate("userId", "name profilePicture")
      .populate("courseId", "courseTitle");

    // Merge and sort by time, take top 5
    const activityItems = [
      ...recentEnrollments.map((e) => ({
        type: "enrollment",
        userName: e.userId?.name || "Unknown",
        userAvatar: e.userId?.profilePicture || "",
        action: `enrolled in ${e.courseId?.courseTitle || "a course"}`,
        time: e.createdAt,
      })),
      ...recentCompletions.map((c) => ({
        type: "completion",
        userName: c.userId?.name || "Unknown",
        userAvatar: c.userId?.profilePicture || "",
        action: `completed ${c.courseId?.courseTitle || "a course"}`,
        time: c.updatedAt,
      })),
    ];
    activityItems.sort((a, b) => new Date(b.time) - new Date(a.time));
    const recentActivity = activityItems.slice(0, 5);

    // --- NEW: Category Enrollment ---
    const allCoursesWithCategory = await Course.find(courseQuery).select(
      "category enrolledStudents",
    );
    const categoryMap = {};
    allCoursesWithCategory.forEach((course) => {
      const cat = course.category || "Uncategorized";
      if (!categoryMap[cat]) {
        categoryMap[cat] = 0;
      }
      categoryMap[cat] += course.enrolledStudents?.length || 0;
    });
    const categoryColors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-cyan-500",
      "bg-emerald-500",
      "bg-amber-500",
      "bg-rose-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    const categoryEnrollment = Object.entries(categoryMap)
      .map(([name, value], i) => ({
        name,
        value,
        color: categoryColors[i % categoryColors.length],
      }))
      .sort((a, b) => b.value - a.value);

    return res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalSales,
        courseStats,
        totalStudents,
        activeCourses,
        completionRate,
        engagementData,
        recentActivity,
        categoryEnrollment,
      },
    });
  } catch (error) {
    console.error("Stats Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
