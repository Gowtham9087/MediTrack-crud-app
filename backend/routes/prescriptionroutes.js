const express = require("express");
const router = express.Router();
const Prescription = require("../models/mysql/Prescription");
const Patient = require("../models/mysql/Patient");
const Doctor = require("../models/mysql/Doctor");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/prescriptions — Doctor submits a prescription
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { patientId, doctorId, appointmentId, medicines } = req.body;

    if (!patientId || !doctorId || !medicines || medicines.length === 0) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const prescription = await Prescription.create({
      patientId,
      doctorId,
      appointmentId: appointmentId || null,
      medicines,
    });

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