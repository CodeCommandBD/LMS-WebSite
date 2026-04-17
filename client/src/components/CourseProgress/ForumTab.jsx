import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getForumPosts, createForumPost, createForumComment, getPostDetails, deleteForumPost } from "@/services/forumApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Send, 
  Pin, 
  Trash2, 
  MessageCircle, 
  User as UserIcon,
  ChevronRight,
  Plus
} from "lucide-react";
import toast from "react-hot-toast";

const ForumTab = ({ courseId, user }) => {
  const queryClient = useQueryClient();
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [commentContent, setCommentContent] = useState("");

  // 1. Fetch Posts
  const { data: postsData, isLoading: isPostsLoading } = useQuery({
    queryKey: ["forumPosts", courseId],
    queryFn: () => getForumPosts(courseId),
  });

  // 2. Fetch Selected Post Details
  const { data: postDetails, isLoading: isDetailsLoading } = useQuery({
    queryKey: ["forumPostDetails", selectedPostId],
    queryFn: () => getPostDetails(selectedPostId),
    enabled: !!selectedPostId,
  });

  // 3. Create Post Mutation
  const createPostMutation = useMutation({
    mutationFn: createForumPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["forumPosts", courseId]);
      setIsAddingPost(false);
      setPostTitle("");
      setPostContent("");
      toast.success("Discussion posted!");
    },
  });

  // 4. Create Comment Mutation
  const createCommentMutation = useMutation({
    mutationFn: createForumComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["forumPostDetails", selectedPostId]);
      queryClient.invalidateQueries(["forumPosts", courseId]);
      setCommentContent("");
      toast.success("Comment added!");
    },
  });

  // 5. Delete Post Mutation
  const deletePostMutation = useMutation({
    mutationFn: deleteForumPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["forumPosts", courseId]);
      setSelectedPostId(null);
      toast.success("Post deleted");
    },
  });

  const posts = postsData?.posts || [];

  if (selectedPostId) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setSelectedPostId(null)}
          className="text-xs font-black text-blue-500 uppercase tracking-widest mb-6 flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
        >
          ← Back to Discussions
        </button>

        {isDetailsLoading ? (
           <div className="py-20 text-center animate-pulse text-gray-500">Loading discussion...</div>
        ) : (
          <div className="space-y-8">
            <div className="bg-[#1e293b]/30 rounded-3xl p-8 border border-white/5 shadow-2xl">
              <div className="flex items-start gap-4 mb-6">
                <Avatar className="h-10 w-10 ring-2 ring-blue-500/20">
                  <AvatarImage src={postDetails.post.userId?.profilePicture} />
                  <AvatarFallback className="bg-blue-600 text-white font-bold">{postDetails.post.userId?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-black text-white leading-tight">{postDetails.post.title}</h2>
                  <p className="text-[10px] text-gray-500 mt-1 font-bold">
                    Posted by <span className="text-blue-400">{postDetails.post.userId?.name}</span> • {new Date(postDetails.post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">{postDetails.post.content}</p>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                Comments ({postDetails.comments?.length || 0})
              </h3>
              
              <div className="space-y-4">
                {postDetails.comments?.map(comment => (
                  <div key={comment._id} className="bg-[#1e293b]/10 rounded-2xl p-4 border border-white/5 flex gap-4">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={comment.userId?.profilePicture} />
                      <AvatarFallback className="bg-gray-700 text-white text-[10px]">{comment.userId?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">{comment.userId?.name}</span>
                        <span className="text-[9px] text-gray-600 font-bold">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Textarea 
                  placeholder="Share your thoughts..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="bg-[#0f172a] border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 mb-3"
                />
                <Button 
                  onClick={() => createCommentMutation.mutate({ postId: selectedPostId, content: commentContent })}
                  disabled={!commentContent || createCommentMutation.isPending}
                  className="rounded-xl h-10 px-6 font-bold"
                >
                  <Send className="w-4 h-4 mr-2" /> Post Comment
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-500" />
            Course Community
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
            Learn together with your peers
          </p>
        </div>
        {!isAddingPost && (
          <Button onClick={() => setIsAddingPost(true)} size="sm" className="rounded-xl font-bold gap-2 shadow-lg shadow-blue-900/20">
            <Plus className="w-4 h-4" /> Start Discussion
          </Button>
        )}
      </div>

      {isAddingPost && (
        <div className="bg-[#1e293b]/30 rounded-3xl p-6 border border-white/5 mb-8 animate-in slide-in-from-top-4 duration-300">
          <Input 
            placeholder="What's on your mind? (Title)"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="bg-[#0f172a] border-none rounded-xl h-12 mb-4 font-bold text-white transition-all focus:ring-2 focus:ring-blue-500"
          />
          <Textarea 
            placeholder="Provide more details..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="bg-[#0f172a] border-none rounded-xl p-4 text-sm mb-4 h-32"
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsAddingPost(false)}>Cancel</Button>
            <Button 
              disabled={!postTitle || !postContent || createPostMutation.isPending}
              onClick={() => createPostMutation.mutate({ courseId, title: postTitle, content: postContent })}
              className="rounded-xl px-8"
            >
              Post Discussion
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {isPostsLoading ? (
          <div className="py-20 text-center animate-pulse text-gray-500">Loading discussions...</div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center bg-[#1e293b]/10 rounded-3xl border border-dashed border-white/5">
             <MessageSquare className="w-10 h-10 text-gray-700 mx-auto mb-4 opacity-30" />
             <p className="text-gray-500 font-bold italic">No discussions yet. Be the first to start one!</p>
          </div>
        ) : (
          posts.map(post => (
            <div 
              key={post._id}
              onClick={() => setSelectedPostId(post._id)}
              className="group bg-[#1e293b]/20 hover:bg-[#1e293b]/40 rounded-2xl p-5 border border-white/5 flex items-center justify-between cursor-pointer transition-all duration-300"
            >
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 ring-2 ring-white/5 mt-1 shrink-0">
                  <AvatarImage src={post.userId?.profilePicture} />
                  <AvatarFallback className="bg-gray-800 text-gray-400 font-bold">{post.userId?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {post.isPinned && <Pin className="w-3 h-3 text-blue-500 fill-blue-500" />}
                    <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{post.title}</h4>
                  </div>
                  <p className="text-gray-500 text-xs line-clamp-1 mb-2 font-medium">{post.content}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest flex items-center gap-1">
                       <UserIcon className="w-2.5 h-2.5" /> {post.userId?.name}
                    </span>
                    <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest flex items-center gap-1">
                       <MessageSquare className="w-2.5 h-2.5" /> {post.commentsCount} Comments
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ForumTab;
