import express from "express";
import { getOrCreateCertificate } from "../Controller/certificate.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/v1/certificates/:courseId — get or issue certificate (requires completion)
router.get("/:courseId", authenticate, getOrCreateCertificate);

export default router;
