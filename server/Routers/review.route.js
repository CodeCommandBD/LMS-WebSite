import express from "express";
import {
  createOrUpdateReview,
  getCourseReviews,
  deleteReview,
} from "../Controller/review.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public: get reviews for a course
router.get("/:courseId", getCourseReviews);

// Auth required: create/update a review
router.post("/:courseId", authenticate, createOrUpdateReview);

// Auth required: delete own review
router.delete("/:courseId", authenticate, deleteReview);

export default router;
