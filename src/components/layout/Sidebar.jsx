import {
  LayoutDashboard, Users, MessageSquare, Activity, Stethoscope,
  CalendarDays, LogOut, HeartPulse, CreditCard, Pill,
  FlaskConical, FileBarChart2, Settings, AlertTriangle, HelpCircle,
  X, Save, User
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { API_URL } from "../../api";

function Sidebar({ role, logout, setMobileMenu }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const toastTimer = useRef(null);

  const userEmail = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");

  const userName = localStorage.getItem(`${role}_userName`) ||
    (role === "admin" ? "Admin" : role === "doctor" ? "Doctor" : "User");

  const [patient, setPatient] = useState({
    name: userName || "",
    email: userEmail || "",
    contact: "",
    address: "",
    age: "",
    gender: "",
    problem: "",
  });

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  const fetchUserData = async () => {
    if (role !== "user" || !userEmail) return;
    try {
      const res = await fetch(`${API_URL}/patients/email/${userEmail}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const myData = await res.json();
      if (!res.ok) return;
      if (myData) {
        setPatientId(myData.id);
        setPatient({
          name: myData.name || userName || "",
          email: myData.email || userEmail || "",
          contact: myData.contact || "",
          address: myData.address || "",
          age: myData.age || "",
          gender: myData.gender || "",
          problem: myData.problem || "",
        });
      }
    } catch (err) { console.log(err); }
  };

  useEffect(() => {
    if (showProfileModal) fetchUserData();
  }, [showProfileModal]);

  const savePatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (patient.contact && String(patient.contact).length !== 10) {
      showToast("Contact number must be 10 digits ❌");
      setLoading(false);
      return;
    }
    try {
      const method = patientId ? "PUT" : "POST";
      const url = patientId ? `${API_URL}/patients/${patientId}` : `${API_URL}/patients`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(patient),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.message || "Update failed ❌"); setLoading(false); return; }
      if (!patientId && data.id) setPatientId(data.id);
      showToast("Details updated successfully ✔️");
    } catch { showToast("Update failed ❌"); }
    setLoading(false);
  };

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

  const doctorLinks = [
    { name: "My Queue", icon: LayoutDashboard, path: "/doctor/dashboard" },
    { name: "Patient Files", icon: Users, path: "/doctor/patients" },
    { name: "Settings", icon: Settings, path: "/doctor/settings" },
  ];

  const userLinks = [
    { name: "Appointments", icon: CalendarDays, path: "/user/appointments" },
    { name: "Billing", icon: CreditCard, path: "/user/billing" },
    { name: "Help & Support", icon: HelpCircle, path: "/user/settings" },
  ];

  let links = userLinks;
  if (role === "admin") links = adminLinks;
  if (role === "doctor") links = doctorLinks;

  const getRoleLabel = () => {
    if (role === "admin") return "Super Admin";
    if (role === "doctor") return "Attending Doctor";
    return "Patient";
  };

  const inputClass = "w-full bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 dark:text-white text-sm";
  const labelClass = "block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5 ml-1";

  return (
    <>
      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 w-[320px] shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={28} />
              </div>
            </div>
            <h2 className="text-white text-xl font-black text-center mb-1">Logout?</h2>
            <p className="text-slate-400 text-sm text-center mb-6">Are you sure you want to logout from MediTrack?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-3 rounded-xl border border-slate-700 text-white font-bold hover:bg-slate-500 transition-all">Cancel</button>
              <button onClick={() => { setShowLogoutModal(false); logout(); }} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all">Yes, Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal — user only */}
      {showProfileModal && role === "user" && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#1e293b]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-400 rounded-xl flex items-center justify-center text-white font-black text-lg">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">My Profile</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Update your personal & medical details</p>
                </div>
              </div>
              <button onClick={() => setShowProfileModal(false)} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#1e293b] flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={savePatient} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input type="text" name="name" value={patient.name} onChange={e => setPatient({ ...patient, name: e.target.value })} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input type="email" value={patient.email} disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
                </div>
                <div>
                  <label className={labelClass}>Contact Number</label>
                  <input type="number" name="contact" value={patient.contact} onChange={e => setPatient({ ...patient, contact: e.target.value })} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Age</label>
                  <input type="number" name="age" value={patient.age} onChange={e => setPatient({ ...patient, age: e.target.value })} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Gender</label>
                  <select name="gender" value={patient.gender} onChange={e => setPatient({ ...patient, gender: e.target.value })} required className={`${inputClass} appearance-none cursor-pointer`}>
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Residential Address</label>
                  <input type="text" name="address" value={patient.address} onChange={e => setPatient({ ...patient, address: e.target.value })} required className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Medical Problem / History</label>
                <textarea name="problem" value={patient.problem} onChange={e => setPatient({ ...patient, problem: e.target.value })} rows="3" required className={`${inputClass} resize-none`} />
              </div>

              {toast && (
                <p className="text-center text-sm font-semibold text-emerald-500">{toast}</p>
              )}

              <button type="submit" disabled={loading} className="w-full py-3 bg-blue-400 hover:bg-blue-500 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70">
                <Save size={18} />
                {loading ? "Saving..." : "Update My Details"}
              </button>
            </form>
          </div>
        </div>
      )}

      <aside className="w-[220px] h-screen bg-[#020817] border-r border-slate-800/40 fixed left-0 top-0 z-50 flex flex-col">
        <div className="h-[76px] px-5 flex items-center border-b border-slate-800/40">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <HeartPulse className="text-white" size={21} />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-black text-white tracking-tight">Medi<span className="text-blue-500">Track</span></h1>
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
                onClick={() => { if (setMobileMenu) setMobileMenu(false); }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${isActive
                    ? "bg-blue-400 text-white shadow-lg shadow-blue-500/20"
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
          <button
            onClick={() => role === "user" && setShowProfileModal(true)}
            className={`w-full bg-[#0f172a] border border-[#1e293b] rounded-2xl p-3 mb-3 flex items-center gap-3 text-left transition-all ${role === "user" ? "hover:border-blue-500/50 hover:bg-[#1e293b] cursor-pointer" : "cursor-default"}`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-400 flex items-center justify-center text-white font-black flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">
                {role === "doctor" && !userName.toLowerCase().startsWith("dr") ? `Dr. ${userName}` : userName}
              </p>
              <p className="text-slate-400 text-xs truncate">{getRoleLabel()}</p>
            </div>
            {role === "user" && <User size={14} className="text-slate-500 shrink-0" />}
          </button>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-3 rounded-xl font-bold transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;