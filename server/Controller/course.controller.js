import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import Lecture from "../models/lecture.model.js";
import Quiz from "../models/quiz.model.js";
import CourseProgress from "../models/courseProgress.model.js";
import fs from "fs";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

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

    const course = await Course.findById(courseId)
      .populate("lectures")
      .populate("creator", "name profilePicture");

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
      sectionName: req.body.sectionName || "Course Content",
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
    const { lectureTitle, videoUrl, isPreviewFree, sectionName } = req.body;
    const file = req.file;

    // 1. Check if course and lecture exists
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res
        .status(404)
        .json({ success: false, message: "Lecture not found" });
    }

    // 2. Update Basic Fields
    if (lectureTitle !== undefined) lecture.lectureTitle = lectureTitle;
    if (sectionName !== undefined) lecture.sectionName = sectionName;
    if (isPreviewFree !== undefined) {
      lecture.isPreviewFree =
        isPreviewFree === "true" || isPreviewFree === true;
    }

    // Handle video upload or YouTube URL
    if (file) {
      // 1. Upload to Cloudinary
      const result = await uploadToCloudinary(req.file.path, "lms/lectures");
      if (!result.success) {
        return res
          .status(500)
          .json({ success: false, message: "Failed to upload video" });
      }

      // 2. Delete old video if exists
      if (lecture.publicId) {
        await deleteFromCloudinary(lecture.publicId);
      }

      // 3. Update lecture with new video
      lecture.videoUrl = result.url;
      lecture.publicId = result.publicId;
    } else if (videoUrl && !videoUrl.includes("res.cloudinary.com")) {
      // Handle YouTube URL (only if it's not a Cloudinary URL)
      // If switching to YouTube, delete old Cloudinary video
      if (lecture.publicId) {
        await deleteFromCloudinary(lecture.publicId);
      }
      lecture.videoUrl = videoUrl;
      lecture.publicId = null; // Clear publicId for YouTube
    }

    await lecture.save();

    // 3. Ensure lecture is linked to the course
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

// delete lecture
export const deleteLecture = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;

    // 1. Find lecture
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // 2. Delete video from Cloudinary if exists
    if (lecture.publicId) {
      await deleteFromCloudinary(lecture.publicId);
    }

    // 3. Remove lecture from course
    await Course.findByIdAndUpdate(courseId, {
      $pull: { lectures: lectureId },
    });

    // 4. Delete lecture document
    await Lecture.findByIdAndDelete(lectureId);

    return res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// toggle publish course
