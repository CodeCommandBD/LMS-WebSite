import express from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../Controller/notification.controller.js";
import { authenticate as isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);

export default router;
