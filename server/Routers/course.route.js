import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  createCourse,
  getCreatorCourses,
  getPublicCourses,
} from "../Controller/course.controller.js";

const router = express.Router();

router.post("/", authenticate, createCourse);
router.get("/public-courses", getPublicCourses);
router.get("/", authenticate, getCreatorCourses);

export default router;
