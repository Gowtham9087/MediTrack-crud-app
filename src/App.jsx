import { useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Patients from "./Pages/Patients";
import UserDashboard from "./Pages/UserDashboard";
import Feedback from "./Pages/Feedback";
import AdminFeedback from "./Pages/AdminFeedback";

function App() {
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem("role"));

  const logout = () => {
    localStorage.clear();
    setRole(null);
    navigate("/");
  };

  const linkStyle = ({ isActive }) =>
    `px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
      isActive
        ? "bg-blue-500/20 text-cyan-300"
        : "text-blue-300 hover:text-white hover:bg-white/10"
    }`;

  return (
    <div className="min-h-screen text-blue-400">
      <nav className="sticky top-0 z-50 bg-[#11111d]/90 backdrop-blur-xl border-b border-white/10 px-10 py-5 flex justify-between items-center shadow-lg">
        <h3
          onClick={() =>
            navigate(
              role === "admin"
                ? "/admin/add"
                : role === "user"
                ? "/feedback"
                : "/"
            )
          }
          className="text-3xl font-bold text-blue-400 cursor-pointer tracking-wide"
        >
          Medi Track
        </h3>

        <div className="flex gap-3 items-center">
          {!role && (
            <NavLink to="/" className={linkStyle}>
              Login
            </NavLink>
          )}

          {role === "admin" && (
            <>
              <NavLink to="/admin/add" className={linkStyle}>
                Add Patient
              </NavLink>

              <NavLink to="/admin/patients" className={linkStyle}>
                Patient List
              </NavLink>

              <NavLink to="/admin/feedback" className={linkStyle}>
                Feedback List
              </NavLink>
            </>
          )}

          {role === "user" && (
            <>
              <NavLink to="/feedback" className={linkStyle}>
                Feedback
              </NavLink>

              <NavLink to="/user" className={linkStyle}>
                Update Details
              </NavLink>
            </>
          )}

          {role && (
            <button
              onClick={logout}
              className="ml-3 px-4 py-2 rounded-lg text-red-300 hover:text-white hover:bg-red-500/20 font-medium cursor-pointer transition-all duration-300"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            role === "admin" ? (
              <Navigate to="/admin/add" />
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
      </Routes>
    </div>
  );
}

export default App;