import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourseById } from "@/services/courseApi";
import {
  createQuizService,
  getCourseQuizzesService,
  editQuizService,
  deleteQuizService,
} from "@/services/quizApi";
import {
  Plus,
  Trash,
  Save,
  ChevronLeft,
  GraduationCap,
  PlusCircle,
  HelpCircle,
  FileQuestion,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import toast from "react-hot-toast";

const EMPTY_QUESTION = () => ({
  questionText: "",
  options: ["", "", "", ""],
  correctOptionIndex: 0,
});

const AdminQuizManager = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // "new" | quiz._id
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [selectedSection, setSelectedSection] = useState("");
  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    quizId: null,
  });

  const { data: courseData } = useQuery({
    queryKey: ["courseDetails", courseId],
    queryFn: () => getCourseById(courseId),
  });

  const { data: quizzesData } = useQuery({
    queryKey: ["courseQuizzes", courseId],
    queryFn: () => getCourseQuizzesService(courseId),
  });

  const allQuizzes = quizzesData?.quizzes || [];
  const course = courseData?.course;
  const sections = Array.from(
    new Set(
      course?.lectures?.map((l) => l.sectionName || "Course Content") || [],
    ),
  );

  // Load quiz into form when selecting an existing quiz
  useEffect(() => {
    if (!selectedQuizId || selectedQuizId === "new") {
      if (selectedQuizId === "new") {
        setQuizTitle("");
        setQuizDescription("");
        setQuestions([]);
        // don't reset selectedSection so user's pick persists
      }
      return;
    }
    const quiz = allQuizzes.find((q) => q._id === selectedQuizId);
    if (quiz) {
      setQuizTitle(quiz.title || "");
      setQuizDescription(quiz.description || "");
      setSelectedSection(quiz.sectionName || "");
      setQuestions(
        (quiz.questions || []).map((q) => ({
          questionText: q.questionText,
          options: q.options || ["", "", "", ""],
          correctOptionIndex: q.correctOptionIndex ?? 0,
        })),
      );
    }
  }, [selectedQuizId, quizzesData]);

  const handleAddQuestion = () =>
    setQuestions([...questions, EMPTY_QUESTION()]);

  const handleRemoveQuestion = (index) =>
    setQuestions(questions.filter((_, i) => i !== index));

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectOptionChange = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].correctOptionIndex = oIndex;
    setQuestions(updated);
  };

  const createQuizMutation = useMutation({
    mutationFn: createQuizService,
    onSuccess: (data) => {
      toast.success("Quiz created!");
      queryClient.invalidateQueries({ queryKey: ["courseQuizzes", courseId] });
      // Select the newly created quiz
      if (data?.quiz?._id) setSelectedQuizId(data.quiz._id);
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to create quiz"),
  });

  const editQuizMutation = useMutation({
    mutationFn: ({ quizId, data }) => editQuizService(quizId, data),
    onSuccess: () => {
      toast.success("Quiz updated!");
      queryClient.invalidateQueries({ queryKey: ["courseQuizzes", courseId] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to update quiz"),
  });

  const deleteQuizMutation = useMutation({
    mutationFn: (quizId) => deleteQuizService(quizId),
    onSuccess: () => {
      toast.success("Quiz deleted!");
      queryClient.invalidateQueries({ queryKey: ["courseQuizzes", courseId] });
      setSelectedQuizId(null);
      setDeleteConfirm({ open: false, quizId: null });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to delete quiz"),
  });

  const handleSubmit = () => {
    if (!selectedSection) return toast.error("Please select a module/section");
    if (!quizTitle.trim()) return toast.error("Please enter a quiz title");
    if (questions.length === 0)
      return toast.error("Please add at least one question");

    const payload = {
      courseId,
      sectionName: selectedSection,
      title: quizTitle,
      description: quizDescription,
      questions,
    };

    if (selectedQuizId && selectedQuizId !== "new") {
      editQuizMutation.mutate({ quizId: selectedQuizId, data: payload });
    } else {
      createQuizMutation.mutate(payload);
    }
  };

  const isEditing = selectedQuizId && selectedQuizId !== "new";
  const isSaving = createQuizMutation.isPending || editQuizMutation.isPending;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(`/admin/courses/${courseId}/lectures`)}
          className="text-gray-400 hover:text-white group cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Curriculum
        </Button>
        <div className="flex items-center gap-3">
          <div className="bg-green-600/20 p-2 rounded-xl border border-green-600/30">
            <GraduationCap className="text-green-500 w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Quiz Manager
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar: All Quizzes List */}
        <div className="space-y-4">
          {/* New Quiz Button */}
          <Button
            onClick={() => {
              setSelectedQuizId("new");
              setQuizTitle("");
              setQuizDescription("");
              setQuestions([]);
              setSelectedSection("");
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-11 font-bold transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Quiz
          </Button>

          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
            All Quizzes ({allQuizzes.length})
          </h3>

          <div className="space-y-2">
            {allQuizzes.length === 0 && (
              <div className="p-6 text-center text-gray-600 text-sm font-medium border border-dashed border-gray-800 rounded-2xl">
                No quizzes yet. <br /> Click "New Quiz" to start.
              </div>
            )}
            {allQuizzes.map((quiz) => (
              <div
                key={quiz._id}
                onClick={() => setSelectedQuizId(quiz._id)}
                className={`group p-4 rounded-2xl cursor-pointer transition-all border ${
                  selectedQuizId === quiz._id
                    ? "bg-blue-600/10 border-blue-500 text-blue-400"
                    : "bg-[#1e293b]/50 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-black text-sm truncate">{quiz.title}</p>
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1 truncate">
                      {quiz.sectionName}
                    </p>
                    <Badge className="mt-2 bg-gray-800 text-gray-400 border-0 text-[10px]">
                      {quiz.questions?.length || 0} questions
                    </Badge>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm({ open: true, quizId: quiz._id });
                    }}
                    className="shrink-0 p-1.5 text-gray-700 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedQuizId ? (
            <div className="h-64 flex flex-col items-center justify-center bg-[#1e293b]/30 rounded-3xl border-2 border-dashed border-gray-800">
              <HelpCircle className="w-12 h-12 text-gray-700 mb-4" />
              <p className="text-gray-500 font-medium tracking-tight">
                Select a quiz to edit, or create a new one
              </p>
            </div>
          ) : (
            <Card className="bg-[#1e293b] border-gray-800/50 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-gray-800/50 p-6 bg-gray-800/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-3">
                    <PlusCircle className="w-5 h-5 text-blue-500" />
                    {isEditing ? "Edit Quiz" : "Create New Quiz"}
                  </CardTitle>
                  {isEditing && (
                    <Badge className="bg-blue-600 text-white border-0">
                      Revision Mode
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Section Picker (only for new quiz) */}
                {!isEditing && (
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs font-black uppercase tracking-widest pl-1">
                      Module / Section
                    </Label>
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                      {sections.map((sec) => (
                        <button
                          key={sec}
                          onClick={() => setSelectedSection(sec)}
                          className={`w-full text-left p-3 rounded-xl border text-sm font-bold transition-all ${
                            selectedSection === sec
                              ? "bg-blue-600/10 border-blue-500 text-blue-400"
                              : "bg-[#0f172a] border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"
                          }`}
                        >
                          {sec}
                        </button>
                      ))}
                    </div>
                    {selectedSection && (
                      <p className="text-xs text-blue-400 pl-1 font-bold">
                        ✓ Selected: {selectedSection}
                      </p>
                    )}
                  </div>
                )}

                {/* Quiz Title */}
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest pl-1">
                    Quiz Title
                  </Label>
                  <Input
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder='e.g., "HTML & CSS Foundations Check"'
                    className="bg-[#0f172a] border-gray-800 rounded-xl h-12 focus:ring-blue-500/50 text-white"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest pl-1">
                    Description (Optional)
                  </Label>
                  <Textarea
                    value={quizDescription}
                    onChange={(e) => setQuizDescription(e.target.value)}
                    placeholder="Provide instructions for the quiz..."
                    className="bg-[#0f172a] border-gray-800 rounded-xl min-h-[80px] focus:ring-blue-500/50 text-white"
                  />
                </div>

                {/* Questions */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-black text-lg">
                      Questions ({questions.length})
                    </h4>
                    <Button
                      variant="outline"
                      onClick={handleAddQuestion}
                      className="border-blue-600/30 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl h-10 px-4 font-bold transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                  </div>

                  <div className="space-y-8">
                    {questions.map((q, qIndex) => (
                      <div
                        key={qIndex}
                        className="bg-[#0f172a] p-6 rounded-2xl border border-gray-800/50 space-y-6 group"
                      >
                        <div className="flex items-start justify-between">
                          <Badge className="bg-blue-600/10 text-blue-500 border-0 h-8 px-4 font-black">
                            Question {qIndex + 1}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveQuestion(qIndex)}
                            className="text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-500 text-[10px] font-black uppercase tracking-widest pl-1">
                            Question Text
                          </Label>
                          <Input
                            value={q.questionText}
                            onChange={(e) =>
                              handleQuestionChange(qIndex, e.target.value)
                            }
                            placeholder="Enter your question here..."
                            className="bg-[#1e293b] border-gray-800 rounded-xl h-12 focus:border-blue-500/50 text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {q.options.map((opt, oIndex) => (
                            <div key={oIndex} className="space-y-2">
                              <Label
                                className={`text-[10px] font-black uppercase tracking-widest pl-1 ${
                                  q.correctOptionIndex === oIndex
                                    ? "text-green-500"
                                    : "text-gray-600"
                                }`}
                              >
                                Option {oIndex + 1}
                                {q.correctOptionIndex === oIndex &&
                                  " ✓ Correct"}
                              </Label>
                              <div className="flex gap-2">
                                <Input
                                  value={opt}
                                  onChange={(e) =>
                                    handleOptionChange(
                                      qIndex,
                                      oIndex,
                                      e.target.value,
                                    )
                                  }
                                  placeholder={`Option ${oIndex + 1}`}
                                  className={`bg-[#1e293b] border-gray-800 rounded-xl h-12 text-white ${
                                    q.correctOptionIndex === oIndex
                                      ? "border-green-500/50 ring-1 ring-green-500/20"
                                      : ""
                                  }`}
                                />
                                <Button
                                  onClick={() =>
                                    handleCorrectOptionChange(qIndex, oIndex)
                                  }
                                  variant={
                                    q.correctOptionIndex === oIndex
                                      ? "default"
                                      : "outline"
                                  }
                                  title="Mark as correct answer"
                                  className={`shrink-0 rounded-xl w-12 h-12 p-0 cursor-pointer ${
                                    q.correctOptionIndex === oIndex
                                      ? "bg-green-600 hover:bg-green-700"
                                      : "border-gray-800"
                                  }`}
                                >
                                  <Save className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {questions.length === 0 && (
                      <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-2xl">
                        <FileQuestion className="w-10 h-10 text-gray-700 mb-3" />
                        <p className="text-gray-600 text-sm font-medium">
                          No questions yet. Click "Add Question" above.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-6 border-t border-gray-800">
                  <Button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 font-black text-lg shadow-xl shadow-blue-900/40 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    {isSaving
                      ? "Saving..."
                      : isEditing
                        ? "Update Quiz"
                        : "Save Quiz"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, quizId: null })}
        onConfirm={() => deleteQuizMutation.mutate(deleteConfirm.quizId)}
        title="Delete Quiz?"
        description="This quiz and all its questions will be permanently deleted."
        isLoading={deleteQuizMutation.isPending}
      />
    </div>
  );
};

export default AdminQuizManager;
