import api from "../lib/api";

// create a new course

export const createCourse = async (courseData) => {
  const response = await api.post("/courses", courseData);
  return response.data;
};

// get Courses created by the logged in user

export const getInstructorCourses = async () => {
  const response = await api.get("/courses");
  return response.data.courses;
};

// edit a course

export const editCourse = async (courseId, courseData) => {
  const response = await api.put(`/courses/${courseId}`, courseData);
  return response.data;
};

// get course by id
export const getCourseById = async (courseId) => {
  const response = await api.get(`/courses/${courseId}`);
  return response.data;
};

export const deleteCourseService = async (courseId) => {
  const response = await api.delete(`/courses/${courseId}`);
  return response.data;
};
