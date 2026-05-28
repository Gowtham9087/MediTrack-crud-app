const LabTest = require("../models/mysql/LabTest");

exports.getLabTests = async (req, res) => {
  try {
    const tests = await LabTest.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(tests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch lab tests" });
  }
};

exports.createLabTest = async (req, res) => {
  try {
    const { patient, test, amount, status, date } = req.body;
    const count = await LabTest.count();
    const id = `LAB-${String(count + 1).padStart(3, "0")}`;

    const newTest = await LabTest.create({
      id,
      patient,
      test,
      amount,
      status: status || "Pending",
      date
    });

    res.status(201).json(newTest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lab test add failed" });
  }
};

exports.updateLabStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await LabTest.update({ status }, { where: { id: req.params.id } });
    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Update failed" });
  }
};

exports.deleteLabTest = async (req, res) => {
  try {
    const test = await LabTest.findByPk(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    await test.destroy();
    res.json({ message: "Test deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Delete failed" });
  }
};