import express from "express";
import { getOrCreateCertificate, verifyCertificate } from "../Controller/certificate.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/v1/certificates/:courseId — get or issue certificate (requires login)
router.get("/:courseId", authenticate, getOrCreateCertificate);

// GET /api/v1/certificates/verify/:id — public verification (no login required)
router.get("/verify/:id", verifyCertificate);

export default router;
