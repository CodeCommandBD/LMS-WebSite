import React from "react";
import CourseCard from "@/components/CourseCard";
import CourseSkeleton from "@/components/CourseSkeleton";
import { usePublishedCourses } from "@/hooks/usePublishedCourses";
import { Loader2 } from "lucide-react";

const Courses = () => {
  const { data: courses, isLoading, isError } = usePublishedCourses();

  if (isLoading) {
    return (
      <div className="bg-gray-100 pt-20">
        <div className="min-h-screen max-w-7xl mx-auto py-10 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <CourseSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">
          Failed to load courses. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 pt-20">
      <div className="min-h-screen max-w-7xl mx-auto py-10">
        <div className="px-4">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Explore Our Courses
          </h1>
          <p className="text-center mb-12 text-gray-600">
            Discover a wide range of courses taught by expert instructors.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses?.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
          {courses?.length === 0 && (
            <p className="text-center text-gray-600 mt-10">
              No courses available at the moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
