import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import Purchase from "../models/purchase.model.js";
import CourseProgress from "../models/courseProgress.model.js";

export const getPlatformStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments({ isPublished: true });
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalInstructors = await User.countDocuments({ role: "teacher" });
    const totalEnrollments = await Purchase.countDocuments({
      status: "completed",
    });

    // Real success rate: percentage of course progress entries that are completed
    const totalProgress = await CourseProgress.countDocuments({});
    const completedProgress = await CourseProgress.countDocuments({
      isCompleted: true,
    });
    const successRate =
      totalProgress > 0
        ? Math.round((completedProgress / totalProgress) * 100)
        : 0;

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
