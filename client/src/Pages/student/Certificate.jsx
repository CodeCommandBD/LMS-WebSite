import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Award,
  Download,
  Share2,
  CheckCircle2,
  GraduationCap,
  Calendar,
  User,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Certificate = () => {
  const { id: courseId } = useParams();

  const { data: courseData, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const resp = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/courses/${courseId}`,
        { withCredentials: true },
      );
      return resp.data;
    },
  });

  const { data: userData } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const resp = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/users/profile`,
        { withCredentials: true },
      );
      return resp.data;
    },
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading certificate...
      </div>
    );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/my-learning"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Learning
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 relative">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl text-sm" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

          <div className="p-12 md:p-20 flex flex-col items-center text-center relative z-10">
            {/* Certificate Header */}
            <div className="mb-12">
              <div className="bg-blue-600/10 p-5 rounded-3xl inline-block mb-6 ring-8 ring-blue-500/5">
                <Award className="w-16 h-16 text-blue-600" />
              </div>
              <h1 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em] mb-4">
                Certificate of Completion
              </h1>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-gray-200 dark:bg-gray-700" />
                <span className="text-gray-400 font-medium italic">
                  Proudly Presented To
                </span>
                <div className="h-px w-12 bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>

            {/* Recipient Name */}
            <div className="mb-12">
              <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tight mb-4 capitalize">
                {userData?.user?.name || "Student Name"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-lg">
                For successfully completing all requirements and assessments of
                the professional course
              </p>
            </div>

            {/* Course Name */}
            <div className="mb-16">
              <div className="inline-flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 px-8 py-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {courseData?.course?.courseTitle || "Course Title"}
                </h3>
              </div>
            </div>

            {/* Certificate Footer Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full pt-12 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-col items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Date Issued
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Instructor
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {courseData?.course?.creator?.name || "Instructor"}
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Certificate ID
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                  {Math.random().toString(36).substring(2, 10).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => window.print()}
            size="lg"
            className="rounded-full px-8 py-6 bg-blue-600 hover:bg-blue-700 font-bold shadow-xl shadow-blue-500/25 flex items-center gap-2 w-full md:w-auto"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 py-6 border-2 font-bold flex items-center gap-2 w-full md:w-auto bg-white dark:bg-gray-900"
          >
            <Share2 className="w-5 h-5" />
            Share Certificate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
