import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: true,
  darkMode: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleDarkMode } =
  uiSlice.actions;
export default uiSlice.reducer;
