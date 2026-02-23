/**
 * Secret Generator Utility
 * =========================
 * Run this script to generate cryptographically strong secrets for your .env file.
 *
 * Usage:
 *   node utils/generateSecret.js
 *
 * Output: New secrets to copy into your .env file
 */

import crypto from "crypto";

const generate = (bytes = 64) => crypto.randomBytes(bytes).toString("hex");

console.log("\n🔐 Generated Secrets — Copy these into your .env file:\n");
console.log("━".repeat(60));

console.log("\n# JWT Secret (256-bit)");
console.log(`JWT_SECRET=${generate(32)}`);

console.log("\n# Additional Encryption Key (optional, for future use)");
console.log(`ENCRYPTION_KEY=${generate(32)}`);

console.log("\n# Session Secret (optional)");
console.log(`SESSION_SECRET=${generate(24)}`);

console.log("\n" + "━".repeat(60));
console.log("\n⚠️  These are ONE-TIME generated values.");
console.log(
  "   Store them securely. Changing JWT_SECRET will log out all users.\n",
);
