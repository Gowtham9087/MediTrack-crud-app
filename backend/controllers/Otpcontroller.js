const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const User = require("../models/mysql/User");
const Patient = require("../models/mysql/Patient");
const Doctor = require("../models/mysql/Doctor");

// In-memory OTP store { email: { otp, expiresAt, verified } }
const otpStore = {};

// ─── Nodemailer Setup ─────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ─── POST /api/send-otp ───────────────────────────────────────────────────────
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Check all tables
    const user = await User.findOne({ where: { email } });
    const doctor = await Doctor.findOne({ where: { email } });
    const patient = await Patient.findOne({ where: { email } });

    if (!user && !doctor && !patient) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const otp = generateOTP();
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000, verified: false };

    console.log(`OTP for ${email}: ${otp}`);

    await transporter.sendMail({
      from: `"MediTrack" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "MediTrack - Your OTP Verification Code",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:16px;background:#ffffff;">
          <div style="text-align:center;margin-bottom:24px;">
            <h2 style="color:#2563eb;margin:0;font-size:28px;font-weight:900;">MediTrack</h2>
            <p style="color:#64748b;margin:4px 0 0;font-size:13px;">Hospital Management System</p>
          </div>
          <div style="background:#f8fafc;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
            <p style="color:#0f172a;font-size:15px;margin:0 0 16px;font-weight:600;">Your OTP Verification Code</p>
            <div style="font-size:42px;font-weight:900;letter-spacing:14px;color:#2563eb;padding:8px 0;">
              ${otp}
            </div>
            <p style="color:#64748b;font-size:13px;margin:16px 0 0;">This code expires in <strong>5 minutes</strong></p>
          </div>
          <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
            If you did not request this, please ignore this email.<br/>
            Do not share this code with anyone.
          </p>
        </div>
      `,
    });

    res.json({ success: true, message: "OTP sent to your email successfully" });
  } catch (error) {
    console.error("Send OTP error:", error.message);
    res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
};

// ─── POST /api/verify-otp ─────────────────────────────────────────────────────
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore[email];
    if (!record) return res.status(400).json({ message: "OTP not found. Please request a new one." });
    if (Date.now() > record.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }
    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    otpStore[email].verified = true;
    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error.message);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// ─── POST /api/reset-password ─────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const record = otpStore[email];
    if (!record || !record.verified) {
      return res.status(403).json({ message: "Please verify OTP first" });
    }

    let updated = false;

    // Admin or Doctor → hash password
    const user = await User.findOne({ where: { email } });
    if (user) {
      const hashed = await bcrypt.hash(newPassword, 10);
      await User.update({ password: hashed }, { where: { email } });
      updated = true;
    }

    if (!updated) {
      const doctor = await Doctor.findOne({ where: { email } });
      if (doctor) {
        const hashed = await bcrypt.hash(newPassword, 10);
        await Doctor.update({ password: hashed }, { where: { email } });
        updated = true;
      }
    }

    // Patient → password is their contact number
    if (!updated) {
      const patient = await Patient.findOne({ where: { email } });
      if (patient) {
        await Patient.update({ contact: newPassword }, { where: { email } });
        updated = true;
      }
    }

    if (!updated) return res.status(404).json({ message: "User not found" });

    delete otpStore[email];
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error.message);
    res.status(500).json({ message: "Password reset failed" });
  }
};