import { useQuery } from "@tanstack/react-query";
import { getPublishedCourses } from "@/services/courseApi";

export const usePublishedCourses = () => {
  return useQuery({
    queryKey: ["publishedCourses"],
    queryFn: getPublishedCourses,
  });
};
