import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

export const fetchPlatformSettings = createAsyncThunk(
  "settings/fetchPlatform",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/settings/platform");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch settings");
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    siteName: "EduHub",
    siteLogo: "",
    contactEmail: "support@eduhub.com",
    socialLinks: {},
    footerText: "© 2026 EduHub LMS. All rights reserved.",
    isLoading: false,
    error: null,
  },
  reducers: {
    setSettings: (state, action) => {
      const { siteName, logoUrl, contactEmail, socialLinks, footerText } = action.payload;
      if (siteName) state.siteName = siteName;
      if (logoUrl) state.siteLogo = logoUrl;
      if (contactEmail) state.contactEmail = contactEmail;
      if (socialLinks) state.socialLinks = socialLinks;
      if (footerText) state.footerText = footerText;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatformSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPlatformSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        const data = action.payload.data;
        if (data) {
          state.siteName = data.siteName || state.siteName;
          state.siteLogo = data.logoUrl || state.siteLogo;
          state.contactEmail = data.contactEmail || state.contactEmail;
          state.socialLinks = data.socialLinks || state.socialLinks;
          state.footerText = data.footerText || state.footerText;
        }
      })
      .addCase(fetchPlatformSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
