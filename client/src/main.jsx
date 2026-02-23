import { StrictMode, lazy, Suspense } from "react";
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
import ErrorBoundary from "./components/ErrorBoundary";
import GlobalErrorPage from "./components/GlobalErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Lazy Load Pages
const Home = lazy(() => import("./Pages/Home"));
const Courses = lazy(() => import("./Pages/Courses"));
const Login = lazy(() => import("./Pages/auth/Login"));
const Signup = lazy(() => import("./Pages/auth/Signup"));
const Profile = lazy(() => import("./Pages/Profile"));
const AdminDashboard = lazy(() => import("./Pages/admin/AdminDashboard"));
const AdminHome = lazy(() => import("./Pages/admin/Dashboard"));
const AdminCourses = lazy(() => import("./Pages/admin/Course"));
const CreateCourse = lazy(() => import("./Pages/admin/CreateCourse"));
const EditCourse = lazy(() => import("./Pages/admin/UpdateCourse"));
const Lectures = lazy(() => import("./Pages/admin/CreateLecture"));
const EditLecture = lazy(() => import("./Pages/admin/EditLecture"));
const AdminQuizManager = lazy(() => import("./Pages/admin/AdminQuizManager"));
const CourseCardDetails = lazy(() => import("./components/CourseCardDetails"));
const CourseProgress = lazy(() => import("./Pages/CourseProgress"));
const PurchaseSuccess = lazy(() => import("./Pages/PurchaseSuccess"));
const InstructorProfile = lazy(() => import("./Pages/InstructorProfile"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const ForgotPassword = lazy(() => import("./Pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./Pages/auth/ResetPassword"));
const SearchPage = lazy(() => import("./Pages/SearchPage"));
const MyEnrolledCourses = lazy(() => import("./Pages/MyEnrolledCourses"));
const Wishlist = lazy(() => import("./Pages/Wishlist"));
const About = lazy(() => import("./Pages/About"));
const Contact = lazy(() => import("./Pages/Contact"));
const Terms = lazy(() => import("./Pages/Terms"));
const Privacy = lazy(() => import("./Pages/Privacy"));
const Certificate = lazy(() => import("./Pages/student/Certificate"));
const AdminUsers = lazy(() => import("./Pages/admin/AdminUsers"));
const AdminAnalytics = lazy(() => import("./Pages/admin/AdminAnalytics"));
const AdminSettings = lazy(() => import("./Pages/admin/AdminSettings"));
const AdminHelpCenter = lazy(() => import("./Pages/admin/AdminHelpCenter"));
const AdminQuizHome = lazy(() => import("./Pages/admin/AdminQuizHome"));
const AdminCategories = lazy(() => import("./Pages/admin/AdminCategories"));

// Loading Fallback Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
  </div>
);

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes stale time
    },
  },
});

// Create router
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <GlobalErrorPage />,
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
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/purchase-success",
        element: (
          <ProtectedRoute>
            <PurchaseSuccess />
          </ProtectedRoute>
        ),
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
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/terms",
        element: <Terms />,
      },
      {
        path: "/privacy",
        element: <Privacy />,
      },
      {
        path: "/my-learning",
        element: (
          <ProtectedRoute>
            <MyEnrolledCourses />
          </ProtectedRoute>
        ),
      },
      {
        path: "/wishlist",
        element: (
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        ),
      },
      {
        path: "/certificate/:id",
        element: (
          <ProtectedRoute>
            <Certificate />
          </ProtectedRoute>
        ),
      },
      {
        path: "/instructor/:id",
        element: <InstructorProfile />,
      },
      // Admin Routes
      {
        path: "/admin",
        element: (
          <ProtectedRoute roles={["admin", "teacher"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "",
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <AdminHome />,
          },
          {
            path: "courses",
            element: <AdminCourses />,
          },
          {
            path: "createCourse",
            element: <CreateCourse />,
          },
          {
            path: "courses/:id",
            element: <EditCourse />,
          },
          {
            path: "courses/:id/lectures",
            element: <Lectures />,
          },
          {
            path: "courses/:id/lectures/:lectureId",
            element: <EditLecture />,
          },
          {
            path: "courses/:id/quizzes",
            element: <AdminQuizManager />,
          },
          {
            path: "quizzes",
            element: <AdminQuizHome />,
          },
          {
            path: "users",
            element: <AdminUsers />,
          },
          {
            path: "analytics",
            element: <AdminAnalytics />,
          },
          {
            path: "settings",
            element: <AdminSettings />,
          },
          {
            path: "help",
            element: <AdminHelpCenter />,
          },
          {
            path: "categories",
            element: <AdminCategories />,
          },
        ],
      },
      // 404 Route
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" />
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  </Provider>,
);
