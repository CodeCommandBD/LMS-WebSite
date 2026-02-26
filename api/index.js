import app from "../server/app.js";
import connectDB from "../server/utils/db.js";

// Vercel serverless function entry point
// Ensure DB connection is initiated
connectDB();

// Export the express app as the default handler
export default app;
