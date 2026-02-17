import { useQuery } from "@tanstack/react-query";
import { getCourseById } from "@/services/courseApi";
import { useParams } from "react-router-dom";

export const useCourseDetails = () => {
  const { id: courseId } = useParams();

  const {
    data: courseData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
  });

  return {
    course: courseData?.course,
    isLoading,
    isError,
    error,
  };
};
