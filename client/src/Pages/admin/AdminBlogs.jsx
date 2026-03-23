import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Newspaper,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";

const getAllBlogs = () => api.get("/blogs?status=all").then((r) => r.data);
const deleteBlogFn = (id) => api.delete(`/blogs/${id}`).then((r) => r.data);
const togglePublishFn = ({ id, currentStatus }) =>
  api.patch(`/blogs/${id}`, { status: currentStatus === "published" ? "draft" : "published" }).then((r) => r.data);

const AdminBlogs = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["adminBlogs"],
    queryFn: getAllBlogs,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlogFn,
    onSuccess: () => {
      toast.success("Blog deleted successfully");
      setConfirmDelete(null);
      queryClient.invalidateQueries(["adminBlogs"]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete blog"),
  });

  const toggleMutation = useMutation({
    mutationFn: togglePublishFn,
    onSuccess: (data) => {
      toast.success(data.message || "Status updated");
      queryClient.invalidateQueries(["adminBlogs"]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update status"),
  });

  const blogs = data?.blogs || [];

  const filtered = blogs.filter((b) => {
    const matchSearch = b.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-black/20 text-white">
              <Newspaper className="w-6 h-6" />
            </div>
            Blog Management
          </h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">
            Create, edit, and manage knowledge hub articles
          </p>
        </div>
        <Link
          to="/admin/createBlog"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm px-6 py-3 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create New Blog
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: blogs.length, color: "text-white" },
          { label: "Published", value: blogs.filter((b) => b.status === "published").length, color: "text-emerald-400" },
          { label: "Draft", value: blogs.filter((b) => b.status === "draft").length, color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-4 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#1e293b]/20 border border-gray-800 rounded-[32px] overflow-hidden">
        {/* Filters */}
        <div className="p-6 border-b border-gray-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1e293b]/50 border border-gray-800 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            {["all", "published", "draft"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  statusFilter === s
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "bg-[#1e293b]/50 text-gray-400 border border-gray-800 hover:border-gray-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800/50">
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Article</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Views</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-gray-500 font-bold">
                    No articles found.
                  </td>
                </tr>
              ) : (
                filtered.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {blog.thumbnail && (
                          <img
                            src={blog.thumbnail}
                            className="w-12 h-12 rounded-lg object-cover ring-2 ring-gray-800 group-hover:ring-blue-600/30 transition-all shrink-0"
                            alt=""
                          />
                        )}
                        <div>
                          <p className="text-white font-bold text-sm line-clamp-1">{blog.title}</p>
                          <p className="text-gray-500 text-[10px] font-medium flex items-center gap-2 mt-1">
                            {new Date(blog.createdAt).toLocaleDateString()}
                            <Link
                              to={`/blog/${blog.slug || blog._id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline inline-flex items-center gap-0.5"
                            >
                              Visit <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-800/50 text-gray-300 text-[10px] font-black px-2.5 py-1 rounded-md border border-gray-700">
                        {blog.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-bold text-xs">{blog.views || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          blog.status === "published"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${blog.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Publish / Unpublish toggle */}
                        <button
                          onClick={() => toggleMutation.mutate({ id: blog._id, currentStatus: blog.status })}
                          disabled={toggleMutation.isPending}
                          title={blog.status === "published" ? "Unpublish" : "Publish"}
                          className={`p-2 rounded-lg transition-all ${
                            blog.status === "published"
                              ? "bg-amber-600/10 text-amber-500 hover:bg-amber-600 hover:text-white"
                              : "bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white"
                          }`}
                        >
                          {blog.status === "published" ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        {/* Edit */}
                        <Link
                          to={`/admin/blogs/${blog._id}`}
                          className="p-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {/* Delete with confirm */}
                        {confirmDelete === blog._id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => deleteMutation.mutate(blog._id)}
                              disabled={deleteMutation.isPending}
                              className="text-[10px] font-black text-rose-400 hover:text-rose-300 uppercase tracking-wider py-1.5 px-3 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 transition-colors"
                            >
                              {deleteMutation.isPending ? "..." : "Confirm"}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="text-[10px] font-black text-gray-400 uppercase tracking-wider py-1.5 px-2 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(blog._id)}
                            className="p-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogs;
