import { Button } from "@/components/ui/button";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Trash, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getInstructorCourses } from "@/services/courseApi";

const Course = () => {
  const {
    data: courses = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["instructorCourses"],
    queryFn: getInstructorCourses,
  });

  if (isLoading) {
    return (
      <div className="md:p-10 p-4 w-full h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="md:p-10 p-4 w-full h-screen bg-gray-50">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="md:p-10 p-4 w-full h-screen bg-gray-50">
      <Button className="flex items-center gap-2">
        <Plus />
        <Link to="/admin/createCourse">Add Course</Link>
      </Button>

      {courses.length === 0 ? (
        <p className="mt-10 text-gray-500 text-center">
          No courses yet. Click "Add Course" to create one!
        </p>
      ) : (
        <Table className="mt-10">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center">
                Course Name
              </TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Discount</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell className="font-medium text-center">
                  {course.courseTitle}
                </TableCell>
                <TableCell className="text-center">
                  {course.price ? `৳${course.price}` : "Free"}
                </TableCell>
                <TableCell className="text-center">
                  {course.discount ? `${course.discount}%` : "—"}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
                      course.status === "Published"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {course.status || "Draft"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Button className="mr-2 bg-blue-500 hover:bg-blue-600 text-white">
                    <Pencil />
                  </Button>
                  <Button className="bg-red-500 hover:bg-red-600 text-white">
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Course;
