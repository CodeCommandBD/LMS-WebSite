import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  isLoading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
    },
    addItemToCart: (state, action) => {
      // action.payload is the course object
      const exists = state.items.find((item) => item.courseId?._id === action.payload._id);
      if (!exists) {
        state.items.push({ courseId: action.payload, addedAt: new Date().toISOString() });
      }
    },
    removeItemFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.courseId?._id !== action.payload);
    },
    setCartLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearCartState: (state) => {
      state.items = [];
    },
  },
});

export const {
  setCart,
  addItemToCart,
  removeItemFromCart,
  setCartLoading,
  clearCartState,
} = cartSlice.actions;

export default cartSlice.reducer;
