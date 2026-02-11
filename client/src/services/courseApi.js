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
