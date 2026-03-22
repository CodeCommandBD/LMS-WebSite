import express from "express";
import { addComment, getBlogComments, deleteComment } from "../Controller/blogComment.controller.js";
import { authenticate as isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public: Get comments for a blog post
router.get("/:blogId", getBlogComments);

// Auth: Add or delete comments
router.post("/", isAuthenticated, addComment);
router.delete("/:commentId", isAuthenticated, deleteComment);

export default router;
