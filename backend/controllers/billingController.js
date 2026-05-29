const Invoice = require("../models/mysql/Invoice");

exports.createInvoice = async (req, res) => {
  try {
    const {
      patientName,
      doctorName,
      consultationFee,
      medicineFee,
      labFee,
      otherFee,
      status,
      invoiceDate,
    } = req.body;

    if (!patientName || !doctorName || !invoiceDate) {
      return res.status(400).json({
        message: "Patient, doctor and invoice date are required",
      });
    }

    const totalAmount =
      Number(consultationFee || 0) +
      Number(medicineFee || 0) +
      Number(labFee || 0) +
      Number(otherFee || 0);

    const count = await Invoice.count();

    const invoiceNumber = `INV-${String(count + 1).padStart(4, "0")}`;

    const invoice = await Invoice.create({
      invoiceNumber,
      patientName,
      doctorName,
      consultationFee: Number(consultationFee || 0),
      medicineFee: Number(medicineFee || 0),
      labFee: Number(labFee || 0),
      otherFee: Number(otherFee || 0),
      totalAmount,
      status: status || "Pending",
      invoiceDate,
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Invoice creation failed" });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(invoices);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const {
      patientName,
      doctorName,
      consultationFee,
      medicineFee,
      labFee,
      otherFee,
      status,
      invoiceDate,
    } = req.body;

    const totalAmount =
      Number(consultationFee || 0) +
      Number(medicineFee || 0) +
      Number(labFee || 0) +
      Number(otherFee || 0);

    await invoice.update({
      patientName,
      doctorName,
      consultationFee: Number(consultationFee || 0),
      medicineFee: Number(medicineFee || 0),
      labFee: Number(labFee || 0),
      otherFee: Number(otherFee || 0),
      totalAmount,
      status,
      invoiceDate,
    });

    await invoice.reload(); // ← fetches fresh data from DB after update

    res.json(invoice);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Invoice update failed" });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    await invoice.destroy();

    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Invoice delete failed" });
  }
};