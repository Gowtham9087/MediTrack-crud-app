const Feedback = require("../models/mongo/Feedback");
const ActivityLog = require("../models/mongo/ActivityLog");

exports.addFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);

    await ActivityLog.create({
      action: "FEEDBACK_SUBMITTED",
      userRole: req.user.role,
      userId: req.user.id,
      details: `Feedback submitted by ${feedback.name}`,
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: "Feedback submit failed" });
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

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    await ActivityLog.create({
      action: "FEEDBACK_DELETED",
      userRole: req.user.role,
      userId: req.user.id,
      details: `Feedback from ${feedback.name} was deleted`,
    });

    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};