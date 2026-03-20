import Notification from "../models/notification.model.js";

// 1. Get all notifications for a user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

import { getIO } from "../utils/socket.js";

// 4. Create notification (can be called from other controllers)
export const createNotification = async (userId, title, message, type = "info", link = "") => {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      link,
    });

    // 📣 Real-time Emit!
    try {
      const io = getIO();
      io.to(userId.toString()).emit("new-notification", notification);
    } catch (socketError) {
      console.error("Socket emit failed (server still running):", socketError.message);
    }
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};
