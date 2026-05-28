const { DataTypes } = require("sequelize");
const sequelize = require("../../config/mysql");

const LabTest = sequelize.define(
  "LabTest",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    patient: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    test: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Pending",
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "lab_tests",
    timestamps: true,
  }
);

module.exports = LabTest;