import api from "../lib/api";

export const registerUser = async (userData) => {
  const response = await api.post("/users/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/users/login", userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/users/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

export const updateProfile = async (userData) => {
  const headers = {};

  // If userData is FormData, let axios set Content-Type automatically
  // Otherwise, explicitly set JSON header
  if (!(userData instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await api.put("/users/update-profile", userData, {
    headers,
  });
  return response.data;
};
