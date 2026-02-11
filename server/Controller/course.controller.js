import Course from "../models/course.model.js";

// Create a new course with title, category, and the logged-in user as creator
export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;

    // Validate required fields
    if (!courseTitle || !category) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Create course and assign the authenticated user as the creator
    const course = await Course.create({
      courseTitle,
      category,
      creator: req.user.id,
    });
    res
      .status(201)
      .json({ success: true, course, message: "Course created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all published courses (publicly accessible, no auth required)
export const getPublicCourses = async (req, res) => {
  try {
    // Only fetch courses where isPublished is true
    const courses = await Course.find({ isPublished: true });
    if (!courses) {
      return res
        .status(404)
        .json({ success: false, message: "No courses found" });
    }
    res.status(200).json({
      success: true,
      courses,
      message: "Courses fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all courses created by the logged-in user (requires authentication)
export const getCreatorCourses = async (req, res) => {
  try {
    // Get the authenticated user's ID from the request
    const userId = req.user.id;

    // Find all courses where the creator matches the logged-in user
    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res.status(404).json({
        success: false,
        courses: [],
        message: "No courses found",
      });
    }
    res.status(200).json({
      success: true,
      courses,
      message: "Courses fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
