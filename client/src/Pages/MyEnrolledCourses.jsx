import React from "react";
import { useQuery } from "@tanstack/react-query";
import CourseCard from "@/components/CourseCard";
import CourseSkeleton from "@/components/CourseSkeleton";
import {
  GraduationCap,
  BookOpen,
  Clock,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import { getEnrolledCourses } from "@/services/authApi";

const MyEnrolledCourses = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["enrolledCourses"],
    queryFn: getEnrolledCourses,
  });

  const completedCoursesCount =
    data?.progress?.filter((p) => p.isCompleted).length || 0;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link to="/profile" className="hover:text-blue-600 transition-colors">
            Profile
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-blue-600 font-medium">My Learning</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              My Enrolled Courses
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Continue where you left off and master new skills.
            </p>
          </div>

          <div className="flex items-center gap-8 bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-2xl border border-blue-100 dark:border-blue-900/30">
            <div className="text-center">
              <span className="block text-2xl font-bold text-blue-600">
                {data?.courses?.length || 0}
              </span>
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">
                Enrolled
              </span>
            </div>
            <div className="w-px h-8 bg-blue-200 dark:bg-blue-800/50" />
            <div className="text-center">
              <span className="block text-2xl font-bold text-purple-600">
                {completedCoursesCount}
              </span>
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-widest">
                Completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <CourseSkeleton key={i} />
          ))}
        </div>
      ) : data?.courses?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.courses.map((course) => (
            <CourseCard key={course._id} course={course} isEnrolled={true} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 dark:bg-gray-900/50 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-gray-800">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-full shadow-xl mb-8 relative">
            <BookOpen className="w-16 h-16 text-gray-300" />
            <div className="absolute -bottom-2 -right-2 bg-blue-600 p-3 rounded-full text-white shadow-lg">
              <LayoutGrid className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            No courses yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto mb-10">
            You haven't enrolled in any courses. Start your learning journey
            today by exploring our catalog!
          </p>
          <Link to="/courses">
            <Button
              size="lg"
              className="rounded-full px-10 py-6 bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-xl shadow-blue-500/25 transition-all active:scale-95"
            >
              Browse All Courses
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyEnrolledCourses;
