import mongoose from "mongoose";

const pointsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    history: [
      {
        points: Number,
        reason: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

const Points = mongoose.models.Points || mongoose.model("Points", pointsSchema);

export default Points;
