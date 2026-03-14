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
  // If validation failed, return a helpful error
  if (validationError) {
    return res.status(500).json({
      success: false,
      message: "Vercel Environment Configuration Error",
      error: validationError,
      action: "Please add the missing variables to the Vercel Dashboard Settings.",
    });
  }

  await dbPromise; // Ensure DB is connected before handling the request
  return app(req, res);
};
