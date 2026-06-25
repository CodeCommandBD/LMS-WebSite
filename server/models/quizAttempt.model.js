import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        chosenOptionIndex: Number,
      },
    ],
    score: { type: Number, default: 0 },
    isPassed: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);

// DB-IDX-A FIX: Add compound index for fast per-user per-quiz lookups
// (used in submitQuizAttempt to check for farming protection)
quizAttemptSchema.index({ userId: 1, quizId: 1 });

export default QuizAttempt;
