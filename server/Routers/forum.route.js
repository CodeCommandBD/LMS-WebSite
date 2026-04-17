import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  createPost,
  getPostsByCourse,
  getPostDetails,
  createComment,
  deletePost,
} from "../Controller/forum.controller.js";

const router = express.Router();

router.use(authenticate); // All forum routes require login

router.get("/course/:courseId", getPostsByCourse);
router.get("/post/:postId", getPostDetails);
router.post("/post/create", createPost);
router.post("/comment/create", createComment);
router.delete("/post/:postId", deletePost);

export default router;
