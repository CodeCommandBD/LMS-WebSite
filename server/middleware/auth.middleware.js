import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user is still active and not banned
    const user = await User.findById(decoded.id).select("isBanned role");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists.",
      });
    }
    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Please contact support.",
      });
    }

    // Attach user data to request
    // BUG-013 FIX: Use role from DB (user.role), NOT from JWT (decoded.role).
    // This ensures role changes by an admin take effect immediately,
    // rather than waiting up to 48h for the old token to expire.
    req.user = {
      id: decoded.id,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token. Please login again.",
    });
  }
};
