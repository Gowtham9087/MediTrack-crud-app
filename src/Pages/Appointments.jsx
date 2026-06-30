import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api"; 
import { CalendarDays, Plus, Search, X } from "lucide-react";

import AddAppointmentForm from "../components/appointments/AddAppointmentForm"; 
import EditAppointmentModal from "../components/appointments/EditAppointmentModal"; 
import DeleteAppointmentModal from "../components/appointments/DeleteAppointmentModal"; 
import AppointmentTable from "../components/tables/AppointmentTable"; 

function Appointments() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const toastTimer = useRef(null);

  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [appointment, setAppointment] = useState({
    patientId: "", doctorId: "", appointmentDate: "", appointmentTime: "", reason: "",
  });

  const [editData, setEditData] = useState({
    patientId: "", doctorId: "", appointmentDate: "", appointmentTime: "", reason: "", status: "",
  });

  const token = localStorage.getItem("token");

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  // 1. Fetch static data (Patients & Doctors) only ONCE
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

  // 2. Fetch Live Appointments (This will run on an interval)
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
    // Run both immediately on load
    fetchStaticData();
    fetchLiveAppointments();

    // ⚡️ LIVE POLLING: Check for new appointments every 5 seconds
    const intervalId = setInterval(() => {
      fetchLiveAppointments();
    }, 5000);

    return () => { 
      clearInterval(intervalId); // Cleanup interval when leaving page
      if (toastTimer.current) clearTimeout(toastTimer.current); 
    };
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
      fetchLiveAppointments(); // Instant refresh on submit
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-white px-6 py-5 relative">
      {toast && (
        <div className="fixed top-28 right-6 z-[99999] bg-[#0f172a] border border-[#1e293b] text-white px-5 py-4 rounded-2xl shadow-2xl font-semibold">
          {toast}
        </div>
      )}

      <div className="max-w-[1650px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <p className="text-blue-500 font-bold text-sm">Appointment Management</p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Appointments</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm max-w-sm">Book, update and manage appointment schedules.</p>
          </div>

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
        </div>

        <div className="mb-3 pl-1">
          <div className="inline-flex items-center gap-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] px-3.5 py-1.5 rounded-xl shadow-sm">
            <CalendarDays size={14} className="text-blue-500" />
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Appointments</span>
              <span className="text-sm font-black text-slate-900 dark:text-white leading-none">{appointments.length}</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0f172a] shadow-sm overflow-hidden w-full h-auto mx-auto">
          <AppointmentTable appointments={filteredAppointments} startEdit={startEdit} setDeleteId={setDeleteId} />
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9998] px-4">
          <div className="fixed inset-0" onClick={() => setIsAddOpen(false)} />
          <div className="relative bg-white dark:bg-[#111827] w-full max-w-3xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl z-10 border border-slate-200 dark:border-slate-800">
            <button onClick={() => setIsAddOpen(false)} className="absolute top-6 right-6 w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-white"><X size={20} /></button>
            
            {/* ⚡️ ADDED existingAppointments PROP HERE */}
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

      {/* Existing Modals */}
      <EditAppointmentModal editId={editId} setEditId={setEditId} editData={editData} setEditData={setEditData} patients={patients} doctors={doctors} updateAppointment={updateAppointment} />
      <DeleteAppointmentModal deleteId={deleteId} setDeleteId={setDeleteId} deleteAppointment={deleteAppointment} />
    </div>
  );
}

export default Appointments;