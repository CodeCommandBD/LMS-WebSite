import Quiz from "../models/quiz.model.js";
import QuizAttempt from "../models/quizAttempt.model.js";

// --- ADMIN CONTROLLERS ---

// 1. Create Quiz for Course Section
export const createQuiz = async (req, res) => {
  try {
    const { courseId, sectionName, title, description, questions } = req.body;

    const quiz = await Quiz.create({
      courseId,
      sectionName,
      title,
      description,
      questions,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Edit Quiz
export const editQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const updateData = req.body;

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
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- STUDENT CONTROLLERS ---

// 4. Get Quiz with Attempts Status
export const getQuizForStudent = async (req, res) => {
  try {
    const { courseId, sectionName } = req.params;
    const userId = req.user.id;

    const quiz = await Quiz.findOne({ courseId, sectionName });

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
    return res.status(500).json({ success: false, message: error.message });
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

    // Combine them
    const quizzesWithStatus = quizzes.map((quiz) => {
      const attempt = attempts
        .filter((a) => a.quizId.toString() === quiz._id.toString())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]; // Latest

      return {
        ...quiz.toObject(),
        latestAttempt: attempt || null,
      };
    });

    return res.status(200).json({
      success: true,
      quizzes: quizzesWithStatus,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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
    const isPassed = score >= 60; // Standard 60% passing mark

    const attempt = await QuizAttempt.create({
      userId,
      quizId,
      answers,
      score,
      isPassed: isPassed,
    });

    return res.status(200).json({
      success: true,
      message: isPassed
        ? "Congratulations! You passed the quiz."
        : "You did not pass. Try again!",
      attempt,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
