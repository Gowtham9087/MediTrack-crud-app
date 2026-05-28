const express = require("express");
const router = express.Router();
const { getLiveSchedules } = require("../controllers/scheduleController");
const Doctor = require("../models/mysql/Doctor"); // Import Doctor model directly for quick update
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Get live schedules
router.get("/", authMiddleware, getLiveSchedules);

// NEW: Admin updates doctor availability and timings
router.put("/update-doctor/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { status, workingHours } = req.body;
    
    await Doctor.update(
      { status, workingHours },
      { where: { id: req.params.id } }
    );

    res.status(200).json({ message: "Doctor management logs updated successfully ✔" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update clinician parameters" });
  }
});

module.exports = router;