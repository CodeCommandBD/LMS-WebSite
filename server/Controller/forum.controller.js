import ForumPost from "../models/forumPost.model.js";
import ForumComment from "../models/forumComment.model.js";
import User from "../models/user.model.js";
import { sendError } from "../utils/errorHandler.js";

// 1. Create Post
export const createPost = async (req, res) => {
  try {
    const { courseId, title, content } = req.body;
    const userId = req.user.id;

    // Validation
    if (!title || title.trim().length < 5) {
      return res.status(400).json({ success: false, message: "Title must be at least 5 characters." });
    }
    if (!content || content.trim().length < 10) {
      return res.status(400).json({ success: false, message: "Content must be at least 10 characters." });
    }

    // Check enrollment
    const user = await User.findById(userId);
    if (!user.enrolledCourses.includes(courseId) && user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only enrolled students can post." });
    }

    const post = await ForumPost.create({
      courseId,
      userId,
      title,
      content,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    return sendError(res, error, "forumController");
  }
};

// 2. Get Posts by Course
export const getPostsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    let query = {};
    if (courseId === "all") {
      // Find all posts from courses the user is enrolled in
      const user = await User.findById(userId);
      query = { courseId: { $in: user.enrolledCourses } };
    } else {
      query = { courseId };
    }

    const posts = await ForumPost.find(query)
      .populate("userId", "name profilePicture")
      .sort({ isPinned: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    return sendError(res, error, "forumController");
  }
};

// 3. Get Post with Comments
export const getPostDetails = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await ForumPost.findById(postId).populate("userId", "name profilePicture");
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const comments = await ForumComment.find({ postId })
      .populate("userId", "name profilePicture")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      post,
      comments,
    });
  } catch (error) {
    return sendError(res, error, "forumController");
  }
};

// 4. Create Comment
export const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const userId = req.user.id;

    const post = await ForumPost.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    if (!content || content.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Comment is too short." });
    }

    const comment = await ForumComment.create({
      postId,
      userId,
      content,
    });

    // Update comment count
    post.commentsCount += 1;
    await post.save();

    return res.status(201).json({
      success: true,
      message: "Comment added",
      comment,
    });
  } catch (error) {
    return sendError(res, error, "forumController");
  }
};

// 5. Delete Post
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await ForumPost.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    if (post.userId.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await ForumComment.deleteMany({ postId });
    await ForumPost.findByIdAndDelete(postId);

    return res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    return sendError(res, error, "forumController");
  }
};
