import api from "../lib/api";

// 1. Create a quiz
export const createQuizService = async (quizData) => {
  const response = await api.post("/quiz/create", quizData);
  return response.data;
};

// 2. Get all quizzes for a course (for Admin list)
export const getCourseQuizzesService = async (courseId) => {
  const response = await api.get(`/quiz/course/${courseId}`);
  return response.data;
};

// 3. Edit a quiz
export const editQuizService = async (quizId, quizData) => {
  const response = await api.put(`/quiz/edit/${quizId}`, quizData);
  return response.data;
};

// 4. Get quiz for student (with attempt status)
export const getQuizForStudentService = async (courseId, sectionName) => {
  const response = await api.get(
    `/quiz/course/${courseId}/section/${sectionName}`,
  );
  return response.data;
};

// 5. Get quizzes for a course with student attempt status
export const getCourseQuizzesWithStatusService = async (courseId) => {
  const response = await api.get(`/quiz/course/${courseId}/status`);
  return response.data;
};

// 6. Submit quiz attempt
export const submitQuizAttemptService = async (quizId, answers) => {
  const response = await api.post(`/quiz/submit/${quizId}`, { answers });
  return response.data;
};
