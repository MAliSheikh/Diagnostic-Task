// api/submit.js — Vercel Serverless Function
// Mirrors the Python smtplib/Gmail SMTP approach, implemented in Node.js with Nodemailer.
// Credentials are read from environment variables (never hardcoded).

const nodemailer = require("nodemailer");

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, organisation, communication } = req.body;

  // Basic validation
  if (!name || !organisation || !communication) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Gmail SMTP transporter — same approach as the Python smtplib code
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,      // set in .env or Vercel dashboard
      pass: process.env.PASSWORD,   // 16-char Gmail App Password
    },
  });

  const subject = `SKA Task Submission — ${name}`;

  const body = `
New diagnostic submission received via the Thrive by Design platform.

────────────────────────────────
Name:          ${name}
Organisation:  ${organisation}
Communication: ${communication}
────────────────────────────────

Submitted on: ${new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" })} (PKT)
  `.trim();

  try {
    await transporter.sendMail({
      from: `"SKA Diagnostic" <${process.env.EMAIL}>`,
      to: "hello@sarahkhan.co",
      subject,
      text: body,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email send error:", err.message);
    return res.status(500).json({ error: "Failed to send email" });
  }
};
