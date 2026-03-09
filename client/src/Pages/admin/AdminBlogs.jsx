import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Newspaper,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL || ""}/api/v1/blogs?status=all`,
      ); // Allow admin to see drafts
      if (response.data.success) {
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL || ""}/api/v1/blogs/${id}`,
          { withCredentials: true },
        );
        if (response.data.success) {
          toast.success("Blog deleted successfully");
          fetchBlogs();
        }
      } catch (error) {
        toast.error("Failed to delete blog");
      }
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
            Create, edit and manage your knowledge hub articles
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

      <div className="bg-[#1e293b]/20 border border-gray-800 rounded-[32px] overflow-hidden">
        <div className="p-6 border-b border-gray-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1e293b]/50 border border-gray-800 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all text-sm font-medium"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-bold text-white">{filteredBlogs.length}</span>{" "}
            Articles Total
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800/50">
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Article
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Category
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Stats
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                      Fetching articles...
                    </p>
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-20 text-center text-gray-500 font-bold"
                  >
                    No articles found.
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-gray-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={blog.thumbnail}
                          className="w-12 h-12 rounded-lg object-cover ring-2 ring-gray-800 group-hover:ring-blue-600/30 transition-all"
                          alt=""
                        />
                        <div>
                          <p className="text-white font-bold text-sm tracking-tight line-clamp-1">
                            {blog.title}
                          </p>
                          <p className="text-gray-500 text-[10px] font-medium flex items-center gap-1 mt-1">
                            {new Date(blog.createdAt).toLocaleDateString()}
                            <Link
                              to={`/blog/${blog.slug || blog._id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline inline-flex items-center gap-1"
                            >
                              Visit <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-800/50 text-gray-300 text-[10px] font-black px-2.5 py-1 rounded-md border border-gray-700">
                        {blog.category?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-xs">
                          {blog.views || 0} views
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          blog.status === "published"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${blog.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`}
                        />
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/blogs/${blog._id}`}
                          className="p-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="p-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
