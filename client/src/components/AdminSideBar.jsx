import { BookOpen, ChartColumn } from "lucide-react";
import React from "react";
import { NavLink } from "react-router";

const AdminSideBar = () => {
  return (
    <div className="w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700  bg-[#f4f4f5] sticky left-0 top-20 h-[calc(100vh-5rem)]">
      <div className="space-y-4 ">
        <h1 className="font-bold text-center text-xl mt-5">Admin Dashboard</h1>
      </div>
      <div className=" p-3 space-y-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `text-xl block p-2 rounded ${isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800 hover:text-white"} flex items-center cursor-pointer font-semibold gap-2 w-full  `
          }
        >
          <ChartColumn />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/courses"
          className={({ isActive }) =>
            `text-xl block p-2 rounded ${isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800 hover:text-white"} flex items-center cursor-pointer font-semibold gap-2 w-full `
          }
        >
          <BookOpen />
          Courses
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSideBar;
