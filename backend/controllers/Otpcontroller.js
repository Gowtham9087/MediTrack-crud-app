const nodemailer = require("nodemailer");
const twilio = require("twilio");
const User = require("../models/mysql/User");
const Patient = require("../models/mysql/Patient");
const Doctor = require("../models/mysql/Doctor");
const bcrypt = require("bcryptjs");

// In-memory OTP store { email: { otp, expiresAt } }
const otpStore = {};

// ─── Nodemailer Setup ─────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── Twilio Setup ─────────────────────────────────────────────────────────────
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ─── Generate 6-digit OTP ─────────────────────────────────────────────────────
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ─── POST /api/auth/send-otp ──────────────────────────────────────────────────
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Find user in all three tables
    let userRecord = await User.findOne({ where: { email } });
    let phone = null;

    if (!userRecord) {
      const doctor = await Doctor.findOne({ where: { email } });
      if (doctor) {
        userRecord = doctor;
        phone = doctor.contact || doctor.phone || null;
      }
    } else {
      phone = userRecord.phone || null;
    }

    if (!userRecord) {
      const patient = await Patient.findOne({ where: { email } });
      if (patient) {
        userRecord = patient;
        phone = patient.contact || null;
      }
    }

    if (!userRecord) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    otpStore[email] = { otp, expiresAt };

    console.log(`OTP for ${email}: ${otp}`); // debug log

    // ─── Send Email ───────────────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"MediTrack" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "MediTrack - Your OTP Code",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:16px;">
          <h2 style="color:#2563eb;margin:0 0 8px;">MediTrack</h2>
          <p style="color:#64748b;margin:0 0 24px;">Hospital Management System</p>
          <p style="font-size:15px;color:#0f172a;">Your OTP verification code is:</p>
          <div style="font-size:40px;font-weight:900;letter-spacing:12px;color:#2563eb;text-align:center;padding:24px 0;">
            ${otp}
          </div>
          <p style="color:#64748b;font-size:13px;text-align:center;">This code expires in <strong>5 minutes</strong>.</p>
          <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:24px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    // ─── Send SMS if phone exists ─────────────────────────────────────────────
    if (phone) {
      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
      try {
        await twilioClient.messages.create({
          body: `Your MediTrack OTP is: ${otp}. Valid for 5 minutes.`,
          from: process.env.TWILIO_PHONE,
          to: formattedPhone,
        });
      } catch (smsErr) {
        console.error("SMS send failed:", smsErr.message);
        // Don't fail the whole request if SMS fails
      }
    }

    res.json({ success: true, message: "OTP sent to your email" + (phone ? " and phone" : "") });
  } catch (error) {
    console.error("Send OTP error:", error.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ─── POST /api/auth/verify-otp ────────────────────────────────────────────────
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore[email];
    if (!record) return res.status(400).json({ message: "OTP not found. Please request again." });
    if (Date.now() > record.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired. Please request again." });
    }
    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid — mark as verified
    otpStore[email].verified = true;

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error.message);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const record = otpStore[email];
    if (!record || !record.verified) {
      return res.status(403).json({ message: "Please verify OTP first" });
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update in correct table
    let updated = false;

    const user = await User.findOne({ where: { email } });
    if (user) {
      await User.update({ password: hashed }, { where: { email } });
      updated = true;
    }

    if (!updated) {
      const doctor = await Doctor.findOne({ where: { email } });
      if (doctor) {
        await Doctor.update({ password: hashed }, { where: { email } });
        updated = true;
      }
    }

    if (!updated) {
      // For patients, password is their contact number — update contact
      const patient = await Patient.findOne({ where: { email } });
      if (patient) {
        await Patient.update({ contact: newPassword }, { where: { email } });
        updated = true;
      }
    }

    if (!updated) return res.status(404).json({ message: "User not found" });

    delete otpStore[email]; // clear OTP after reset
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error.message);
    res.status(500).json({ message: "Password reset failed" });
  }
};