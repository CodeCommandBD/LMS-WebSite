/**
 * Central Error Handler Utility
 * ==============================
 * BUG-006 Fix: Prevents internal error messages (DB schema, file paths,
 * stack traces) from leaking to clients in production environments.
 *
 * Usage:
 *   import { sendError } from "../utils/errorHandler.js";
 *   } catch (error) {
 *     return sendError(res, error, "functionName");
 *   }
 */

/**
 * Send a safe error response to the client.
 * - Development: returns the real error.message for debugging.
 * - Production:  returns a generic message to prevent information disclosure.
 *
 * @param {object}  res     - Express response object
 * @param {Error}   error   - The caught error
 * @param {string}  context - Optional label (e.g. controller name) for server logs
 * @param {number}  status  - HTTP status code (default: 500)
 */
export const sendError = (res, error, context = "", status = 500) => {
  // Always log the full error server-side for debugging
  const timestamp = new Date().toISOString();
  const label = context ? ` [${context}]` : "";
  console.error(`[${timestamp}][ERROR]${label}:`, error.message);
  if (process.env.NODE_ENV !== "production") {
    console.error(error.stack);
  }

  const clientMessage =
    process.env.NODE_ENV === "production"
      ? "An internal server error occurred. Please try again later."
      : error.message;

  return res.status(status).json({
    success: false,
    message: clientMessage,
  });
};

/**
 * Global Express error-handling middleware.
 * Add this as the LAST middleware in app.js:
 *   app.use(globalErrorMiddleware);
 *
 * Catches errors passed via next(error).
 */
export const globalErrorMiddleware = (err, req, res, next) => {
  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(400).json({
      success: false,
      message: `Duplicate value for ${field}. Please use a different value.`,
    });
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token. Please login again.",
    });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please login again.",
    });
  }

  // Default: generic 500
  sendError(res, err, req.path);
};
