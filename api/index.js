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
import "../server/models/quiz.model.js";
import "../server/models/quizAttempt.model.js";
import "../server/models/review.model.js";

// Validate environment variables
try {
  validateEnv();
} catch (error) {
  console.error("Environment validation failed:", error);
}

// Initiate DB connection at top level (Vercel reuses containers)
const dbPromise = connectDB();

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
  await dbPromise; // Ensure DB is connected before handling the request
  return app(req, res);
};
