import api from "@/lib/api";

export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const addToCart = async (courseId) => {
  const response = await api.post("/cart/add", { courseId });
  return response.data;
};

export const removeFromCart = async (courseId) => {
  const response = await api.delete(`/cart/remove/${courseId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete("/cart/clear");
  return response.data;
};
