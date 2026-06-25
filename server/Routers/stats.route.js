import express from "express";
import { getPlatformStats } from "../Controller/stats.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// BUG-NEW-D FIX: Platform stats expose revenue, enrollment and course counts.
// These are sensitive business metrics and must not be publicly accessible.
router.get("/", authenticate, getPlatformStats);

export default router;