export const publishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // 1. Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 2. Ownership Check: Only the creator can publish/unpublish
    if (course.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only the creator can publish this course",
      });
    }

    // 3. Validation: Prevent publishing if no lectures exist
    if (
      !course.isPublished &&
      (!course.lectures || course.lectures.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Course must have at least one lecture before publishing",
      });
    }

    // 4. Toggle publish status and sync 'status' field
    course.isPublished = !course.isPublished;
    course.status = course.isPublished ? "Published" : "Draft";

    await course.save();

    const message = course.isPublished
      ? "Course published successfully"
      : "Course unpublished successfully";

    return res.status(200).json({
      success: true,
      course,
      message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; // get published courses with search, filters, and pagination
export const getPublishedCourses = async (req, res) => {
  try {
    const {
      search = "",
      categories = [],
      levels = [],
      minPrice,
      maxPrice,
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    // 1. Build Query
    const query = { isPublished: true };

    // Text Search (Title, Subtitle, Category)
    if (search) {
      const escapedSearch = search
        .trim()
        .replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const searchRegex = new RegExp(escapedSearch, "i");
      query.$or = [
        { courseTitle: searchRegex },
        { subTitle: searchRegex },
        { category: searchRegex },
      ];
    }

    // Category Filter
    if (categories.length > 0) {
      query.category = {
        $in: Array.isArray(categories) ? categories : [categories],
      };
    }

    // Level Filter
    if (levels.length > 0) {
      query.courseLevel = { $in: Array.isArray(levels) ? levels : [levels] };
    }

    // Price Filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    // 2. Build Sort Options
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === "price-low") sortOptions = { price: 1 };
    if (sort === "price-high") sortOptions = { price: -1 };
    if (sort === "oldest") sortOptions = { createdAt: 1 };

    // 3. Pagination Logic
    const skip = (Number(page) - 1) * Number(limit);

    // 4. Execute Query

    const [courses, totalCourses] = await Promise.all([
      Course.find(query)
        .populate("lectures", "lectureTitle")
        .populate("creator", "name profilePicture")
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Course.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      courses,
      totalCourses,
      totalPages: Math.ceil(totalCourses / Number(limit)),
      currentPage: Number(page),
      message: "Published courses fetched successfully",
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Enroll in a course
export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const user = await User.findById(userId);
    if (user.enrolledCourses.some((id) => id.toString() === courseId)) {
      return res
        .status(400)
        .json({ success: false, message: "Already enrolled in this course" });
    }

    // Add course to user's enrolledCourses
    user.enrolledCourses.push(courseId);
    await user.save();
    fs.appendFileSync(
      "debug.log",
      `\n[${new Date().toISOString()}] Free Enroll: user ${userId}, course ${courseId} - SUCCESS`,
    );

    // Add user to course's enrolledStudents
    course.enrolledStudents.push(userId);
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Enrolled successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle Wishlist
export const toggleWishlist = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const isWishlisted = user.wishlist.some((id) => id.toString() === courseId);

    if (isWishlisted) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== courseId);
    } else {
      user.wishlist.push(courseId);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      isWishlisted: !isWishlisted,
      message: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Check Enrollment and Wishlist Status
export const checkEnrollmentAndWishlist = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const isEnrolled = user.enrolledCourses.some(
      (id) => id.toString() === courseId,
    );
    const isWishlisted = user.wishlist.some((id) => id.toString() === courseId);

    const progress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    return res.status(200).json({
      success: true,
      isEnrolled,
      isWishlisted,
      progress,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
// Rename a section (updates all lectures and quizzes in that section)
export const renameSection = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { oldSectionName, newSectionName } = req.body;

    if (!oldSectionName || !newSectionName) {
      return res.status(400).json({
        success: false,
        message: "Both old and new section names are required",
      });
    }

    // Update Lectures
    await Lecture.updateMany(
      { course: courseId, sectionName: oldSectionName },
      { $set: { sectionName: newSectionName } },
    );

    // Update Quizzes
    await Quiz.updateMany(
      { courseId, sectionName: oldSectionName },
      { $set: { sectionName: newSectionName } },
    );

    return res.status(200).json({
      success: true,
      message: `Section renamed from "${oldSectionName}" to "${newSectionName}"`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a section (removes all lectures and quizzes in that section)
export const deleteSection = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { sectionName } = req.body;

    if (!sectionName) {
      return res
        .status(400)
        .json({ success: false, message: "Section name is required" });
    }

    // 1. Get all lectures to delete videos from Cloudinary
    const lecturesToDelete = await Lecture.find({
      course: courseId,
      sectionName,
    });
    for (const lecture of lecturesToDelete) {
      if (lecture.publicId) {
        await deleteFromCloudinary(lecture.publicId);
      }
    }

    // 2. Remove lectures from Course document
    const lectureIds = lecturesToDelete.map((l) => l._id);
    await Course.findByIdAndUpdate(courseId, {
      $pull: { lectures: { $in: lectureIds } },
    });

    // 3. Delete Lectures
    await Lecture.deleteMany({ course: courseId, sectionName });

    // 4. Delete Quizzes
    await Quiz.deleteMany({ courseId, sectionName });

    return res.status(200).json({
      success: true,
      message: `Section "${sectionName}" and its content deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
