import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "@/services/authApi";
import { setUser, clearUser } from "@/store/slices/authSlice";

export const useAuthInit = () => {
  const dispatch = useDispatch();

  // Fetch current user with TanStack Query
  const { isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false, // Don't retry on auth failure
    staleTime: Infinity, // Don't refetch automatically
    refetchOnWindowFocus: false, // Don't refetch on window focus

    // Success callback - runs when API call succeeds
    onSuccess: (data) => {
      if (data?.user) {
        dispatch(setUser(data.user));
      }
    },

    // Error callback - runs when API call fails
    onError: () => {
      dispatch(clearUser());
    },
  });

  return { isLoading };
};
