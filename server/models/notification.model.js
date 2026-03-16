import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error", "achievement"],
      default: "info",
    },
    isRead: { type: Boolean, default: false },
    link: { type: String }, // Optional link to a page (e.g., /certificate/:id)
  },
  { timestamps: true },
);

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

export default Notification;
