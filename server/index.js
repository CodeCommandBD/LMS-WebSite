import "dotenv/config";
import { validateEnv } from "./utils/validateEnv.js";
import connectDB from "./utils/db.js";
import app from "./app.js";

// ✅ Validate all required environment variables FIRST
// Server will crash immediately with a clear error if anything is missing
validateEnv();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  connectDB();
});
