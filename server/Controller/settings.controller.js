import Settings from "../models/settings.model.js";

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
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update or Create Settings
export const updateSettings = async (req, res) => {
  try {
    const { type } = req.params;
    const { data } = req.body;

    const settings = await Settings.findOneAndUpdate(
      { type },
      { data },
      { new: true, upsert: true },
    );

    return res.status(200).json({
      success: true,
      message: `${type} settings updated successfully`,
      settings,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
