import express from "express";
import { getNotifications, markAsRead, markAllAsRead, sendNotification } from "../Controller/notification.controller.js";
import { authenticate as isAuthenticated } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);

// Admin: Send notification to all or specific user
router.post("/send", authorize("admin"), sendNotification);

export default router;
