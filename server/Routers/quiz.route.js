import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  createQuiz,
  getCourseQuizzes,
  editQuiz,
  getQuizForStudent,
  getCourseQuizzesWithStatus,
  submitQuizAttempt,
} from "../Controller/quiz.controller.js";

const router = express.Router();

// Mixed / Shared
router.get("/course/:courseId", authenticate, getCourseQuizzes);

// Admin Routes
router.post("/create", authenticate, createQuiz);
router.put("/edit/:quizId", authenticate, editQuiz);

// Student Routes
router.get(
  "/course/:courseId/status",
  authenticate,
  getCourseQuizzesWithStatus,
);
router.get(
  "/course/:courseId/section/:sectionName",
  authenticate,
  getQuizForStudent,
);
router.post("/submit/:quizId", authenticate, submitQuizAttempt);

export default router;
