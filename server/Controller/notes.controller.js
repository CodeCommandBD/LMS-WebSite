import Notes from "../models/notes.model.js";
import User from "../models/user.model.js";

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
    return res.status(500).json({ success: false, message: error.message });
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
    return res.status(500).json({ success: false, message: error.message });
  }
};
