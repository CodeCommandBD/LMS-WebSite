import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema } from "@/schemas/createCourseSchema";
import { createCourse } from "@/services/courseApi";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getCategories } from "@/services/categoryApi";

const CreateCourse = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseTitle: "",
      category: "",
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      toast.success("Course created successfully");
      queryClient.invalidateQueries({ queryKey: ["instructorCourses"] });
      reset();
      navigate("/admin/courses");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const onSubmit = (data) => {
    createCourseMutation.mutate(data);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Launch New Course
        </h1>
        <p className="text-gray-400 font-medium mt-1 italic">
          Start your teaching journey by defining the basics
        </p>
      </div>

      <Card className="bg-[#1e293b] border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-gray-800/50">
          <CardTitle className="text-xl font-extrabold text-white">
            Basic Information
          </CardTitle>
          <CardDescription className="text-gray-400 font-medium">
            You can add more details like curriculum and pricing once the course
            is created.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-10">
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-3">
              <Label className="text-gray-300 font-bold ml-1">
                Course Title
              </Label>
              <Input
                {...register("courseTitle")}
                type="text"
                placeholder="Ex. Mastering Abstract Art"
                className="bg-[#0f172a] border-none rounded-2xl p-6 h-14 text-white focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600 text-lg font-bold"
              />
              {errors.courseTitle && (
                <p className="text-red-500 text-xs font-bold ml-1">
                  {errors.courseTitle.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-gray-300 font-bold ml-1">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-[#0f172a] border-none rounded-2xl h-14 text-white px-6 focus:ring-2 focus:ring-blue-500 font-bold text-lg">
                      <SelectValue
                        placeholder={
                          isCategoriesLoading
                            ? "Loading Categories..."
                            : "Select a category"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1e293b] border-gray-800 text-white rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat._id}
                          value={cat.name}
                          className="capitalize py-3 cursor-pointer"
                        >
                          {cat.name}
                        </SelectItem>
                      ))}
                      {categories.length === 0 && !isCategoriesLoading && (
                        <div className="p-4 text-center text-xs text-gray-500">
                          No categories found. Create one in the Categories
                          page.
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-red-500 text-xs font-bold ml-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-6">
              <Button
                type="button"
                variant="ghost"
                className="px-8 py-6 rounded-2xl font-bold text-gray-400 hover:bg-gray-800 hover:text-white transition-all cursor-pointer"
                onClick={() => navigate("/admin/courses")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createCourseMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                {createCourseMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Course...
                  </>
                ) : (
                  "Launch Course"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCourse;
