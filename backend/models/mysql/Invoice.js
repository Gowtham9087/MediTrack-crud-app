const { DataTypes } = require("sequelize");
const sequelize = require("../../config/mysql");

const Invoice = sequelize.define("Invoice", {
  invoiceNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },

  patientName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  doctorName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  consultationFee: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },

  medicineFee: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },

  labFee: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },

  otherFee: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },

  totalAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },

  status: {
    type: DataTypes.ENUM("Paid", "Pending", "Cancelled", "Refunded"),
    defaultValue: "Pending",
  },

  invoiceDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

module.exports = Invoice;