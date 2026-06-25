import Category from "../models/category.model.js";
import { sendError } from "../utils/errorHandler.js";

// 1. Get All Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      name: 1,
    });
    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    return sendError(res, error, "categoryController");
  }
};

// 2. Create Category (Admin Only)
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    const category = await Category.create({ name, description });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    return sendError(res, error, "categoryController");
  }
};

// 3. Delete Category (Admin Only)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return sendError(res, error, "categoryController");
  }
};
