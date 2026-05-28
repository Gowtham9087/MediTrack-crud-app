const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/mysql/User");
const Patient = require("../models/mysql/Patient");
const Doctor = require("../models/mysql/Doctor");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check Users table (admin)
    const user = await User.findOne({ where: { email } });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid password" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        role: user.role,
        userId: user.id,                                    // ✅ added
        user: { name: user.name, email: user.email },
      });
    }

    // 2. Check Doctors table
    const doctor = await Doctor.findOne({ where: { email } });
    if (doctor) {
      if (!doctor.password) {
        return res.status(401).json({ message: "Password not set. Contact admin." });
      }

      const isMatch = await bcrypt.compare(password, doctor.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid password" });

      const token = jwt.sign(
        { id: doctor.id, role: "doctor" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        role: "doctor",
        userId: doctor.id,                                  // ✅ added
        user: { name: doctor.name, email: doctor.email },
      });
    }

    // 3. Check Patients table
    const patient = await Patient.findOne({ where: { email } });
    if (!patient) return res.status(400).json({ message: "Invalid email" });

    if (patient.contact !== password) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    const token = jwt.sign(
      { id: patient.id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      role: "user",
      userId: patient.id,                                   // ✅ added
      user: { name: patient.name, email: patient.email },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};