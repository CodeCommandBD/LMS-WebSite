import express from "express";
import {
  createCheckoutSession,
  stripeWebhook,
  getDashboardStats,
} from "../Controller/purchase.controller.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

router.route("/checkout").post(authenticate, createCheckoutSession);
router.route("/webhook").post(stripeWebhook);
router
  .route("/stats")
  .get(authenticate, authorize("admin", "teacher"), getDashboardStats);

export default router;
