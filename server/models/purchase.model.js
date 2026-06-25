import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "unenrolled"],
      default: "pending",
    },
    unenrolledAt: {
      type: Date,
      default: null,
    },
    paymentId: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    couponCode: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

// BUG-020 FIX: Database performance optimizations
purchaseSchema.index({ userId: 1, courseId: 1 });
purchaseSchema.index({ paymentId: 1 }, { unique: true });

const Purchase =
  mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);

export default Purchase;
