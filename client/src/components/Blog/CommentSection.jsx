import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Send, Trash2, Loader2, User as UserIcon } from "lucide-react";
import api from "@/lib/api";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const commentApi = {
  getByBlog: (blogId) => api.get(`/blog-comments/${blogId}`).then((r) => r.data.comments),
  add: (data) => api.post("/blog-comments", data).then((r) => r.data.comment),
  delete: (id) => api.delete(`/blog-comments/${id}`).then((r) => r.data),
};

const CommentSection = ({ blogId }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ["blogComments", blogId],
    queryFn: () => commentApi.getByBlog(blogId),
    enabled: !!blogId,
  });

  const addCommentMutation = useMutation({
    mutationFn: commentApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogComments", blogId]);
      setNewComment("");
      toast.success("Comment posted!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to post comment"),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: commentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogComments", blogId]);
      toast.success("Comment deleted");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete comment"),
  });

  const handlePost = () => {
    if (!newComment.trim()) return;
    addCommentMutation.mutate({ blogId, comment: newComment });
  };

  return (
    <div className="mt-16 pt-12 border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          Comments ({comments?.length || 0})
        </h2>
      </div>

      {/* Input Area */}
      {isAuthenticated ? (
        <div className="flex gap-4 mb-12">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <textarea
              placeholder="What are your thoughts on this topic?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none min-h-[100px]"
            />
            <div className="flex justify-end mt-2">
              <Button
                onClick={handlePost}
                disabled={!newComment.trim() || addCommentMutation.isPending}
                className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 font-bold h-10"
              >
                {addCommentMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 text-center mb-12">
          <p className="text-sm text-gray-500 font-medium">
            Please <a href="/login" className="text-blue-600 font-bold hover:underline">login</a> to join the discussion.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : comments?.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4 group">
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarImage src={comment.userId?.profilePicture} />
                <AvatarFallback className="bg-gray-100 text-gray-400 font-bold">
                  {comment.userId?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                      {comment.userId?.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium bg-gray-50 dark:bg-gray-900 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {(user?._id === comment.userId?._id || ["admin", "teacher"].includes(user?.role)) && (
                    <button
                      onClick={() => deleteCommentMutation.mutate(comment._id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10"
                      title="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                  {comment.comment}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 bg-gray-50/50 dark:bg-gray-900/20 rounded-[40px] border-2 border-dashed border-gray-100 dark:border-gray-800">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-10" />
            <p className="text-sm font-medium">No comments yet. Start the conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
