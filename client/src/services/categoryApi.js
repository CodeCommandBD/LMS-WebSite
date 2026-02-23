import api from "../lib/api";

// 1. Get all categories
export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data.categories;
};

// 2. Create category (Admin only)
export const createCategory = async (categoryData) => {
  const response = await api.post("/categories", categoryData);
  return response.data;
};

// 3. Delete category (Admin only)
export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};
