import Blog from "../models/blog.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import { sendError } from "../utils/errorHandler.js";

// Create Blog
export const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, status, isFeatured } =
      req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, content and category are required",
      });
    }

    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Add a unique identifier to ensure slug history uniqueness
    const strMatch = Math.random().toString(36).substring(2, 8);
    const slug = `${baseSlug}-${strMatch}`;

    const blogData = {
      title,
      slug,
      content,
      excerpt,
      category,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(",")) : [],
      status,
      isFeatured: isFeatured === "true" || isFeatured === true,
      author: req.user.id,
    };

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      if (uploadResult.success) {
        blogData.thumbnail = uploadResult.url;
        fs.unlinkSync(req.file.path);
      }
    }

    const blog = await Blog.create(blogData);

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error("Create Blog Error:", error);
    return sendError(res, error, "blogController");
  }
};

// Get All Blogs (Public)
export const getAllBlogs = async (req, res) => {
  try {
    const { category, tag, search, status, limit, sortBy } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    } else if (!status) {
      query.status = "published"; // Default for public view
    }

    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === "views") sortOptions = { views: -1 };

    const maxLimit = limit ? parseInt(limit, 10) : 0;

    const blogs = await Blog.find(query)
      .populate("author", "name profilePicture")
      .populate("category", "name")
      .sort(sortOptions)
      .limit(maxLimit);

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    return sendError(res, error, "blogController");
  }
};

// Get Single Blog (Public)
export const getBlogBySlugOrId = async (req, res) => {
  try {
    const { identifier } = req.params;
    const blog = await Blog.findOne({
      $or: [
        { _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : null },
        { slug: identifier },
      ],
    })
      .populate("author", "name bio profilePicture")
      .populate("category", "name");

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    return sendError(res, error, "blogController");
  }
};

// Update Blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    // BUG-NEW-C FIX: Whitelist allowed fields to prevent mass assignment.
    // Previously `{ ...req.body }` let attackers overwrite any field including
    // `author`, `slug`, `views`, and `isFeatured`.
    const { title, content, excerpt, category, tags, status, isFeatured } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (category !== undefined) updateData.category = category;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured === "true" || isFeatured === true;
    if (status !== undefined) updateData.status = status;
    if (tags !== undefined) {
      updateData.tags = Array.isArray(tags) ? tags : tags.split(",");
    }

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      if (uploadResult.success) {
        updateData.thumbnail = uploadResult.url;
        fs.unlinkSync(req.file.path);
      }
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // BUG-NEW-E FIX: Ensure the user owns the blog or is an admin before updating.
    if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only edit your own blogs.",
      });
    }

    // Update the existing blog object
    Object.assign(blog, updateData);
    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    return sendError(res, error, "blogController");
  }
};

// Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // BUG-NEW-E FIX: Ensure the user owns the blog or is an admin before deleting.
    if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only delete your own blogs.",
      });
    }

    await Blog.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return sendError(res, error, "blogController");
  }
};

// ─────────────────────────────────────────────
// Blog Comments
// ─────────────────────────────────────────────
import BlogComment from "../models/blogComment.model.js";

// GET /api/v1/blogs/:id/comments — list comments for a blog
export const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await BlogComment.find({ blogId: id })
      .populate("userId", "name profilePicture role")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, comments });
  } catch (error) {
    return sendError(res, error, "blogController");
  }
};

// POST /api/v1/blogs/:id/comments — add a comment (authenticated users)
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Comment cannot be empty." });
    }

    const newComment = await BlogComment.create({
      blogId: id,
      userId: req.user.id,
      comment: comment.trim(),
    });

    const populated = await newComment.populate(
      "userId",
      "name profilePicture role",
    );

    return res.status(201).json({ success: true, comment: populated });
  } catch (error) {
    return sendError(res, error, "blogController");
  }
};

// DELETE /api/v1/blogs/:id/comments/:commentId — delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const comment = await BlogComment.findById(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found." });
    }

    // Only the comment author or admin can delete
    if (comment.userId.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    await BlogComment.findByIdAndDelete(commentId);
    return res.status(200).json({ success: true, message: "Comment deleted." });
  } catch (error) {
    return sendError(res, error, "blogController");
  }
};
