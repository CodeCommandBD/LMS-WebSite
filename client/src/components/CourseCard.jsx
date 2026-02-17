import React from "react";
import { Link } from "react-router";

const CourseCard = ({ course }) => {
  return (
    <div
      key={course._id || course.id}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.courseThumbnail || course.image}
          alt={course.courseTitle || course.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
          {course.courseLevel || "Beginner"}
        </div>
      </div>
      <div className="p-5 flex flex-col grow">
        <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
          {course.courseTitle || course.title}
        </h2>
        <div className="text-gray-600 text-sm mb-4 line-clamp-2 grow overflow-hidden">
          {/* Render description as HTML but keep it clean */}
          <div
            className="description-content"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50/50">
          <span className="text-xl font-extrabold text-blue-600">
            ৳{course.price || 0}
          </span>
          <Link to={`/courseDetails/${course._id || course.id}`}>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium text-sm">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
