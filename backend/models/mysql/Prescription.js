const { DataTypes } = require("sequelize");
const sequelize = require("../../config/mysql");
const Patient = require("./Patient");
const Doctor = require("./Doctor");

const Prescription = sequelize.define("Prescription", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Patient, key: "id" },
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Doctor, key: "id" },
  },
  appointmentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // Store the full medicines array as JSON
  medicines: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
}, {
  tableName: "Prescriptions",
  timestamps: true, // gives you createdAt / updatedAt automatically
});

// Associations — lets you do prescription.Doctor and prescription.Patient
Prescription.belongsTo(Patient, { foreignKey: "patientId" });
Prescription.belongsTo(Doctor, { foreignKey: "doctorId" });

module.exports = Prescription;