import React from "react";
import CourseCard from "./CourseCard";
import { usePublishedCourses } from "@/hooks/usePublishedCourses";
import { Loader2 } from "lucide-react";

const CourseSection = () => {
  const { data: courses, isLoading, isError } = usePublishedCourses();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">Failed to load courses for Home page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      {courses?.slice(0, 6).map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
      {courses?.length === 0 && (
        <div className="col-span-full text-center py-10 text-gray-500">
          No courses available.
        </div>
      )}
    </div>
  );
};

export default CourseSection;
