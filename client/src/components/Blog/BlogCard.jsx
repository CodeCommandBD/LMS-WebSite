import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const { title, thumbnail, category, author, createdAt, views, slug } = blog;

  return (
    <div className="group cursor-pointer flex flex-col h-full w-full rounded-[2rem] bg-white p-3 shadow-sm border border-slate-100 hover:shadow-md hover:border-purple-600/30 transition-all duration-300 relative overflow-hidden">
      <Link
        to={`/blog/${slug || blog._id}`}
        className="block overflow-hidden rounded-[1.5rem] mb-4"
      >
        <div className="relative h-56 w-full">
          <img
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={thumbnail || "https://via.placeholder.com/400x300"}
            alt={title}
          />
          <div className="absolute top-4 left-4 rounded-lg bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-900 backdrop-blur-md shadow-sm">
            {category?.name || "General"}
          </div>
        </div>
      </Link>
      <div className="flex flex-col flex-1 px-3 pb-3">
        <div className="mb-3 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <span>
            {Math.ceil(
              (blog.content
                ? blog.content.replace(/<[^>]*>?/gm, "").split(/\s+/).length
                : 1000) / 200,
            )}{" "}
            min read
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span>
              {new Date(createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <Link to={`/blog/${slug || blog._id}`}>
          <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug font-display">
            {title}
          </h3>
        </Link>
        <p className="mb-6 line-clamp-2 text-sm text-slate-500 leading-relaxed">
          {blog.excerpt ||
            (blog.content
              ? blog.content.replace(/<[^>]*>?/gm, "").substring(0, 100) + "..."
              : "Dive into this interesting topic...")}
        </p>
        <div className="mt-auto flex items-center gap-3 pt-4 border-t border-slate-100">
          <img
            className="h-8 w-8 rounded-full object-cover border border-slate-200"
            src={author?.profilePicture || "https://github.com/shadcn.png"}
            alt={author?.name}
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900 leading-none mb-1">
              {author?.name || "Admin"}
            </span>
            <span className="text-[10px] text-slate-400 font-medium leading-none">
              Author
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
