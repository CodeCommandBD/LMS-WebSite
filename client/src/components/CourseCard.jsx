import React from "react";
import { Link } from "react-router";

const CourseCard = ({ course }) => {
  return (
    <div
      key={course._id || course.id}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <img
        src={course.courseThumbnail || course.image}
        alt={course.courseTitle || course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {course.courseTitle || course.title}
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-800">
            ${course.price}
          </span>
          <Link to={`/courseDetails/${course._id || course.id}`}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
