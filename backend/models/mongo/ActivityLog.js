const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },

    userRole: {
      type: String,
      required: true,
    },

    userId: {
      type: Number,
      required: false,
    },

    details: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ action: 1 });
activityLogSchema.index({ userRole: 1 });
activityLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);