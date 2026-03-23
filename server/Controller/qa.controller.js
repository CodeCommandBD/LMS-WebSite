import QA from "../models/qa.model.js";
import CourseProgress from "../models/courseProgress.model.js";
import User from "../models/user.model.js";

// 1. Get all Q&A questions for a lecture (enrolled users only)
export const getLectureQA = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.user.id;

    // Enrollment check
    const user = await User.findById(userId);
    if (
      !user ||
      !user.enrolledCourses.some((id) => id.toString() === courseId)
    ) {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled to view Q&A.",
      });
    }

    const questions = await QA.find({ courseId, lectureId })
      .populate("userId", "name profilePicture role")
      .populate("replies.userId", "name profilePicture role")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, questions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Post a question (enrolled users only)
export const postQuestion = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const { question } = req.body;
    const userId = req.user.id;

    if (!question || !question.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Question cannot be empty." });
    }

    // Enrollment check
    const user = await User.findById(userId);
    if (
      !user ||
      !user.enrolledCourses.some((id) => id.toString() === courseId)
    ) {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled to post a question.",
      });
    }

    const newQuestion = await QA.create({
      courseId,
      lectureId,
      userId,
      question: question.trim(),
    });

    await newQuestion.populate("userId", "name profilePicture role");

    return res.status(201).json({
      success: true,
      message: "Question posted successfully.",
      question: newQuestion,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Reply to a question (enrolled users or instructor/admin)
export const replyToQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { body } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!body || !body.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Reply cannot be empty." });
    }

    const qa = await QA.findById(questionId);
    if (!qa) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found." });
    }

    const isInstructorReply = ["teacher", "admin"].includes(userRole);

    qa.replies.push({
      userId,
      body: body.trim(),
      isInstructorReply,
    });

    await qa.save();
    await qa.populate("userId", "name profilePicture role");
    await qa.populate("replies.userId", "name profilePicture role");

    return res.status(200).json({
      success: true,
      message: "Reply posted successfully.",
      question: qa,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Toggle resolved status (question author or instructor/admin)
export const toggleResolvedStatus = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const qa = await QA.findById(questionId);
    if (!qa) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found." });
    }

    // Only original poster or instructor/admin can resolve
    const canResolve =
      qa.userId.toString() === userId ||
      ["teacher", "admin"].includes(userRole);

    if (!canResolve) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized." });
    }

    qa.isResolved = !qa.isResolved;
    await qa.save();

    return res.status(200).json({
      success: true,
      message: qa.isResolved ? "Marked as resolved." : "Marked as unresolved.",
      isResolved: qa.isResolved,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Delete question (owner or admin)
export const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const qa = await QA.findById(questionId);
    if (!qa) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found." });
    }

    if (qa.userId.toString() !== userId && userRole !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized." });
    }

    await QA.findByIdAndDelete(questionId);

    return res
      .status(200)
      .json({ success: true, message: "Question deleted." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Get ALL questions posted by the logged-in user (across all courses)
export const getAllMyQuestions = async (req, res) => {
  try {
    const userId = req.user.id;

    const questions = await QA.find({ userId })
      .populate("courseId", "courseTitle thumbnail")
      .populate("lectureId", "lectureTitle")
      .populate("userId", "name photoUrl role")
      .populate("replies.userId", "name photoUrl role")
      .sort({ createdAt: -1 });

    // Group by course
    const grouped = {};
    questions.forEach((q) => {
      const cId = q.courseId?._id?.toString();
      if (!cId) return;
      if (!grouped[cId]) {
        grouped[cId] = {
          courseId: cId,
          courseTitle: q.courseId?.courseTitle || "Unknown Course",
          thumbnail: q.courseId?.thumbnail || "",
          questions: [],
        };
      }
      grouped[cId].questions.push(q);
    });

    return res.status(200).json({
      success: true,
      courses: Object.values(grouped),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
