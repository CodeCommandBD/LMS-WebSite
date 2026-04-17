import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

// Prevent adding duplicate courses to the same cart
cartSchema.index({ userId: 1, "items.courseId": 1 });

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;
