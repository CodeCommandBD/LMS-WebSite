import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateProfile,
} from "../Controller/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { uploadProfilePicture } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authenticate, getCurrentUser);
router.get("/test-cookies", (req, res) => {
  res.json({
    cookies: req.cookies,
    headers: req.headers,
    user: req.user,
  });
});
router.put(
  "/update-profile",
  authenticate,
  uploadProfilePicture.single("profilePicture"),
  updateProfile,
);

export default router;
