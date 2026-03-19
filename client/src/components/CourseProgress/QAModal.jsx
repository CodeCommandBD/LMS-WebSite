import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { CheckCircle2, Trash2, MessageSquare, Reply, Loader2 } from "lucide-react";
import api from "@/lib/api";

// Q&A API service functions
const qaApi = {
  getQuestions: (courseId, lectureId) =>
    api.get(`/qa/${courseId}/${lectureId}`).then((r) => r.data),
  postQuestion: (courseId, lectureId, question) =>
    api.post(`/qa/${courseId}/${lectureId}`, { question }).then((r) => r.data),
  postReply: (questionId, body) =>
    api.post(`/qa/${questionId}/reply`, { body }).then((r) => r.data),
  toggleResolved: (questionId) =>
    api.patch(`/qa/${questionId}/resolve`).then((r) => r.data),
  deleteQuestion: (questionId) =>
    api.delete(`/qa/${questionId}`).then((r) => r.data),
};

const QAModal = ({ isOpen, onOpenChange, currentLecture, courseId }) => {
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const [newQuestion, setNewQuestion] = useState("");
  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);

  const qKey = ["qa", courseId, currentLecture?._id];

  const { data, isLoading } = useQuery({
    queryKey: qKey,
    queryFn: () => qaApi.getQuestions(courseId, currentLecture._id),
    enabled: !!(isOpen && courseId && currentLecture?._id),
  });

  const postMutation = useMutation({
    mutationFn: () => qaApi.postQuestion(courseId, currentLecture._id, newQuestion),
    onSuccess: () => {
      toast.success("Question posted!");
      setNewQuestion("");
      queryClient.invalidateQueries(qKey);
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to post"),
  });

  const replyMutation = useMutation({
    mutationFn: ({ questionId, body }) => qaApi.postReply(questionId, body),
    onSuccess: (_, { questionId }) => {
      toast.success("Reply posted!");
      setReplyText((p) => ({ ...p, [questionId]: "" }));
      setReplyingTo(null);
      queryClient.invalidateQueries(qKey);
    },
    onError: (e) => toast.error(e.response?.data?.message || "Failed to reply"),
  });

  const resolveMutation = useMutation({
    mutationFn: (questionId) => qaApi.toggleResolved(questionId),
    onSuccess: () => queryClient.invalidateQueries(qKey),
  });

  const deleteMutation = useMutation({
    mutationFn: (questionId) => qaApi.deleteQuestion(questionId),
    onSuccess: () => {
      toast.success("Question deleted");
      queryClient.invalidateQueries(qKey);
    },
  });

  const questions = data?.questions || [];
  const isInstructor = ["teacher", "admin"].includes(user?.role);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px] max-h-[85vh] bg-[#0f172a] border-white/10 text-white flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-black flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-400" />
            Q&amp;A — {currentLecture?.lectureTitle}
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            {questions.length} question{questions.length !== 1 ? "s" : ""} for this lecture
          </DialogDescription>
        </DialogHeader>

        {/* Ask question input */}
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask a question about this lecture..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-white placeholder:text-gray-500 transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter" && newQuestion.trim()) postMutation.mutate();
            }}
          />
          <Button
            onClick={() => postMutation.mutate()}
            disabled={!newQuestion.trim() || postMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl shrink-0"
          >
            {postMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask"}
          </Button>
        </div>

        {/* Questions list */}
        <div className="flex-1 overflow-y-auto pr-1 mt-3 space-y-4 custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No questions yet. Be the first!</p>
            </div>
          ) : (
            questions.map((qa) => (
              <div
                key={qa._id}
                className={`rounded-xl p-4 border transition-colors ${
                  qa.isResolved ? "bg-green-950/20 border-green-500/20" : "bg-white/5 border-white/5"
                }`}
              >
                {/* Question header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={qa.userId?.profilePicture || `https://ui-avatars.com/api/?name=${qa.userId?.name}&background=1e40af&color=fff`}
                      alt={qa.userId?.name}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-semibold text-sm text-white">{qa.userId?.name}</span>
                      {qa.userId?.role !== "student" && (
                        <span className="ml-1 text-[9px] font-bold px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30 uppercase">
                          {qa.userId?.role}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {qa.isResolved && (
                      <span className="flex items-center gap-1 text-[10px] text-green-400 font-bold">
                        <CheckCircle2 className="h-3 w-3" /> Resolved
                      </span>
                    )}
                    {(qa.userId?._id === user?.id || isInstructor) && (
                      <button
                        onClick={() => resolveMutation.mutate(qa._id)}
                        className="text-gray-500 hover:text-green-400 transition-colors"
                        title={qa.isResolved ? "Mark unresolved" : "Mark resolved"}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    )}
                    {(qa.userId?._id === user?.id || user?.role === "admin") && (
                      <button
                        onClick={() => deleteMutation.mutate(qa._id)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-200 mb-3 leading-relaxed">{qa.question}</p>

                {/* Replies */}
                {qa.replies?.length > 0 && (
                  <div className="space-y-2 mb-3 border-l-2 border-white/10 pl-3">
                    {qa.replies.map((reply) => (
                      <div key={reply._id} className="text-sm">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <img
                            src={reply.userId?.profilePicture || `https://ui-avatars.com/api/?name=${reply.userId?.name}&background=1e40af&color=fff`}
                            alt={reply.userId?.name}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                          <span className="font-semibold text-blue-300 text-xs">{reply.userId?.name}</span>
                          {reply.isInstructorReply && (
                            <span className="text-[9px] font-bold px-1 py-0.5 bg-purple-500/20 text-purple-400 rounded border border-purple-500/30 uppercase">
                              Instructor
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed">{reply.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply toggle */}
                {replyingTo !== qa._id ? (
                  <button
                    onClick={() => setReplyingTo(qa._id)}
                    className="text-xs text-gray-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
                  >
                    <Reply className="h-3 w-3" /> Reply
                  </button>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={replyText[qa._id] || ""}
                      onChange={(e) =>
                        setReplyText((p) => ({ ...p, [qa._id]: e.target.value }))
                      }
                      placeholder="Write a reply..."
                      autoFocus
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-white placeholder:text-gray-500"
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setReplyingTo(null);
                        if (e.key === "Enter" && (replyText[qa._id] || "").trim()) {
                          replyMutation.mutate({ questionId: qa._id, body: replyText[qa._id] });
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() =>
                        replyMutation.mutate({ questionId: qa._id, body: replyText[qa._id] || "" })
                      }
                      disabled={!(replyText[qa._id] || "").trim() || replyMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 h-auto py-1.5 text-xs"
                    >
                      Send
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setReplyingTo(null)}
                      className="h-auto py-1.5 text-xs text-gray-400"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QAModal;
