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
import {
  Pencil,
  Plus,
  Trash,
  Loader2,
  GraduationCap,
  BookOpen,
} from "lucide-react";
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Manage Courses
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Create and manage your educational content
          </p>
        </div>
        <Link to="/admin/createCourse">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer">
            <Plus className="w-5 h-5" />
            Add New Course
          </Button>
        </Link>
      </div>

      <div className="bg-[#1e293b] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-800/50">
        {courses.length === 0 ? (
          <div className="py-20 text-center">
            <div className="bg-gray-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-gray-500" />
            </div>
            <p className="text-gray-400 font-medium">
              No courses yet. Click "Add Course" to create one!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-800/50">
                <TableRow className="hover:bg-transparent border-gray-800">
                  <TableHead className="py-5 px-6 text-gray-300 font-bold uppercase tracking-wider text-xs">
                    Course Details
                  </TableHead>
                  <TableHead className="py-5 px-6 text-gray-300 font-bold uppercase tracking-wider text-xs text-center">
                    Price
                  </TableHead>
                  <TableHead className="py-5 px-6 text-gray-300 font-bold uppercase tracking-wider text-xs text-center">
                    Status
                  </TableHead>
                  <TableHead className="py-5 px-6 text-gray-300 font-bold uppercase tracking-wider text-xs text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow
                    key={course._id}
                    className="hover:bg-gray-800/30 border-gray-800/50 transition-colors"
                  >
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative group">
                          <img
                            src={
                              course.courseThumbnail ||
                              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
                            }
                            alt="thumbnail"
                            className="w-14 h-14 rounded-xl object-cover ring-2 ring-gray-800 group-hover:ring-blue-500/50 transition-all"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-bold leading-tight">
                            {course.courseTitle}
                          </span>
                          <span className="text-gray-500 text-[10px] mt-1 uppercase tracking-widest font-bold">
                            {course.category || "General"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center">
                      <span className="text-white font-extrabold tabular-nums">
                        {course.price ? `৳${course.price}` : "Free"}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          course.isPublished
                            ? "bg-green-500/10 text-green-500 border border-green-500/20"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-2 ${course.isPublished ? "bg-green-500" : "bg-amber-500"}`}
                        ></span>
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/courses/${course._id}/quizzes`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 rounded-xl hover:bg-green-500/10 hover:text-green-500 text-gray-400 transition-all cursor-pointer"
                            title="Manage Quizzes"
                          >
                            <GraduationCap className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/admin/courses/${course._id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 rounded-xl hover:bg-blue-500/10 hover:text-blue-500 text-gray-400 transition-all cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleDelete(course._id)}
                          disabled={deleteMutation.isPending}
                          variant="ghost"
                          size="icon"
                          className="w-10 h-10 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-gray-400 transition-all cursor-pointer"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
    </div>
  );
};

export default Course;
