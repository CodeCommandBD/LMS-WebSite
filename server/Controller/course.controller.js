import Course from "../models/course.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

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
    return res
      .status(201)
      .json({ success: true, course, message: "Course created successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all published courses (publicly accessible, no auth required)
export const getPublicCourses = async (req, res) => {
  try {
    // Only fetch courses where isPublished is true
    const courses = await Course.find({ isPublished: true });
    if (!courses || courses.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No courses found" });
    }
    return res.status(200).json({
      success: true,
      courses,
      message: "Courses fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all courses created by the logged-in user (requires authentication)
export const getCreatorCourses = async (req, res) => {
  try {
    // Get the authenticated user's ID from the request
    const userId = req.user.id;

    // Find all courses where the creator matches the logged-in user
    const courses = await Course.find({ creator: userId });
    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        courses: [],
        message: "No courses found",
      });
    }
    return res.status(200).json({
      success: true,
      courses,
      message: "Courses fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// edit course
export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const { courseTitle, category, subTitle, description, courseLevel, price } =
      req.body;

    const file = req.file;

    let course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    if (course.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Upload thumbnail to Cloudinary if a file was provided
    if (file) {
      const result = await uploadToCloudinary(file.path, "lms/courses");
      if (!result.success) {
        return res
          .status(500)
          .json({ success: false, message: "Failed to upload thumbnail" });
      }
      course.courseThumbnail = result.url;
    }

    // Only update fields that were actually sent
    if (courseTitle) course.courseTitle = courseTitle;
    if (category) course.category = category;
    if (subTitle !== undefined) course.subTitle = subTitle;
    if (description !== undefined) course.description = description;
    if (courseLevel) course.courseLevel = courseLevel;
    if (price !== undefined) course.price = price;

    await course.save();

    return res
      .status(200)
      .json({ success: true, course, message: "Course updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get course by id
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    return res
      .status(200)
      .json({ success: true, course, message: "Course fetched successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
