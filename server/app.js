import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xssClean from "xss-clean";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import { globalErrorMiddleware } from "./utils/errorHandler.js";
import userRouter from "./Routers/user.route.js";
import courseRouter from "./Routers/course.route.js";
import purchaseRouter from "./Routers/purchase.route.js";
import courseProgressRouter from "./Routers/courseProgress.route.js";
import quizRouter from "./Routers/quiz.route.js";
import reviewRouter from "./Routers/review.route.js";
import categoryRouter from "./Routers/category.route.js";
import blogRouter from "./Routers/blog.route.js";
import settingsRouter from "./Routers/settings.route.js";
import statsRouter from "./Routers/stats.route.js";
import contactRouter from "./Routers/contact.route.js";
import certificateRouter from "./Routers/certificate.route.js";
import notificationRouter from "./Routers/notification.route.js";
import qaRouter from "./Routers/qa.route.js";
import notesRouter from "./Routers/notes.route.js";
import pointsRouter from "./Routers/points.route.js";
import blogCommentRouter from "./Routers/blogComment.route.js";
import cartRouter from "./Routers/cart.route.js";
import couponRouter from "./Routers/coupon.route.js";
import forumRouter from "./Routers/forum.route.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Extra strict limiter for password reset
const sensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Only 5 attempts per hour
  message: {
    success: false,
    message: "Too many attempts, please try again after an hour",
  },
});

app.use("/api/", limiter);
app.use("/api/v1/users/login", authLimiter);
app.use("/api/v1/users/register", authLimiter);
app.use("/api/v1/users/forgot-password", sensitiveLimiter);
app.use("/api/v1/users/reset-password", sensitiveLimiter);
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
app.use(hpp()); // Protection against HTTP Parameter Pollution attacks

// CORS configuration — driven by environment variables
// Development: CLIENT_URL=http://localhost:5173
// Production: CLIENT_URL=https://your-deployed-frontend.com
//
// BUG-007 FIX: Removed wildcard *.vercel.app rule.
// Previously ANY .vercel.app subdomain was allowed, meaning an attacker
// could host a malicious site on Vercel and bypass CORS.
// Now only explicitly listed origins are permitted.
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,          // e.g. https://your-app.vercel.app
  process.env.ALLOWED_ORIGIN_2,    // optional second frontend domain
].filter(Boolean);

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
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/settings", settingsRouter);
app.use("/api/v1/stats", statsRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/certificates", certificateRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/qa", qaRouter);
app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/points", pointsRouter);
app.use("/api/v1/blog-comments", blogCommentRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/coupons", couponRouter);
app.use("/api/v1/forum", forumRouter);

// Static files & Catch-all route (MUST be at the end)
// In local dev: serves from client/dist after running the build
// In Vercel: static files are served by Vercel CDN, this code is not used
app.use(express.static(path.join(__dirname, "..", "client", "dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});

// ─── Global Error Handler (MUST be last) ────────────────────────────────────
// BUG-006 FIX: Catches errors passed via next(error).
// Handles Mongoose validation, duplicate key, cast errors, and JWT errors
// with user-friendly messages. In production, never leaks internal details.
app.use(globalErrorMiddleware);

export default app;
