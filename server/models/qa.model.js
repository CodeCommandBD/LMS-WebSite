import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, "Reply cannot exceed 2000 characters"],
    },
    isInstructorReply: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const qaSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: [true, "Question cannot be empty"],
      trim: true,
      maxlength: [2000, "Question cannot exceed 2000 characters"],
    },
    replies: [replySchema],
    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const QA = mongoose.models.QA || mongoose.model("QA", qaSchema);
export default QA;
