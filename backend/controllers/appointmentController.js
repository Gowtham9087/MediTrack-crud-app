const bcrypt = require("bcryptjs");
const sequelize = require("../config/mysql");
const Patient = require("../models/mysql/Patient");
const Doctor = require("../models/mysql/Doctor");
const Appointment = require("../models/mysql/Appointment");
const ActivityLog = require("../models/mongo/ActivityLog");

exports.addDoctor = async (req, res) => {
  try {
    const { name, specialization, email, phone } = req.body;

    // Hash phone number as default password
    const hashedPassword = await bcrypt.hash(phone, 10);

    const doctor = await Doctor.create({
      name,
      specialization,
      email,
      phone,
      password: hashedPassword,
      role: "doctor",
    });

    await ActivityLog.create({
      action: "DOCTOR_ADDED",
      userRole: req.user.role,
      userId: req.user.id,
      details: `Doctor ${doctor.name} was added`,
    });

    res.status(201).json(doctor);
  } catch (error) {
    console.error("Add doctor error:", error);
    res.status(400).json({ message: "Doctor already exists or invalid data" });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    await doctor.update(req.body);

    await ActivityLog.create({
      action: "DOCTOR_UPDATED",
      userRole: req.user.role,
      userId: req.user.id,
      details: `Doctor ${doctor.name} was updated`,
    });

    res.json({ message: "Doctor updated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Doctor update failed" });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const appointmentCount = await Appointment.count({
      where: { doctorId: req.params.id },
    });

    if (appointmentCount > 0) {
      return res.status(400).json({
        message: "Cannot delete doctor because appointments are linked",
      });
    }

    await doctor.destroy();

    await ActivityLog.create({
      action: "DOCTOR_DELETED",
      userRole: req.user.role,
      userId: req.user.id,
      details: `Doctor ${doctor.name} was deleted`,
    });

    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Doctor delete failed" });
  }
};

exports.bookAppointment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { patientId, doctorId, appointmentDate, appointmentTime, reason } = req.body;

    const patient = await Patient.findByPk(patientId);
    const doctor = await Doctor.findByPk(doctorId);

    if (!patient || !doctor) {
      await transaction.rollback();
      return res.status(404).json({ message: "Patient or doctor not found" });
    }

    const existingAppointment = await Appointment.findOne({
      where: { doctorId, appointmentDate, appointmentTime },
    });

    if (existingAppointment) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Doctor already has appointment at this time",
      });
    }

    const appointment = await Appointment.create(
      { patientId, doctorId, appointmentDate, appointmentTime, reason, status: "Booked" },
      { transaction }
    );

    await ActivityLog.create({
      action: "APPOINTMENT_BOOKED",
      userRole: req.user.role,
      userId: req.user.id,
      details: `Appointment booked for ${patient.name} with Dr. ${doctor.name}`,
    });

    await transaction.commit();
    res.status(201).json(appointment);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Appointment booking failed" });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: Patient, attributes: ["id", "name", "email", "contact", "problem"] },
        { model: Doctor, attributes: ["id", "name", "specialization", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    await appointment.update(req.body);

    await ActivityLog.create({
      action: "APPOINTMENT_UPDATED",
      userRole: req.user.role,
      userId: req.user.id,
      details: "Appointment details were updated",
    });

    res.json({ message: "Appointment updated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Appointment update failed" });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = status;
    await appointment.save();

    await ActivityLog.create({
      action: "APPOINTMENT_STATUS_UPDATED",
      userRole: req.user.role,
      userId: req.user.id,
      details: `Appointment status updated to ${status}`,
    });

    res.json({ message: "Appointment status updated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Status update failed" });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    await appointment.destroy();

    await ActivityLog.create({
      action: "APPOINTMENT_DELETED",
      userRole: req.user.role,
      userId: req.user.id,
      details: "Appointment was deleted",
    });

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};