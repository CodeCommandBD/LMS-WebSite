import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { getSettings, updateSettings } from "../Controller/setting.controller.js";
import { uploadCourseThumbnail } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", getSettings);
router.put("/", authenticate, authorize("admin"), uploadCourseThumbnail.single("logo"), updateSettings);

export default router;
