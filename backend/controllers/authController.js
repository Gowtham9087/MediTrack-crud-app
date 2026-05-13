const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/mysql/User");
const Patient = require("../models/mysql/Patient");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. First check admin/user from Users table
    const user = await User.findOne({
      where: { email },
    });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid password",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      return res.json({
        token,
        role: user.role,
        user: {
          name: user.name,
          email: user.email,
        },
      });
    }

    // 2. If not found in Users table, check Patients table
    const patient = await Patient.findOne({
      where: { email },
    });

    if (!patient) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    // Patient password = mobile/contact number
    if (patient.contact !== password) {
      return res.status(400).json({
        message: "Invalid mobile number",
      });
    }

    const token = jwt.sign(
      {
        id: patient.id,
        role: "user",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      role: "user",
      user: {
        name: patient.name,
        email: patient.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
    });
  }
};