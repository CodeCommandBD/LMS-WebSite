import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  createCourse,
  editCourse,
  getCourseById,
  getCreatorCourses,
  getPublicCourses,
  deleteCourse,
  createLecture,
  editLecture,
  getCourseLectures
} from "../Controller/course.controller.js";
import { uploadCourseThumbnail } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", authenticate, createCourse);
router.get("/public-courses", getPublicCourses);
router.get("/", authenticate, getCreatorCourses);
router.put(
  "/:courseId",
  authenticate,
  uploadCourseThumbnail.single("courseThumbnail"),
  editCourse,
);
router.get("/:courseId", authenticate, getCourseById);
router.delete("/:courseId", authenticate, deleteCourse);
router.post("/:courseId/lectures", authenticate, createLecture);
router.get("/:courseId/lectures", authenticate, getCourseLectures);
router.put("/:courseId/lectures/:lectureId", authenticate, editLecture);


export default router;
