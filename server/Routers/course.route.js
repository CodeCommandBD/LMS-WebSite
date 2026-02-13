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
  getCourseLectures,
  deleteLecture,
} from "../Controller/course.controller.js";
import {
  uploadCourseThumbnail,
  uploadMedia,
} from "../middleware/upload.middleware.js";

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
router.post(
  "/:courseId/lectures",
  authenticate,
  uploadMedia.single("video"),
  createLecture,
);
router.get("/:courseId/lectures", authenticate, getCourseLectures);
router.put(
  "/:courseId/lectures/:lectureId",
  authenticate,
  uploadMedia.single("video"),
  editLecture,
);
router.delete("/:courseId/lectures/:lectureId", authenticate, deleteLecture);

export default router;
