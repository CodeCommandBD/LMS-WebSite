import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import api from "@/lib/api";
import toast from "react-hot-toast";
import AdSense from "../../components/Blog/AdSense";
import SEO from "../../components/SEO";

// ─────────────────────────────────────────────
// CommentSection component
// ─────────────────────────────────────────────
const CommentSection = ({ blogId, user, navigate }) => {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["blogComments", blogId],
    queryFn: () => api.get(`/blogs/${blogId}/comments`).then((r) => r.data),
    enabled: !!blogId,
  });

  const addMutation = useMutation({
    mutationFn: (comment) =>
      api.post(`/blogs/${blogId}/comments`, { comment }).then((r) => r.data),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries(["blogComments", blogId]);
      toast.success("Comment posted!");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to post comment"),
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId) =>
      api.delete(`/blogs/${blogId}/comments/${commentId}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["blogComments", blogId]);
      toast.success("Comment deleted");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to delete"),
  });

  const comments = data?.comments || [];

  return (
    <section className="mt-16 border-t border-slate-200 pt-12 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
        <span className="text-3xl">💬</span>
        {comments.length > 0
          ? `${comments.length} Comment${comments.length !== 1 ? "s" : ""}`
          : "Comments"}
      </h2>

      {/* Comment Form */}
      {user ? (
        <div className="mb-10 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-500 text-white font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="font-semibold text-slate-800">{user.name}</span>
          </div>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts on this article..."
            rows={3}
            className="w-full border border-slate-200 rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-slate-700"
          />
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (!commentText.trim())
                  return toast.error("Please write something.");
                addMutation.mutate(commentText.trim());
              }}
              disabled={addMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              {addMutation.isPending ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-10 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3">
          <p className="text-slate-600 font-medium">
            Join the conversation — sign in to comment.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse"
            >
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-slate-200 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-1/4" />
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <div className="text-5xl mb-3">💭</div>
          <p className="font-medium">No comments yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0 mt-0.5">
                  {c.userId?.profilePicture ? (
                    <img
                      src={c.userId.profilePicture}
                      alt={c.userId?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white font-bold text-sm">
                      {c.userId?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">
                      {c.userId?.name}
                    </span>
                    {c.userId?.role === "admin" && (
                      <span className="text-[10px] font-black text-purple-500 bg-purple-50 px-2 py-0.5 rounded uppercase tracking-wider">
                        Admin
                      </span>
                    )}
                    {c.userId?.role === "teacher" && (
                      <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                        Teacher
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm mt-1.5 leading-relaxed">
                    {c.comment}
                  </p>
                </div>
                {/* Delete button — shown to author or admin */}
                {user &&
                  (user._id === c.userId?._id ||
                    user.id === c.userId?._id ||
                    user.role === "admin") && (
                    <button
                      onClick={() => deleteMutation.mutate(c._id)}
                      disabled={deleteMutation.isPending}
                      className="text-slate-300 hover:text-red-400 transition-colors ml-2 shrink-0 text-xs font-bold"
                      title="Delete comment"
                    >
                      ✕
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const BlogDetails = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const [blog, setBlog] = useState(null);
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL || ""}/api/v1/blogs/${identifier}`,
        );
        if (response.data.success) {
          const currentBlog = response.data.blog;
          setBlog(currentBlog);

          // Fetch Popular Blogs
          try {
            const popRes = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL || ""}/api/v1/blogs?sortBy=views&limit=4`,
            );
            if (popRes.data.success) {
              setPopularBlogs(
                popRes.data.blogs
                  .filter((b) => b._id !== currentBlog._id)
                  .slice(0, 3),
              );
            }
          } catch (e) {
            console.error("Error fetching popular blogs", e);
          }

          // Fetch Related Blogs
          if (currentBlog.category?._id) {
            try {
              const relRes = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL || ""}/api/v1/blogs?category=${currentBlog.category._id}&limit=4`,
              );
              if (relRes.data.success) {
                setRelatedBlogs(
                  relRes.data.blogs
                    .filter((b) => b._id !== currentBlog._id)
                    .slice(0, 3),
                );
              }
            } catch (e) {
              console.error("Error fetching related blogs", e);
            }
          }
        }
      } catch (err) {
        setError("Blog post not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogData();
    window.scrollTo(0, 0);
  }, [identifier]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F4F9]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-[#4ECCA3]/20 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-[#4ECCA3]/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F4F9] p-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">{error}</h2>
        <Link
          to="/blog"
          className="text-indigo-600 font-bold hover:underline flex items-center gap-2"
        >
          <span className="material-symbols-outlined">arrow_back</span> Back to
          EduHub
        </Link>
      </div>
    );
  }

  const wordCount = blog.content
    ? blog.content.replace(/<[^>]*>?/gm, "").split(/\s+/).length
    : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const publishDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-[#F4F4F9] text-slate-900 transition-colors duration-300 font-sans min-h-screen w-full flex-col overflow-x-hidden pt-24 pb-20">
      <SEO
        title={blog.title}
        description={
          blog.summary ||
          blog.content?.substring(0, 160).replace(/<[^>]*>?/gm, "")
        }
        image={blog.banner}
        type="article"
      />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:py-16">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-purple-600 mb-8 font-semibold transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>{" "}
          Back to EduHub
        </Link>

        {/* Article Header */}
        <div className="mb-10 text-center max-w-4xl mx-auto">
          <nav className="mb-6 flex justify-center gap-2 text-sm font-medium text-purple-600 uppercase tracking-widest">
            <Link to="/blog" className="hover:text-pink-600 transition-colors">
              {blog.category?.name || "General"}
            </Link>
            {blog.tags && blog.tags.length > 0 && (
              <>
                <span>•</span>
                <Link to="/blog">{blog.tags[0]}</Link>
              </>
            )}
          </nav>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-slate-900 mb-6 font-display">
            {blog.title}
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-12 w-12 rounded-full bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 p-0.5">
              <img
                className="h-full w-full rounded-full object-cover"
                alt={blog.author?.name}
                src={
                  blog.author?.profilePicture || "https://github.com/shadcn.png"
                }
              />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-900">
                {blog.author?.name || "Admin"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {publishDate} · {readingTime} min read
              </p>
            </div>
          </div>
        </div>

        {/* Top Banner Ad */}
        <div className="mx-auto mb-12 max-w-4xl overflow-hidden rounded-lg bg-white border-slate-200 shadow-sm flex items-center justify-center min-h-[90px]">
          <AdSense slotId="blog-details-top" format="horizontal" />
        </div>

        {/* Main Layout: Sidebar Share | Content | Sidebar Ads/Posts */}
        <div className="relative flex flex-col lg:flex-row gap-12">
          {/* Social Share Floating Sidebar */}
          <aside className="hidden lg:block w-16 shrink-0">
            <div className="sticky top-32 flex flex-col gap-4 items-center">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                Share
              </span>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:text-white transition-all shadow-sm"
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?url=${window.location.href}&text=${blog.title}`,
                    "_blank",
                  )
                }
              >
                <span className="material-symbols-outlined text-lg">share</span>
              </button>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:text-white transition-all shadow-sm"
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
                    "_blank",
                  )
                }
              >
                <span className="material-symbols-outlined text-lg">
                  thumb_up
                </span>
              </button>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:text-white transition-all shadow-sm"
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
              >
                <span className="material-symbols-outlined text-lg">link</span>
              </button>
            </div>
          </aside>

          {/* Article Body */}
          <article className="flex-1 max-w-3xl">
            <img
              className="w-full h-auto max-h-[500px] object-cover rounded-2xl mb-10 shadow-2xl"
              alt={blog.title}
              src={blog.thumbnail || "https://via.placeholder.com/800x400"}
            />

            <div
              className="prose prose-lg dark:prose-invert max-w-none text-slate-700 leading-relaxed font-sans prose-headings:font-display prose-headings:!text-slate-900 prose-a:!text-[#4ECCA3] prose-img:rounded-2xl prose-blockquote:border-l-4 prose-blockquote:border-[#4ECCA3] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:!text-slate-500 prose-blockquote:!bg-[#4ECCA3]/5 prose-blockquote:py-2 prose-blockquote:rounded-r-lg [&_*]:!text-inherit [&_*]:!bg-transparent [&_*]:!font-inherit"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* In-feed Ad Simulation or Real Ad */}
            <div className="my-10 overflow-hidden rounded-lg bg-white border-slate-200 shadow-sm flex items-center justify-center min-h-[250px]">
              <AdSense slotId="blog-details-infeed" format="fluid" />
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-16 flex flex-wrap gap-2">
                {blog.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-slate-200 dark:bg-slate-800 px-4 py-1 text-sm font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Right Sidebar: Popular Posts & Skyscrapers Ad */}
          <aside className="w-full lg:w-80 flex flex-col gap-10 shrink-0">
            {/* Popular Posts */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-bold text-slate-900 font-display">
                Popular Posts
              </h3>
              <div className="flex flex-col gap-6">
                {popularBlogs.length > 0 ? (
                  popularBlogs.map((popBlog) => (
                    <Link
                      key={popBlog._id}
                      to={`/blog/${popBlog.slug || popBlog._id}`}
                      className="group flex gap-4"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                        <img
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                          alt={popBlog.title}
                          src={
                            popBlog.thumbnail ||
                            "https://via.placeholder.com/150"
                          }
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold leading-snug group-hover:text-purple-600 transition-colors line-clamp-2">
                          {popBlog.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {Math.ceil(
                            (popBlog.content
                              ?.replace(/<[^>]*>?/gm, "")
                              .split(/\s+/).length || 1000) / 200,
                          )}{" "}
                          min read
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No popular posts yet.
                  </p>
                )}
              </div>
            </div>

            {/* Vertical Sky-scraper Ad */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col items-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Advertisement
              </p>
              <AdSense slotId="blog-sidebar-vertical" format="vertical" />
            </div>
          </aside>
        </div>

        {/* ─────────── COMMENTS SECTION ─────────── */}
        {blog && (
          <CommentSection blogId={blog._id} user={user} navigate={navigate} />
        )}

        {/* Related Posts Section */}
        <section className="mt-24 border-t border-slate-200 dark:border-slate-800 pt-16">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-slate-900 font-display">
              Related Posts
            </h2>
            <Link
              className="flex items-center gap-2 text-purple-600 font-bold hover:text-pink-600 transition-colors"
              to="/blog"
            >
              View all articles{" "}
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedBlogs.length > 0 ? (
              relatedBlogs.map((relBlog) => (
                <Link
                  key={relBlog._id}
                  to={`/blog/${relBlog.slug || relBlog._id}`}
                  className="group cursor-pointer"
                >
                  <div className="aspect-video overflow-hidden rounded-xl bg-slate-200 mb-4">
                    <img
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      alt={relBlog.title}
                      src={
                        relBlog.thumbnail ||
                        "https://via.placeholder.com/400x250"
                      }
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors mb-2 font-display line-clamp-2">
                    {relBlog.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">
                    {relBlog.content
                      ? relBlog.content
                          .replace(/<[^>]*>?/gm, "")
                          .substring(0, 100) + "..."
                      : ""}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-500 col-span-3">
                No related posts found.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BlogDetails;
