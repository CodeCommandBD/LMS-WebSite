import "dotenv/config";
import { validateEnv } from "../server/utils/validateEnv.js";
import connectDB from "../server/utils/db.js";
import app from "../server/app.js";

// Validate environment variables
validateEnv();

// Cache the DB connection promise so it's reused across invocations
let dbConnected = false;

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
  next();
});

// Export the express app as the default handler for Vercel
export default app;
