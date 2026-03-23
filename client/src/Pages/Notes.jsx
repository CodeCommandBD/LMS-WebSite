import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import {
  FileText,
  ChevronRight,
  BookOpen,
  Search,
  Clock,
  PlayCircle,
  StickyNote,
} from "lucide-react";
import { Loader2 } from "lucide-react";

const fetchMyNotes = () => api.get("/notes/me").then((r) => r.data);

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCourses, setExpandedCourses] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ["myNotes"],
    queryFn: fetchMyNotes,
  });

  const courses = data?.courses || [];

  const filteredCourses = courses
    .map((course) => ({
      ...course,
      notes: course.notes.filter(
        (note) =>
          note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.lectureTitle.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((c) => c.notes.length > 0 || searchQuery === "");

  const toggleCourse = (courseId) => {
    setExpandedCourses((prev) => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  const totalNotes = courses.reduce((acc, c) => acc + c.notes.length, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium">My Notes</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl">
              <StickyNote className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">My Notes</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {totalNotes} note{totalNotes !== 1 ? "s" : ""} across {courses.length} course{courses.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search your notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 shadow-sm"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No notes yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Start taking notes while watching lectures in your enrolled courses.
            </p>
            <Link
              to="/my-learning"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20"
            >
              <BookOpen className="w-4 h-4" />
              Go to My Learning
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCourses.map((course) => {
              const isExpanded = expandedCourses[course.courseId] !== false;
              return (
                <div
                  key={course.courseId}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden"
                >
                  {/* Course Header */}
                  <button
                    onClick={() => toggleCourse(course.courseId)}
                    className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                  >
                    <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.courseTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="w-6 h-6 text-gray-400 m-2" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-gray-900 dark:text-white truncate">
                        {course.courseTitle}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {course.notes.length} note{course.notes.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <Link
                      to={`/course-progress/${course.courseId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      Continue Course
                    </Link>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </button>

                  {/* Notes List */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 dark:border-gray-700/50 divide-y divide-gray-50 dark:divide-gray-700/30">
                      {course.notes.map((note) => (
                        <div key={note._id} className="p-5 pl-8">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <PlayCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              <span className="text-xs font-bold text-blue-500 dark:text-blue-400">
                                {note.lectureTitle}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-gray-400 shrink-0">
                              <Clock className="w-3 h-3" />
                              {timeAgo(note.updatedAt)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap line-clamp-4">
                            {note.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
