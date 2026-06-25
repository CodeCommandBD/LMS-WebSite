import mongoose from "mongoose";
import Certificate from "../models/certificate.model.js";
import CourseProgress from "../models/courseProgress.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import { sendError } from "../utils/errorHandler.js";

/**
 * GET /api/v1/certificates/:courseId
 * Issues or retrieves an existing certificate.
 * Only accessible if the user has completed the course.
 */
export const getOrCreateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // 1. Check enrollment
    const user = await User.findById(userId);
    if (
      !user ||
      !user.enrolledCourses.some((id) => id.toString() === courseId)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course.",
      });
    }

    // 2. Check course completion
    const progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress || !progress.isCompleted) {
      return res.status(403).json({
        success: false,
        message: "You must complete the course to receive a certificate.",
      });
    }

    // 3. Get or create certificate (upsert to avoid duplicates)
    const certificate = await Certificate.findOneAndUpdate(
      { userId, courseId },
      { userId, courseId }, // don't overwrite certificateId or issuedAt
      { new: true, upsert: true, setDefaultsOnInsert: true },
    )
      .populate("userId", "name email profilePicture")
      .populate("courseId", "courseTitle creator")
      .populate({
        path: "courseId",
        populate: { path: "creator", select: "name" },
      });

    return res.status(200).json({
      success: true,
      certificate,
    });
  } catch (error) {
    console.error("Certificate error:", error);
    return sendError(res, error, "certificateController");
  }
};

/**
 * GET /api/v1/certificates/verify/:id
 * Publicly verify a certificate by its unique certificateId (8-char code) or _id.
 */
export const verifyCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    // Search by either the 8-char short code or the Mongo ObjectId
    // BUG-027 FIX: Cleaner condition logic to prevent bugs
    const queryList = [{ certificateId: id.toUpperCase() }];
    if (mongoose.isValidObjectId(id)) {
      queryList.push({ _id: id });
    }

    const certificate = await Certificate.findOne({
      $or: queryList,
    })
      .populate("userId", "name profilePicture")
      .populate("courseId", "courseTitle creator")
      .populate({
        path: "courseId",
        populate: { path: "creator", select: "name" },
      });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found or invalid ID.",
      });
    }

    return res.status(200).json({
      success: true,
      certificate,
    });
  } catch (error) {
    return sendError(res, error, "certificateController");
  }
};
