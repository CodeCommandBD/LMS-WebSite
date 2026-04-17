import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
  validateCoupon,
} from "../Controller/coupon.controller.js";

const router = express.Router();

// Admin Routes
router.post("/create", authenticate, authorize("admin"), createCoupon);
router.get("/all", authenticate, authorize("admin"), getAllCoupons);
router.delete("/:id", authenticate, authorize("admin"), deleteCoupon);

// User Routes
router.post("/validate", authenticate, validateCoupon);

export default router;
