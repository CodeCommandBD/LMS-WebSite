import Notification from "../models/notification.model.js";
import { sendError } from "../utils/errorHandler.js";

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
    return sendError(res, error, "notificationController");
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
    return sendError(res, error, "notificationController");
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
    return sendError(res, error, "notificationController");
  }
};

import { getIO } from "../utils/socket.js";
import User from "../models/user.model.js";

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

// 5. Admin: Send notification to a specific user or broadcast to all
export const sendNotification = async (req, res) => {
  try {
    const { title, message, type = "info", link = "", targetUserId } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required.",
      });
    }

    let userIds = [];

    if (targetUserId) {
      // Send to a specific user
      userIds = [targetUserId];
    } else {
      // Broadcast: send to all verified, non-banned users
      const users = await User.find({ isVerified: true, isBanned: false }).select("_id");
      userIds = users.map((u) => u._id);
    }

    // Create notifications in bulk
    const notifications = await Notification.insertMany(
      userIds.map((uid) => ({ userId: uid, title, message, type, link }))
    );

    // Real-time emit
    try {
      const io = getIO();
      notifications.forEach((notif) => {
        io.to(notif.userId.toString()).emit("new-notification", notif);
      });
    } catch (socketError) {
      console.error("Socket emit failed:", socketError.message);
    }

    return res.status(201).json({
      success: true,
      message: `Notification sent to ${userIds.length} user(s).`,
      count: userIds.length,
    });
  } catch (error) {
    return sendError(res, error, "notificationController");
  }
};
