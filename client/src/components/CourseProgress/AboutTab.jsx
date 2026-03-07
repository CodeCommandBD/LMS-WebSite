import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Globe,
  Layout,
  CheckCircle,
  FileText,
  MessageSquare,
  Award,
} from "lucide-react";

const AboutTab = ({
  course,
  currentLecture,
  lectures,
  completedLectures,
  handleToggleComplete,
  updateProgressMutation,
  setIsQAOpen,
  handleDownloadNotes,
  isCourseCompleted,
  setIsCertificateOpen,
}) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1 font-black text-[10px] uppercase tracking-widest">
            Lecture {lectures.indexOf(currentLecture) + 1}
          </Badge>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 italic">
            <Clock className="h-3 w-3" /> 12:45 Total Length
          </div>
        </div>
        <h2 className="text-3xl lg:text-5xl font-black tracking-tighter text-white">
          {currentLecture?.lectureTitle}
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
            <span className="flex items-center gap-1.5">
              <Globe className="h-4 w-4" /> English Audio
            </span>
            <span className="flex items-center gap-1.5">
              <Layout className="h-4 w-4" /> Supporting Docs
            </span>
          </div>
          <Button
            onClick={() => handleToggleComplete()}
            disabled={updateProgressMutation.isPending}
            variant={
              completedLectures.includes(currentLecture?._id)
                ? "secondary"
                : "default"
            }
            className={`rounded-xl px-6 font-black h-12 transition-all ${
              completedLectures.includes(currentLecture?._id)
                ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20"
            }`}
          >
            {completedLectures.includes(currentLecture?._id) ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" /> Completed
              </>
            ) : (
              "Mark as Complete"
            )}
          </Button>
        </div>
      </div>

      <Separator className="bg-white/5" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-xl font-black text-white/90 tracking-tight flex items-center gap-3">
            <FileText className="h-5 w-5 text-blue-500" />
            About this course
          </h3>
          <div
            className="text-gray-400 leading-relaxed font-medium prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: course?.description }}
          />
          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsQAOpen(true)}
              className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-white text-xs font-black px-6 h-12 rounded-xl"
            >
              <MessageSquare className="h-4 w-4 mr-2 text-blue-400" /> Q&A
              Session
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadNotes}
              className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-white text-xs font-black px-6 h-12 rounded-xl"
            >
              <FileText className="h-4 w-4 mr-2 text-green-400" /> Download
              Notes
            </Button>
            {isCourseCompleted && (
              <Button
                onClick={() => setIsCertificateOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-black px-6 h-12 rounded-xl border-none shadow-[0_0_15px_rgba(234,179,8,0.3)] animate-pulse"
              >
                <Award className="h-4 w-4 mr-2" /> Get Certificate
              </Button>
            )}
          </div>
        </div>

        <div className="bg-[#1e293b]/30 border border-white/5 rounded-3xl p-6 h-fit space-y-6">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0 shadow-lg">
              {course?.creator?.profilePicture ? (
                <img
                  src={course.creator.profilePicture}
                  alt={course.creator.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <span className="font-black text-lg">
                  {course?.creator?.name?.substring(0, 2).toUpperCase() || "AS"}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                Instructor
              </p>
              <p className="font-bold text-white truncate">
                {course?.creator?.name || "Alex Sterling"}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed font-medium">
            {course?.creator?.bio ||
              "Expert educator with 10+ years of industry experience. Get direct help in the Q&A tab."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutTab;
