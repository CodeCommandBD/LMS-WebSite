import express from "express";
import {
  createCheckoutSession,
  stripeWebhook,
} from "../Controller/purchase.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/checkout").post(authenticate, createCheckoutSession);
router.route("/webhook").post(stripeWebhook);

export default router;
