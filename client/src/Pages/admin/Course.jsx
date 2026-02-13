import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInstructorCourses,
  deleteCourseService,
} from "@/services/courseApi";
import toast from "react-hot-toast";

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

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteCourseService,
    onSuccess: () => {
      toast.success("Course deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["instructorCourses"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete course");
    },
  });

  /* State */
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (courseId) => {
    setSelectedCourse(courseId);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCourse) {
      deleteMutation.mutate(selectedCourse);
      setIsModalOpen(false);
    }
  };

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
    <>
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
                <TableHead className="w-[200px] text-center">Course</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell className="font-medium text-center flex items-center gap-2 w-[200px]">
                    <img
                      src={
                        course.courseThumbnail ||
                        "https://github.com/shadcn.png"
                      }
                      alt="thumbnail"
                      className="w-15 h-15 object-cover"
                    />
                    {course.courseTitle}
                  </TableCell>
                  <TableCell className="text-center">
                    {course.price ? `৳${course.price}` : "N/A"}
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
                    <Link to={`/admin/courses/${course._id}`}>
                      <Button className="mr-2 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">
                        <Pencil />
                      </Button>
                    </Link>

                    <Button
                      onClick={() => handleDelete(course._id)}
                      disabled={deleteMutation.isPending}
                      variant="ghost"
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 hover:text-white text-white cursor-pointer"
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              course and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Course;
