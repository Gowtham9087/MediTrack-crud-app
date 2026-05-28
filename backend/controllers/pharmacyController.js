const Medicine = require("../models/mysql/Medicine");

exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(medicines);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch medicines",
    });
  }
};

exports.createMedicine = async (req, res) => {
  try {
    const {
      medicineName,
      category,
      stock,
      price,
      expiryDate,
    } = req.body;

    const count = await Medicine.count();

    const medicineId = `MED-${String(count + 1).padStart(3, "0")}`;

    const totalValue =
      Number(stock || 0) * Number(price || 0);

    const medicine = await Medicine.create({
      medicineId,
      medicineName,
      category,
      stock,
      price,
      totalValue,
      expiryDate,
    });

    res.status(201).json(medicine);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Medicine add failed",
    });
  }
};

exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        message: "Medicine not found",
      });
    }

    await medicine.destroy();

    res.json({
      message: "Medicine deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Delete failed",
    });
  }
};