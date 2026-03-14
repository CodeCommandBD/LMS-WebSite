/**
 * Environment Variable Validator
 * ================================
 * Validates all required environment variables at application startup.
 * If any required variable is missing → server immediately crashes with a
 * clear, helpful error message instead of failing silently at runtime.
 *
 * Usage: import this file BEFORE anything else in index.js
 */

const REQUIRED_VARS = [
  {
    key: "MONGO_URL",
    description: "MongoDB connection string",
    howToGet: "https://cloud.mongodb.com → Connect → Drivers",
  },
  {
    key: "JWT_SECRET",
    description: "JWT signing secret (min 32 chars)",
    howToGet:
      "node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"",
    validate: (val) =>
      val.length >= 32 || "JWT_SECRET must be at least 32 characters long",
  },
  {
    key: "CLOUD_NAME",
    description: "Cloudinary cloud name",
    howToGet: "https://cloudinary.com → Dashboard",
  },
  {
    key: "CLOUD_API_KEY",
    description: "Cloudinary API key",
    howToGet: "https://cloudinary.com → Dashboard",
  },
  {
    key: "CLOUD_SECRET",
    description: "Cloudinary API secret",
    howToGet: "https://cloudinary.com → Dashboard",
  },
  {
    key: "STRIPE_SECRET_KEY",
    description: "Stripe secret key (sk_test_... or sk_live_...)",
    howToGet: "https://dashboard.stripe.com → Developers → API Keys",
    validate: (val) =>
      val.startsWith("sk_") ||
      "STRIPE_SECRET_KEY must start with sk_test_ or sk_live_",
  },
  {
    key: "CLIENT_URL",
    description: "Frontend URL for CORS and redirects",
    howToGet: "http://localhost:5173 for development",
  },
];

// Variables that are strongly recommended but not required to start
const RECOMMENDED_VARS = [
  {
    key: "STRIPE_WEBHOOK_SECRET",
    description: "Stripe webhook signing secret",
    howToGet:
      "stripe listen --forward-to localhost:4000/api/v1/purchase/webhook",
  },
  {
    key: "BACKEND_URL",
    description: "Backend public URL for building asset links",
    howToGet: "http://localhost:4000 for development",
  },
];

export function validateEnv() {
  const errors = [];
  const warnings = [];

  console.log("\n🔍 Validating environment variables...\n");

  // Check required variables
  for (const { key, description, howToGet, validate } of REQUIRED_VARS) {
    const value = process.env[key];

    if (!value || value.trim() === "") {
      errors.push(
        `  ❌ Missing: ${key}\n     What: ${description}\n     How to get: ${howToGet}`,
      );
      continue;
    }

    // Run custom validator if provided
    if (validate) {
      const result = validate(value);
      if (result !== true) {
        errors.push(`  ❌ Invalid: ${key}\n     Reason: ${result}`);
      }
    }
  }

  // Check recommended variables (warn but don't crash)
  for (const { key, description, howToGet } of RECOMMENDED_VARS) {
    const value = process.env[key];
    if (!value || value.trim() === "") {
      warnings.push(
        `  ⚠️  Missing (recommended): ${key}\n     What: ${description}\n     How to get: ${howToGet}`,
      );
    }
  }

  // Log warnings
  if (warnings.length > 0) {
    console.warn(
      "⚠️  Environment Warnings (app will run, but some features may not work):",
    );
    warnings.forEach((w) => console.warn(w));
    console.warn("");
  }

  // Throw error if there are missing variables
  if (errors.length > 0) {
    const errorMsg = `🚨 FATAL: Missing or invalid environment variables!\n${errors.join("\n")}`;
    console.error(errorMsg);
    // In serverless environments like Vercel, we should THROW an error
    // instead of process.exit(1) so it can be handled by the route handler.
    if (process.env.VERCEL) {
      throw new Error(errorMsg);
    } else {
      process.exit(1);
    }
  }

  console.log("✅ All required environment variables are set.\n");
}
