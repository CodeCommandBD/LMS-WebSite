import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRouter from "./Routers/user.route.js";
import courseRouter from "./Routers/course.route.js";
dotenv.config();

const app = express();

// CORS configuration for credentials support
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Client URL
    credentials: true, // Allow cookies
  }),
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// routes api
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);

export default app;
