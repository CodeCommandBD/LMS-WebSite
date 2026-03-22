import Points from "../models/points.model.js";
import User from "../models/user.model.js";

// 1. Get Global Leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Points.find()
      .sort({ totalPoints: -1 })
      .limit(20)
      .populate("userId", "name profilePicture");

    return res.status(200).json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Current User Points & Rank
export const getMyPoints = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user points
    let points = await Points.findOne({ userId });
    if (!points) {
      points = await Points.create({ userId, totalPoints: 0, history: [] });
    }

    // Get rank
    const rank = await Points.countDocuments({
      totalPoints: { $gt: points.totalPoints },
    }) + 1;

    return res.status(200).json({
      success: true,
      points,
      rank,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
