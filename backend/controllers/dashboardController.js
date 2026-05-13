const Patient = require("../models/mysql/Patient");
const Feedback = require("../models/mongo/Feedback");
const ActivityLog = require("../models/mongo/ActivityLog");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await Patient.count();
    const totalFeedbacks = await Feedback.countDocuments();
    const totalLogs = await ActivityLog.countDocuments();

    const maleCount = await Patient.count({ where: { gender: "Male" } });
    const femaleCount = await Patient.count({ where: { gender: "Female" } });

    const recentLogs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const activitySummary = await ActivityLog.aggregate([
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    const feedbackSummary = await Feedback.aggregate([
      {
        $group: {
          _id: "$email",
          totalFeedbacks: { $sum: 1 },
        },
      },
      {
        $sort: {
          totalFeedbacks: -1,
        },
      },
    ]);

    res.json({
      totalPatients,
      totalFeedbacks,
      totalLogs,
      maleCount,
      femaleCount,
      recentLogs,
      activitySummary,
      feedbackSummary,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard stats",
    });
  }
};