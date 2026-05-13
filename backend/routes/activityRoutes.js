const express = require("express");
const router = express.Router();

const { getActivityLogs } = require("../controllers/activityController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, roleMiddleware("admin"), getActivityLogs);

module.exports = router;