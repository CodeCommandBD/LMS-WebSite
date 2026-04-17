import api from "@/lib/api";

export const getForumPosts = async (courseId) => {
  const response = await api.get(`/forum/course/${courseId}`);
  return response.data;
};

export const getPostDetails = async (postId) => {
  const response = await api.get(`/forum/post/${postId}`);
  return response.data;
};

export const createForumPost = async (postData) => {
  const response = await api.post("/forum/post/create", postData);
  return response.data;
};

export const createForumComment = async (commentData) => {
  const response = await api.post("/forum/comment/create", commentData);
  return response.data;
};

export const deleteForumPost = async (postId) => {
  const response = await api.delete(`/forum/post/${postId}`);
  return response.data;
};
