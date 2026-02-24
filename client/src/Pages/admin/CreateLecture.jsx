import {
  PlusCircle,
  Loader2,
  ArrowLeft,
  MoreVertical,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lectureSchema } from "@/schemas/lectureSchema";
import {
  createLectureService,
  getCourseById,
  renameSectionService,
  deleteSectionService,
  deleteLectureService,
} from "@/services/courseApi";
import { getCourseQuizzesService, deleteQuizService } from "@/services/quizApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ModuleCard from "@/components/admin/ModuleCard";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import toast from "react-hot-toast";

const CreateLecture = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [isAddLectureModalOpen, setIsAddLectureModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [newSectionName, setNewSectionName] = useState("");
  const [modalStep, setModalStep] = useState(1);
  const [pendingModuleName, setPendingModuleName] = useState("");
  // Confirm dialog state
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: null,
  });

  const openConfirm = ({ title, description, onConfirm }) =>
    setConfirmState({ open: true, title, description, onConfirm });
  const closeConfirm = () =>
    setConfirmState((s) => ({ ...s, open: false, onConfirm: null }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(lectureSchema),
    defaultValues: {
      lectureTitle: "",
      sectionName: "",
    },
  });

  const { data: courseData, isLoading: isCourseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
  });

  const { data: quizzesData, isLoading: isQuizzesLoading } = useQuery({
    queryKey: ["courseQuizzes", courseId],
    queryFn: () => getCourseQuizzesService(courseId),
    enabled: !!courseId,
  });

  const createLectureMutation = useMutation({
    mutationFn: (data) =>
      createLectureService(courseId, data.lectureTitle, data.sectionName),
    onSuccess: (data, variables) => {
      toast.success("Content added successfully");
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      setIsAddLectureModalOpen(false);
      setIsAddModuleModalOpen(false);
      reset({
        lectureTitle: "",
        sectionName: variables.sectionName,
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add content");
    },
  });

  const renameSectionMutation = useMutation({
    mutationFn: ({ oldSectionName, newName }) =>
      renameSectionService(courseId, oldSectionName, newName),
    onSuccess: () => {
      toast.success("Module renamed successfully");
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.invalidateQueries({ queryKey: ["courseQuizzes", courseId] });
      setIsRenameModalOpen(false);
    },
    onError: (error) => toast.error(error.message || "Failed to rename module"),
  });

  const deleteSectionMutation = useMutation({
    mutationFn: (sectionName) => deleteSectionService(courseId, sectionName),
    onSuccess: () => {
      toast.success("Module deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.invalidateQueries({ queryKey: ["courseQuizzes", courseId] });
    },
    onError: (error) => toast.error(error.message || "Failed to delete module"),
  });

  const deleteLectureMutation = useMutation({
    mutationFn: (lectureId) => deleteLectureService(courseId, lectureId),
    onSuccess: () => {
      toast.success("Lecture deleted");
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },
    onError: (error) =>
      toast.error(error.message || "Failed to delete lecture"),
  });

  const deleteQuizMutation = useMutation({
    mutationFn: (quizId) => deleteQuizService(quizId),
    onSuccess: () => {
      toast.success("Quiz deleted");
      queryClient.invalidateQueries({ queryKey: ["courseQuizzes", courseId] });
    },
    onError: (error) => toast.error(error.message || "Failed to delete quiz"),
  });

  const onSubmit = (data) => {
    createLectureMutation.mutate({
      ...data,
      sectionName: data.sectionName || selectedSection,
    });
  };

  const handleRename = () => {
    if (!newSectionName) return toast.error("Please enter a new name");
    renameSectionMutation.mutate({
      oldSectionName: selectedSection,
      newName: newSectionName,
    });
  };

  const handleDeleteSection = (sectionName) => {
    openConfirm({
      title: "Delete Module?",
      description: `"${sectionName}" and all its lectures & quizzes will be permanently deleted.`,
      onConfirm: () => {
        deleteSectionMutation.mutate(sectionName);
        closeConfirm();
      },
    });
  };

  const handleDeleteLecture = (lectureId) => {
    openConfirm({
      title: "Delete Lecture?",
      description: "This lecture will be permanently removed from the module.",
      onConfirm: () => {
        deleteLectureMutation.mutate(lectureId);
        closeConfirm();
      },
    });
  };

  const handleDeleteQuiz = (quizId) => {
    openConfirm({
      title: "Delete Quiz?",
      description:
        "This quiz and all its questions will be permanently deleted.",
      onConfirm: () => {
        deleteQuizMutation.mutate(quizId);
        closeConfirm();
      },
    });
  };

  const lectures = courseData?.course?.lectures || [];
  const quizzes = quizzesData?.quizzes || [];

  // Group everything by sectionName
  const groupedContent = [
    ...lectures,
    ...quizzes.map((q) => ({ ...q, isQuiz: true })),
  ].reduce((acc, item) => {
    const section = item.sectionName || "Course Content";
    if (!acc[section]) {
      acc[section] = { lectures: [], quizzes: [] };
    }
    if (item.isQuiz) {
      acc[section].quizzes.push(item);
    } else {
      acc[section].lectures.push(item);
    }
    return acc;
  }, {});

  if (isCourseLoading || isQuizzesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl pb-20">
      {/* 1. Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/admin/courses/${courseId}`}>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-2xl bg-[#1e293b] hover:bg-gray-800 text-gray-400 hover:text-white transition-all shadow-xl flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Curriculum Builder
            </h1>
            <p className="text-gray-400 font-medium text-sm mt-1">
              Manage modules and content for{" "}
              <span className="text-blue-500 font-black">
                {courseData?.course?.courseTitle}
              </span>
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsAddModuleModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-2xl font-black text-sm shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Create New Module
        </Button>
      </div>

      {/* 2. Modules List */}
      <div className="space-y-6">
        {Object.keys(groupedContent).length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center bg-[#1e293b]/30 rounded-[3rem] border-4 border-dashed border-gray-800/50">
            <div className="bg-gray-800/50 p-6 rounded-full mb-6">
              <PlusCircle className="w-12 h-12 text-gray-700 opacity-30" />
            </div>
            <h2 className="text-xl font-black text-gray-500 tracking-tight">
              Your curriculum is empty
            </h2>
            <p className="text-gray-600 text-sm mt-2 font-medium">
              Click "Create New Module" to get started.
            </p>
          </div>
        ) : (
          Object.entries(groupedContent).map(([sectionName, content]) => (
            <ModuleCard
              key={sectionName}
              sectionName={sectionName}
              lectures={content.lectures}
              quizzes={content.quizzes}
              courseId={courseId}
              onAddVideo={() => {
                setSelectedSection(sectionName);
                setIsAddLectureModalOpen(true);
              }}
              onAddQuiz={() => navigate(`/admin/courses/${courseId}/quizzes`)}
              onDeleteModule={() => handleDeleteSection(sectionName)}
              onRenameModule={() => {
                setSelectedSection(sectionName);
                setNewSectionName(sectionName);
                setIsRenameModalOpen(true);
              }}
              onDeleteLecture={handleDeleteLecture}
              onDeleteQuiz={handleDeleteQuiz}
            />
          ))
        )}
      </div>

      {/* 3. Global Add Module Button at Bottom */}
      {Object.keys(groupedContent).length > 0 && (
        <button
          onClick={() => setIsAddModuleModalOpen(true)}
          className="w-full py-10 rounded-[3rem] border-4 border-dashed border-gray-800/50 hover:border-blue-500/30 hover:bg-blue-600/5 group transition-all flex flex-col items-center justify-center gap-4 cursor-pointer"
        >
          <div className="p-4 bg-gray-800 group-hover:bg-blue-600 rounded-full transition-all">
            <PlusCircle className="w-8 h-8 text-gray-500 group-hover:text-white" />
          </div>
          <span className="text-gray-600 group-hover:text-blue-400 font-black text-xl tracking-tight uppercase">
            Create New Module
          </span>
        </button>
      )}

      <div className="flex items-center justify-between pt-10 border-t border-gray-800/50">
        <Button
          variant="ghost"
          className="text-gray-500 hover:text-white font-bold"
          onClick={() => navigate(`/admin/courses/${courseId}`)}
        >
          Back to Course Info
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 rounded-2xl font-black shadow-lg shadow-blue-600/20 flex items-center gap-2">
          Continue to Preview <ArrowLeft className="rotate-180 w-5 h-5" />
        </Button>
      </div>

      {/* --- MODALS --- */}

      {/* Create Module Modal - Two Step */}
      <Dialog
        open={isAddModuleModalOpen}
        onOpenChange={(open) => {
          setIsAddModuleModalOpen(open);
          if (!open) {
            setModalStep(1);
            setPendingModuleName("");
            reset();
          }
        }}
      >
        <DialogContent className="bg-[#1e293b] border-gray-800 text-white rounded-4xl p-10 max-w-md border-none shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              {modalStep === 2 && (
                <button
                  onClick={() => setModalStep(1)}
                  className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <DialogTitle className="text-2xl font-black tracking-tight">
                {modalStep === 1
                  ? "Create New Module"
                  : `Add to "${pendingModuleName}"`}
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-400 font-medium">
              {modalStep === 1
                ? "Give your module a clear, descriptive name."
                : "What type of content would you like to add first?"}
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Module Name */}
          {modalStep === 1 && (
            <div className="space-y-6 pt-4">
              <div className="space-y-3">
                <Label className="text-gray-400 font-bold ml-1 uppercase text-[10px] tracking-widest">
                  Module Name
                </Label>
                <Input
                  value={pendingModuleName}
                  onChange={(e) => setPendingModuleName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && pendingModuleName.trim()) {
                      e.preventDefault();
                      setModalStep(2);
                    }
                  }}
                  placeholder="e.g. Module 1: Introduction to React"
                  className="bg-[#0f172a] border-none h-14 rounded-xl px-6 font-bold focus:ring-2 focus:ring-blue-500 text-white placeholder:text-gray-600"
                  autoFocus
                />
              </div>
              <Button
                onClick={() => {
                  if (pendingModuleName.trim()) setModalStep(2);
                }}
                disabled={!pendingModuleName.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-xl font-black shadow-xl shadow-blue-900/40 cursor-pointer disabled:opacity-50"
              >
                Continue →
              </Button>
            </div>
          )}

          {/* Step 2: Content Type Picker */}
          {modalStep === 2 && (
            <div className="space-y-4 pt-4">
              {/* Video Option */}
              <button
                onClick={() => {
                  setSelectedSection(pendingModuleName);
                  reset({ lectureTitle: "", sectionName: pendingModuleName });
                  setIsAddModuleModalOpen(false);
                  setIsAddLectureModalOpen(true);
                  setModalStep(1);
                }}
                className="w-full flex items-center gap-5 p-5 bg-[#0f172a] hover:bg-blue-600/10 border border-gray-800 hover:border-blue-500/30 rounded-2xl transition-all group cursor-pointer text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-all">
                  <PlusCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="font-black text-white text-sm">Video Lecture</p>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    Upload or link a video lesson
                  </p>
                </div>
              </button>

              {/* Quiz Option */}
              <button
                onClick={() => {
                  setIsAddModuleModalOpen(false);
                  setModalStep(1);
                  // First create the module with a placeholder so it exists, then navigate to quiz
                  createLectureMutation.mutate(
                    {
                      lectureTitle: `${pendingModuleName} – Intro`,
                      sectionName: pendingModuleName,
                    },
                    {
                      onSuccess: () => {
                        navigate(`/admin/courses/${courseId}/quizzes`);
                      },
                    },
                  );
                }}
                className="w-full flex items-center gap-5 p-5 bg-[#0f172a] hover:bg-amber-600/10 border border-gray-800 hover:border-amber-500/30 rounded-2xl transition-all group cursor-pointer text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-all">
                  <PlusCircle className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="font-black text-white text-sm">
                    Quiz / Assessment
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    Create a quiz with multiple question types
                  </p>
                </div>
              </button>

              {/* Empty Module Option */}
              <button
                onClick={() => {
                  // Simply register the module name via a hidden lecture that gets deleted, or just close
                  // We'll create the module silently without a lecture by setting a placeholder
                  setSelectedSection(pendingModuleName);
                  setIsAddModuleModalOpen(false);
                  setModalStep(1);
                  toast(
                    `Module "${pendingModuleName}" is ready. Add content from its card.`,
                    { icon: "✅" },
                  );
                }}
                className="w-full flex items-center gap-5 p-5 bg-[#0f172a] hover:bg-gray-700/20 border border-dashed border-gray-800 hover:border-gray-600 rounded-2xl transition-all group cursor-pointer text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-800/50 flex items-center justify-center shrink-0 transition-all">
                  <PlusCircle className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-black text-gray-400 text-sm">
                    Create Empty Module
                  </p>
                  <p className="text-[11px] text-gray-600 font-medium mt-0.5">
                    Add content later from the module card
                  </p>
                </div>
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Lecture Modal */}
      <Dialog
        open={isAddLectureModalOpen}
        onOpenChange={setIsAddLectureModalOpen}
      >
        <DialogContent className="bg-[#1e293b] border-gray-800 text-white rounded-4xl p-10 max-w-md border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">
              Add Content to {selectedSection}
            </DialogTitle>
            <DialogDescription className="text-gray-400 font-medium pt-2">
              Enter the title for your new video lecture.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <div className="space-y-3">
              <Label className="text-gray-400 font-bold ml-1 uppercase text-[10px] tracking-widest">
                Lecture Title
              </Label>
              <Input
                {...register("lectureTitle", { required: true })}
                placeholder="e.g. Advanced State Management"
                className="bg-[#0f172a] border-none h-14 rounded-xl px-6 font-bold focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              type="submit"
              disabled={createLectureMutation.isPending}
              className="w-full bg-blue-600 h-14 rounded-xl font-black shadow-xl shadow-blue-900/40 cursor-pointer"
            >
              {createLectureMutation.isPending
                ? "Adding..."
                : "Add Video Lecture"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Rename Module Modal */}
      <Dialog open={isRenameModalOpen} onOpenChange={setIsRenameModalOpen}>
        <DialogContent className="bg-[#1e293b] border-gray-800 text-white rounded-4xl p-10 max-w-md border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">
              Rename Module
            </DialogTitle>
            <DialogDescription className="text-gray-400 font-medium pt-2">
              Enter the new name for{" "}
              <span className="text-white">"{selectedSection}"</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-3">
              <Label className="text-gray-400 font-bold ml-1 uppercase text-[10px] tracking-widest">
                New Module Name
              </Label>
              <Input
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="e.g. Module 1: Getting Started"
                className="bg-[#0f172a] border-none h-14 rounded-xl px-6 font-bold focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              onClick={handleRename}
              disabled={renameSectionMutation.isPending}
              className="w-full bg-blue-600 h-14 rounded-xl font-black shadow-xl shadow-blue-900/40 cursor-pointer"
            >
              {renameSectionMutation.isPending ? "Renaming..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Global Confirm Dialog */}
      <ConfirmDialog
        open={confirmState.open}
        onClose={closeConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        description={confirmState.description}
        isLoading={
          deleteSectionMutation.isPending ||
          deleteLectureMutation.isPending ||
          deleteQuizMutation.isPending
        }
      />
    </div>
  );
};

export default CreateLecture;
