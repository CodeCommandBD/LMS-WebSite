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
router.get("/me", authenticate, getCurrentUser);
router.get("/enrolled-courses", authenticate, getEnrolledCourses);
router.get("/wishlist", authenticate, getWishlistCourses);
router.get("/", authenticate, authorize("admin"), getAllUsers);
// Public: get instructor profile
router.get("/instructor/:instructorId", getInstructorProfile);

router.put(
  "/update-profile",
  authenticate,
  uploadProfilePicture.single("profilePicture"),
  updateProfile,
);

export default router;
