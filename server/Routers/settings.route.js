import express from "express";
import {
  getSettings,
  updateSettings,
} from "../Controller/settings.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

// Public route to get settings (e.g., AdSense script ID)
router.get("/:type", getSettings);

// Protected route to update settings (Admin only)
router.put("/:type", authenticate, authorize("admin"), updateSettings);

export default router;
