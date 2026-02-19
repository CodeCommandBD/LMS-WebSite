import Review from "../models/review.model.js";
import Course from "../Models/course.model.js";

// Create or update a review (one per user per course)
export const createOrUpdateReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Check if user is enrolled in the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const isEnrolled = course.enrolledStudents.some(
      (studentId) => studentId.toString() === userId,
    );
    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled in this course to leave a review",
      });
    }

    // Upsert: create if not exists, update if exists
    const review = await Review.findOneAndUpdate(
      { userId, courseId },
      { rating, comment: comment || "" },
      { new: true, upsert: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "You already reviewed this course" });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all reviews for a course
export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    const reviews = await Review.find({ courseId })
      .populate("userId", "name profilePicture")
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating =
      reviews.length > 0
        ? parseFloat((totalRatings / reviews.length).toFixed(1))
        : 0;

    // Rating distribution (how many 5-star, 4-star, etc.)
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      distribution[r.rating]++;
    });

    return res.status(200).json({
      success: true,
      reviews,
      averageRating,
      totalReviews: reviews.length,
      distribution,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a review (by the user who wrote it)
export const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const review = await Review.findOneAndDelete({ userId, courseId });
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
