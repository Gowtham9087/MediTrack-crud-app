const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    feedback: { type: String },

    patientId: { type: Number },
    doctorId: { type: Number },
    appointmentId: { type: Number },
    rating: { type: Number, min: 0, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

feedbackSchema.index({ email: 1 });
feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ patientId: 1 });
feedbackSchema.index({ doctorId: 1 });
feedbackSchema.index({ appointmentId: 1 });

module.exports = mongoose.model("Feedback", feedbackSchema);