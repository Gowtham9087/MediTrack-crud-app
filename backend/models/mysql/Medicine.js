const { DataTypes } = require("sequelize");
const sequelize = require("../../config/mysql");

const Medicine = sequelize.define("Medicine", {
  medicineId: {
    type: DataTypes.STRING,
    unique: true,
  },

  medicineName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  category: {
    type: DataTypes.STRING,
  },

  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  price: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },

  totalValue: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },

  expiryDate: {
    type: DataTypes.DATEONLY,
  },
});

module.exports = Medicine;