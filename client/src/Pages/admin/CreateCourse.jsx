import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

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

  const onSubmit = (data) => {
    createCourseMutation.mutate(data);
  };

  return (
    <div className="md:p-10 p-4 w-full h-screen bg-gray-50">
      <h1 className="text-2xl font-bold">Lets Create a Course</h1>
      <p className="text-gray-500">Fill up the form below to create a course</p>
      <form
        className="flex flex-col gap-3 mt-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Label className="text-lg font-semibold">Title</Label>
        <Input
          {...register("courseTitle")}
          type="text"
          placeholder="Your Course Title"
        />
        <div className="w-1/2 flex flex-col gap-3">
          <Label className="text-lg font-semibold">Category</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black h-40 overflow-y-auto">
                  <SelectItem value="next js">Next js</SelectItem>
                  <SelectItem value="react js">React js</SelectItem>
                  <SelectItem value="node js">Node js</SelectItem>
                  <SelectItem value="javascript"> JavaScript</SelectItem>
                  <SelectItem value="python"> Python</SelectItem>
                  <SelectItem value="java"> Java</SelectItem>
                  <SelectItem value="c++"> C++</SelectItem>
                  <SelectItem value="c#"> C#</SelectItem>
                  <SelectItem value="c"> C</SelectItem>
                  <SelectItem value="html"> HTML</SelectItem>
                  <SelectItem value="css"> CSS</SelectItem>
                  <SelectItem value="bootstrap"> Bootstrap</SelectItem>
                  <SelectItem value="tailwind"> Tailwind</SelectItem>
                  <SelectItem value="material ui"> Material UI</SelectItem>
                  <SelectItem value="ant design"> Ant Design</SelectItem>
                  <SelectItem value="vue js"> Vue js</SelectItem>
                  <SelectItem value="angular"> Angular</SelectItem>
                  <SelectItem value="svelte"> Svelte</SelectItem>
                  <SelectItem value="laravel"> Laravel</SelectItem>
                  <SelectItem value="symfony"> Symfony</SelectItem>
                  <SelectItem value="ruby on rails"> Ruby on Rails</SelectItem>
                  <SelectItem value="django"> Django</SelectItem>
                  <SelectItem value="flask"> Flask</SelectItem>
                  <SelectItem value="express"> Express</SelectItem>
                  <SelectItem value="nest js"> Nest js</SelectItem>
                  <SelectItem value="spring"> Spring</SelectItem>
                  <SelectItem value="hibernate"> Hibernate</SelectItem>
                  <SelectItem value="mybatis"> MyBatis</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={createCourseMutation.isPending}
          className="bg-blue-500 hover:bg-blue-600 text-white mt-5"
        >
          {createCourseMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Course"
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateCourse;
