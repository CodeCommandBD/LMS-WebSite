import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  editCourse,
  getCourseById,
  togglePublishCourse,
} from "@/services/courseApi";
import { editCourseSchema } from "@/schemas/editCourseSchema";

const useEditCourse = () => {
  const { id: courseId } = useParams(); // Get course ID from URL
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [previewThumbnail, setPreviewThumbnail] = useState("");

  // 1. Fetch Course Data
  const {
    data: courseData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId, // Only run if courseId exists
    refetchOnWindowFocus: false,
  });

  const course = courseData?.course;

  // 2. Initialize Form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
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
    // Automatically populate form when 'course' data is available
    values: course
      ? {
          courseTitle: course.courseTitle,
          subTitle: course.subTitle,
          category: course.category,
          description: course.description,
          courseLevel: course.courseLevel,
          price: course.price,
        }
      : undefined,
  });

  // 3. Set Preview Image when course loads
  useEffect(() => {
    if (course?.courseThumbnail) {
      setPreviewThumbnail(course.courseThumbnail);
    }
  }, [course]);

  // Handle Thumbnail Selection & Preview
  const selectThumbnail = (file) => {
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewThumbnail(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // 4. Update Course Mutation
  const editCourseMutation = useMutation({
    mutationFn: ({ courseId, formData }) => editCourse(courseId, formData),
    onSuccess: (data) => {
      toast.success(data.message || "Course edited successfully");
      // Refresh queries to show updated data
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.invalidateQueries({ queryKey: ["instructorCourses"] });
      navigate("/admin/courses");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to edit course");
    },
  });

  // Form Submit Handler
  const onSubmit = (data) => {
    const formData = new FormData();

    // Directly add fields to FormData (Easy to understand)
    formData.append("courseTitle", data.courseTitle);
    formData.append("subTitle", data.subTitle || "");
    formData.append("description", data.description || "");
    formData.append("category", data.category);
    formData.append("courseLevel", data.courseLevel);
    formData.append("price", Number(data.price) || 0);

    // Add thumbnail file (if selected)
    // Check if it's a FileList or an actual file from selectThumbnail
    if (data.courseThumbnail?.[0]) {
      formData.append("courseThumbnail", data.courseThumbnail[0]);
    }

    editCourseMutation.mutate({ courseId, formData });
  };

  // Toggle Publish Course Mutation
  const togglePublishCourseMutaion = useMutation({
    mutationFn: () => togglePublishCourse(courseId),
    onSuccess: (data) => {
      toast.success(data.message || "Course status updated");
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.invalidateQueries({ queryKey: ["instructorCourses"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update course status",
      );
    },
  });

  return {
    register,
    handleSubmit,
    control,
    errors,
    previewThumbnail,
    selectThumbnail,
    onSubmit,
    isLoading,
    isError,
    isPending: editCourseMutation.isPending,
    togglePublishCourseMutaion,
    course,
  };
};

export default useEditCourse;
