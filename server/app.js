import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xssClean from "xss-clean";
import rateLimit from "express-rate-limit";
import userRouter from "./Routers/user.route.js";
import courseRouter from "./Routers/course.route.js";
import purchaseRouter from "./Routers/purchase.route.js";
import courseProgressRouter from "./Routers/courseProgress.route.js";
import quizRouter from "./Routers/quiz.route.js";
import reviewRouter from "./Routers/review.route.js";
import categoryRouter from "./Routers/category.route.js";
import path from "path";
dotenv.config();

const app = express();

// path
const _dirname = path.resolve();

// 1. HTTP Security Headers
app.use(helmet());

// 2. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Specific limiter for authentication routes (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Only 10 login/register attempts per 15 mins
  message: {
    success: false,
    message:
      "Too many authentication attempts, please try again after 15 minutes",
  },
});

app.use("/api/", limiter);
app.use("/api/v1/users/login", authLimiter);
app.use("/api/v1/users/register", authLimiter);
// 3. Express 5 compatibility shim (Required for express-mongo-sanitize & xss-clean)
app.use((req, res, next) => {
  if (req.query) {
    Object.defineProperty(req, "query", {
      value: { ...req.query },
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
  if (req.params) {
    Object.defineProperty(req, "params", {
      value: { ...req.params },
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
  next();
});

// 4. Input Sanitization
// Specific route for Stripe Webhook to handle raw body (MUST BE BEFORE express.json())
app.post("/api/v1/purchase/webhook", express.raw({ type: "application/json" }));

app.use(express.json({ limit: "1mb" })); // Protection against large payloads
app.use(mongoSanitize()); // Protection against NoSQL Injection
app.use(xssClean()); // Protection against XSS attacks

// CORS configuration — driven by environment variables
// Development: CLIENT_URL=http://localhost:5173
// Production: CLIENT_URL=https://your-deployed-frontend.com
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean); // remove undefined/empty values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked: ${origin} is not allowed`));
    },
    credentials: true,
  }),
);

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json()); // Replaced by express.json() above for security
app.use(cookieParser());

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// routes api
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/progress", courseProgressRouter);
app.use("/api/v1/quiz", quizRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/categories", categoryRouter);

// Static files & Catch-all route (MUST be at the end)
app.use(express.static(path.join(_dirname, "client", "dist")));
app.get(/.*/, (_, res) => {
  res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
});

export default app;
