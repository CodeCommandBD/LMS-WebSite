import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} from "../Controller/cart.controller.js";

const router = express.Router();

router.use(authenticate); // All cart routes require login

router.get("/", getCart);
router.post("/add", addToCart);
router.delete("/remove/:courseId", removeFromCart);
router.delete("/clear", clearCart);

export default router;
