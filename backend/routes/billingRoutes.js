const express = require("express");
const router = express.Router();

const {
  createInvoice,
  getInvoices,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/billingController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ⚡️ FIXED: Removed roleMiddleware("admin") so users can fetch bills
router.get("/", authMiddleware, getInvoices);

// Keep these protected for admins only
router.post("/", authMiddleware, roleMiddleware("admin"), createInvoice);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateInvoice);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteInvoice);

module.exports = router;