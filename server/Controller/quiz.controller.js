import Quiz from "../models/quiz.model.js";
import QuizAttempt from "../models/quizAttempt.model.js";
import Points from "../models/points.model.js";
import { createNotification } from "./notification.controller.js";
import { sendError } from "../utils/errorHandler.js";

// --- ADMIN CONTROLLERS ---

// 1. Create Quiz for Course Section
export const createQuiz = async (req, res) => {
  try {
    const { courseId, sectionName, title, description, questions, passingMark } = req.body;

    // BUG-015 FIX: Validate required fields before creating a quiz
    if (!courseId || !title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Course ID, title, and at least one question are required." 
      });
    }

    const quiz = await Quiz.create({
      courseId,
      sectionName,
      title,
      description,
      questions,
      passingMark: passingMark || 60,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    return sendError(res, error, "quizController");
  }
};

// 2. Get All Quizzes for a Course
export const getCourseQuizzes = async (req, res) => {
  try {
    const { courseId } = req.params;
    const quizzes = await Quiz.find({ courseId });

    return res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error) {
    return sendError(res, error, "quizController");
  }
};

// 3. Edit Quiz
export const editQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    
    // BUG-016 FIX: Prevent mass assignment by extracting only allowed fields.
    // Previously `const updateData = req.body;` allowed an attacker to overwrite
    // any field in the document (like setting _id or internal flags).
    const { title, description, questions, passingMark, sectionName } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (questions !== undefined && Array.isArray(questions)) updateData.questions = questions;
    if (passingMark !== undefined) updateData.passingMark = passingMark;
    if (sectionName !== undefined) updateData.sectionName = sectionName;

    const quiz = await Quiz.findByIdAndUpdate(quizId, updateData, {
      new: true,
    });

    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      quiz,
    });
  } catch (error) {
    return sendError(res, error, "quizController");
  }
};

// --- STUDENT CONTROLLERS ---

// 4. Get Quiz with Attempts Status
export const getQuizForStudent = async (req, res) => {
  try {
    const { courseId, sectionName } = req.params;
    const userId = req.user.id;

    // We MUST hide correctOptionIndex from students
    const quiz = await Quiz.findOne({ courseId, sectionName }).select("-questions.correctOptionIndex");

    if (!quiz) {
      return res.status(200).json({
        success: true,
        quiz: null,
        message: "No quiz found for this section",
      });
    }

    // Check for previous attempts
    const latestAttempt = await QuizAttempt.findOne({
      userId,
      quizId: quiz._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      quiz,
      latestAttempt,
    });
  } catch (error) {
    return sendError(res, error, "quizController");
  }
};

// 6. Get All Quizzes with Attempt Status for Student
export const getCourseQuizzesWithStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const quizzes = await Quiz.find({ courseId });

    // Fetch attempts for all these quizzes
    const quizIds = quizzes.map((q) => q._id);
    const attempts = await QuizAttempt.find({
      userId,
      quizId: { $in: quizIds },
    });

    // Combine them and STRIP correctOptionIndex
    const quizzesWithStatus = quizzes.map((quiz) => {
      const attempt = attempts
        .filter((a) => a.quizId.toString() === quiz._id.toString())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]; // Latest

      const quizObj = quiz.toObject();
      if (quizObj.questions) {
        quizObj.questions = quizObj.questions.map(q => {
          const { correctOptionIndex, ...rest } = q;
          return rest;
        });
      }

      return {
        ...quizObj,
        latestAttempt: attempt || null,
      };
    });

    return res.status(200).json({
      success: true,
      quizzes: quizzesWithStatus,
    });
  } catch (error) {
    return sendError(res, error, "quizController");
  }
};

// 8. Delete Quiz (Admin/Teacher)
export const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findByIdAndDelete(quizId);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    // Also delete all attempts for this quiz
    await QuizAttempt.deleteMany({ quizId });

    return res.status(200).json({
      success: true,
      message: "Quiz and all its attempts deleted successfully",
    });
  } catch (error) {
    return sendError(res, error, "quizController");
  }
};

// 7. Submit Quiz Attempt
export const submitQuizAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // Array of { questionId, chosenOptionIndex }
    const userId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    // Calculate Score
    let correctCount = 0;
    quiz.questions.forEach((q) => {
      const studentAnswer = answers.find(
        (a) => a.questionId === q._id.toString(),
      );
      if (
        studentAnswer &&
        studentAnswer.chosenOptionIndex === q.correctOptionIndex
      ) {
        correctCount++;
      }
    });

    const score = (correctCount / quiz.questions.length) * 100;
    const passingMark = quiz.passingMark || 60; // Use model value or default to 60
    const isPassed = score >= passingMark;

    const attempt = await QuizAttempt.create({
      userId,
      quizId,
      answers,
      score,
      isPassed: isPassed,
    });

    if (isPassed) {
      // POINT FARMING PROTECTION: Only award points if this is the FIRST pass
      const previousSuccessfulAttempt = await QuizAttempt.findOne({
        userId,
        quizId,
        isPassed: true,
        _id: { $ne: attempt._id } // Exclude current attempt
      });

      if (!previousSuccessfulAttempt) {
        await Points.findOneAndUpdate(
          { userId },
          { 
            $inc: { totalPoints: 50 }, 
            $push: { history: { points: 50, reason: `Passed Quiz: ${quiz.title}` } } 
          },
          { upsert: true }
        );

        await createNotification(
          userId,
          "Quiz Passed!",
          `Well done! You passed the quiz "${quiz.title}" with a score of ${score.toFixed(1)}%.`,
          "success"
        );
      } else {
        await createNotification(
          userId,
          "Quiz Completed",
          `You completed the quiz "${quiz.title}" again with a score of ${score.toFixed(1)}%. (Points already awarded)`,
          "info"
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: isPassed
        ? "Congratulations! You passed the quiz."
        : "You did not pass. Try again!",
      attempt,
    });
  } catch (error) {
    return sendError(res, error, "quizController");
  }
};
