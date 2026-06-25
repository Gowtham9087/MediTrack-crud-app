const { DataTypes } = require("sequelize");
const sequelize = require("../../config/mysql");
const Patient = require("./Patient");
const Doctor = require("./Doctor");

const Appointment = sequelize.define(
  "Appointment",
  {
    appointmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    appointmentTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Booked",
    },
  }
  // ✅ Removed indexes block — belongsTo/hasMany auto-create them
);

Patient.hasMany(Appointment, { foreignKey: "patientId" });
Appointment.belongsTo(Patient, { foreignKey: "patientId" });
Doctor.hasMany(Appointment, { foreignKey: "doctorId" });
Appointment.belongsTo(Doctor, { foreignKey: "doctorId" });

module.exports = Appointment;