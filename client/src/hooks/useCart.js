import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getCart, addToCart, removeFromCart, clearCart } from "@/services/cartApi";
import { setCart, addItemToCart, removeItemFromCart, clearCartState } from "@/store/slices/cartSlice";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const useCart = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);

  // 1. Fetch Cart Query
  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!user,
  });

  // Sync Redux with Query Data
  useEffect(() => {
    if (data?.cart?.items) {
      dispatch(setCart(data.cart.items));
    }
  }, [data, dispatch]);

  // 2. Add Mutation
  const addMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cart"]);
      toast.success(data.message || "Added to cart!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    },
  });

  // 3. Remove Mutation
  const removeMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cart"]);
      toast.success("Removed from cart");
    },
    onError: (error) => {
      toast.error("Failed to remove item");
    },
  });

  // 4. Clear Mutation
  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      dispatch(clearCartState());
    },
  });

  return {
    cartItems,
    isLoading,
    addToCart: addMutation.mutate,
    removeFromCart: removeMutation.mutate,
    clearCart: clearMutation.mutate,
    isAdding: addMutation.isPending,
  };
};
