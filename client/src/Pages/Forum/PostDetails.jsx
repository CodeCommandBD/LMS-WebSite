import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { 
  ArrowLeft, 
  Clock, 
  Send, 
  Loader2, 
  MessageSquare, 
  Share2, 
  ThumbsUp, 
  MoreHorizontal,
  Trash2,
  AlertCircle
} from "lucide-react";
import { getPostDetails, createForumComment, deleteForumPost } from "@/services/forumApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";

const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const [commentContent, setCommentContent] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["postDetails", postId],
    queryFn: () => getPostDetails(postId),
  });

  const commentMutation = useMutation({
    mutationFn: createForumComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["postDetails", postId]);
      setCommentContent("");
      toast.success("Comment added!");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to comment"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteForumPost(postId),
    onSuccess: () => {
      toast.success("Post deleted");
      navigate("/forum");
    },
  });

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    commentMutation.mutate({ postId, content: commentContent });
  };

  if (isLoading) {
     return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
         <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
         <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Loading Discussion...</p>
       </div>
     );
  }

  if (isError || !data?.success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
         <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
         <h2 className="text-3xl font-black text-white">Post not found</h2>
         <p className="text-gray-500 mt-4">This discussion may have been removed or the link is invalid.</p>
         <Button asChild className="mt-8 bg-blue-600">
           <Link to="/forum">Back to Forum</Link>
         </Button>
      </div>
    );
  }

  const { post, comments } = data;
  const isAuthor = user?._id === post.userId?._id;
  const isAdmin = user?.role === "admin";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          onClick={() => navigate(-1)} 
          variant="ghost" 
          className="text-gray-500 hover:text-white hover:bg-white/5 font-bold rounded-xl"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Discussions
        </Button>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="rounded-xl text-gray-500">
             <Share2 className="w-5 h-5" />
           </Button>
           {(isAuthor || isAdmin) && (
             <Button 
              onClick={() => { if(window.confirm("Delete this post?")) deleteMutation.mutate(); }}
              variant="ghost" size="icon" className="rounded-xl text-rose-500 hover:bg-rose-500/10"
             >
               <Trash2 className="w-5 h-5" />
             </Button>
           )}
        </div>
      </div>

      {/* Main Post */}
      <article className="space-y-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-4 ring-gray-100 dark:ring-gray-800 shadow-xl">
            <AvatarImage src={post.userId?.profilePicture} />
            <AvatarFallback className="bg-blue-600 text-white font-black text-xl">{post.userId?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{post.userId?.name}</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Published {new Date(post.createdAt).toLocaleString()}</span>
              <span>•</span>
              <span className="text-blue-500">In Technical Discussion</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-[1.15] tracking-tight">
            {post.title}
          </h1>
          <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 p-8 rounded-[40px] text-lg leading-relaxed text-gray-700 dark:text-gray-300 shadow-inner">
             {post.content}
          </div>
        </div>

        <div className="flex items-center gap-6 pt-4 border-b border-gray-100 dark:border-gray-800 pb-10">
           <Button variant="outline" className="rounded-2xl h-12 px-6 gap-2 border-gray-200 dark:border-gray-800 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all">
             <ThumbsUp className="w-5 h-5" />
             Helpful
           </Button>
           <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
             <MessageSquare className="w-4 h-4" />
             {comments?.length || 0} Responses
           </div>
        </div>
      </article>

      {/* Comment Section */}
      <section className="space-y-10">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Responses</h2>
        
        {/* New Comment Form */}
        <Card className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[32px] overflow-hidden shadow-2xl">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={user?.photoUrl} />
                <AvatarFallback className="bg-indigo-600 text-white font-bold">{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <form onSubmit={handleCommentSubmit} className="flex-1 space-y-4">
                <textarea 
                  rows={4}
                  className="w-full bg-transparent border-0 focus:ring-0 text-gray-800 dark:text-white font-medium resize-none placeholder:text-gray-500"
                  placeholder="Share your thoughts or answer this question..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  required
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={commentMutation.isPending || !commentContent.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 h-12 rounded-2xl shadow-xl shadow-blue-600/20"
                  >
                    {commentMutation.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : [<Send className="w-4 h-4 mr-2" />, "Post Response"]}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Existing Comments */}
        <div className="space-y-6">
          {comments?.length > 0 ? (
            comments.map((comment, idx) => (
              <div 
                key={comment._id} 
                className="flex gap-5 animate-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <Avatar className="h-10 w-10 shrink-0 border border-gray-100 dark:border-gray-800">
                  <AvatarImage src={comment.userId?.profilePicture} />
                  <AvatarFallback className="bg-gray-100 text-gray-600 font-bold">{comment.userId?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-black text-gray-900 dark:text-white">{comment.userId?.name}</span>
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-3">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                       <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 p-5 rounded-[24px] rounded-tl-none text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                    {comment.content}
                  </div>
                  <div className="flex items-center gap-4 ml-2">
                    <button className="text-[11px] font-black text-gray-500 hover:text-blue-500 flex items-center gap-1.5 transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" /> Helpful
                    </button>
                    <button className="text-[11px] font-black text-gray-500 hover:text-blue-500 transition-colors">Reply</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center grayscale opacity-40">
               <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
               <p className="font-bold text-gray-500 italic">No responses yet. Start the conversation!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PostDetails;
