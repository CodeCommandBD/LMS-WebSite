import mongoose from "mongoose";

const forumPostSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const ForumPost = mongoose.models.ForumPost || mongoose.model("ForumPost", forumPostSchema);

export default ForumPost;
