import nodemailer from "nodemailer";

/**
 * Create a nodemailer transporter using environment variables.
 * Supports Gmail, Outlook, SendGrid SMTP, or any custom SMTP.
 *
 * Required .env variables:
 *   EMAIL_HOST     — e.g. "smtp.gmail.com"
 *   EMAIL_PORT     — e.g. 587
 *   EMAIL_USER     — your email address
 *   EMAIL_PASS     — your email password / app password
 *   EMAIL_FROM     — e.g. "LMS Platform <noreply@yourdomain.com>"
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    secure: parseInt(process.env.EMAIL_PORT || "587", 10) === 465, // true for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send a generic email.
 * @param {Object} options
 * @param {string} options.to        — recipient email
 * @param {string} options.subject   — email subject
 * @param {string} options.html      — HTML body
 * @param {string} [options.text]    — plain text fallback
 */
export const sendMail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  const from =
    process.env.EMAIL_FROM || `"LMS Platform" <${process.env.EMAIL_USER}>`;

  const mailOptions = { from, to, subject, html, text };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

// ─────────────────────────────────────────────
// Pre-built email templates
// ─────────────────────────────────────────────

/**
 * Password Reset Email
 */
export const sendPasswordResetEmail = async (to, name, resetUrl) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 40px 32px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 24px; }
        .body { padding: 32px; color: #374151; line-height: 1.7; }
        .btn { display: inline-block; margin: 24px 0; padding: 14px 32px; background: #2563eb; color: #fff !important; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }
        .footer { padding: 24px 32px; background: #f9fafb; text-align: center; font-size: 12px; color: #9ca3af; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; margin: 16px 0; font-size: 14px; color: #92400e; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="body">
          <p>Hello <strong>${name}</strong>,</p>
          <p>We received a request to reset your password for your LMS account. Click the button below to create a new password:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="btn">Reset My Password</a>
          </div>
          <div class="warning">
            ⚠️ This link expires in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email.
          </div>
          <p>If the button doesn't work, copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; color: #6b7280; font-size: 13px;">${resetUrl}</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} LMS Platform. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendMail({
    to,
    subject: "🔐 Reset Your Password — LMS Platform",
    html,
    text: `Hello ${name},\n\nClick the link below to reset your password:\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, ignore this email.`,
  });
};

/**
 * Welcome / Registration Email
 */
export const sendWelcomeEmail = async (to, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 40px 32px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 24px; }
        .body { padding: 32px; color: #374151; line-height: 1.7; }
        .btn { display: inline-block; margin: 24px 0; padding: 14px 32px; background: #2563eb; color: #fff !important; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }
        .footer { padding: 24px 32px; background: #f9fafb; text-align: center; font-size: 12px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to LMS Platform!</h1>
        </div>
        <div class="body">
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your account has been created successfully. We're excited to have you on board!</p>
          <p>You can now:</p>
          <ul>
            <li>Browse hundreds of courses</li>
            <li>Track your learning progress</li>
            <li>Earn certificates on completion</li>
            <li>Interact with instructors via reviews</li>
          </ul>
          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/courses" class="btn">Browse Courses</a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} LMS Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendMail({
    to,
    subject: "🎉 Welcome to LMS Platform — Account Created!",
    html,
    text: `Hello ${name},\n\nYour account has been created successfully. Start learning at ${process.env.CLIENT_URL || "http://localhost:5173"}/courses`,
  });
};

/**
 * Enrollment Confirmation Email
 */
export const sendEnrollmentEmail = async (to, name, courseTitle) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #059669, #2563eb); padding: 40px 32px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 24px; }
        .body { padding: 32px; color: #374151; line-height: 1.7; }
        .course-box { background: #eff6ff; border: 2px solid #bfdbfe; border-radius: 8px; padding: 16px 24px; margin: 20px 0; text-align: center; }
        .course-box strong { font-size: 18px; color: #1d4ed8; }
        .btn { display: inline-block; margin: 24px 0; padding: 14px 32px; background: #059669; color: #fff !important; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }
        .footer { padding: 24px 32px; background: #f9fafb; text-align: center; font-size: 12px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Enrollment Confirmed!</h1>
        </div>
        <div class="body">
          <p>Hello <strong>${name}</strong>,</p>
          <p>You've been successfully enrolled in:</p>
          <div class="course-box">
            <strong>${courseTitle}</strong>
          </div>
          <p>You can start learning right away. Track your progress, complete quizzes, and earn your certificate!</p>
          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/my-learning" class="btn">Go to My Learning</a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} LMS Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendMail({
    to,
    subject: `🎓 Enrolled in "${courseTitle}" — LMS Platform`,
    html,
    text: `Hello ${name},\n\nYou've been enrolled in "${courseTitle}". Start learning at ${process.env.CLIENT_URL}/my-learning`,
  });
};

/**
 * Email Verification Email
 */
export const sendVerificationEmail = async (to, name, verifyUrl) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #7c3aed, #2563eb); padding: 40px 32px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 24px; }
        .body { padding: 32px; color: #374151; line-height: 1.7; }
        .btn { display: inline-block; margin: 24px 0; padding: 14px 32px; background: #7c3aed; color: #fff !important; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }
        .footer { padding: 24px 32px; background: #f9fafb; text-align: center; font-size: 12px; color: #9ca3af; }
        .info { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 12px 16px; border-radius: 4px; margin: 16px 0; font-size: 14px; color: #15803d; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✉️ Verify Your Email Address</h1>
        </div>
        <div class="body">
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for registering! Please verify your email address to activate your LMS account.</p>
          <div style="text-align: center;">
            <a href="${verifyUrl}" class="btn">Verify My Email</a>
          </div>
          <div class="info">
            ✅ This verification link expires in <strong>24 hours</strong>.
          </div>
          <p>If the button doesn't work, copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; color: #6b7280; font-size: 13px;">${verifyUrl}</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} LMS Platform. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendMail({
    to,
    subject: "✉️ Verify Your Email — LMS Platform",
    html,
    text: `Hello ${name},\n\nPlease verify your email by visiting: ${verifyUrl}\n\nThis link expires in 24 hours.`,
  });
};
