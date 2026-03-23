import express from "express";
import { submitContactForm, getContacts, markContactRead } from "../Controller/contact.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

// Public route — anyone can submit a contact form
router.post("/", submitContactForm);

// Admin: Get all contact messages
router.get("/", authenticate, authorize("admin"), getContacts);

// Admin: Mark as read
router.patch("/:id/read", authenticate, authorize("admin"), markContactRead);

export default router;
