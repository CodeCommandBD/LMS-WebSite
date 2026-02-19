import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getInstructorProfileService } from "@/services/courseApi";
import {
  Loader2,
  Star,
  Users,
  BookOpen,
  Award,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const InstructorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["instructorProfile", id],
    queryFn: () => getInstructorProfileService(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">
          Loading instructor profile...
        </p>
      </div>
    );
  }

  if (error || !data?.instructor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="bg-red-50 p-8 rounded-2xl border border-red-100 text-center max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Instructor not found
          </h2>
          <p className="text-red-600 mb-6">
            {error?.response?.data?.message ||
              "Could not load instructor profile."}
          </p>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const { instructor, courses } = data;

  return (
    <div className="bg-white min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Instructor Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-gray-100 flex items-center justify-center">
              {instructor.profilePicture ? (
                <img
                  src={instructor.profilePicture}
                  alt={instructor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users className="h-16 w-16 text-gray-300" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-full shadow-lg">
              <Award className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                {instructor.name}
              </h1>
              <p className="text-blue-600 font-bold mt-1">
                {instructor.bio || "Instructor"}
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <div>
                  <span className="font-black text-gray-900">
                    {instructor.averageRating || "N/A"}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({instructor.totalReviews} reviews)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="font-black text-gray-900">
                    {instructor.totalStudents}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">students</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-xl border border-purple-100">
                <BookOpen className="h-5 w-5 text-purple-500" />
                <div>
                  <span className="font-black text-gray-900">
                    {instructor.totalCourses}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">courses</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {instructor.description && (
              <p className="text-gray-600 leading-relaxed max-w-3xl">
                {instructor.description}
              </p>
            )}
          </div>
        </div>

        {/* Instructor's Courses */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900">
            Courses by {instructor.name}
          </h2>

          {courses.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium">No published courses yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  onClick={() => navigate(`/courseDetails/${course._id}`)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 group"
                >
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    {course.courseThumbnail ? (
                      <img
                        src={course.courseThumbnail}
                        alt={course.courseTitle}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-3">
                    <Badge className="bg-blue-100 text-blue-700 border-0 font-bold text-[10px] uppercase">
                      {course.category}
                    </Badge>
                    <h3 className="font-black text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {course.courseTitle}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Users className="h-3.5 w-3.5" />
                        <span className="font-medium">
                          {course.enrolledStudents?.length || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span className="font-medium">
                          {course.lectures?.length || 0} lectures
                        </span>
                      </div>
                      <span className="font-black text-gray-900">
                        ৳{course.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;
