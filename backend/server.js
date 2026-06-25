const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const sequelize = require("./config/mysql");
const connectMongoDB = require("./config/mongodb");
const paymentRoutes = require("./routes/paymentRoutes");

// --- MODELS ---
const Patient = require("./models/mysql/Patient");
const User = require("./models/mysql/User");
const Doctor = require("./models/mysql/Doctor");
const Appointment = require("./models/mysql/Appointment");
const LabTest = require("./models/mysql/LabTest");
const Prescription = require("./models/mysql/Prescription");

// --- ROUTES ---
const patientRoutes = require("./routes/patientRoutes");
const authRoutes = require("./routes/authRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const activityRoutes = require("./routes/activityRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const billingRoutes = require("./routes/billingRoutes");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const labRoutes = require("./routes/labRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const PrescriptionRoutes = require("./routes/prescriptionroutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

connectMongoDB();

// --- API ENDPOINTS ---
app.use("/api", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/activity-logs", activityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/laboratory", labRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/prescriptions", PrescriptionRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/api/doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
});

app.get("/api/medicines", async (req, res) => {
  try {
    const mockInventory = [
      { id: 1, name: "Paracetamol 650mg", stock: 150 },
      { id: 2, name: "Amoxicillin 500mg", stock: 85 },
      { id: 3, name: "Cough Syrup 100ml", stock: 40 },
      { id: 4, name: "Vitamin C Tablets", stock: 200 },
      { id: 5, name: "Ibuprofen 400mg", stock: 110 },
    ];
    res.status(200).json(mockInventory);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch medicines" });
  }
});

app.get("/", (req, res) => {
  res.send("MediTrack Backend Running");
});

const PORT = process.env.PORT || 5000;

// ✅ START SERVER FIRST — regardless of DB status
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ✅ Sync MySQL safely — no force, no alter, data is preserved
sequelize
  .sync({})
  .then(async () => {
    console.log("✅ MySQL connected and tables synced successfully.");

    try {
      const existingAdmin = await User.findOne({ where: { email: "admin@gmail.com" } });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await User.create({
          name: "Admin",
          email: "admin@gmail.com",
          password: hashedPassword,
          role: "admin",
        });
        console.log("✅ Admin account auto-created and secured with bcrypt!");
      } else {
        console.log("✅ Admin account already exists.");
      }
    } catch (error) {
      console.log("⚠️ Could not verify admin account:", error.message);
    }
  })
  .catch((err) => {
    console.error("❌ MySQL sync failed:", err.message);
    console.warn("⚠️ Server is running but MySQL-dependent routes will fail.");
  });