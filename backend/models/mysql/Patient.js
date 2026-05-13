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
      unique: true,
    },

    contact: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
  },
  {
    indexes: [
      {
        fields: ["email"],
      },

      {
        fields: ["contact"],
      },

      {
        fields: ["gender"],
      },
    ],
  }
);

module.exports = Patient;