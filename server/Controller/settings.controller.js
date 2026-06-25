import Settings from "../models/settings.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { sendError } from "../utils/errorHandler.js";

// Get Settings by type
export const getSettings = async (req, res) => {
  try {
    const { type } = req.params;
    const settings = await Settings.findOne({ type });

    if (!settings) {
      return res.status(200).json({
        success: true,
        data: {},
      });
    }

    return res.status(200).json({
      success: true,
      data: settings.data,
    });
  } catch (error) {
    return sendError(res, error, "settingsController");
  }
};

// Update or Create Settings
export const updateSettings = async (req, res) => {
  try {
    const { type } = req.params;
    let { data } = req.body;

    // Parse data if it's sent as a string (common in multipart/form-data)
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e) {
        // use as is
      }
    }

    const settings = await Settings.findOne({ type });

    // Handle File Upload for Branding (Platform logo)
    if (type === "platform" && req.file) {
      if (settings?.data?.logoPublicId) {
        await deleteFromCloudinary(settings.data.logoPublicId);
      }
      const result = await uploadToCloudinary(req.file.path, "lms/branding");
      if (result.success) {
        data = {
          ...data,
          logoUrl: result.url,
          logoPublicId: result.public_id,
        };
      }
    }

    const updatedSettings = await Settings.findOneAndUpdate(
      { type },
      { data },
      { new: true, upsert: true },
    );

    return res.status(200).json({
      success: true,
      message: `${type} settings updated successfully`,
      // BUG-NEW-B FIX: Return the updated settings, not the stale pre-update object.
      settings: updatedSettings,
    });
  } catch (error) {
    return sendError(res, error, "settingsController");
  }
};
