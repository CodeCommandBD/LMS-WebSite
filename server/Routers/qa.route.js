import express from "express";
import { authenticate as isAuthenticated } from "../middleware/auth.middleware.js";
import {
  getLectureQA,
  postQuestion,
  replyToQuestion,
  toggleResolvedStatus,
  deleteQuestion,
  getAllMyQuestions,
} from "../Controller/qa.controller.js";

const router = express.Router();

// Get ALL questions posted by the logged-in user
router.get("/me", isAuthenticated, getAllMyQuestions);

// Get Q&A for a specific lecture
router.get("/:courseId/:lectureId", isAuthenticated, getLectureQA);

// Post a new question on a lecture
router.post("/:courseId/:lectureId", isAuthenticated, postQuestion);

// Reply to a question
router.post("/:questionId/reply", isAuthenticated, replyToQuestion);

// Toggle resolved status
router.patch("/:questionId/resolve", isAuthenticated, toggleResolvedStatus);

// Delete a question
router.delete("/:questionId", isAuthenticated, deleteQuestion);

export default router;
