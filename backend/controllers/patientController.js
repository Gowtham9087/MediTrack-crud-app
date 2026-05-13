const Patient = require("../models/mysql/Patient");
const ActivityLog = require("../models/mongo/ActivityLog");
const Appointment = require("../models/mysql/Appointment");

exports.addPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);

    await ActivityLog.create({
      action: "PATIENT_ADDED",
      userRole: req.user.role,
      userId: req.user.id,
      details: `Patient ${patient.name} was added`,
    });

    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: "Patient already exists or invalid data" });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};

exports.getPatientByEmail = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      where: { email: req.params.email },
    });

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patient" });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    await Patient.update(req.body, {
      where: { id: req.params.id },
    });

    await ActivityLog.create({
      action: "PATIENT_UPDATED",
      userRole: req.user.role,
      userId: req.user.id,
      details: `Patient ${patient.name} was updated`,
    });

    res.json({ message: "Patient updated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Update failed" });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const appointmentCount = await Appointment.count({
      where: {
        patientId: req.params.id,
      },
    });

    if (appointmentCount > 0) {
      return res.status(400).json({
        message:
          "Cannot delete patient because appointments are linked to this patient",
      });
    }

    await Patient.destroy({
      where: { id: req.params.id },
    });

    await ActivityLog.create({
      action: "PATIENT_DELETED",
      userRole: req.user.role,
      userId: req.user.id,
      details: `Patient ${patient.name} was deleted`,
    });

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};