import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";
import { User, Phone, Mail, MapPin, HeartPulse, Save } from "lucide-react";

function UserDashboard() {
  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");
  const token = localStorage.getItem("token");

  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const toastTimer = useRef(null);
  const [patientId, setPatientId] = useState(null);

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

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const fetchUserData = async () => {
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserData();
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, []);

  const savePatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (patient.contact && patient.contact.length !== 10) {
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
      if (!res.ok) {
        showToast(data.message || "Update failed ❌");
        setLoading(false);
        return;
      }
      if (!patientId && data.id) setPatientId(data.id);
      showToast("Your details updated successfully ✔️");
    } catch (error) {
      showToast("Update failed ❌");
    }
    setLoading(false);
  };

  const inputClass = "w-full bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 dark:text-white";
  const labelClass = "block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 ml-1";

  // ✅ Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="px-6 py-5 text-slate-900 dark:text-white relative">
      {toast && (
        <div className="fixed top-28 right-6 z-[99999] bg-[#0f172a] border border-[#1e293b] text-white px-5 py-4 rounded-2xl shadow-2xl font-semibold">
          {toast}
        </div>
      )}

      <div className="max-w-[1650px] mx-auto">

        {/* ✅ Welcome header with real user name */}
        <div className="mb-6">
          <p className="text-blue-500 font-bold text-sm mb-1">Patient Portal</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {getGreeting()},{" "}
            <span className="text-blue-500">
              {patient.name || userName || "Patient"}
            </span>{" "}
            👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
            View and update your personal medical details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left: Profile Card */}
          <div className="lg:col-span-1 bg-blue-600 dark:bg-[#0f172a] dark:border dark:border-[#1e293b] dark:shadow-none rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden transition-colors duration-300">
            <div className="absolute w-64 h-64 bg-blue-500/20 dark:bg-transparent rounded-full -top-10 -right-10 blur-3xl" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white dark:bg-[#1e293b] rounded-3xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 shadow-inner transition-colors">
                <User size={36} strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-black mb-1">{patient.name || "Patient Name"}</h2>
              <p className="text-blue-200 dark:text-slate-400 text-sm font-medium mb-8 transition-colors">
                {patient.email || "No email provided"}
              </p>
              <div className="space-y-3">
                <div className="bg-blue-700/50 dark:bg-[#020817] rounded-2xl p-4 flex gap-4 backdrop-blur-sm border border-blue-500/20 dark:border-[#1e293b] transition-colors">
                  <Phone size={18} className="mt-0.5 opacity-70 dark:text-slate-400" />
                  <div>
                    <p className="text-[11px] text-blue-200 dark:text-slate-400 mb-0.5 uppercase tracking-wider font-bold">Contact</p>
                    <p className="font-bold">{patient.contact || "Not set"}</p>
                  </div>
                </div>
                <div className="bg-blue-700/50 dark:bg-[#020817] rounded-2xl p-4 flex gap-4 backdrop-blur-sm border border-blue-500/20 dark:border-[#1e293b] transition-colors">
                  <Mail size={18} className="mt-0.5 opacity-70 dark:text-slate-400" />
                  <div>
                    <p className="text-[11px] text-blue-200 dark:text-slate-400 mb-0.5 uppercase tracking-wider font-bold">Email</p>
                    <p className="font-bold truncate max-w-[200px]">{patient.email || "Not set"}</p>
                  </div>
                </div>
                <div className="bg-blue-700/50 dark:bg-[#020817] rounded-2xl p-4 flex gap-4 backdrop-blur-sm border border-blue-500/20 dark:border-[#1e293b] transition-colors">
                  <MapPin size={18} className="mt-0.5 opacity-70 dark:text-slate-400" />
                  <div>
                    <p className="text-[11px] text-blue-200 dark:text-slate-400 mb-0.5 uppercase tracking-wider font-bold">Address</p>
                    <p className="font-bold leading-tight">{patient.address || "Not set"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Medical Form */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-[#1e293b]">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 flex items-center justify-center rounded-2xl shadow-inner">
                <HeartPulse size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black">Medical Information</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Keep your medical details updated for accurate treatment.
                </p>
              </div>
            </div>

            <form onSubmit={savePatient} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input type="text" name="name" value={patient.name} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input type="email" name="email" value={patient.email} onChange={handleChange} required disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
                </div>
                <div>
                  <label className={labelClass}>Contact Number</label>
                  <input type="number" name="contact" value={patient.contact} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Age</label>
                  <input type="number" name="age" value={patient.age} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Gender</label>
                  <select name="gender" value={patient.gender} onChange={handleChange} required className={`${inputClass} appearance-none cursor-pointer`}>
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Residential Address</label>
                  <input type="text" name="address" value={patient.address} onChange={handleChange} required className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Medical Problem / History</label>
                <textarea name="problem" value={patient.problem} onChange={handleChange} rows="4" required className={`${inputClass} resize-none`} />
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed">
                <Save size={20} />
                {loading ? "Saving Details..." : "Update My Details"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;