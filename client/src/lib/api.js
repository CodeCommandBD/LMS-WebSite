import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We reject with the full error object so components can check for status codes or custom flags (e.g. needsVerification)
    return Promise.reject(error);
  },
);

export default api;
