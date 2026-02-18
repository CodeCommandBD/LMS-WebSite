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
  },
  { timestamps: true },
);

const CourseProgress =
  mongoose.models.CourseProgress ||
  mongoose.model("CourseProgress", courseProgressSchema);
export default CourseProgress;
