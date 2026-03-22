import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
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
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
    },
    content: {
      type: String,
      default: "",
      maxlength: [10000, "Notes cannot exceed 10,000 characters"],
    },
  },
  { timestamps: true },
);

// One note document per user per lecture
notesSchema.index({ userId: 1, lectureId: 1 }, { unique: true });

const Notes = mongoose.models.Notes || mongoose.model("Notes", notesSchema);
export default Notes;
