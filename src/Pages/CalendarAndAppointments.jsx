import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";
import {
  CalendarDays, Plus, Search, X, Clock, Stethoscope,
  CheckCircle2, XCircle, Settings2, ChevronDown
} from "lucide-react";

import AddAppointmentForm from "../components/appointments/AddAppointmentForm";
import EditAppointmentModal from "../components/appointments/EditAppointmentModal";
import DeleteAppointmentModal from "../components/appointments/DeleteAppointmentModal";
import AppointmentTable from "../components/tables/AppointmentTable";

function CalendarAndAppointments() {
  const [activeTab, setActiveTab] = useState("appointments"); // "appointments" | "calendar"
  const token = localStorage.getItem("token");

  /* ================= SHARED TOAST ================= */
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);
  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  /* ================= APPOINTMENTS STATE ================= */
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [appointment, setAppointment] = useState({
    patientId: "", doctorId: "", appointmentDate: "", appointmentTime: "", reason: "",
  });

  const [editData, setEditData] = useState({
    patientId: "", doctorId: "", appointmentDate: "", appointmentTime: "", reason: "", status: "",
  });

  const fetchStaticData = async () => {
    try {
      const patientRes = await fetch(`${API_URL}/patients`, { headers: { Authorization: `Bearer ${token}` } });
      const doctorRes = await fetch(`${API_URL}/appointments/doctors`, { headers: { Authorization: `Bearer ${token}` } });
      if (patientRes.ok) setPatients(await patientRes.json());
      if (doctorRes.ok) setDoctors(await doctorRes.json());
    } catch (error) {
      console.log("Failed to fetch static data", error);
    }
  };

  const fetchLiveAppointments = async () => {
    try {
      const appointmentRes = await fetch(`${API_URL}/appointments`, { headers: { Authorization: `Bearer ${token}` } });
      if (appointmentRes.ok) {
        const data = await appointmentRes.json();
        if (Array.isArray(data)) setAppointments(data);
      }
    } catch (error) {
      console.log("Live stream fetch failed", error);
    }
  };

  useEffect(() => {
    fetchStaticData();
    fetchLiveAppointments();

    const intervalId = setInterval(() => {
      fetchLiveAppointments();
    }, 5000);

    return () => {
      clearInterval(intervalId);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const bookAppointment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(appointment),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.message || "Booking failed ❌");

      showToast("Appointment booked successfully ✔️");
      setAppointment({ patientId: "", doctorId: "", appointmentDate: "", appointmentTime: "", reason: "" });
      setIsAddOpen(false);
      fetchLiveAppointments();
    } catch (error) {
      console.log(error);
      showToast("Appointment booking failed ❌");
    }
  };

  const startEdit = (a) => {
    setEditId(a.id);
    setEditData({
      patientId: a.patientId || "", doctorId: a.doctorId || "", appointmentDate: a.appointmentDate || "",
      appointmentTime: a.appointmentTime || "", reason: a.reason || "", status: a.status || "Booked",
    });
  };

  const updateAppointment = async () => {
    try {
      const res = await fetch(`${API_URL}/appointments/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.message || "Update failed ❌");

      showToast("Appointment updated successfully ✔️");
      setEditId(null);
      fetchLiveAppointments();
    } catch (error) {
      console.log(error);
      showToast("Appointment update failed ❌");
    }
  };

  const deleteAppointment = async (id) => {
    try {
      const res = await fetch(`${API_URL}/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.message || "Delete failed ❌");

      showToast("Appointment deleted successfully ✔️");
      setDeleteId(null);
      fetchLiveAppointments();
    } catch (error) {
      console.log(error);
      showToast("Delete failed ❌");
    }
  };

  const filteredAppointments = appointments.filter((a) =>
    `${a.Patient?.name || ""} ${a.Doctor?.name || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= CALENDAR STATE ================= */
  const [selectedDoctor, setSelectedDoctor] = useState("All");
  const [schedules, setSchedules] = useState([]);
  const [metrics, setMetrics] = useState({ totalDoctors: 0, availableToday: 0, unavailable: 0 });
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [status, setStatus] = useState("Available");
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("01:00 PM");

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
      setCalendarLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleOpenManagement = (doctorItem) => {
    setActiveDoctor(doctorItem);
    setStatus(doctorItem.status);

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
        showToast("Doctor profile updated successfully! ✔");
        setIsModalOpen(false);
        fetchLiveSchedules();
      } else {
        showToast("Failed to update profile parameters.");
      }
    } catch (err) {
      console.error("Error updating doctor availability:", err);
    }
  };

  const calendarDoctors = ["All", ...new Set(schedules.map((item) => item.doctor))];
  const filteredSchedules = selectedDoctor === "All" ? schedules : schedules.filter((item) => item.doctor === selectedDoctor);

  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  const isAppointments = activeTab === "appointments";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-white px-6 py-5 relative">
      {toast && (
        <div className="fixed top-28 right-6 z-[99999] bg-[#0f172a] border border-[#1e293b] text-white px-5 py-4 rounded-2xl shadow-2xl font-semibold">
          {toast}
        </div>
      )}

      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      <div className="max-w-[1650px] mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            <p className="text-blue-500 font-bold mb-1 text-sm">Schedule Management</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Schedule</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm max-w-sm">
              {isAppointments
                ? "Book, update and manage appointment schedules."
                : "Manage operational rosters and doctor availability."}
            </p>
          </div>

          {isAppointments ? (
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <div className="w-full sm:w-[320px] h-12 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] flex items-center px-4 gap-3 shadow-sm">
                <Search size={18} className="text-slate-400 shrink-0" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search appointment..." className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white text-sm" />
              </div>
              <button
                onClick={() => setIsAddOpen(true)}
                className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-blue-400 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-all text-sm shrink-0"
              >
                <Plus size={18} /> New Appointment
              </button>
            </div>
          ) : (
            <div className="relative w-full md:w-64 z-40">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full h-12 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] text-slate-900 dark:text-white px-5 flex items-center justify-between outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              >
                <span className="truncate">{selectedDoctor}</span>
                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl shadow-xl overflow-hidden py-2 z-40">
                  <div className="max-h-60 overflow-y-auto">
                    {calendarDoctors.map((doctor) => (
                      <button
                        key={doctor}
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 hover:bg-blue-600/10 hover:text-blue-500 transition-colors text-sm ${
                          selectedDoctor === doctor ? "text-blue-500 bg-blue-600/10 font-bold" : "text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {doctor}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* TABS */}
        <div className="flex items-center gap-2 mb-5">
          <button
            onClick={() => setActiveTab("appointments")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
              isAppointments
                ? "bg-blue-400 text-white shadow-lg shadow-blue-500/20"
                : "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <CalendarDays size={16} /> Appointments
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${isAppointments ? "bg-white/20" : "bg-slate-100 dark:bg-[#1e293b]"}`}>
              {appointments.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
              !isAppointments
                ? "bg-blue-400 text-white shadow-lg shadow-blue-500/20"
                : "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Clock size={16} /> Calendar
            <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${!isAppointments ? "bg-white/20" : "bg-slate-100 dark:bg-[#1e293b]"}`}>
              {schedules.length}
            </span>
          </button>
        </div>

        {/* ================= APPOINTMENTS TAB ================= */}
        {isAppointments && (
          <>
            <div className="rounded-3xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0f172a] shadow-sm overflow-hidden w-full h-auto mx-auto">
              <AppointmentTable appointments={filteredAppointments} startEdit={startEdit} setDeleteId={setDeleteId} />
            </div>

            {isAddOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9998] px-4">
                <div className="fixed inset-0" onClick={() => setIsAddOpen(false)} />
                <div className="relative bg-white dark:bg-[#111827] w-full max-w-3xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl z-10 border border-slate-200 dark:border-slate-800">
                  <button onClick={() => setIsAddOpen(false)} className="absolute top-6 right-6 w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-white"><X size={20} /></button>
                  <AddAppointmentForm
                    appointment={appointment}
                    setAppointment={setAppointment}
                    patients={patients}
                    doctors={doctors}
                    bookAppointment={bookAppointment}
                    existingAppointments={appointments}
                  />
                </div>
              </div>
            )}

            <EditAppointmentModal editId={editId} setEditId={setEditId} editData={editData} setEditData={setEditData} patients={patients} doctors={doctors} updateAppointment={updateAppointment} />
            <DeleteAppointmentModal deleteId={deleteId} setDeleteId={setDeleteId} deleteAppointment={deleteAppointment} />
          </>
        )}

        {/* ================= CALENDAR TAB ================= */}
        {!isAppointments && (
          <>
            {calendarLoading ? (
              <div className="py-20 flex items-center justify-center">
                <p className="text-lg font-semibold animate-pulse text-blue-400">Loading live medical grid matrices...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 relative z-10">
                  <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] p-6">
                    <p className="text-slate-500 dark:text-slate-400">Total Registered Doctors</p>
                    <h2 className="text-3xl font-black mt-2">{metrics.totalDoctors}</h2>
                  </div>
                  <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] p-6">
                    <p className="text-slate-500 dark:text-slate-400">Active Duty Today</p>
                    <h2 className="text-3xl font-black mt-2 text-emerald-500">{metrics.availableToday}</h2>
                  </div>
                  <div className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] p-6">
                    <p className="text-slate-500 dark:text-slate-400">Off-Duty / Unavailable</p>
                    <h2 className="text-3xl font-black mt-2 text-orange-500">{metrics.unavailable}</h2>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0f172a]/80 shadow-xl overflow-hidden relative z-10">
                  <div className="p-6 border-b border-slate-200 dark:border-[#1e293b]">
                    <h2 className="text-xl font-black">Doctor Roster Hub</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Showing {filteredSchedules.length} active physician profiles</p>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 p-6">
                    {filteredSchedules.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-3xl bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] p-6 hover:border-blue-500/50 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-500 flex items-center justify-center">
                              <Stethoscope size={26} />
                            </div>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${
                                item.status !== "Available"
                                  ? "bg-red-500/10 text-red-500"
                                  : item.isOnDutyToday
                                    ? "bg-emerald-500/10 text-emerald-500"
                                    : "bg-amber-500/10 text-amber-500"
                              }`}
                            >
                              {item.status !== "Available" ? <XCircle size={14} /> : item.isOnDutyToday ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                              {item.status !== "Available" ? "On Leave" : item.isOnDutyToday ? "On Duty Today" : "Next Shift Ready"}
                            </span>
                          </div>

                          <h2 className="text-2xl font-black mt-5">{item.doctor}</h2>
                          <p className="text-blue-500 font-semibold uppercase text-xs tracking-wider">{item.specialization}</p>

                          <div className="mt-6 space-y-3 text-slate-600 dark:text-slate-300 bg-white dark:bg-[#0f172a]/50 p-4 rounded-2xl border border-slate-200 dark:border-[#1e293b]/50">
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Weekly Shift Schedule:</p>
                            <p className="text-xs text-blue-500 font-semibold">{item.workingDays.join(" • ")}</p>
                            <div className="h-px bg-slate-200 dark:bg-[#1e293b] my-1" />
                            <p className="flex items-center gap-3 text-sm">
                              <CalendarDays size={16} className="text-slate-400" />
                              Next Rotation: {item.day}, {item.date}
                            </p>
                            <p className="flex items-center gap-3 text-sm">
                              <Clock size={16} className="text-slate-400" />
                              Hours: {item.time}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleOpenManagement(item)}
                          className="w-full mt-6 py-3.5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] hover:border-blue-500 hover:bg-blue-600/10 font-bold transition-all flex items-center justify-center gap-2 text-slate-900 dark:text-white"
                        >
                          <Settings2 size={16} />
                          Manage Schedule
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {isModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
                  <div className="p-6 border-b border-slate-200 dark:border-[#1e293b] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Settings2 size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black">Manage Settings</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Modify global parameters for this clinician row.</p>
                      </div>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#020817] text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center border border-slate-200 dark:border-[#1e293b]"><X size={18} /></button>
                  </div>

                  <form onSubmit={handleSaveManagementChanges} className="p-6 space-y-5">
                    <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Physician Profile</label>
                      <div className="w-full p-4 bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-2xl flex items-center gap-3">
                        <Stethoscope size={18} className="text-blue-500" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{activeDoctor?.doctor}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">{activeDoctor?.specialization}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Operational Availability Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full h-12 bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-2xl px-4 outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                      >
                        <option value="Available">Available (On-Duty Roster)</option>
                        <option value="Not Available">Not Available (On Leave / Emergency Out)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Shift Working Timings</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-1">Start Time</span>
                          <select
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full h-12 bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-2xl px-4 outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                          >
                            {timeSlots.map((slot) => (
                              <option key={`start-${slot}`} value={slot}>{slot}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block mb-1">End Time</span>
                          <select
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full h-12 bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-2xl px-4 outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
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
                      className="w-full mt-2 bg-blue-400 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/10 py-3.5 transition-all active:scale-[0.99]"
                    >
                      Save Roster Settings
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CalendarAndAppointments;