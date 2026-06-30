const express = require("express");
const router = express.Router();
const Prescription = require("../models/mysql/Prescription");
const Patient = require("../models/mysql/Patient");
const Doctor = require("../models/mysql/Doctor");
const Appointment = require("../models/mysql/Appointment"); // ⬅️ NEW
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/prescriptions — Doctor submits a prescription
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { patientId, doctorId, appointmentId, medicines } = req.body;

    if (!patientId || !doctorId || !medicines || medicines.length === 0) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    console.log("📥 Incoming prescription payload:", { patientId, doctorId, appointmentId });

    const prescription = await Prescription.create({
      patientId,
      doctorId,
      appointmentId: appointmentId || null,
      medicines,
    });

    console.log("✅ Prescription created with id:", prescription.id);

    // mark the linked appointment as Completed once prescribed
    if (appointmentId) {
      const [affectedRows] = await Appointment.update(
        { status: "Completed" },
        { where: { id: appointmentId } }
      );
      console.log(`🔄 Appointment update — id: ${appointmentId}, rows affected: ${affectedRows}`);
    } else {
      console.log("⚠️ No appointmentId provided — skipping status update.");
    }

    res.status(201).json({ message: "Prescription saved successfully!", prescription });
  } catch (error) {
    console.error("Error saving prescription:", error);
    res.status(500).json({ message: "Failed to save prescription." });
  }
});

// GET /api/prescriptions — Returns prescriptions scoped to the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    let where = {};
    if (role === "user")   where.patientId = userId; // ✅ "user" not "patient"
    if (role === "doctor") where.doctorId  = userId;
    // admin gets everything (no filter)

    const prescriptions = await Prescription.findAll({
      where,
      include: [
        { model: Patient, attributes: ["id", "name", "email"] },
        { model: Doctor,  attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ message: "Failed to fetch prescriptions." });
  }
});

module.exports = router;