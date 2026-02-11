import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
        path: "/courseDetails/:id",
        element: <CourseCardDetails />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/admin",
        element: <AdminDashboard />,
        children: [
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
            path:"course/:id",
            element: <Course />,
          }
        ],
      }
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
