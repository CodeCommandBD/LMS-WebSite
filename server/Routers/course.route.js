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
  publishCourse,
  getPublishedCourses,
  enrollCourse,
  toggleWishlist,
  checkEnrollmentAndWishlist,
} from "../Controller/course.controller.js";
import {
  uploadCourseThumbnail,
  uploadMedia,
} from "../middleware/upload.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

router.post("/", authenticate, authorize("admin", "teacher"), createCourse);
router.get("/public-courses", getPublicCourses);
router.get("/", authenticate, authorize("admin", "teacher"), getCreatorCourses);
router.put(
  "/:courseId",
  authenticate,
  authorize("admin", "teacher"),
  uploadCourseThumbnail.single("courseThumbnail"),
  editCourse,
);
router.get("/:courseId", getCourseById);
router.delete(
  "/:courseId",
  authenticate,
  authorize("admin", "teacher"),
  deleteCourse,
);
router.post(
  "/:courseId/lectures",
  authenticate,
  authorize("admin", "teacher"),
  uploadMedia.single("video"),
  createLecture,
);
router.get("/:courseId/lectures", authenticate, getCourseLectures);
router.put(
  "/:courseId/lectures/:lectureId",
  authenticate,
  authorize("admin", "teacher"),
  uploadMedia.single("video"),
  editLecture,
);
router.delete(
  "/:courseId/lectures/:lectureId",
  authenticate,
  authorize("admin", "teacher"),
  deleteLecture,
);

router.get("/published/all", getPublishedCourses); // Adding this for the Courses page
router.patch(
  "/:courseId/publish",
  authenticate,
  authorize("admin", "teacher"),
  publishCourse,
);

// Enrollment and Wishlist
router.post("/:courseId/enroll", authenticate, enrollCourse);
router.post("/:courseId/wishlist", authenticate, toggleWishlist);
router.get("/:courseId/status", authenticate, checkEnrollmentAndWishlist);

export default router;
