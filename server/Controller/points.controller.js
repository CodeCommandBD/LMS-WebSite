import Points from "../models/points.model.js";
import User from "../models/user.model.js";

// 1. Get Global Leaderboard (Students only)
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Points.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      { $match: { "userDetails.role": "student" } }, // Only show students
      { $sort: { totalPoints: -1 } },
      { $limit: 20 },
      {
        $project: {
          _id: 1,
          totalPoints: 1,
          userId: {
            _id: "$userDetails._id",
            name: "$userDetails.name",
            profilePicture: "$userDetails.profilePicture",
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Current User Points & Rank (Rank within students only)
export const getMyPoints = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user points
    let points = await Points.findOne({ userId });
    if (!points) {
      points = await Points.create({ userId, totalPoints: 0, history: [] });
    }

    // Get rank (Compared ONLY against other students)
    const rankData = await Points.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $match: {
          "user.role": "student",
          totalPoints: { $gt: points.totalPoints },
        },
      },
      { $count: "count" },
    ]);

    const rank = (rankData[0]?.count || 0) + 1;

    return res.status(200).json({
      success: true,
      points,
      rank,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
