import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCourseReviewsService } from "@/services/courseApi";

import { useSelector } from "react-redux";

/**
 * CourseCard Component
 * Redesigned to match a premium LMS look with rounded thumbnails,
 * floating price badges, and instructor details.
 */
const CourseCard = ({ course, isEnrolled: isEnrolledProp }) => {
  const { user } = useSelector((state) => state.auth);

  // Check enrollment from prop or Redux state
  const isEnrolled =
    isEnrolledProp ||
    (user?.enrolledCourses &&
      (user.enrolledCourses.includes(course._id) ||
        user.enrolledCourses.some((c) => (c._id || c) === course._id)));
  const { data: reviewsData } = useQuery({
    queryKey: ["courseReviews", course._id || course.id],
    queryFn: () => getCourseReviewsService(course._id || course.id),
    enabled: !!(course._id || course.id),
    staleTime: 5 * 60 * 1000, // cache for 5 min to avoid refetching on every card
  });

  const rating = reviewsData?.averageRating || 0;
  const totalReviews = reviewsData?.totalReviews || 0;

  return (
    <div
      key={course._id || course.id}
      className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100"
    >
      <Link to={`/courseDetails/${course._id || course.id}`}>
        {/* Thumbnail Area */}
        <div className="relative p-3">
          <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={
                course.courseThumbnail?.includes("res.cloudinary.com")
                  ? course.courseThumbnail.replace(
                      "/upload/",
                      "/upload/f_auto,q_auto,w_600/",
                    )
                  : course.courseThumbnail ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
              }
              alt={course.courseTitle}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Price or Enrolled Badge Overlay */}
            <div
              className={`absolute top-3 right-3 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/50 ${isEnrolled ? "bg-green-600/90 text-white" : "bg-white/90 text-blue-600"}`}
            >
              {isEnrolled ? "ENROLLED" : `৳${course.price || 0}`}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 pt-1 flex flex-col grow">
          {/* Category and Rating Row */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded">
              {course.category || "General"}
            </span>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-bold text-amber-700">
                {rating}
              </span>
            </div>
          </div>

          <h2 className="text-base font-extrabold text-gray-900 mb-6 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
            {course.courseTitle}
          </h2>

          {/* Footer with Instructor Info */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 ring-2 ring-gray-50">
                <AvatarImage src={course.creator?.photoUrl} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-[10px]">
                  {course.creator?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-semibold text-gray-600 truncate max-w-[120px]">
                {course.creator?.name || "Unknown Instructor"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;
