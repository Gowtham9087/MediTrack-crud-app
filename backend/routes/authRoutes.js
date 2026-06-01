const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");
const { sendOTP, verifyOTP, resetPassword } = require("../controllers/otpController");

router.post("/login", login);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

module.exports = router;