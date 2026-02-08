import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "@/services/authApi";
import { setUser, clearUser } from "@/store/slices/authSlice";

export const useAuthInit = () => {
  const dispatch = useDispatch();

  // Fetch current user with TanStack Query
  const { data, isError, isSuccess, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false, // Don't retry on auth failure
    refetchOnMount: true, // Always refetch on component mount
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  // Update Redux state when query data changes
  useEffect(() => {
    if (isSuccess && data?.user) {
      dispatch(setUser(data.user));
    } else if (isError) {
      dispatch(clearUser());
    }
  }, [isSuccess, isError, data, dispatch]);

  return { isLoading };
};
