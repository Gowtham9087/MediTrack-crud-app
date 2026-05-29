require("dotenv").config(); // ✅ ensure env vars are loaded

const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Invoice = require("../models/mysql/Invoice");

// ✅ Debug: confirm keys are loaded
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID ? "✅ loaded" : "❌ MISSING");
console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET ? "✅ loaded" : "❌ MISSING");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    console.log("Create order called with amount:", amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100), // convert ₹ to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    console.log("Creating Razorpay order:", options);
    const order = await razorpay.orders.create(options);
    console.log("✅ Order created:", order.id);
    res.json(order);
  } catch (error) {
    console.error("Razorpay order error:", error.message);
    console.error("Full error:", JSON.stringify(error, null, 2));
    res.status(500).json({ message: error.message || "Failed to create payment order" });
  }
});

// POST /api/payment/verify
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      invoiceId,
    } = req.body;

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    await Invoice.update(
      { status: "Paid" },
      { where: { id: invoiceId } }
    );

    console.log("✅ Payment verified and invoice marked as Paid:", invoiceId);
    res.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Razorpay verify error:", error.message);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
});

module.exports = router;