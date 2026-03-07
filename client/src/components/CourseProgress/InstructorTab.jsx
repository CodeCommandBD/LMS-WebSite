import React from "react";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

const InstructorTab = ({ course, averageRating }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 flex flex-col items-center text-center space-y-6 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-blue-600/20 to-transparent" />

        <div className="relative">
          <div className="w-32 h-32 rounded-[32px] overflow-hidden border-4 border-[#0f172a] shadow-2xl bg-slate-800">
            {course?.creator?.profilePicture ? (
              <img
                src={course.creator.profilePicture}
                alt={course.creator.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-black text-gray-700">
                {course?.creator?.name?.substring(0, 2).toUpperCase() || "AS"}
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2.5 rounded-2xl shadow-xl">
            <Award className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="space-y-2 relative">
          <h2 className="text-3xl font-black text-white tracking-tight">
            {course?.creator?.name || "Alex Sterling"}
          </h2>
          <p className="text-blue-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            {course?.creator?.bio || "Lead Course Instructor"}
          </p>
        </div>

        <div className="flex gap-8 py-4">
          <div className="text-center">
            <div className="text-xl font-black text-white">{averageRating}</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Rating
            </div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <div className="text-xl font-black text-white">
              {course?.enrolledStudents?.length || 0}
            </div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Students
            </div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <div className="text-xl font-black text-white">
              {course?.lectures?.length || 0}
            </div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Lessons
            </div>
          </div>
        </div>

        <p className="text-gray-400 leading-relaxed max-w-xl text-sm font-medium">
          {course?.creator?.description ||
            "Passionate educator dedicated to helping students master modern web development through real-world projects and direct mentorship."}
        </p>

        <Button className="bg-white/5 hover:bg-white/10 text-white border-white/10 rounded-2xl px-10 h-14 font-black transition-all">
          View Portfolio
        </Button>
      </div>
    </div>
  );
};

export default InstructorTab;
