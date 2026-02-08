import express from "express";

import {
  loginUser,
  logoutUser,
  registerUser,
  getCurrentUser,
} from "../Controller/user.contollers.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authenticate, getCurrentUser);

export default router;
