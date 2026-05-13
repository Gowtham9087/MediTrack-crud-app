import { useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  UserPlus,
  MessageSquare,
  Activity,
  Stethoscope,
  CalendarDays,
  LogOut,
} from "lucide-react";

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

function App() {
  const navigate = useNavigate();

  const [role, setRole] = useState(localStorage.getItem("role"));
  const [mobileMenu, setMobileMenu] = useState(false);

  const logout = () => {
    localStorage.clear();
    setRole(null);
    navigate("/");
    setMobileMenu(false);
  };

  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/20 shadow-lg"
        : "text-slate-300 hover:text-white hover:bg-white/10"
    }`;

  return (
    <div className="min-h-screen bg-[#050816]">
      {/* NAVBAR */}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1120]/80 backdrop-blur-2xl shadow-xl">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="h-20 flex items-center justify-between">
            {/* LOGO */}

            <div
              onClick={() =>
                navigate(
                  role === "admin"
                    ? "/admin/dashboard"
                    : role === "user"
                    ? "/feedback"
                    : "/"
                )
              }
              className="cursor-pointer"
            >
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-wide">
                Medi Track
              </h1>
            </div>

            {/* DESKTOP MENU */}

            <div className="hidden lg:flex items-center gap-3">
              {!role && (
                <NavLink to="/" className={navLinkStyle}>
                  Login
                </NavLink>
              )}

              {role === "admin" && (
                <>
                  <NavLink to="/admin/add" className={navLinkStyle}>
                    <UserPlus size={18} />
                    Add Patient
                  </NavLink>

                  <NavLink to="/admin/patients" className={navLinkStyle}>
                    <Users size={18} />
                    Patients
                  </NavLink>

                  <NavLink to="/admin/feedback" className={navLinkStyle}>
                    <MessageSquare size={18} />
                    Feedback
                  </NavLink>

                  <NavLink
                    to="/admin/activity-logs"
                    className={navLinkStyle}
                  >
                    <Activity size={18} />
                    Logs
                  </NavLink>

                  <NavLink to="/admin/dashboard" className={navLinkStyle}>
                    <LayoutDashboard size={18} />
                    Dashboard
                  </NavLink>

                  <NavLink to="/admin/doctors" className={navLinkStyle}>
                    <Stethoscope size={18} />
                    Doctors
                  </NavLink>

                  <NavLink to="/admin/appointments" className={navLinkStyle}>
                    <CalendarDays size={18} />
                    Appointments
                  </NavLink>
                </>
              )}

              {role === "user" && (
                <>
                  <NavLink to="/feedback" className={navLinkStyle}>
                    <MessageSquare size={18} />
                    Feedback
                  </NavLink>

                  <NavLink to="/user" className={navLinkStyle}>
                    <Users size={18} />
                    Profile
                  </NavLink>
                </>
              )}

              {role && (
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="lg:hidden text-white p-2 rounded-xl bg-white/10 border border-white/10"
            >
              {mobileMenu ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* MOBILE MENU */}

          {mobileMenu && (
            <div className="lg:hidden pb-6 animate-in slide-in-from-top duration-300">
              <div className="flex flex-col gap-3 mt-3 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                {!role && (
                  <NavLink
                    to="/"
                    className={navLinkStyle}
                    onClick={() => setMobileMenu(false)}
                  >
                    Login
                  </NavLink>
                )}

                {role === "admin" && (
                  <>
                    <NavLink
                      to="/admin/add"
                      className={navLinkStyle}
                      onClick={() => setMobileMenu(false)}
                    >
                      <UserPlus size={18} />
                      Add Patient
                    </NavLink>

                    <NavLink
                      to="/admin/patients"
                      className={navLinkStyle}
                      onClick={() => setMobileMenu(false)}
                    >
                      <Users size={18} />
                      Patients
                    </NavLink>

                    <NavLink
                      to="/admin/feedback"
                      className={navLinkStyle}
                      onClick={() => setMobileMenu(false)}
                    >
                      <MessageSquare size={18} />
                      Feedback
                    </NavLink>

                    <NavLink
                      to="/admin/activity-logs"
                      className={navLinkStyle}
                      onClick={() => setMobileMenu(false)}
                    >
                      <Activity size={18} />
                      Logs
                    </NavLink>

                    <NavLink
                      to="/admin/dashboard"
                      className={navLinkStyle}
                      onClick={() => setMobileMenu(false)}
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </NavLink>

                    <NavLink
                      to="/admin/doctors"
                      className={navLinkStyle}
                      onClick={() => setMobileMenu(false)}
                    >
                      <Stethoscope size={18} />
                      Doctors
                    </NavLink>

                    <NavLink
                      to="/admin/appointments"
                      className={navLinkStyle}
                      onClick={() => setMobileMenu(false)}
                    >
                      <CalendarDays size={18} />
                      Appointments
                    </NavLink>
                  </>
                )}

                {role === "user" && (
                  <>
                    <NavLink
                      to="/feedback"
                      className={navLinkStyle}
                      onClick={() => setMobileMenu(false)}
                    >
                      <MessageSquare size={18} />
                      Feedback
                    </NavLink>

                    <NavLink
                      to="/user"
                      className={navLinkStyle}
                      onClick={() => setMobileMenu(false)}
                    >
                      <Users size={18} />
                      Profile
                    </NavLink>
                  </>
                )}

                {role && (
                  <button
                    onClick={logout}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ROUTES */}

      <Routes>
        <Route
          path="/"
          element={
            role === "admin" ? (
              <Navigate to="/admin/dashboard" />
            ) : role === "user" ? (
              <Navigate to="/feedback" />
            ) : (
              <Login setRole={setRole} />
            )
          }
        />

        <Route
          path="/admin/add"
          element={role === "admin" ? <Home /> : <Navigate to="/" />}
        />

        <Route
          path="/admin/patients"
          element={role === "admin" ? <Patients /> : <Navigate to="/" />}
        />

        <Route
          path="/admin/feedback"
          element={role === "admin" ? <AdminFeedback /> : <Navigate to="/" />}
        />

        <Route
          path="/feedback"
          element={role === "user" ? <Feedback /> : <Navigate to="/" />}
        />

        <Route
          path="/user"
          element={role === "user" ? <UserDashboard /> : <Navigate to="/" />}
        />

        <Route
          path="/admin/activity-logs"
          element={role === "admin" ? <ActivityLogs /> : <Navigate to="/" />}
        />

        <Route
          path="/admin/dashboard"
          element={role === "admin" ? <Dashboard /> : <Navigate to="/" />}
        />

        <Route
          path="/admin/doctors"
          element={role === "admin" ? <Doctors /> : <Navigate to="/" />}
        />

        <Route
          path="/admin/appointments"
          element={role === "admin" ? <Appointments /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;