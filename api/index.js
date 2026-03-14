import app from "../server/app.js";
import connectDB from "../server/utils/db.js";
import { validateEnv } from "../server/utils/validateEnv.js";

// Import all models to ensure they are registered in the serverless environment
import "../server/models/user.model.js";
import "../server/models/course.model.js";
import "../server/models/lecture.model.js";
import "../server/models/category.model.js";
import "../server/models/courseProgress.model.js";
import "../server/models/purchase.model.js";
import "../server/models/blog.model.js";
import "../server/models/blogComment.model.js";
import "../server/models/certificate.model.js";
import "../server/models/settings.model.js";
import "../server/models/quiz.model.js";
import "../server/models/quizAttempt.model.js";
import "../server/models/review.model.js";

// Initiate DB connection and validation
let validationError = null;
try {
  validateEnv();
} catch (error) {
  validationError = error.message;
  console.error("Environment validation failed:", error);
}

const dbPromise = connectDB().catch((err) => {
  console.error("Initial DB connection failed:", err);
  return null;
});

// Global error handler for the serverless function
app.use((err, req, res, next) => {
  console.error("Vercel Function Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error in Vercel Function",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Export the express app as the default handler
export default async (req, res) => {
  // 1. Check for Environment Validation Error
  if (validationError) {
    return res.status(500).json({
      success: false,
      message: "Vercel Configuration Error: Missing Environment Variables",
      error: validationError,
      suggestion: "Please check your Vercel Project Settings -> Environment Variables.",
    });
  }

  // 2. Wait for DB Connection and handle failure
  try {
    const db = await dbPromise;
    if (!db && dbPromise !== null) {
        // This handles cases where connectDB didn't throw but returned nothing
    }
  } catch (dbError) {
    return res.status(500).json({
      success: false,
      message: "Vercel Database Connection Error",
      error: dbError.message,
      suggestion: "Check if MONGO_URL is correct and MongoDB Atlas allows Vercel IPs (0.0.0.0/0).",
    });
  }

  // 3. Forward to Express App
  return app(req, res);
};
