import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getUserCourseProgress,
  updateLectureProgress,
  resetCourseProgress,
} from "../Controller/courseProgress.controller.js";

const router = express.Router();

router.get("/:courseId", authenticate, getUserCourseProgress);
router.post(
  "/:courseId/lectures/:lectureId/view",
  authenticate,
  updateLectureProgress,
);
router.post("/:courseId/reset", authenticate, resetCourseProgress);

export default router;
