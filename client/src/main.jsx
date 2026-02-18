import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Home from "./Pages/Home";
import Courses from "./Pages/Courses";
import Login from "./Pages/auth/Login";
import Signup from "./Pages/auth/Signup";
import CourseCardDetails from "./components/CourseCardDetails";
import Profile from "./Pages/Profile";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import Course from "./Pages/admin/Course";
import Dashboard from "./Pages/admin/Dashboard";
import CreateCourse from "./Pages/admin/CreateCourse";
import UpdateCourse from "./Pages/admin/UpdateCourse";
import CreateLecture from "./Pages/admin/CreateLecture";
import EditLecture from "./Pages/admin/EditLecture";
import PurchaseSuccess from "./Pages/PurchaseSuccess";
import CourseProgress from "./Pages/CourseProgress";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminQuizManager from "./Pages/admin/AdminQuizManager";

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Create router
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/courses",
        element: <Courses />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/purchase-success",
        element: <PurchaseSuccess />,
      },
      {
        path: "/course-progress/:id",
        element: (
          <ProtectedRoute>
            <CourseProgress />
          </ProtectedRoute>
        ),
      },
      {
        path: "/courseDetails/:id",
        element: <CourseCardDetails />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "",
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "courses",
            element: <Course />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "createCourse",
            element: <CreateCourse />,
          },
          {
            path: "courses/:id",
            element: <UpdateCourse />,
          },
          {
            path: "courses/:id/lectures",
            element: <CreateLecture />,
          },
          {
            path: "courses/:id/lectures/:lectureId",
            element: <EditLecture />,
          },
          {
            path: "courses/:id/quizzes",
            element: <AdminQuizManager />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </Provider>,
);
