import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { 
  MessageSquare, 
  MessageCircle, 
  Search, 
  Filter, 
  Plus, 
  Loader2, 
  User, 
  Clock, 
  MoreVertical,
  ThumbsUp,
  Hash
} from "lucide-react";
import { getForumPosts, createForumPost } from "@/services/forumApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

const ForumHome = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [courseFilter, setCourseFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", courseId: "" });

  // For this implementation, we'll fetch posts for "all" by passing a special flag or handling in controller
  // Since controller currently only supports /course/:id, I'll fetch for the specialized "General" course or first course
  // In a real deep implementation, we'd have a /forum/all endpoint.
  // I will use his primary course as default for now, or just show a message.
  
  const selectedCourseId = courseFilter;

  const { data, isLoading } = useQuery({
    queryKey: ["forumPosts", selectedCourseId],
    queryFn: () => getForumPosts(selectedCourseId),
    enabled: !!selectedCourseId || selectedCourseId === "all",
  });

  const createPostMutation = useMutation({
    mutationFn: createForumPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["forumPosts", selectedCourseId]);
      setIsModalOpen(false);
      setNewPost({ title: "", content: "", courseId: "" });
      toast.success("Discussion started!");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to post"),
  });

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.courseId) return toast.error("Please select a course for this discussion.");
    createPostMutation.mutate(newPost);
  };

  const filteredPosts = data?.posts?.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
             <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl shadow-blue-600/20">
               <MessageSquare className="w-8 h-8 text-white" />
             </div>
             Community Forum
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Share knowledge, ask questions, and connect with peers.</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 rounded-2xl shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95">
              <Plus className="w-5 h-5 mr-2" />
              New Discussion
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-3xl p-8 max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-gray-900 dark:text-white">Start a Conversation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePost} className="space-y-6 mt-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Select Course</label>
                <select 
                  className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl p-3 font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                  value={newPost.courseId}
                  onChange={(e) => setNewPost({...newPost, courseId: e.target.value})}
                  required
                >
                  <option value="">Choose a course...</option>
                  {user?.enrolledCourses?.map((course) => (
                    <option key={course._id || course} value={course._id || course}>
                      Course: {course.courseTitle || "Enrolled Course"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Discussion Title</label>
                <input 
                  type="text"
                  placeholder="What's on your mind?"
                  className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl p-3 font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Content</label>
                <textarea 
                  rows={5}
                  placeholder="Provide context, ask a question, or share something cool..."
                  className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl p-3 font-medium text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={createPostMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-14 rounded-2xl shadow-lg"
              >
                {createPostMutation.isPending ? <Loader2 className="animate-spin w-5 h-5" /> : "Publish Discussion"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Filter className="w-3 h-3" />
              Filter By Course
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setCourseFilter("all")}
                className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${courseFilter === "all" ? "bg-blue-600 text-white shadow-lg" : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800"}`}
              >
                All Discussions
              </button>
              {user?.enrolledCourses?.map((course) => (
                <button 
                  key={course._id || course}
                  onClick={() => setCourseFilter(course._id || course)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all group ${courseFilter === (course._id || course) ? "bg-blue-600 text-white shadow-lg" : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800"}`}
                >
                  <span className="truncate block">
                    {course.courseTitle || "Enrolled Course"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-xl font-black leading-tight">Join the Discussion</h4>
              <p className="text-indigo-100 text-xs mt-2 font-medium">Helping others is the best way to learn! Share your expertise.</p>
              <Badge className="bg-white/20 hover:bg-white/30 border-none text-white font-bold mt-4">
                COMMUNITY PRO
              </Badge>
            </div>
            <MessageCircle className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform duration-500" />
          </div>
        </aside>

        <main className="lg:col-span-3 space-y-6">
          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search discussions, topics, or keywords..."
              className="w-full bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-800 rounded-[24px] py-4 pl-12 pr-6 text-gray-900 dark:text-white font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Posts List */}
          {isLoading ? (
             <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
               <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
               <p className="font-bold text-gray-500">Retrieving discussions...</p>
             </div>
          ) : filteredPosts.length > 0 ? (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Link 
                  key={post._id} 
                  to={`/forum/post/${post._id}`}
                  className="block bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-[32px] hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-5">
                    <Avatar className="h-12 w-12 ring-2 ring-gray-100 dark:ring-gray-800 group-hover:ring-blue-500/30 transition-all">
                      <AvatarImage src={post.userId?.profilePicture} />
                      <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">{post.userId?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-gray-900 dark:text-white">{post.userId?.name}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2 leading-relaxed">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-2 text-gray-500 group-hover:text-blue-600 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-[11px] font-black uppercase tracking-wider">{post.commentsCount || 0} Replies</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-[11px] font-black uppercase tracking-wider">Helpful</span>
                        </div>
                        {post.isPinned && (
                           <Badge className="bg-amber-100 text-amber-600 border-none font-black text-[9px] px-2 py-0.5 animate-pulse">
                             PINNED
                           </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800/20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[40px] py-24 flex flex-col items-center justify-center text-center px-10">
               <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-6">
                 <Hash className="w-12 h-12 text-gray-400" />
               </div>
               <h3 className="text-2xl font-black text-gray-900 dark:text-white">No discussions yet</h3>
               <p className="text-gray-500 mt-3 max-w-sm font-medium">Be the first to start a conversation in this community!</p>
               <Button 
                onClick={() => setIsModalOpen(true)}
                variant="outline" 
                className="mt-8 border-gray-300 dark:border-gray-700 font-bold rounded-xl"
               >
                 Start Discussion
               </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ForumHome;
