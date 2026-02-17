import express from "express";
import {
  createCheckoutSession,
  stripeWebhook,
  getDashboardStats,
} from "../Controller/purchase.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/checkout").post(authenticate, createCheckoutSession);
router.route("/webhook").post(stripeWebhook);
router.route("/stats").get(authenticate, getDashboardStats);

export default router;
