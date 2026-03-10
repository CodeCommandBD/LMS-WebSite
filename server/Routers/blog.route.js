import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogBySlugOrId,
  updateBlog,
  deleteBlog,
  getComments,
  addComment,
  deleteComment,
} from "../Controller/blog.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { uploadCourseThumbnail as upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllBlogs);
router.get("/:identifier", getBlogBySlugOrId);

// Protected routes (Admin/Teacher only)
router.post(
  "/",
  authenticate,
  authorize("admin", "teacher"),
  upload.single("thumbnail"),
  createBlog,
);

router.put(
  "/:id",
  authenticate,
  authorize("admin", "teacher"),
  upload.single("thumbnail"),
  updateBlog,
);

router.delete("/:id", authenticate, authorize("admin", "teacher"), deleteBlog);

// Comment routes (public read, auth write)
router.get("/:id/comments", getComments);
router.post("/:id/comments", authenticate, addComment);
router.delete("/:id/comments/:commentId", authenticate, deleteComment);

export default router;
