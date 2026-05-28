import { CalendarDays, Clock, Stethoscope, CheckCircle2, XCircle, X, Settings2, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { API_URL } from "../api";

function Calendar() {
  const [selectedDoctor, setSelectedDoctor] = useState("All");
  const [schedules, setSchedules] = useState([]);
  const [metrics, setMetrics] = useState({ totalDoctors: 0, availableToday: 0, unavailable: 0 });
  const [loading, setLoading] = useState(true);

  // --- CUSTOM DROPDOWN STATE ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- ADMIN MANAGEMENT MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [status, setStatus] = useState("Available"); 
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("01:00 PM");
  const [toast, setToast] = useState("");

  const token = localStorage.getItem("token");

  // Fetch live schedules from MySQL
  const fetchLiveSchedules = async () => {
    try {
      const res = await fetch(`${API_URL}/schedules`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSchedules(data.schedules);
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Failed downloading schedules matrix:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveSchedules();
  }, [token]);

  // Open modal and pre-fill current database values
  const handleOpenManagement = (doctorItem) => {
    setActiveDoctor(doctorItem);
    setStatus(doctorItem.status); 
    
    // Safely split the time string into the two dropdowns
    if (doctorItem.time && doctorItem.time.includes("-")) {
      const parts = doctorItem.time.split("-");
      setStartTime(parts[0].trim());
      setEndTime(parts[1].trim());
    } else {
      setStartTime("09:00 AM");
      setEndTime("01:00 PM");
    }
    
    setIsModalOpen(true);
  };

  // Save changes to the backend
  const handleSaveManagementChanges = async (e) => {
    e.preventDefault();

    const combinedWorkingHours = `${startTime} - ${endTime}`;

    try {
      const res = await fetch(`${API_URL}/schedules/update-doctor/${activeDoctor.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: status,
          workingHours: combinedWorkingHours
        })
      });

      if (res.ok) {
        setToast("Doctor profile updated successfully! ✔");
        setIsModalOpen(false);
        setTimeout(() => setToast(""), 3000);
        fetchLiveSchedules(); // Refresh the UI immediately
      } else {
        setToast("Failed to update profile parameters.");
        setTimeout(() => setToast(""), 3000);
      }
    } catch (err) {
      console.error("Error updating doctor availability:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center text-white">
        <p className="text-lg font-semibold animate-pulse text-blue-400">Loading live medical grid matrices...</p>
      </div>
    );
  }

  const doctors = ["All", ...new Set(schedules.map((item) => item.doctor))];
  const filteredSchedules = selectedDoctor === "All" ? schedules : schedules.filter((item) => item.doctor === selectedDoctor);

  // Structural generation array for custom time slot selections
  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white px-6 py-7 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-6 z-[99999] bg-[#0f172a] border border-[#1e293b] px-5 py-3 rounded-2xl shadow-2xl font-semibold border-l-4 border-l-blue-500">
          {toast}
        </div>
      )}

      {/* Invisible overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      <div className="max-w-[1650px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-7">
          <div>
            <p className="text-blue-400 font-bold mb-2">Doctor Schedule</p>
            <h1 className="text-4xl font-black">Calendar</h1>
            <p className="text-slate-400 mt-2">Manage operational rosters, control doctor availability, and shifts.</p>
          </div>

          {/* ⚡️ FIXED: Replaced native <select> with a Custom Dropdown */}
          <div className="relative w-full xl:w-64 z-40">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full h-14 rounded-2xl bg-[#0f172a] border border-[#1e293b] text-white px-5 flex items-center justify-between outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
            >
              <span className="truncate">{selectedDoctor}</span>
              <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {doctors.map((doctor) => (
                    <button
                      key={doctor}
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 hover:bg-blue-600/10 hover:text-blue-400 transition-colors text-sm sm:text-base ${
                        selectedDoctor === doctor ? "text-blue-400 bg-blue-600/10 font-bold" : "text-slate-300"
                      }`}
                    >
                      {doctor}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Analytics Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 relative z-10">
          <div className="rounded-3xl bg-[#0f172a] border border-[#1e293b] p-6">
            <p className="text-slate-400">Total Registered Doctors</p>
            <h2 className="text-3xl font-black mt-2">{metrics.totalDoctors}</h2>
          </div>
          <div className="rounded-3xl bg-[#0f172a] border border-[#1e293b] p-6">
            <p className="text-slate-400">Active Duty Today</p>
            <h2 className="text-3xl font-black mt-2 text-emerald-400">{metrics.availableToday}</h2>
          </div>
          <div className="rounded-3xl bg-[#0f172a] border border-[#1e293b] p-6">
            <p className="text-slate-400">Off-Duty / Unavailable</p>
            <h2 className="text-3xl font-black mt-2 text-orange-400">{metrics.unavailable}</h2>
          </div>
        </div>

        {/* Doctor Grid Blocks */}
        <div className="rounded-3xl border border-[#1e293b] bg-[#0f172a]/80 shadow-xl overflow-hidden relative z-10">
          <div className="p-6 border-b border-[#1e293b]">
            <h2 className="text-xl font-black">Doctor Roster Hub</h2>
            <p className="text-slate-400 text-sm mt-1">Showing {filteredSchedules.length} active physician profiles</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 p-6">
            {filteredSchedules.map((item, index) => (
              <div
                key={index}
                className="rounded-3xl bg-[#020817] border border-[#1e293b] p-6 hover:border-blue-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                      <Stethoscope size={26} />
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${
                        item.status !== "Available" 
                          ? "bg-red-500/10 text-red-400" 
                          : item.isOnDutyToday 
                            ? "bg-emerald-500/10 text-emerald-400" 
                            : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {item.status !== "Available" ? <XCircle size={14} /> : item.isOnDutyToday ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      {item.status !== "Available" ? "On Leave" : item.isOnDutyToday ? "On Duty Today" : "Next Shift Ready"}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black mt-5">{item.doctor}</h2>
                  <p className="text-blue-400 font-semibold uppercase text-xs tracking-wider">{item.specialization}</p>

                  <div className="mt-6 space-y-3 text-slate-300 bg-[#0f172a]/50 p-4 rounded-2xl border border-[#1e293b]/50">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Weekly Shift Schedule:</p>
                    <p className="text-xs text-blue-400 font-semibold">{item.workingDays.join(" • ")}</p>
                    <div className="h-px bg-[#1e293b] my-1" />
                    <p className="flex items-center gap-3 text-sm">
                      <CalendarDays size={16} className="text-slate-500" />
                      Next Rotation: {item.day}, {item.date}
                    </p>
                    <p className="flex items-center gap-3 text-sm">
                      <Clock size={16} className="text-slate-500" />
                      Hours: {item.time}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenManagement(item)}
                  className="w-full mt-6 py-3.5 rounded-2xl bg-[#0f172a] border border-[#1e293b] hover:border-blue-500 hover:bg-blue-600/10 font-bold transition-all flex items-center justify-center gap-2 text-white"
                >
                  <Settings2 size={16} />
                  Manage Schedule
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- ADMIN ROSTER MANAGEMENT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#0f172a] border border-[#1e293b] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-[#1e293b] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Settings2 size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black">Manage Settings</h2>
                  <p className="text-xs text-slate-400">Modify global parameters for this clinician row.</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 rounded-xl bg-[#020817] text-slate-400 hover:text-white flex items-center justify-center border border-[#1e293b]"><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveManagementChanges} className="p-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Physician Profile</label>
                <div className="w-full p-4 bg-[#020817] border border-[#1e293b] rounded-2xl flex items-center gap-3">
                  <Stethoscope size={18} className="text-blue-400" />
                  <div>
                    <p className="font-bold text-white">{activeDoctor?.doctor}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">{activeDoctor?.specialization}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Operational Availability Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-12 bg-[#020817] border border-[#1e293b] rounded-2xl px-4 outline-none text-white focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                >
                  <option value="Available">Available (On-Duty Roster)</option>
                  <option value="Not Available">Not Available (On Leave / Emergency Out)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Shift Working Timings</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">Start Time</span>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full h-12 bg-[#020817] border border-[#1e293b] rounded-2xl px-4 outline-none text-white focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                    >
                      {timeSlots.map((slot) => (
                        <option key={`start-${slot}`} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">End Time</span>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full h-12 bg-[#020817] border border-[#1e293b] rounded-2xl px-4 outline-none text-white focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                    >
                      {timeSlots.map((slot) => (
                        <option key={`end-${slot}`} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full h-13 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/10 py-3.5 transition-all active:scale-[0.99]"
              >
                Save Roster Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Basic style for the custom scrollbar in the dropdown */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #1e293b;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

export default Calendar;