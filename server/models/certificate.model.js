import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const certificateSchema = new mongoose.Schema(
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
    certificateId: {
      type: String,
      unique: true,
      default: () => uuidv4().substring(0, 8).toUpperCase(),
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Unique constraint: one certificate per user-course pair
certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Certificate =
  mongoose.models.Certificate ||
  mongoose.model("Certificate", certificateSchema);

export default Certificate;
