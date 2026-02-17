import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      sectionName: "Course Content",
    },
  });

  const { data: courseData, isLoading: isCourseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
  });

  const createLectureMutation = useMutation({
    mutationFn: (data) =>
      createLectureService(courseId, data.lectureTitle, data.sectionName),
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Curriculum Builder
        </h1>
        <p className="text-gray-400 font-medium mt-1">
          Add new lecture for course:{" "}
          <span className="text-blue-500 font-bold">
            {courseData?.course?.courseTitle}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form Card */}
        <Card className="bg-[#1e293b] border-none shadow-2xl rounded-[2.5rem] overflow-hidden self-start">
          <CardHeader className="p-8 border-b border-gray-800/50">
            <CardTitle className="text-xl font-extrabold text-white">
              Create Lecture
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs mt-1">
              Give your lecture a clear and engaging title.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <Label className="text-gray-300 font-bold ml-1">
                  Lecture Title
                </Label>
                <Input
                  {...register("lectureTitle")}
                  type="text"
                  placeholder="Ex. Introduction to React Context"
                  className={`bg-[#0f172a] border-none rounded-2xl p-6 h-14 text-white focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600 font-bold ${errors.lectureTitle ? "ring-2 ring-red-500/50" : ""}`}
                />
                {errors.lectureTitle && (
                  <p className="text-red-500 text-xs font-bold ml-1">
                    {errors.lectureTitle.message}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <Label className="text-gray-300 font-bold ml-1">
                  Section / Module Name
                </Label>
                <Input
                  {...register("sectionName")}
                  type="text"
                  placeholder="Ex. Module 1: Introduction"
                  className="bg-[#0f172a] border-none rounded-2xl p-6 h-14 text-white focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600 font-bold"
                />
                <p className="text-gray-500 text-[10px] italic ml-1">
                  Lectures with same section name will be grouped together.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Link to="/admin/courses" className="flex-1">
                  <Button
                    variant="ghost"
                    type="button"
                    className="w-full px-6 py-6 rounded-2xl font-bold text-gray-400 hover:bg-gray-800 hover:text-white transition-all cursor-pointer"
                  >
                    Back
                  </Button>
                </Link>

                <Button
                  disabled={createLectureMutation.isPending}
                  type="submit"
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/20 cursor-pointer"
                >
                  {createLectureMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    </>
                  ) : (
                    "Add Lecture"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* List Card */}
        <Card className="bg-[#1e293b] border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-gray-800/50">
            <CardTitle className="text-xl font-extrabold text-white">
              Lecture List
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs mt-1">
              Manage and reorder your existing lectures.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {courseData?.course?.lectures?.length === 0 ? (
                <div className="text-center py-10 opacity-30 italic text-gray-400">
                  No lectures added yet
                </div>
              ) : (
                courseData?.course?.lectures?.map((lecture, index) => (
                  <div
                    key={lecture._id}
                    className="group flex items-center justify-between bg-[#0f172a] hover:bg-gray-800/50 p-4 rounded-2xl border border-gray-800/50 transition-all hover:translate-x-1"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-blue-500 font-black text-xs tabular-nums bg-blue-500/10 w-8 h-8 rounded-lg flex items-center justify-center uppercase">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors line-clamp-1">
                        {lecture.lectureTitle}
                      </p>
                    </div>
                    <Link
                      to={`/admin/courses/${courseId}/lectures/${lecture._id}`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-9 h-9 rounded-xl hover:bg-white/10 text-gray-500 hover:text-white cursor-pointer transition-all"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateLecture;
