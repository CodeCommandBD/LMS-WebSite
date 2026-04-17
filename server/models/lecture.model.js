import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    publicId: {
      type: String,
    },
    isPreviewFree: {
      type: Boolean,
      default: false,
    },
    sectionName: {
      type: String,
      default: "Course Content",
    },
    releaseOffset: {
      type: Number,
      default: 0, // Days from enrollment
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Lecture =
  mongoose.models.Lecture || mongoose.model("Lecture", lectureSchema);

export default Lecture;
