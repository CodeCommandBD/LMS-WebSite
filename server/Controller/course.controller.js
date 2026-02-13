import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";
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
        .status(200)
        .json({ success: true, courses: [], message: "No courses found" });
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
      return res.status(200).json({
        success: true,
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

    // 1. Check if course exists and belongs to user
    let course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    if (course.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // 2. Prepare Update Object
    const updateData = {};
    if (courseTitle !== undefined) updateData.courseTitle = courseTitle;
    if (category !== undefined) updateData.category = category;
    if (subTitle !== undefined) updateData.subTitle = subTitle;
    if (description !== undefined) updateData.description = description;
    if (courseLevel !== undefined) updateData.courseLevel = courseLevel;
    if (price !== undefined) updateData.price = price;

    // 3. Upload Thumbnail if exists
    if (file) {
      const result = await uploadToCloudinary(file.path, "lms/courses");
      if (!result.success) {
        return res
          .status(500)
          .json({ success: false, message: "Failed to upload thumbnail" });
      }
      updateData.courseThumbnail = result.url;
    }

    // 4. Update Course
    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
      runValidators: true,
    });

    console.log("Req Body:", req.body);
    console.log("Updated Course (After Atomic Update):", updatedCourse);

    return res.status(200).json({
      success: true,
      course: updatedCourse,
      message: "Course updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get course by id
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("lectures");

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

// delete course
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Check if the user is the creator
    if (course.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Course.findByIdAndDelete(courseId);

    return res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// create lecture

export const createLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lectureTitle } = req.body;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Lecture title is required",
      });
    }

    // 1. Check if course exists first
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // 2. Create Lecture
    const lecture = await Lecture.create({
      lectureTitle,
      course: courseId,
    });

    // 3. Update Course
    course.lectures.push(lecture._id);
    await course.save();

    return res.status(201).json({
      success: true,
      lecture,
      course,
      message: "Lecture created successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get course lectures
export const getCourseLectures = async (req, res) => {
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

// edit lecture
export const editLecture = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;

    // 1. Find the lecture
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // 2. Update lecture fields
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    if (isPreviewFree !== undefined) lecture.isPreviewFree = isPreviewFree; // Check explicitly for undefined

    await lecture.save();

    // 3. Ensure lecture is linked to the course
    // Use findByIdAndUpdate to add to set (unique), preventing duplicates efficiently
    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(200).json({
      success: true,
      lecture,
      message: "Lecture updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
