import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "EduHub",
    },
    siteLogo: {
      type: String,
      default: "",
    },
    siteLogoPublicId: {
       type: String,
       default: "",
    },
    siteFavicon: {
      type: String,
      default: "",
    },
    contactEmail: {
      type: String,
      default: "support@eduhub.com",
    },
    socialLinks: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
    footerText: {
       type: String,
       default: "Built with passion by EduHub Team",
    }
  },
  { timestamps: true },
);

// We only ever need one document for settings
const Setting = mongoose.models.Setting || mongoose.model("Setting", settingSchema);

export default Setting;
