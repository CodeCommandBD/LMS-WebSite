import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/RichTextEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editCourseSchema } from "@/schemas/editCourseSchema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { editCourse, getCourseById } from "@/services/courseApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const CourseTab = () => {
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const params = useParams();
  const courseId = params.id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch course data by ID
  const {
    data: courseData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
  });

  const course = courseData?.course;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(editCourseSchema),
    defaultValues: {
      courseTitle: "",
      subTitle: "",
      category: "",
      description: "",
      courseLevel: "",
      price: 0,
    },
  });

  // Populate form when course data arrives
  React.useEffect(() => {
    if (course) {
      reset({
        courseTitle: course.courseTitle || "",
        subTitle: course.subTitle || "",
        category: course.category || "",
        description: course.description || "",
        courseLevel: course.courseLevel || "",
        price: course.price || 0,
      });
      setPreviewThumbnail(course.courseThumbnail || "");
    }
  }, [course, reset]);

  const selectThumbnail = (file) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error("File size should be less than 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const editCourseMutation = useMutation({
    mutationFn: ({ courseId, formData }) => editCourse(courseId, formData),
    onSuccess: () => {
      toast.success("Course edited successfully");
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.invalidateQueries({ queryKey: ["instructorCourses"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("courseTitle", data.courseTitle);
    formData.append("subTitle", data.subTitle);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("courseLevel", data.courseLevel);
    formData.append("price", data.price);
    if (data.courseThumbnail && data.courseThumbnail[0]) {
      formData.append("courseThumbnail", data.courseThumbnail[0]);
    }
    editCourseMutation.mutate({ courseId, formData });
  };

  if (isLoading || editCourseMutation.isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>Failed to load course data.</p>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader className="flex md:flex-row flex-col items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Course Information
            </CardTitle>
            <CardDescription>
              <p className="text-lg font-semibold">
                Update your course information
              </p>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button className="cursor-pointer">Unpublish</Button>
            <Button variant="destructive" className="text-white cursor-pointer">
              Remove Course
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Label>Title</Label>
                <Input
                  {...register("courseTitle")}
                  type="text"
                  placeholder="Enter course title"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label>Subtitle</Label>
                <Input
                  {...register("subTitle")}
                  type="text"
                  placeholder="Ex. Complete Web Development Bootcamp"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label>Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                <div className="flex flex-col gap-3">
                  <Label>Category</Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web-development">
                            Web Development
                          </SelectItem>
                          <SelectItem value="mobile-development">
                            Mobile Development
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label>Course Level</Label>
                  <Controller
                    name="courseLevel"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select course level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label>Price</Label>
                  <Input
                    {...register("price")}
                    type="number"
                    placeholder="200"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Label>Course Thumbnail</Label>
                <Input
                  {...register("courseThumbnail")}
                  onChange={(e) => {
                    register("courseThumbnail").onChange(e);
                    if (e.target.files && e.target.files[0]) {
                      selectThumbnail(e.target.files[0]);
                    }
                  }}
                  accept="image/*"
                  className="cursor-pointer w-fit"
                  placeholder="Upload course thumbnail"
                  type="file"
                  id="courseThumbnail"
                />
                {previewThumbnail && (
                  <img
                    src={previewThumbnail}
                    alt="Course Thumbnail"
                    className="w-[200px] h-[200px] my-2 object-cover rounded-md"
                  />
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Link to="/admin/courses">
                <Button
                  variant="destructive"
                  className="cursor-pointer text-white"
                >
                  Cancel
                </Button>
              </Link>
              <Button className="cursor-pointer text-white">
                Update Course
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseTab;
