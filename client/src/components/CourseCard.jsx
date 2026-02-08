import React from "react";
import { Link } from "react-router";

const CourseCard = ({ course }) => {
  return (
    <div
      key={course.id}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h2>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-800">
            ${course.price}
          </span>
          <Link to={`/courseDetails/${course.id}`}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
