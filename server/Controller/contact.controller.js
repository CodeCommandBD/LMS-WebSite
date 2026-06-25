import { sendMail } from "../utils/email.js";
import Contact from "../models/contact.model.js";
import { sendError } from "../utils/errorHandler.js";

/**
 * Handle contact form submissions.
 * Saves to DB + Sends an email to the admin + an auto-reply to the sender.
 */
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, subject, message) are required.",
      });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email address." });
    }

    // Save to database
    await Contact.create({ name, email, subject, message });

    const adminEmail = process.env.EMAIL_USER;

    // 1. Notify admin about new contact form submission
    const adminHtml = `
      <!DOCTYPE html><html><head><meta charset="UTF-8"/>
      <style>
        body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0;}
        .container{max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);}
        .header{background:linear-gradient(135deg,#2563eb,#7c3aed);padding:32px;text-align:center;}
        .header h1{color:#fff;margin:0;font-size:20px;}
        .body{padding:32px;color:#374151;line-height:1.7;}
        .field{background:#f9fafb;border-left:4px solid #2563eb;padding:12px 16px;border-radius:4px;margin:12px 0;}
        .label{font-size:11px;font-weight:bold;text-transform:uppercase;color:#6b7280;margin-bottom:4px;}
        .value{font-size:15px;color:#111827;}
        .footer{padding:20px 32px;background:#f9fafb;text-align:center;font-size:12px;color:#9ca3af;}
      </style></head>
      <body><div class="container">
        <div class="header"><h1>📬 New Contact Form Submission</h1></div>
        <div class="body">
          <div class="field"><div class="label">Name</div><div class="value">${name}</div></div>
          <div class="field"><div class="label">Email</div><div class="value">${email}</div></div>
          <div class="field"><div class="label">Subject</div><div class="value">${subject}</div></div>
          <div class="field"><div class="label">Message</div><div class="value" style="white-space:pre-wrap">${message}</div></div>
        </div>
        <div class="footer"><p>Submitted on ${new Date().toLocaleString()}</p></div>
      </div></body></html>
    `;

    sendMail({
      to: adminEmail,
      subject: `📬 Contact Form: ${subject}`,
      html: adminHtml,
      text: `New contact from ${name} (${email})\n\nSubject: ${subject}\n\nMessage:\n${message}`,
    }).catch((e) => console.error("Admin email failed:", e.message));

    // 2. Send auto-reply to the user
    const replyHtml = `
      <!DOCTYPE html><html><head><meta charset="UTF-8"/>
      <style>
        body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0;}
        .container{max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);}
        .header{background:linear-gradient(135deg,#2563eb,#7c3aed);padding:32px;text-align:center;}
        .header h1{color:#fff;margin:0;font-size:20px;}
        .body{padding:32px;color:#374151;line-height:1.7;}
        .box{background:#eff6ff;border:2px solid #bfdbfe;border-radius:8px;padding:16px;margin:20px 0;}
        .footer{padding:20px 32px;background:#f9fafb;text-align:center;font-size:12px;color:#9ca3af;}
      </style></head>
      <body><div class="container">
        <div class="header"><h1>✅ We've Received Your Message!</h1></div>
        <div class="body">
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for reaching out to us! We've received your message and will get back to you within <strong>24–48 hours</strong>.</p>
          <div class="box">
            <strong>Your message:</strong>
            <p style="white-space:pre-wrap;margin-top:8px;color:#374151">${message}</p>
          </div>
          <p>If you have an urgent inquiry, please check our <a href="${process.env.CLIENT_URL}/blogs" style="color:#2563eb">help articles</a>.</p>
        </div>
        <div class="footer"><p>© ${new Date().getFullYear()} LMS Platform. All rights reserved.</p></div>
      </div></body></html>
    `;

    sendMail({
      to: email,
      subject: "✅ We received your message — LMS Platform",
      html: replyHtml,
      text: `Hello ${name},\n\nThank you for contacting us! We'll reply within 24–48 hours.\n\nYour message: "${message}"`,
    }).catch((e) => console.error("Auto-reply email failed:", e.message));

    return res.status(200).json({
      success: true,
      message:
        "Your message has been sent successfully. We'll reply within 24–48 hours.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};

// Admin: Get all contact messages (sorted newest first)
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, contacts });
  } catch (error) {
    return sendError(res, error, "contactController");
  }
};

// Admin: Mark a contact message as read
export const markContactRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndUpdate(id, { isRead: true });
    return res.status(200).json({ success: true, message: "Marked as read" });
  } catch (error) {
    return sendError(res, error, "contactController");
  }
};
