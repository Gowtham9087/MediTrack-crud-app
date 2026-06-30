const Feedback = require("../models/mongo/Feedback");
const ActivityLog = require("../models/mongo/ActivityLog");

exports.addFeedback = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentId, rating, comment, name, email, feedback } = req.body;
    const newFeedback = await Feedback.create({
      patientId, doctorId, appointmentId, rating, comment,
      name: name || `Patient ${patientId}`,
      email: email || "",
      feedback: comment || feedback || "",
    });
    await ActivityLog.create({
      action: "FEEDBACK_SUBMITTED",
      userRole: req.user.role,
      userId: req.user.id,
      details: `Feedback submitted by patient ${patientId} for doctor ${doctorId}`,
    });
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(400).json({ message: "Feedback submit failed", error: error.message });
  }
};

// Patient fetches only their own feedbacks to check which appointments already submitted
exports.getMyFeedbacks = async (req, res) => {
  try {
    const { patientId } = req.query;
    const feedbacks = await Feedback.find({ patientId: Number(patientId) }).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
};

exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    await Feedback.findByIdAndDelete(req.params.id);
    await ActivityLog.create({
      action: "FEEDBACK_DELETED",
      userRole: req.user.role,
      userId: req.user.id,
      details: `Feedback ${req.params.id} deleted`,
    });
    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};