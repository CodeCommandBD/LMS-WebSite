import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { submitQuizAttemptService } from "@/services/quizApi";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Trophy,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";

const QuizPlayer = ({ quiz, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState(null);

  const submitMutation = useMutation({
    mutationFn: (data) => submitQuizAttemptService(quiz._id, data),
    onSuccess: (data) => {
      setResult(data.attempt);
      setIsFinished(true);
      if (data.attempt.isPassed) {
        toast.success("Awesome! You passed the section quiz.");
      } else {
        toast.error("You didn't pass this time. Please review and try again.");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit quiz");
    },
  });

  const handleOptionSelect = (optionIndex) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(
      (a) => a.questionId === quiz.questions[currentQuestionIndex]._id,
    );

    if (existingIndex !== -1) {
      newAnswers[existingIndex].chosenOptionIndex = optionIndex;
    } else {
      newAnswers.push({
        questionId: quiz.questions[currentQuestionIndex]._id,
        chosenOptionIndex: optionIndex,
      });
    }
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (answers.length < quiz.questions.length) {
      return toast.error("Please answer all questions before submitting");
    }
    submitMutation.mutate(answers);
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedOption = answers.find(
    (a) => a.questionId === currentQuestion._id,
  )?.chosenOptionIndex;

  if (isFinished && result) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 p-12 text-center animate-in zoom-in duration-500 bg-[#0f172a] rounded-[2.5rem]">
        <div
          className={`p-6 rounded-full ${result.isPassed ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}
        >
          {result.isPassed ? (
            <Trophy className="w-20 h-20" />
          ) : (
            <AlertCircle className="w-20 h-20" />
          )}
        </div>

        <div>
          <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">
            {result.isPassed ? "Section Mastered!" : "Almost There!"}
          </h2>
          <p className="text-gray-400 font-bold max-w-sm">
            {result.isPassed
              ? "You've successfully completed the quiz and unlocked the next section."
              : "You need at least 60% to pass and unlock the next section."}
          </p>
        </div>

        <div className="bg-[#1e293b] px-10 py-6 rounded-3xl border border-white/5 space-y-1">
          <span className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em]">
            Your Final Score
          </span>
          <div
            className={`text-6xl font-black ${result.isPassed ? "text-green-500" : "text-red-500"}`}
          >
            {Math.round(result.score)}%
          </div>
        </div>

        <div className="flex gap-4 w-full max-w-sm">
          {!result.isPassed && (
            <Button
              variant="outline"
              onClick={() => {
                setIsFinished(false);
                setCurrentQuestionIndex(0);
                setAnswers([]);
              }}
              className="flex-1 h-14 rounded-2xl border-white/10 text-white font-black hover:bg-white/5"
            >
              Try Again
            </Button>
          )}
          <Button
            onClick={() => onComplete(result.isPassed)}
            className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-900/40"
          >
            {result.isPassed ? "Continue Course" : "Close Quiz"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600/20 p-2 rounded-xl border border-blue-600/30">
            <GraduationCap className="text-blue-500 w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest">
              {quiz.title}
            </h3>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter">
              Step {currentQuestionIndex + 1} of {quiz.questions.length}
            </p>
          </div>
        </div>
        <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{
              width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <Card className="bg-[#1e293b] border-gray-800 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-10 space-y-10">
          <div className="space-y-4">
            <Badge className="bg-blue-600/10 text-blue-500 border-0 text-[10px] font-black uppercase tracking-[0.2em] h-7 px-4">
              CHALLENGE {currentQuestionIndex + 1}
            </Badge>
            <h2 className="text-2xl font-black text-white leading-tight tracking-tight">
              {currentQuestion.questionText}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`group flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all border-2 ${
                  selectedOption === index
                    ? "bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                    : "bg-[#0f172a] border-transparent hover:border-gray-800/80 hover:bg-gray-800/10"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black transition-all ${
                    selectedOption === index
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 group-hover:bg-gray-700"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span
                  className={`font-bold transition-colors ${
                    selectedOption === index
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-300"
                  }`}
                >
                  {option}
                </span>
                {selectedOption === index && (
                  <CheckCircle2 className="w-5 h-5 text-blue-500 ml-auto" />
                )}
              </div>
            ))}
          </div>

          <div className="pt-6 flex gap-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              className="px-8 h-12 rounded-xl text-gray-500 font-bold hover:text-white hover:bg-white/5 transition-all disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                selectedOption === undefined || submitMutation.isPending
              }
              className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-900/30 transition-all active:scale-[0.98]"
            >
              {currentQuestionIndex === quiz.questions.length - 1
                ? submitMutation.isPending
                  ? "Submitting..."
                  : "Verify Identity & Submit"
                : "Confirm Answer"}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPlayer;
