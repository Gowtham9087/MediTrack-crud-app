const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const sequelize = require("./config/mysql");
const connectMongoDB = require("./config/mongodb");

const Patient = require("./models/mysql/Patient");
const User = require("./models/mysql/User");

const patientRoutes = require("./routes/patientRoutes");
const authRoutes = require("./routes/authRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const activityRoutes = require("./routes/activityRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const Doctor = require("./models/mysql/Doctor");
const Appointment = require("./models/mysql/Appointment");
const appointmentRoutes = require("./routes/appointmentRoutes");


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectMongoDB();

app.use("/api", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/activity-logs", activityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/appointments", appointmentRoutes);

app.get("/", (req, res) => {
  res.send("MediTrack Backend Running");
});

const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then(() => {
    console.log("MySQL connected and tables synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MySQL connection failed:", err.message);
  });