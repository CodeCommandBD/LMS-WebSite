import CourseProgress from "../Models/courseProgress.model.js";
import Course from "../Models/course.model.js";

// 1. Get User Course Progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Find progress entry
    let progress = await CourseProgress.findOne({ userId, courseId });

    // If no progress exists, return initial empty progress (don't create yet to save DB)
    if (!progress) {
      return res.status(200).json({
        success: true,
        progress: {
          completedLectures: [],
          isCompleted: false,
        },
      });
    }

    return res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Update Lecture Completion
export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.user.id;

    // Find or Create Progress
    let progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      progress = await CourseProgress.create({
        userId,
        courseId,
        completedLectures: [],
      });
    }

    // Toggle lecture completion
    const index = progress.completedLectures.indexOf(lectureId);
    if (index === -1) {
      // Mark as completed
      progress.completedLectures.push(lectureId);
    } else {
      // Unmark as completed
      progress.completedLectures.splice(index, 1);
    }

    // Check if course is fully completed
    const course = await Course.findById(courseId);
    if (course) {
      const totalLectures = course.lectures.length;
      progress.isCompleted =
        progress.completedLectures.length === totalLectures;
    }

    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      progress,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Reset Course Progress
export const resetCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const progress = await CourseProgress.findOne({ userId, courseId });
    if (progress) {
      progress.completedLectures = [];
      progress.isCompleted = false;
      await progress.save();
    }

    return res.status(200).json({
      success: true,
      message: "Progress reset successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
