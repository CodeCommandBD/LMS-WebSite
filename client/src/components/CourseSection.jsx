import React from "react";
import CourseCard from "./CourseCard";
import courses from "../data/courses.json";

const CourseSection = () => {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      {courses.slice(0, 6).map((course) => (
        <CourseCard key={course.id || course._id} course={course} />
      ))}
    </div>
  );
};

export default CourseSection;
