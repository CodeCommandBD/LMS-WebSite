import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lectureSchema } from "@/schemas/lectureSchema";
import { createLectureService, getCourseById } from "@/services/courseApi";
import toast from "react-hot-toast";

const CreateLecture = () => {
  const params = useParams();
  const courseId = params.id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(lectureSchema),
    defaultValues: {
      lectureTitle: "",
    },
  });

  const { data: courseData, isLoading: isCourseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
  });

  const createLectureMutation = useMutation({
    mutationFn: (data) => createLectureService(courseId, data.lectureTitle),
    onSuccess: () => {
      toast.success("Lecture created successfully");
      queryClient.invalidateQueries({ queryKey: ["course", courseId] }); // Optionally invalidate course query if it fetches lectures
      reset();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create lecture");
    },
  });

  const onSubmit = (data) => {
    createLectureMutation.mutate(data);
  };

  if (isCourseLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-2">Lectures</h1>
      <p className="text-gray-500 mb-6">
        Add new lecture for course:{" "}
        <span className="font-semibold text-black">
          {courseData?.course?.courseTitle}
        </span>
      </p>

      <div className="mt-10 bg-white p-6 rounded-lg shadow-sm max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label>Lecture Title</Label>
            <Input
              {...register("lectureTitle")}
              type="text"
              placeholder="Enter lecture title"
              className={errors.lectureTitle ? "border-red-500" : ""}
            />
            {errors.lectureTitle && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lectureTitle.message}
              </p>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <Link to="/admin/courses">
              <Button
                variant="outline"
                type="button"
                className="cursor-pointer"
              >
                Back to course
              </Button>
            </Link>

            <Button
              disabled={createLectureMutation.isPending}
              type="submit"
              className="cursor-pointer bg-blue-600 hover:bg-blue-700"
            >
              {createLectureMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Add Lecture"
              )}
            </Button>
          </div>
        </form>
        <div className="mt-10 flex flex-col gap-3">
          {courseData?.course?.lectures?.map((lecture) => (
            <div
              key={lecture._id}
              className="flex items-center justify-between bg-gray-200 p-2 rounded-lg"
            >
              <p className="font-semibold">{lecture.lectureTitle}</p>
              <Link to={`/admin/courses/${courseId}/lectures/${lecture._id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
