import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router-dom";
import Home from './Pages/Home';
import Courses from './Pages/Courses';
import Login from './Pages/auth/Login';
import Signup from './Pages/auth/Signup';
import CourseCardDetails from './components/CourseCardDetails';

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
    ],
  },
]);

createRoot(document.getElementById('root')).render(

    <RouterProvider router={router} />

)
