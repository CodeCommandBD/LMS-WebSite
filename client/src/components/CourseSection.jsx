import React from "react";
import CourseCard from "./CourseCard";
import { Link } from "react-router-dom";
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
    <section className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="inline-block px-4 py-1.5 rounded-full bg-linear-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-100 dark:border-blue-900/30">
              Future-Ready Skills
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Featured{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600">
                Courses
              </span>
            </h3>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
              Carefully curated learning paths to take you from beginner to
              expert in no time.
            </p>
          </div>
          <Link
            to="/courses"
            className="shrink-0 px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-sm flex items-center gap-2"
          >
            Explore All{" "}
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses?.slice(0, 6).map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
          {courses?.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              No courses available.
            </div>
          )}
        </div>
        <div className="flex justify-center mt-16">
          <Link
            to="/courses"
            className="px-10 py-5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black rounded-3xl hover:scale-105 transition-all shadow-2xl hover:shadow-indigo-500/30 text-lg uppercase tracking-wider"
          >
            Start Learning Today
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CourseSection;
