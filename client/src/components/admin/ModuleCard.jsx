import React, { useState } from "react";
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit3,
  Plus,
  PlayCircle,
  GraduationCap,
  Link as LinkIcon,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const ModuleCard = ({
  sectionName,
  lectures = [],
  quizzes = [],
  courseId,
  onAddVideo,
  onAddQuiz,
  onDeleteModule,
  onRenameModule,
  onDeleteLecture,
  onDeleteQuiz,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-[#1e293b] border border-gray-800/50 rounded-4xl shadow-xl overflow-hidden mb-6 transition-all border-l-4 border-l-blue-600/50">
      {/* Module Header */}
      <div
        className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-800/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <GripVertical className="text-gray-600 w-5 h-5 cursor-grab active:cursor-grabbing" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white tracking-tight">
                {sectionName}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRenameModule(sectionName);
                }}
                className="p-1.5 hover:bg-gray-700/50 rounded-lg text-gray-500 hover:text-blue-400 transition-all"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">
              {lectures.length} Lectures • {quizzes.length} Quizzes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteModule(sectionName);
            }}
            className="p-2.5 hover:bg-red-500/10 rounded-xl text-gray-600 hover:text-red-500 transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <div className="p-2.5 bg-gray-900/50 rounded-xl text-gray-400">
            {isOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>
      </div>

      {/* Module Content */}
      {isOpen && (
        <div className="px-6 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="h-px bg-gray-800/50 mb-4" />

          {lectures.length === 0 && quizzes.length === 0 && (
            <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-3xl bg-gray-900/20">
              <div className="bg-gray-800/50 p-4 rounded-full mb-4">
                <GripVertical className="w-8 h-8 text-gray-600 opacity-20" />
              </div>
              <p className="text-gray-500 font-bold text-sm tracking-tight mb-6">
                This module is empty.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={onAddVideo}
                  variant="outline"
                  className="bg-blue-600/5 border-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl h-10 px-5 font-bold transition-all text-xs"
                >
                  <PlayCircle className="w-4 h-4 mr-2" /> Video
                </Button>
                <Button
                  onClick={onAddQuiz}
                  variant="outline"
                  className="bg-amber-600/5 border-amber-600/20 text-amber-500 hover:bg-amber-600 hover:text-white rounded-xl h-10 px-5 font-bold transition-all text-xs"
                >
                  <GraduationCap className="w-4 h-4 mr-2" /> Quiz
                </Button>
                <Button
                  variant="outline"
                  className="bg-purple-600/5 border-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white rounded-xl h-10 px-5 font-bold transition-all text-xs"
                >
                  <LinkIcon className="w-4 h-4 mr-2" /> Link
                </Button>
              </div>
            </div>
          )}

          {/* Lecture Items */}
          {lectures.map((lecture, idx) => (
            <div
              key={lecture._id}
              className="group flex items-center justify-between bg-[#0f172a] hover:bg-blue-600/5 p-4 rounded-2xl border border-gray-800/50 transition-all hover:border-blue-500/20"
            >
              <div className="flex items-center gap-4">
                <GripVertical className="text-gray-700 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                  <PlayCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                    {idx + 1}. {lecture.lectureTitle}
                  </h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                    Video • 10:45
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/admin/courses/${courseId}/lectures/${lecture._id}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-9 h-9 rounded-xl hover:bg-white/10 text-gray-500 hover:text-white transition-all"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteLecture(lecture._id)}
                  className="w-9 h-9 rounded-xl hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-all cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Quiz Items */}
          {quizzes.map((quiz, idx) => (
            <div
              key={quiz._id}
              className="group flex items-center justify-between bg-[#0f172a] hover:bg-amber-600/5 p-4 rounded-2xl border border-gray-800/50 transition-all hover:border-amber-500/20"
            >
              <div className="flex items-center gap-4">
                <GripVertical className="text-gray-700 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                    {quiz.title}
                  </h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                    Assessment • {quiz.questions?.length || 0} Questions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/admin/courses/${courseId}/quizzes`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-9 h-9 rounded-xl hover:bg-white/10 text-gray-500 hover:text-white transition-all"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteQuiz(quiz._id)}
                  className="w-9 h-9 rounded-xl hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-all cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Add Content Button - Picker */}
          {(lectures.length > 0 || quizzes.length > 0) && (
            <div className="pt-4">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 pl-1">
                + Add Content to Module
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={onAddVideo}
                  variant="outline"
                  className="flex-1 bg-green-600/5 border-green-600/20 text-green-400 hover:bg-green-600 hover:text-white rounded-xl h-10 px-4 font-bold transition-all text-xs cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4 mr-2" /> Video
                </Button>
                <Button
                  onClick={onAddQuiz}
                  variant="outline"
                  className="flex-1 bg-amber-600/5 border-amber-600/20 text-amber-500 hover:bg-amber-600 hover:text-white rounded-xl h-10 px-4 font-bold transition-all text-xs cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 mr-2" /> Quiz
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-purple-600/5 border-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white rounded-xl h-10 px-4 font-bold transition-all text-xs cursor-pointer"
                >
                  <LinkIcon className="w-4 h-4 mr-2" /> Link
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
