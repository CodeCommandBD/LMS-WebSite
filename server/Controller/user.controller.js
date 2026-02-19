import User from "../models/user.model.js";
import Course from "../Models/course.model.js";
import Review from "../models/review.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: `Account already exists with this email as a ${user.role}. One email can only have one role.`,
      });
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Incorrect email or password" });
    }

    const { role } = req.body;
    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        message: `Incorrect role selected. This email is registered as a ${user.role}.`,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect email or password" });
    }

    // token generation
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "48h",
      },
    );

    // set cookie
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only HTTPS in production
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 48 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          photoUrl: user.profilePicture
            ? user.profilePicture.startsWith("http")
              ? user.profilePicture
              : `${process.env.BACKEND_URL || "http://localhost:4000"}/${user.profilePicture}`
            : null,
        },
        token,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    // req.user.id is set by auth middleware
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        photoUrl: user.profilePicture
          ? user.profilePicture.startsWith("http")
            ? user.profilePicture
            : `${process.env.BACKEND_URL || "http://localhost:4000"}/${user.profilePicture}`
          : null,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("token", { maxAge: 0 })
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, bio } = req.body;
    const userId = req.user.id; // From auth middleware

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use by another account",
      });
    }

    // Prepare update data
    const updateData = {
      name,
      email,
      bio: bio || "",
    };

    // If profile picture is uploaded, add it to update data
    if (req.file) {
      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(req.file.path);

      if (uploadResult.success) {
        updateData.profilePicture = uploadResult.url;

        // Remove file from local storage after successful upload
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          console.error("Error deleting local file:", err);
        }
      } else {
        return res
          .status(500)
          .json({ success: false, message: "Failed to upload image" });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        photoUrl: updatedUser.profilePicture
          ? updatedUser.profilePicture.startsWith("http")
            ? updatedUser.profilePicture
            : `${process.env.BACKEND_URL || "http://localhost:4000"}/${updatedUser.profilePicture}`
          : null,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Public: get instructor profile
export const getInstructorProfile = async (req, res) => {
  try {
    const { instructorId } = req.params;

    const instructor = await User.findById(instructorId).select(
      "-password -enrolledCourses -wishlist",
    );
    if (!instructor || !["teacher", "admin"].includes(instructor.role)) {
      return res
        .status(404)
        .json({ success: false, message: "Instructor not found" });
    }

    // Get all published courses by this instructor
    const courses = await Course.find({
      creator: instructorId,
      isPublished: true,
    })
      .populate("lectures", "lectureTitle")
      .select(
        "courseTitle courseThumbnail category price enrolledStudents lectures",
      );

    // Total students across all courses
    const totalStudents = courses.reduce(
      (sum, c) => sum + (c.enrolledStudents?.length || 0),
      0,
    );

    // Average rating across all courses
    const courseIds = courses.map((c) => c._id);
    const reviews = await Review.find({ courseId: { $in: courseIds } });
    const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating =
      reviews.length > 0
        ? parseFloat((totalRatings / reviews.length).toFixed(1))
        : 0;

    return res.status(200).json({
      success: true,
      instructor: {
        _id: instructor._id,
        name: instructor.name,
        bio: instructor.bio,
        description: instructor.description,
        profilePicture: instructor.profilePicture,
        totalCourses: courses.length,
        totalStudents,
        averageRating,
        totalReviews: reviews.length,
      },
      courses,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
