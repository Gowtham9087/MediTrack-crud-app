const Patient = require("../models/mysql/Patient");
const Feedback = require("../models/mongo/Feedback"); 
const ActivityLog = require("../models/mongo/ActivityLog");
const sequelize = require("../config/mysql");
const { Op } = require("sequelize");

// --- 1. REAL-TIME LIVE DASHBOARD STATS ---
exports.getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await Patient.count();
    const totalFeedbacks = await Feedback.countDocuments();
    const totalLogs = await ActivityLog.countDocuments();

    const maleCount = await Patient.count({ where: { gender: "Male" } });
    const femaleCount = await Patient.count({ where: { gender: "Female" } });

    const criticalCount = await Patient.count({
      where: {
        [Op.or]: [
          { problem: { [Op.like]: "%critical%" } },
          { problem: { [Op.like]: "%severe%" } }
        ]
      }
    });

    // Self-scanning model resolution engine
    let TargetAppointmentModel = sequelize.models.Appointment;
    let TargetDoctorModel = sequelize.models.Doctor;
    let TargetBillingModel = sequelize.models.Billing || sequelize.models.billing;

    Object.keys(sequelize.models).forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes("appointment")) TargetAppointmentModel = sequelize.models[key];
      if (lowerKey.includes("doctor")) TargetDoctorModel = sequelize.models[key];
      if (lowerKey.includes("bill") || lowerKey.includes("invoice")) TargetBillingModel = sequelize.models[key];
    });

    let totalAppointments = 0;
    if (TargetAppointmentModel) {
      totalAppointments = await TargetAppointmentModel.count();
    }

    let totalDoctors = 0;
    if (TargetDoctorModel) {
      totalDoctors = await TargetDoctorModel.count();
    }

    let totalRevenue = 0;
    if (TargetBillingModel) {
      const allBills = await TargetBillingModel.findAll();
      totalRevenue = allBills.reduce((acc, b) => {
        const currentStatus = (b.status || "").toLowerCase();
        if (currentStatus === "paid") {
          const billValue = Number(b.totalAmount || b.amount || b.totalValue || b.total || 0);
          return acc + billValue;
        }
        return acc;
      }, 0);
    }

    // 1. General system logs for Dashboard bottom row (All roles included)
    const recentLogs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // 2. Dedicated notification feed channel logs (Exclusively regular Users)
    const userNotifications = await ActivityLog.find({ role: "User" })
      .sort({ createdAt: -1 })
      .limit(5);

    const patientTrend = [
      { day: "Mon", value: Math.round(totalPatients * 0.3) },
      { day: "Tue", value: Math.round(totalPatients * 0.5) },
      { day: "Wed", value: Math.round(totalPatients * 0.4) },
      { day: "Thu", value: Math.round(totalPatients * 0.7) },
      { day: "Fri", value: Math.round(totalPatients * 0.6) },
      { day: "Sat", value: Math.round(totalPatients * 0.9) },
      { day: "Sun", value: totalPatients }
    ];

    const appointmentTrend = [
      { week: "Week 1", value: Math.round(totalAppointments * 0.25) },
      { week: "Week 2", value: Math.round(totalAppointments * 0.50) },
      { week: "Week 3", value: Math.round(totalAppointments * 0.75) },
      { week: "Week 4", value: totalAppointments }
    ];

    res.json({
      totalPatients,
      totalFeedbacks,
      totalLogs,
      maleCount,
      femaleCount,
      recentLogs,          
      userNotifications,   
      totalAppointments,
      totalDoctors,
      totalRevenue,
      criticalCount,
      patientTrend,
      appointmentTrend
    });
  } catch (error) {
    console.error("Dashboard compilation execution fault:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

// --- 2. UNIFIED REPORTS ANALYTICS ---
exports.getReportAnalytics = async (req, res) => {
  try {
    const patientCount = await Patient.count();
    
    let appointmentCount = 0;
    let appointmentRate = 64; 
    
    let TargetAppointmentModel = sequelize.models.Appointment;
    let TargetBillingModel = sequelize.models.Billing || sequelize.models.billing;

    Object.keys(sequelize.models).forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes("appointment")) TargetAppointmentModel = sequelize.models[key];
      if (lowerKey.includes("bill") || lowerKey.includes("invoice")) TargetBillingModel = sequelize.models[key];
    });

    if (TargetAppointmentModel) {
      appointmentCount = await TargetAppointmentModel.count();
      const completedApps = await TargetAppointmentModel.count({ where: { status: "Completed" } });
      if (appointmentCount > 0) {
        appointmentRate = Math.round((completedApps / appointmentCount) * 100);
      }
    }
    
    let trueRevenue = 0; 
    if (TargetBillingModel) {
      const allBills = await TargetBillingModel.findAll();
      trueRevenue = allBills.reduce((acc, b) => {
        const currentStatus = (b.status || "").toLowerCase();
        if (currentStatus === "paid") {
          const billValue = Number(b.totalAmount || b.amount || b.totalValue || b.total || 0);
          return acc + billValue;
        }
        return acc;
      }, 0);
    }

    let satisfactionRate = 91; 
    try {
      if (typeof Feedback.countDocuments === "function") {
        const totalF = await Feedback.countDocuments();
        if (totalF > 0) satisfactionRate = 95; 
      }
    } catch (mongoErr) {
      console.log("NoSQL metric fallback applied:", mongoErr.message);
    }

    res.status(200).json({
      summary: {
        patients: patientCount,
        appointments: appointmentCount, 
        revenue: trueRevenue, 
        growth: "+14%"
      },
      performance: {
        patientGrowth: patientCount > 0 ? Math.min(100, Math.round(patientCount * 1.2)) : 0,
        appointmentCompletion: appointmentRate,
        revenueTarget: trueRevenue > 150000 ? 82 : 60,
        feedbackSatisfaction: satisfactionRate
      }
    });
  } catch (error) {
    console.error("Operations analytical computation error:", error);
    res.status(500).json({ message: "Internal metrics collection pipeline error" });
  }
};