import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CourseSkeleton from "@/components/CourseSkeleton";
import {
  GraduationCap,
  BookOpen,
  Clock,
  ChevronRight,
  LayoutGrid,
  PlayCircle,
  LogOut,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { getEnrolledCourses } from "@/services/authApi";
import toast from "react-hot-toast";

const unenrollCourse = (courseId) =>
  api.post(`/purchase/unenroll/${courseId}`).then((r) => r.data);

const MyEnrolledCourses = () => {
  const queryClient = useQueryClient();
  const [confirmUnenrollId, setConfirmUnenrollId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["enrolledCourses"],
    queryFn: getEnrolledCourses,
  });

  const unenrollMutation = useMutation({
    mutationFn: unenrollCourse,
    onSuccess: () => {
      toast.success("Successfully unenrolled from the course.");
      setConfirmUnenrollId(null);
      queryClient.invalidateQueries(["enrolledCourses"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to unenroll.");
    },
  });

  const completedCoursesCount =
    data?.progress?.filter((p) => p.isCompleted).length || 0;

  const getProgress = (courseId) => {
    const prog = data?.progress?.find(
      (p) => p.courseId?.toString() === courseId?.toString()
    );
    return prog?.isCompleted ? 100 : prog?.completedLectures?.length
      ? Math.round(
          (prog.completedLectures.length /
            (data?.courses?.find((c) => c._id === courseId)?.lectures?.length ||
              1)) *
            100
        )
      : 0;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link to="/profile" className="hover:text-blue-600 transition-colors">Profile</Link>
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
              <span className="block text-2xl font-bold text-blue-600">{data?.courses?.length || 0}</span>
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">Enrolled</span>
            </div>
            <div className="w-px h-8 bg-blue-200 dark:bg-blue-800/50" />
            <div className="text-center">
              <span className="block text-2xl font-bold text-purple-600">{completedCoursesCount}</span>
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-widest">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <CourseSkeleton key={i} />)}
        </div>
      ) : data?.courses?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.courses.map((course) => {
            const progress = getProgress(course._id);
            const isCompleted = progress === 100;
            const showConfirm = confirmUnenrollId === course._id;

            return (
              <div
                key={course._id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden flex flex-col group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
                  {course.courseThumbnail ? (
                    <img src={course.courseThumbnail} alt={course.courseTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-gray-300" />
                    </div>
                  )}
                  {isCompleted && (
                    <Badge className="absolute top-3 right-3 bg-emerald-500 text-white border-0 shadow-lg">
                      ✓ Completed
                    </Badge>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 bg-gray-100 dark:bg-gray-700">
                  <div
                    className={`h-full transition-all duration-700 ${isCompleted ? "bg-emerald-500" : "bg-blue-500"}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col gap-3">
                  <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                    {course.courseTitle}
                  </h3>

                  <div className="flex items-center gap-2 justify-between mt-auto">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {progress}% complete
                    </span>
                    {course.courseRating?.average > 0 && (
                      <span className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-current" />
                        {course.courseRating.average.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  {showConfirm ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-center">
                      <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2">
                        Unenroll and lose all progress?
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => unenrollMutation.mutate(course._id)}
                          disabled={unenrollMutation.isPending}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs h-8"
                        >
                          {unenrollMutation.isPending ? "..." : "Yes, Unenroll"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setConfirmUnenrollId(null)}
                          className="flex-1 text-xs h-8"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Link to={`/course-progress/${course._id}`} className="flex-1">
                        <Button className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl gap-1.5">
                          <PlayCircle className="w-3.5 h-3.5" />
                          {isCompleted ? "Review" : "Continue"}
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setConfirmUnenrollId(course._id)}
                        className="h-9 px-2.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 border-red-200 dark:border-red-800 rounded-xl"
                        title="Unenroll"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 dark:bg-gray-900/50 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-gray-800">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-full shadow-xl mb-8 relative">
            <BookOpen className="w-16 h-16 text-gray-300" />
            <div className="absolute -bottom-2 -right-2 bg-blue-600 p-3 rounded-full text-white shadow-lg">
              <LayoutGrid className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No courses yet</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto mb-10">
            You haven't enrolled in any courses. Start your learning journey today!
          </p>
          <Link to="/courses">
            <Button size="lg" className="rounded-full px-10 py-6 bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-xl shadow-blue-500/25">
              Browse All Courses
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyEnrolledCourses;
