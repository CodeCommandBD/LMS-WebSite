import Setting from "../models/setting.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

export const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    return res.status(200).json({ success: true, settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { siteName, contactEmail, facebook, twitter, linkedin, youtube, footerText } = req.body;
    let settings = await Setting.findOne();
    if (!settings) settings = await Setting.create({});

    const updateData = {
      siteName,
      contactEmail,
      footerText,
      socialLinks: { facebook, twitter, linkedin, youtube }
    };

    // Handle Logo Upload
    if (req.file) {
      if (settings.siteLogoPublicId) {
        await deleteFromCloudinary(settings.siteLogoPublicId);
      }
      const result = await uploadToCloudinary(req.file.path, "lms/branding");
      if (result.success) {
        updateData.siteLogo = result.url;
        updateData.siteLogoPublicId = result.public_id;
      }
    }

    const updatedSettings = await Setting.findOneAndUpdate({}, updateData, { new: true });

    return res.status(200).json({
      success: true,
      settings: updatedSettings,
      message: "Platform settings updated successfully"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
