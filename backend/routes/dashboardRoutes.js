const express = require("express");
const router = express.Router();

const { getDashboardStats, getReportAnalytics } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Your existing dashboard stats route (maps to /api/dashboard)
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getDashboardStats
);

// NEW: Your reports metrics analytical route (maps to /api/dashboard/analytics)
router.get(
  "/analytics",
  authMiddleware,
  roleMiddleware("admin"),
  getReportAnalytics
);

module.exports = router;