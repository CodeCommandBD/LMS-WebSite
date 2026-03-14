import express from "express";
import { submitContactForm } from "../Controller/contact.controller.js";

const router = express.Router();

// Public route — anyone can submit a contact form
router.post("/", submitContactForm);

export default router;
