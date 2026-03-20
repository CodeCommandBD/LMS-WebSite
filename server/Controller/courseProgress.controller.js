import CourseProgress from "../models/courseProgress.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import Quiz from "../models/quiz.model.js";
import QuizAttempt from "../models/quizAttempt.model.js";
import Points from "../models/points.model.js";
import { createNotification } from "./notification.controller.js";
import { sendCourseCompletionEmail } from "../utils/email.js";

// 1. Get User Course Progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Enrollment check
    const user = await User.findById(userId);
    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not enrolled in this course.",
      });
    }

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

    // Enrollment check
    const user = await User.findById(userId);
    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. You are not enrolled in this course.",
      });
    }

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
      
      // Reward points for completion
      await Points.findOneAndUpdate(
        { userId },
        { 
          $inc: { totalPoints: 10 }, 
          $push: { history: { points: 10, reason: "Completed a lecture" } } 
        },
        { upsert: true }
      );
    } else {
      // Unmark as completed
      progress.completedLectures.splice(index, 1);
      
      // Deduct points for unmarking (optional but fair for consistency)
      await Points.findOneAndUpdate(
        { userId },
        { 
          $inc: { totalPoints: -10 }, 
          $push: { history: { points: -10, reason: "Unmarked a lecture completion" } } 
        }
      );
    }

    // Check if course is fully completed (Lectures + Quizzes)
    const course = await Course.findById(courseId);
    if (course) {
      const totalLectures = course.lectures.length;
      const allLecturesDone = progress.completedLectures.length === totalLectures;

      // Check if all quizzes for this course are passed
      const quizzes = await Quiz.find({ courseId });
      let allQuizzesPassed = true;

      if (quizzes.length > 0) {
        const quizIds = quizzes.map((q) => q._id);
        const passedAttempts = await QuizAttempt.countDocuments({
          userId,
          quizId: { $in: quizIds },
          isPassed: true,
        });
        
        // We need to ensure each unique quiz is passed
        // A more robust way:
        const userPassedQuizzes = await QuizAttempt.distinct("quizId", {
            userId,
            quizId: { $in: quizIds },
            isPassed: true
        });

        allQuizzesPassed = userPassedQuizzes.length === quizzes.length;
      }

      progress.isCompleted = allLecturesDone && allQuizzesPassed;
      
      if (progress.isCompleted) {
        // 1. Create in-app notification
        await createNotification(
          userId,
          "Course Completed!",
          `Congratulations! You have completed "${course.courseTitle}".`,
          "achievement",
          `/certificate/${courseId}`
        );

        // 2. Send professional completion email
        const certUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/verify-certificate/${courseId}`; // Simplified for now, or based on actual cert logic
        sendCourseCompletionEmail(user.email, user.name, course.courseTitle, certUrl).catch(err => 
          console.error("Completion email failed:", err.message)
        );
      }
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

    // Enrollment check
    const user = await User.findById(userId);
    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. You are not enrolled in this course.",
      });
    }

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
