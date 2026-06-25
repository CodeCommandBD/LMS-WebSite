import Notes from "../models/notes.model.js";
import User from "../models/user.model.js";
import { sendError } from "../utils/errorHandler.js";

// 1. Get notes for a specific lecture
export const getNotes = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.user.id;

    // Enrollment check
    const user = await User.findById(userId);
    if (
      !user ||
      !user.enrolledCourses.some((id) => id.toString() === courseId)
    ) {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled to access notes.",
      });
    }

    const notes = await Notes.findOne({ userId, lectureId, courseId });
    return res.status(200).json({
      success: true,
      content: notes?.content || "",
    });
  } catch (error) {
    return sendError(res, error, "notesController");
  }
};

// 2. Save (upsert) notes for a specific lecture
export const saveNotes = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Enrollment check
    const user = await User.findById(userId);
    if (
      !user ||
      !user.enrolledCourses.some((id) => id.toString() === courseId)
    ) {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled to save notes.",
      });
    }

    const notes = await Notes.findOneAndUpdate(
      { userId, lectureId, courseId },
      { content: content || "" },
      { new: true, upsert: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "Notes saved successfully.",
      content: notes.content,
    });
  } catch (error) {
    return sendError(res, error, "notesController");
  }
};

// 3. Get ALL notes for the logged-in user (grouped by course)
export const getAllMyNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    const notes = await Notes.find({ userId, content: { $ne: "" } })
      .populate("courseId", "courseTitle thumbnail")
      .populate("lectureId", "lectureTitle")
      .sort({ updatedAt: -1 });

    // Group notes by course
    const grouped = {};
    notes.forEach((note) => {
      const cId = note.courseId?._id?.toString();
      if (!cId) return;
      if (!grouped[cId]) {
        grouped[cId] = {
          courseId: cId,
          courseTitle: note.courseId?.courseTitle || "Unknown Course",
          thumbnail: note.courseId?.thumbnail || "",
          notes: [],
        };
      }
      grouped[cId].notes.push({
        _id: note._id,
        lectureId: note.lectureId?._id,
        lectureTitle: note.lectureId?.lectureTitle || "Unknown Lecture",
        content: note.content,
        updatedAt: note.updatedAt,
      });
    });

    return res.status(200).json({
      success: true,
      courses: Object.values(grouped),
    });
  } catch (error) {
    return sendError(res, error, "notesController");
  }
};
