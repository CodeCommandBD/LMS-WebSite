import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completedLectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completionBonusAwarded: {
      type: Boolean,
      default: false,
    },
    // BUG-018 FIX: Track lectures that have already awarded points to prevent farming
    rewardedLectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      }
    ]
  },
  { timestamps: true },
);

// BUG-021 FIX: Add unique compound index
courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const CourseProgress =
  mongoose.models.CourseProgress ||
  mongoose.model("CourseProgress", courseProgressSchema);
export default CourseProgress;
