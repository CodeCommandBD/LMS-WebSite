import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      enum: ["general", "adsense", "social"],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true },
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
