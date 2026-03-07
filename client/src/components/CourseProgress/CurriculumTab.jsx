import React from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Lock, CheckCircle2, PlayCircle } from "lucide-react";

const CurriculumTab = ({
  lectures,
  quizzes,
  groupedLectures,
  openSections,
  toggleSection,
  completedLectures,
  currentLecture,
  setCurrentLecture,
  getSectionStatus,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-white">Course Curriculum</h2>
        <Badge className="bg-white/5 text-gray-400 border-white/10 font-bold">
          {lectures.length} Lectures • {quizzes.length} Quizzes
        </Badge>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedLectures).map(
          ([sectionName, sectionLectures]) => (
            <div
              key={sectionName}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
            >
              <div
                onClick={() => toggleSection(sectionName)}
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                      openSections[sectionName] ? "" : "-rotate-90"
                    }`}
                  />
                  <h3 className="font-bold text-white">{sectionName}</h3>
                </div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  {sectionLectures.length} Lessons
                </span>
              </div>

              {openSections[sectionName] && (
                <div className="border-t border-white/5 p-2 space-y-1">
                  {sectionLectures.map((lecture, idx) => {
                    const isCompleted = completedLectures.includes(lecture._id);
                    const isActive = currentLecture?._id === lecture._id;
                    const sectionStatus = getSectionStatus(sectionName);
                    const isLocked =
                      sectionStatus === "locked" && !isCompleted && !isActive;

                    return (
                      <div
                        key={lecture._id}
                        onClick={() => !isLocked && setCurrentLecture(lecture)}
                        className={`flex items-center justify-between p-4 rounded-xl transition-all group ${
                          isActive
                            ? "bg-blue-600/20 border border-blue-500/20"
                            : isLocked
                              ? "opacity-40 cursor-not-allowed"
                              : "hover:bg-white/5 cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {isLocked ? (
                            <Lock className="h-4 w-4 text-gray-500" />
                          ) : isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <PlayCircle
                              className={`h-5 w-5 ${
                                isActive
                                  ? "text-blue-500"
                                  : "text-gray-400 group-hover:text-white"
                              }`}
                            />
                          )}
                          <span
                            className={`text-sm font-bold ${
                              isActive
                                ? "text-white"
                                : "text-gray-400 group-hover:text-gray-200"
                            }`}
                          >
                            {idx + 1}. {lecture.lectureTitle}
                          </span>
                        </div>
                        {isCompleted && (
                          <Badge className="bg-green-500/10 text-green-500 border-none text-[9px] font-black uppercase tracking-tighter">
                            Done
                          </Badge>
                        )}
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
  );
};

export default CurriculumTab;
