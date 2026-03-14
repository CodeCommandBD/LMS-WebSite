import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateProfile,
  getInstructorProfile,
  forgotPassword,
  resetPassword,
  getEnrolledCourses,
  getWishlistCourses,
  getAllUsers,
  toggleBanUser,
  changeUserRole,
  deleteUser,
  verifyEmail,
  resendVerification,
} from "../Controller/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { uploadProfilePicture } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
// Email verification (public, no auth needed)
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.get("/me", authenticate, getCurrentUser);
router.get("/enrolled-courses", authenticate, getEnrolledCourses);
router.get("/wishlist", authenticate, getWishlistCourses);
router.get("/", authenticate, authorize("admin", "teacher"), getAllUsers);
// Admin: User Management
router.patch("/:userId/ban", authenticate, authorize("admin"), toggleBanUser);
router.patch("/:userId/role", authenticate, authorize("admin"), changeUserRole);
router.delete("/:userId", authenticate, authorize("admin"), deleteUser);
// Public: get instructor profile
router.get("/instructor/:instructorId", getInstructorProfile);

router.put(
  "/update-profile",
  authenticate,
  uploadProfilePicture.single("profilePicture"),
  updateProfile,
);

export default router;
