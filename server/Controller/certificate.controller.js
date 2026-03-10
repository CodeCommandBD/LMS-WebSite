import Certificate from "../models/certificate.model.js";
import CourseProgress from "../models/courseProgress.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

/**
 * GET /api/v1/certificates/:courseId
 * Issues or retrieves an existing certificate.
 * Only accessible if the user has completed the course.
 */
export const getOrCreateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // 1. Check enrollment
    const user = await User.findById(userId);
    if (
      !user ||
      !user.enrolledCourses.some((id) => id.toString() === courseId)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course.",
      });
    }

    // 2. Check course completion
    const progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress || !progress.isCompleted) {
      return res.status(403).json({
        success: false,
        message: "You must complete the course to receive a certificate.",
      });
    }

    // 3. Get or create certificate (upsert to avoid duplicates)
    const certificate = await Certificate.findOneAndUpdate(
      { userId, courseId },
      { userId, courseId }, // don't overwrite certificateId or issuedAt
      { new: true, upsert: true, setDefaultsOnInsert: true },
    )
      .populate("userId", "name email profilePicture")
      .populate("courseId", "courseTitle creator")
      .populate({
        path: "courseId",
        populate: { path: "creator", select: "name" },
      });

    return res.status(200).json({
      success: true,
      certificate,
    });
  } catch (error) {
    console.error("Certificate error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
