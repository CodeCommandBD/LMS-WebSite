import express from "express";
import { authenticate as isAuthenticated } from "../middleware/auth.middleware.js";
import { getNotes, saveNotes, getAllMyNotes } from "../Controller/notes.controller.js";

const router = express.Router();

// Get ALL notes for the logged-in user (across all courses)
router.get("/me", isAuthenticated, getAllMyNotes);

// Get notes for a specific lecture
router.get("/:courseId/:lectureId", isAuthenticated, getNotes);

// Save (upsert) notes for a specific lecture
router.post("/:courseId/:lectureId", isAuthenticated, saveNotes);

export default router;