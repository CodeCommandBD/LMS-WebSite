import { BookOpen, ChartColumn } from "lucide-react";
import React from "react";
import { NavLink } from "react-router";

const AdminSideBar = () => {
  return (
    <div className="w-[100px] md:w-[250px] space-y-8 border-r border-gray-300 dark:border-gray-700 bg-gray-300 sticky left-0 top-20 h-[calc(100vh-5rem)]">
      <div className="space-y-4">
        <h1 className="font-bold text-center text-xl mt-5 hidden md:block">
          Admin Dashboard
        </h1>
      </div>
      <div className="p-3 space-y-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `text-xl block p-2 rounded ${isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800 hover:text-white"} flex items-center justify-center md:justify-start cursor-pointer font-semibold gap-2 w-full`
          }
        >
          <ChartColumn />
          <span className="hidden md:block">Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/courses"
          className={({ isActive }) =>
            `text-xl block p-2 rounded ${isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800 hover:text-white"} flex items-center justify-center md:justify-start cursor-pointer font-semibold gap-2 w-full`
          }
        >
          <BookOpen />
          <span className="hidden md:block">Courses</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSideBar;
