import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
});

const quizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    sectionName: {
      type: String,
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    questions: [questionSchema],
  },
  { timestamps: true },
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
