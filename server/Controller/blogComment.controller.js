import BlogComment from "../models/blogComment.model.js";

// 1. Add Comment
export const addComment = async (req, res) => {
  try {
    const { blogId, comment } = req.body;
    const userId = req.user.id;

    if (!comment || comment.trim() === "") {
      return res.status(400).json({ success: false, message: "Comment cannot be empty" });
    }

    const newComment = await BlogComment.create({
      blogId,
      userId,
      comment,
    });

    const populatedComment = await BlogComment.findById(newComment._id).populate("userId", "name profilePicture");

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Comments for a Blog
export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await BlogComment.find({ blogId })
      .populate("userId", "name profilePicture")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Delete Comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await BlogComment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    // Only comment owner or admin/teacher can delete
    if (comment.userId.toString() !== userId && !["admin", "teacher"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this comment" });
    }

    await BlogComment.findByIdAndDelete(commentId);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
