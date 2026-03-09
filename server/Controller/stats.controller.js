import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import Purchase from "../models/purchase.model.js";

export const getPlatformStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments({ isPublished: true });
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalInstructors = await User.countDocuments({ role: "teacher" });
    const totalEnrollments = await Purchase.countDocuments({
      status: "completed",
    });

    // Mock success rate for now or calculate based on reviews/completions if available
    const successRate = 98;

    res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        totalStudents,
        totalInstructors,
        totalEnrollments,
        successRate,
      },
    });
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch platform statistics",
    });
  }
};
