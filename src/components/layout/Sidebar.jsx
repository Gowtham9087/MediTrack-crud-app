import {
  LayoutDashboard, Users, MessageSquare, Activity, Stethoscope,
  CalendarDays, LogOut, HeartPulse, CreditCard, Pill,
  FlaskConical, FileBarChart2, Settings
} from "lucide-react";
import { NavLink } from "react-router-dom";

// ⚡️ ADDED: setMobileMenu to the props
function Sidebar({ role, logout, setMobileMenu }) {
  // ✅ Read real name from localStorage
  const userName = localStorage.getItem(`${role}_userName`) || 
                   (role === "admin" ? "Admin" : role === "doctor" ? "Doctor" : "User");

  // --- ADMIN LINKS ---
  const adminLinks = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Patients", icon: Users, path: "/admin/patients" },
    { name: "Doctors", icon: Stethoscope, path: "/admin/doctors" },
    { name: "Appointments", icon: CalendarDays, path: "/admin/appointments" },
    { name: "Billing", icon: CreditCard, path: "/admin/billing" },
    { name: "Pharmacy", icon: Pill, path: "/admin/pharmacy" },
    { name: "Laboratory", icon: FlaskConical, path: "/admin/laboratory" },
    { name: "Reports", icon: FileBarChart2, path: "/admin/reports" },
    { name: "Feedback", icon: MessageSquare, path: "/admin/feedback" },
    { name: "Logs", icon: Activity, path: "/admin/activity-logs" },
    { name: "Calendar", icon: CalendarDays, path: "/admin/calendar" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  // --- STREAMLINED DOCTOR LINKS ---
  const doctorLinks = [
    { name: "My Queue", icon: LayoutDashboard, path: "/doctor/dashboard" },
    { name: "Patient Files", icon: Users, path: "/doctor/patients" }, // The unified page
    { name: "Settings", icon: Settings, path: "/doctor/settings" },
  ];

  // --- PATIENT / USER LINKS ---
  const userLinks = [
    { name: "Profile", icon: Users, path: "/user" },
    { name: "Appointments", icon: CalendarDays, path: "/user/appointments" },
    { name: "Prescriptions", icon: Pill, path: "/user/prescriptions" }, // Added here
    { name: "Billing", icon: CreditCard, path: "/user/billing" },
    { name: "Calendar", icon: CalendarDays, path: "/user/calendar" },
    { name: "Feedback", icon: MessageSquare, path: "/feedback" },
    { name: "Settings", icon: Settings, path: "/user/settings" },
  ];

  // Determine which links to show based on role
  let links = userLinks;
  if (role === "admin") links = adminLinks;
  if (role === "doctor") links = doctorLinks;

  // Determine text for the badge at the bottom
  const getRoleLabel = () => {
    if (role === "admin") return "Super Admin";
    if (role === "doctor") return "Attending Doctor";
    return "Patient";
  };

  return (
    <aside className="w-[220px] h-screen bg-[#020817] border-r border-slate-800/40 fixed left-0 top-0 z-50 flex flex-col">
      <div className="h-[76px] px-5 flex items-center border-b border-slate-800/40">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <HeartPulse className="text-white" size={21} />
        </div>
        <div className="ml-3">
          <h1 className="text-xl font-black text-white tracking-tight">
            Medi<span className="text-blue-500">Track</span>
          </h1>
          <p className="text-[11px] text-slate-500">Hospital Management</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end
              // ⚡️ ADDED: This closes the mobile menu when a link is tapped!
              onClick={() => {
                if (setMobileMenu) setMobileMenu(false);
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-400 hover:bg-[#0f172a] hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              <span className="text-sm">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800/40">
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-3 mb-3 flex items-center gap-3">
          {/* Avatar shows real first letter of name */}
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black flex-shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            {/* Real name here */}
            <p className="text-white font-bold text-sm truncate">
              {role === "doctor" && !userName.toLowerCase().startsWith("dr") ? `Dr. ${userName}` : userName}
            </p>
            <p className="text-slate-400 text-xs truncate">
              {getRoleLabel()}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-3 rounded-xl font-bold transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;