import "dotenv/config";
import { validateEnv } from "./utils/validateEnv.js";
import connectDB from "./utils/db.js";
import app from "./app.js";

// ✅ Validate all required environment variables FIRST
// Server will crash immediately with a clear error if anything is missing
import http from "http";
import { initSocket } from "./utils/socket.js";

validateEnv();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  connectDB();
});
