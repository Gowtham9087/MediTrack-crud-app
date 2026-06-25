const { DataTypes } = require("sequelize");
const sequelize = require("../../config/mysql");

const Patient = sequelize.define(
  "Patient",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // ✅ this already creates an index automatically
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // ✅ this already creates an index automatically
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    problem: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }
  // ✅ Removed indexes block — unique:true fields auto-create their own indexes
);

module.exports = Patient;