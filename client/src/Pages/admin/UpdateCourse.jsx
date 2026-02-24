import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import CourseTab from "./CourseTab";

import { useParams } from "react-router-dom";

const UpdateCourse = () => {
  const { id: courseId } = useParams();
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#1e293b] rounded-[2rem] border border-gray-800/50 shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Add detailed information of course
          </h1>
          <p className="text-gray-400 text-sm italic">
            Click below to manage your course lectures and content
          </p>
        </div>
        <Link to={`/admin/courses/${courseId}/lectures`}>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20 cursor-pointer">
            Go to Lectures Page
          </Button>
        </Link>
      </div>
      <CourseTab />
    </div>
  );
};

export default UpdateCourse;
