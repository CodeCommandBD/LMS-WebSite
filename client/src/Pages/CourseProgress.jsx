import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getCourseById,
  getUserCourseProgressService,
  updateLectureProgressService,
} from "@/services/courseApi";
import {
  Loader2,
  PlayCircle,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Lock,
  Globe,
  Clock,
  Layout,
  MessageSquare,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getCourseQuizzesWithStatusService } from "@/services/quizApi";
import QuizPlayer from "@/components/QuizPlayer";

const CourseProgress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentLecture, setCurrentLecture] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);

  const {
    data: courseData,
    isLoading: isCourseLoading,
    isError: isCourseError,
  } = useQuery({
    queryKey: ["courseDetails", id],
    queryFn: () => getCourseById(id),
  });

  const { data: progressData, isLoading: isProgressLoading } = useQuery({
    queryKey: ["courseProgress", id],
    queryFn: () => getUserCourseProgressService(id),
  });

  const { data: quizzesData } = useQuery({
    queryKey: ["courseQuizzes", id],
    queryFn: () => getCourseQuizzesWithStatusService(id),
  });

  const queryClient = useQueryClient();

  const updateProgressMutation = useMutation({
    mutationFn: (lectureId) => updateLectureProgressService(id, lectureId),
    onSuccess: (data) => {
      queryClient.setQueryData(["courseProgress", id], data);
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update progress");
    },
  });

  const course = courseData?.course;
  const lectures = course?.lectures || [];

  const groupedLectures = lectures.reduce((acc, lecture) => {
    const section = lecture.sectionName || "Course Content";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(lecture);
    return acc;
  }, {});

  const quizzes = quizzesData?.quizzes || [];
  const groupedQuizzes = quizzes.reduce((acc, quiz) => {
    const section = quiz.sectionName || "Course Content";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(quiz);
    return acc;
  }, {});

  useEffect(() => {
    if (Object.keys(groupedLectures).length > 0) {
      const initialOpen = {};
      Object.keys(groupedLectures).forEach((section) => {
        initialOpen[section] = true;
      });
      setOpenSections(initialOpen);
    }
  }, [course]);

  const toggleSection = (sectionName) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const completedLectures = progressData?.progress?.completedLectures || [];

  // Gating Logic
  const getSectionStatus = (sectionName) => {
    const sectionIndex = Object.keys(groupedLectures).indexOf(sectionName);
    if (sectionIndex === 0) return "unlocked";

    const prevSectionName = Object.keys(groupedLectures)[sectionIndex - 1];
    const prevSectionLectures = groupedLectures[prevSectionName];

    // 1. All previous lectures must be completed
    const allPrevLecturesDone = prevSectionLectures.every((l) =>
      completedLectures.includes(l._id),
    );

    // 2. Previous section quiz must be passed (if it exists)
    const prevQuiz = quizzesData?.quizzes?.find(
      (q) => q.sectionName === prevSectionName,
    );

    if (!allPrevLecturesDone) return "locked";

    // If a quiz exists for the previous section, it must be passed
    if (prevQuiz && !prevQuiz.latestAttempt?.isPassed) {
      return "locked";
    }

    return "unlocked";
  };

  const handleNextMilestone = () => {
    const currentSectionName = currentLecture?.sectionName || "Course Content";

    if (!quizzesData?.quizzes) {
      return toast.error("Quiz data is still loading. Please wait a moment.");
    }

    const sectionQuizzes = quizzesData.quizzes.filter(
      (q) =>
        q.sectionName?.trim().toLowerCase() ===
        currentSectionName.trim().toLowerCase(),
    );

    if (sectionQuizzes.length > 0) {
      // Find the first unpassed quiz in this section
      const nextQuiz = sectionQuizzes.find((q) => !q.latestAttempt?.isPassed);
      if (nextQuiz) {
        setActiveQuiz(nextQuiz);
        setShowQuiz(true);
      } else {
        toast.success(
          `You have passed all quizzes for "${currentSectionName}"!`,
        );
      }
    } else {
      toast(
        `No quiz found for "${currentSectionName}". Complete all lectures in this section to proceed.`,
        {
          icon: "ℹ️",
        },
      );
    }
  };

  const handleQuizComplete = (isPassed) => {
    setShowQuiz(false);
    if (isPassed) {
      queryClient.invalidateQueries(["courseQuizzes", id]);
      toast.success("Section Unlocked!");
    }
  };

  // Initialize first lecture as current if none selected
  useEffect(() => {
    if (lectures.length > 0 && !currentLecture) {
      setCurrentLecture(lectures[0]);
    }
  }, [lectures, currentLecture]);

  const handleNextLecture = () => {
    // Optional: Mark current as complete when clicking 'Next' if not already done
    if (!completedLectures.includes(currentLecture?._id)) {
      handleToggleComplete(currentLecture?._id);
    }

    const currentIndex = lectures.findIndex(
      (l) => l._id === currentLecture?._id,
    );
    if (currentIndex < lectures.length - 1) {
      setCurrentLecture(lectures[currentIndex + 1]);
      // Scroll to top of video area
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleToggleComplete = (lectureId) => {
    updateProgressMutation.mutate(lectureId || currentLecture?._id);
  };

  const isLoading = isCourseLoading || isProgressLoading;
  const isError = isCourseError;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-400 font-medium animate-pulse">
          Initializing your classroom...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] p-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Failed to load course progress
        </h2>
        <Button onClick={() => navigate("/")} className="bg-blue-600">
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-white">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="h-16 border-b border-white/5 bg-[#1e293b]/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/courseDetails/${id}`)}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-sm font-black tracking-tight leading-none mb-1 line-clamp-1">
              {course?.courseTitle}
            </h1>
            <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
              <span>
                {lectures.indexOf(currentLecture) + 1} of {lectures.length}{" "}
                Lectures
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-green-400 text-[9px] bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20">
                Active Session
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Your Progress
            </span>
            <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{
                  width: `${((lectures.indexOf(currentLecture) + 1) / lectures.length) * 100}%`,
                }}
              />
            </div>
          </div>
          <Button
            onClick={handleNextLecture}
            disabled={lectures.indexOf(currentLecture) === lectures.length - 1}
            className="bg-blue-600 hover:bg-blue-700 text-xs font-black h-10 px-6 rounded-xl shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete & Next
          </Button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden flex-col lg:row lg:flex-row">
        {/* 2. VIDEO & CONTENT AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#020617]">
          {/* Video Section */}
          <div className="relative aspect-video w-full bg-black shadow-2xl">
            {currentLecture?.videoUrl ? (
              currentLecture.videoUrl.includes("youtube.com") ||
              currentLecture.videoUrl.includes("youtu.be") ? (
                <iframe
                  src={
                    currentLecture.videoUrl.includes("watch?v=")
                      ? currentLecture.videoUrl.replace("watch?v=", "embed/")
                      : currentLecture.videoUrl.includes("youtu.be/")
                        ? currentLecture.videoUrl.replace(
                            "youtu.be/",
                            "youtube.com/embed/",
                          )
                        : currentLecture.videoUrl
                  }
                  className="w-full h-full"
                  allowFullScreen
                  title={currentLecture.lectureTitle}
                />
              ) : (
                <video
                  src={currentLecture.videoUrl}
                  controls
                  className="w-full h-full"
                  controlsList="nodownload"
                  key={currentLecture.videoUrl} // Force re-render on video change
                />
              )
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-br from-slate-900 to-black">
                <div className="p-8 rounded-full bg-white/5 border border-white/10 mb-6 group cursor-pointer hover:bg-white/10 transition-colors">
                  <PlayCircle className="h-16 w-12 text-blue-600 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-black text-white/50 uppercase tracking-widest">
                  No video source available
                </h3>
                <p className="text-gray-500 text-sm mt-2 font-bold italic opacity-60">
                  This lecture might be text-only or still processing.
                </p>
              </div>
            )}

            {/* Video Overlay Info */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <Badge className="bg-black/60 backdrop-blur-md border-white/20 text-[10px] font-bold px-3 py-1.5 rounded-lg">
                1080p • Auto
              </Badge>
            </div>
          </div>

          {/* Content Info */}
          <div className="max-w-4xl mx-auto p-8 lg:p-12 space-y-10">
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
                  Lecture Synopsis
                </h3>
                <p className="text-gray-400 leading-relaxed font-medium">
                  {course?.description
                    ?.replace(/<[^>]*>?/gm, "")
                    .substring(0, 400)}
                  ...
                </p>
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    className="border-white/10 hover:bg-white/5 hover:text-white text-black text-xs font-black px-6 h-12 rounded-xl"
                  >
                    <MessageSquare className="h-4 w-4 mr-2 text-blue-400" /> Q&A
                    Session
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/10 hover:bg-white/5 hover:text-white text-black text-xs font-black px-6 h-12 rounded-xl"
                  >
                    Download Notes
                  </Button>
                </div>
              </div>

              <div className="bg-[#1e293b]/30 border border-white/5 rounded-3xl p-6 h-fit space-y-6">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0 shadow-lg">
                    <span className="font-black text-lg">AS</span>
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
                  Expert educator with 10+ years of industry experience. Get
                  direct help in the Q&A tab.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. LECTURE SIDEBAR */}
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
                ([sectionName, sectionLectures], sIndex) => (
                  <div key={sectionName} className="space-y-2">
                    <div
                      onClick={() => toggleSection(sectionName)}
                      className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-white/5 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <ChevronRight
                          className={`h-4 w-4 text-blue-500 transition-transform duration-300 ${openSections[sectionName] ? "rotate-90" : ""}`}
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
      </main>

      {/* QUIZ PLAYER OVERLAY */}
      {showQuiz && activeQuiz && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-[#0f172a]/95 backdrop-blur-xl animate-in fade-in duration-300">
          <QuizPlayer quiz={activeQuiz} onComplete={handleQuizComplete} />
        </div>
      )}

      {/* Global CSS for scrollbar */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `,
        }}
      />
    </div>
  );
};

export default CourseProgress;
