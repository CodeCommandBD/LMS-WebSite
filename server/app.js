import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRouter from "./Routers/user.route.js";
import courseRouter from "./Routers/course.route.js";
import purchaseRouter from "./Routers/purchase.route.js";
import courseProgressRouter from "./Routers/courseProgress.route.js";
import quizRouter from "./Routers/quiz.route.js";
dotenv.config();

const app = express();

// CORS configuration for credentials support
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
);

// Specific route for Stripe Webhook to handle raw body
app.post("/api/v1/purchase/webhook", express.raw({ type: "application/json" }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// routes api
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/progress", courseProgressRouter);
app.use("/api/v1/quiz", quizRouter);

export default app;
