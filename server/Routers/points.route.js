import express from "express";
import { getLeaderboard, getMyPoints } from "../Controller/points.controller.js";
import { authenticate as isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public leaderboard (or auth-only if preferred)
router.get("/leaderboard", getLeaderboard);

// Personal points (must be authenticated)
router.get("/me", isAuthenticated, getMyPoints);

export default router;
