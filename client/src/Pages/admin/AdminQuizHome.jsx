import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getInstructorCourses } from "@/services/courseApi";
import {
  HelpCircle,
  Search,
  Loader2,
  Plus,
  BookOpen,
  MessageSquare,
  ChevronRight,
  BrainCircuit,
  Settings2,
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminQuizHome = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["adminCourses"],
    queryFn: getInstructorCourses,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const courses = data?.courses || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="bg-cyan-600 p-2 rounded-xl shadow-lg shadow-cyan-600/20">
              <BrainCircuit className="w-6 h-6" />
            </div>
            Quiz Management
          </h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">
            Create and manage assessments for your courses
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-cyan-500 transition-colors" />
            <input
              type="text"
              placeholder="Find a course..."
              className="bg-[#1e293b]/50 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-600/50 focus:border-cyan-600 transition-all w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-[#1e293b]/20 border border-gray-800 rounded-[32px] p-6 group hover:border-cyan-600/30 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <BrainCircuit className="w-20 h-20 text-white" />
            </div>

            <div className="relative z-10">
              <div className="bg-gray-800/50 w-fit p-2 rounded-lg mb-4">
                <BookOpen className="w-4 h-4 text-gray-400" />
              </div>
              <h3 className="text-white font-black text-lg leading-tight mb-2 line-clamp-2 min-h-14 group-hover:text-cyan-400 transition-colors">
                {course.courseTitle}
              </h3>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    {course.lectures?.length || 0} Lectures
                  </span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-700" />
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded-md">
                  Draft Mode
                </span>
              </div>

              <Link to={`/admin/courses/${course._id}/quizzes`}>
                <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-black text-sm py-3.5 rounded-2xl shadow-xl shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all active:scale-95">
                  <Settings2 className="w-4 h-4" />
                  Manage Assessments
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="bg-gray-800/30 p-6 rounded-full w-fit mx-auto">
              <BrainCircuit className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-white font-black text-xl tracking-tight">
              No courses found
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto text-sm">
              You need to create a course before you can add any quizzes or
              assessments.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuizHome;
