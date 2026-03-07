import React from "react";
import {
  ChevronRight,
  Lock,
  CheckCircle2,
  PlayCircle,
  Clock,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CourseSidebar = ({
  lectures,
  currentLecture,
  setCurrentLecture,
  groupedLectures,
  groupedQuizzes,
  openSections,
  toggleSection,
  completedLectures,
  getSectionStatus,
  handleToggleComplete,
  handleNextMilestone,
  setActiveQuiz,
  setShowQuiz,
}) => {
  return (
    <aside className="w-full lg:w-[400px] bg-[#0f172a] border-l border-white/5 flex flex-col h-[500px] lg:h-auto">
      <div className="p-6 border-b border-white/5 bg-[#1e293b]/20">
        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center justify-between">
          Course Content
          <span className="text-[10px] bg-white/5 px-2 py-1 rounded-md text-gray-400">
            {lectures.length} Total
          </span>
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-3 space-y-4">
          {Object.entries(groupedLectures).map(
            ([sectionName, sectionLectures]) => (
              <div key={sectionName} className="space-y-2">
                <div
                  onClick={() => toggleSection(sectionName)}
                  className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-white/5 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <ChevronRight
                      className={`h-4 w-4 text-blue-500 transition-transform duration-300 ${
                        openSections[sectionName] ? "rotate-90" : ""
                      }`}
                    />
                    <h4 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-blue-400">
                      {sectionName}
                    </h4>
                  </div>
                  <span className="text-[9px] font-bold text-gray-600 bg-white/5 px-2 py-0.5 rounded-md">
                    {sectionLectures.length}
                  </span>
                </div>

                {openSections[sectionName] && (
                  <div className="space-y-1 pl-1 animate-in fade-in slide-in-from-top-1 duration-300">
                    {sectionLectures.map((lecture) => {
                      const lectureIndex = lectures.findIndex(
                        (l) => l._id === lecture._id,
                      );
                      const isActive = currentLecture?._id === lecture._id;
                      const isCompleted = completedLectures.includes(
                        lecture._id,
                      );
                      const sectionStatus = getSectionStatus(sectionName);
                      const isLocked = sectionStatus === "locked";

                      return (
                        <div
                          key={lecture._id}
                          onClick={() =>
                            !isLocked && setCurrentLecture(lecture)
                          }
                          className={`group relative flex items-start gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${
                            isActive
                              ? "bg-blue-600/10 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.05)]"
                              : isLocked
                                ? "opacity-50 grayscale cursor-not-allowed"
                                : "hover:bg-white/5 border border-transparent"
                          }`}
                        >
                          <div
                            className="relative shrink-0 mt-0.5"
                            onClick={(e) => {
                              if (isLocked) return;
                              e.stopPropagation();
                              handleToggleComplete(lecture._id);
                            }}
                          >
                            {isLocked ? (
                              <div className="w-5 h-5 rounded-full bg-gray-800 border border-white/5 flex items-center justify-center">
                                <Lock className="h-2.5 w-2.5 text-gray-600" />
                              </div>
                            ) : isCompleted ? (
                              <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white/20 flex items-center justify-center shadow-lg shadow-green-900/40">
                                <CheckCircle2 className="h-3 w-3 text-white" />
                              </div>
                            ) : isActive ? (
                              <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white/20 flex items-center justify-center shadow-lg shadow-blue-900/40 animate-pulse">
                                <PlayCircle className="h-3 w-3 text-white" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-black text-gray-500 group-hover:border-white/30 transition-colors">
                                {lectureIndex + 1}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4
                              className={`text-[13px] font-bold leading-tight line-clamp-2 transition-colors ${
                                isActive
                                  ? "text-blue-400"
                                  : "text-gray-300 group-hover:text-white"
                              }`}
                            >
                              {lecture.lectureTitle}
                            </h4>
                            <div className="flex items-center gap-2 mt-1.5 font-bold">
                              <span className="text-[9px] text-gray-500 flex items-center gap-1 uppercase tracking-tighter">
                                <Clock className="h-2.5 w-2.5" /> 10 mins
                              </span>
                              {lecture.isPreviewFree && (
                                <span className="text-[8px] text-blue-400/80 bg-blue-400/5 px-1.5 py-0.5 rounded border border-blue-400/10 uppercase tracking-widest">
                                  Preview
                                </span>
                              )}
                            </div>
                          </div>
                          {isActive && (
                            <div className="absolute left-[-2px] top-4 bottom-4 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                          )}
                        </div>
                      );
                    })}

                    {/* Quizzes Section */}
                    {groupedQuizzes[sectionName]?.map((quiz) => {
                      const isCompleted = quiz.latestAttempt?.isPassed;
                      const sectionStatus = getSectionStatus(sectionName);
                      const isLocked = sectionStatus === "locked";

                      return (
                        <div
                          key={quiz._id}
                          onClick={() => {
                            if (!isLocked) {
                              setActiveQuiz(quiz);
                              setShowQuiz(true);
                            }
                          }}
                          className={`group relative flex items-start gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${
                            isLocked
                              ? "opacity-50 grayscale cursor-not-allowed"
                              : "hover:bg-blue-600/5 border border-transparent"
                          }`}
                        >
                          <div className="relative shrink-0 mt-0.5">
                            {isLocked ? (
                              <div className="w-5 h-5 rounded-full bg-gray-800 border border-white/5 flex items-center justify-center">
                                <Lock className="h-2.5 w-2.5 text-gray-600" />
                              </div>
                            ) : isCompleted ? (
                              <div className="w-5 h-5 rounded-full bg-indigo-500 border-2 border-white/20 flex items-center justify-center shadow-lg shadow-indigo-900/40">
                                <CheckCircle2 className="h-3 w-3 text-white" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                                <FileText className="h-3 w-3 text-indigo-400" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4
                              className={`text-[13px] font-bold leading-tight line-clamp-2 transition-colors ${
                                isCompleted
                                  ? "text-indigo-300"
                                  : "text-gray-300 group-hover:text-indigo-400"
                              }`}
                            >
                              {quiz.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1.5 font-bold">
                              <span className="text-[8px] text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-1.5 py-0.5 rounded border border-indigo-400/20">
                                Quiz
                              </span>
                              {isCompleted && (
                                <span className="text-[8px] text-green-400 uppercase tracking-widest bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20">
                                  Passed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      </div>

      <div className="p-6 bg-blue-600/5 border-t border-white/5">
        <Button
          onClick={handleNextMilestone}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black h-12 rounded-xl tracking-widest uppercase"
        >
          Next Milestone <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </aside>
  );
};

export default CourseSidebar;
