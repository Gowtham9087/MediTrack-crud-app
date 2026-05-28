const express = require("express");
const router = express.Router();

const {
  addDoctor,
  getDoctors,
  updateDoctor,
  deleteDoctor,
  bookAppointment,
  getAppointments,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} = require("../controllers/appointmentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// --- DOCTOR ROUTES ---
router.post("/doctors", authMiddleware, roleMiddleware("admin"), addDoctor);
router.get("/doctors", authMiddleware, getDoctors);
router.put("/doctors/:id", authMiddleware, roleMiddleware("admin"), updateDoctor);
router.delete("/doctors/:id", authMiddleware, roleMiddleware("admin"), deleteDoctor);

// --- APPOINTMENT ROUTES ---
router.post("/", authMiddleware, bookAppointment);
router.get("/", authMiddleware, getAppointments);
router.put("/:id", authMiddleware, roleMiddleware("admin"), updateAppointment);
router.put("/:id/status", authMiddleware, roleMiddleware("admin"), updateAppointmentStatus);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteAppointment);

module.exports = router;