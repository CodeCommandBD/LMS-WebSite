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
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

// Admin Routes
router.get(
  "/course/:courseId",
  authenticate,
  authorize("admin", "teacher"),
  getCourseQuizzes,
);
router.post("/create", authenticate, authorize("admin", "teacher"), createQuiz);
router.put(
  "/edit/:quizId",
  authenticate,
  authorize("admin", "teacher"),
  editQuiz,
);

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
