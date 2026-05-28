import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Patients from "./Pages/Patients";
import UserDashboard from "./Pages/UserDashboard";
import Feedback from "./Pages/Feedback";
import AdminFeedback from "./Pages/AdminFeedback";
import ActivityLogs from "./Pages/ActivityLogs";
import Dashboard from "./Pages/Dashboard";
import Doctors from "./Pages/Doctors";
import Appointments from "./Pages/Appointments";
import Billing from "./Pages/Billing";
import Pharmacy from "./Pages/Pharmacy";
import Laboratory from "./Pages/Laboratory";
import Reports from "./Pages/Reports";
import Calendar from "./Pages/Calendar";
import Settings from "./Pages/Settings";

// User Pages
import UserPharmacy from "./Pages/user/UserPharmacy";
import UserBilling from "./Pages/user/UserBilling";
import UserCalendar from "./Pages/user/UserCalendar";
import UserAppointments from "./Pages/user/UserAppointments";
import UserSettings from "./Pages/user/UserSettings";
import PatientPrescriptions from './Pages/user/PatientPrescriptions';

// Doctor Pages
import DoctorDashboard from "./Pages/doctors/DoctorDashboard";
import DoctorLogin from "./Pages/DoctorLogin";  // ✅ NEW
import DoctorSettings from "./Pages/doctors/DoctorSettings";
import DoctorPatients from "./Pages/doctors/DoctorPatients"; // ✅ NEW (placeholder for now)
import DashboardLayout from "./components/layout/DashboardLayout";

const ProtectedRoute = ({ allowedRole, children }) => {
  const roleToken = localStorage.getItem(`${allowedRole}_token`);
  if (roleToken) return children;
  return <Navigate to="/" replace />;
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  let activeRole = null;
  if (location.pathname.startsWith("/admin")) activeRole = "admin";
  else if (location.pathname.startsWith("/doctor")) activeRole = "doctor";
  else if (location.pathname.startsWith("/user")) activeRole = "user";

  const userName = activeRole ? localStorage.getItem(`${activeRole}_userName`) : null;
  const token = activeRole ? localStorage.getItem(`${activeRole}_token`) : null;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const logout = () => {
    localStorage.clear();
    setMobileMenu(false);
    navigate("/");
  };

  // Pages that should NOT show the DashboardLayout
  const noLayoutPages = ["/", "/doctor-login"];
  const showLayout = !noLayoutPages.includes(location.pathname);

  const appRoutes = (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* ✅ NEW: Doctor Login Page */}
      <Route path="/doctor-login" element={<DoctorLogin />} />

      {/* --- ADMIN ROUTES --- */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/add" element={<ProtectedRoute allowedRole="admin"><Home /></ProtectedRoute>} />
      <Route path="/admin/patients" element={<ProtectedRoute allowedRole="admin"><Patients /></ProtectedRoute>} />
      <Route path="/admin/billing" element={<ProtectedRoute allowedRole="admin"><Billing /></ProtectedRoute>} />
      <Route path="/admin/doctors" element={<ProtectedRoute allowedRole="admin"><Doctors /></ProtectedRoute>} />
      <Route path="/admin/appointments" element={<ProtectedRoute allowedRole="admin"><Appointments /></ProtectedRoute>} />
      <Route path="/admin/feedback" element={<ProtectedRoute allowedRole="admin"><AdminFeedback /></ProtectedRoute>} />
      <Route path="/admin/activity-logs" element={<ProtectedRoute allowedRole="admin"><ActivityLogs /></ProtectedRoute>} />
      <Route path="/admin/pharmacy" element={<ProtectedRoute allowedRole="admin"><Pharmacy /></ProtectedRoute>} />
      <Route path="/admin/laboratory" element={<ProtectedRoute allowedRole="admin"><Laboratory /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRole="admin"><Reports /></ProtectedRoute>} />
      <Route path="/admin/calendar" element={<ProtectedRoute allowedRole="admin"><Calendar /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRole="admin"><Settings darkMode={darkMode} setDarkMode={setDarkMode} /></ProtectedRoute>} />

      {/* --- DOCTOR ROUTES --- */}
      <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRole="doctor"><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/patients" element={<ProtectedRoute allowedRole="doctor"><DoctorPatients /></ProtectedRoute>} />
      <Route path="/doctor/settings" element={<ProtectedRoute allowedRole="doctor"><DoctorSettings /></ProtectedRoute>} />

      {/* --- PATIENT / USER ROUTES --- */}
      <Route path="/user" element={<ProtectedRoute allowedRole="user"><UserDashboard /></ProtectedRoute>} />
      <Route path="/feedback" element={<ProtectedRoute allowedRole="user"><Feedback /></ProtectedRoute>} />
      <Route path="/user/pharmacy" element={<ProtectedRoute allowedRole="user"><UserPharmacy /></ProtectedRoute>} />
      <Route path="/user/billing" element={<ProtectedRoute allowedRole="user"><UserBilling /></ProtectedRoute>} />
      <Route path="/user/calendar" element={<ProtectedRoute allowedRole="user"><UserCalendar /></ProtectedRoute>} />
      <Route path="/user/appointments" element={<ProtectedRoute allowedRole="user"><UserAppointments /></ProtectedRoute>} />
      <Route path="/user/prescriptions" element={<ProtectedRoute allowedRole="user"><PatientPrescriptions /></ProtectedRoute>} /> {/* ✅ ADDED HERE */}
      <Route path="/user/settings" element={<ProtectedRoute allowedRole="user"><UserSettings /></ProtectedRoute>} />


      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  return (
    <div className="min-h-screen bg-app-bg text-text-primary transition-colors duration-300">
      {showLayout ? (
        <DashboardLayout
          role={activeRole}
          userName={userName}
          token={token}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          mobileMenu={mobileMenu}
          setMobileMenu={setMobileMenu}
          logout={logout}
        >
          {appRoutes}
        </DashboardLayout>
      ) : (
        appRoutes
      )}
    </div>
  );
}

export default App;