import { useEffect, useState, useRef } from "react";
import { API_URL } from "../../api";
import { CalendarDays, Clock, X, AlertCircle, Plus, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import EmptyState from "../../components/ui/EmptyState";

function UserAppointments() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]); // Just the user's appointments for the table
  const [allAppointments, setAllAppointments] = useState([]); // ⚡️ ALL appointments to check global availability
  const [myPatientId, setMyPatientId] = useState(null); 
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  const currentUserEmail = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDocDropdownOpen, setIsDocDropdownOpen] = useState(false); // Custom dropdown state
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [form, setForm] = useState({ date: "", time: "", reason: "" });
  const [availableSlots, setAvailableSlots] = useState([]);

  // 📄 Pagination & Page Size States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const allSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

  // Show Toast Notification
  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3500);
  };

  const fetchMyPatientProfile = () => {
    fetch(`${API_URL}/patients/email/${currentUserEmail}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { if (data && data.id) setMyPatientId(data.id); })
      .catch(err => console.log("Profile is empty or not found.", err));
  };

  const fetchAppointments = () => {
    fetch(`${API_URL}/appointments`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async res => { if (!res.ok) throw new Error("Appointments route blocked"); return res.json(); })
      .then(data => { 
        if (Array.isArray(data)) {
          setAllAppointments(data); // ⚡️ Save all appointments to check slots against everyone
          setAppointments(data.filter(app => app.Patient && app.Patient.email === currentUserEmail)); 
        }
      })
      .catch(err => console.log(err.message));
  };

  useEffect(() => {
    fetchMyPatientProfile();
    fetch(`${API_URL}/doctors`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async res => { if (!res.ok) throw new Error("Doctors route blocked"); return res.json(); })
      .then(data => { if (Array.isArray(data)) setDoctors(data); })
      .catch(err => console.log(err.message));
    
    fetchAppointments();

    const intervalId = setInterval(() => {
      fetchAppointments();
    }, 5000);

    return () => { 
      clearInterval(intervalId);
      if (toastTimer.current) clearTimeout(toastTimer.current); 
    };
  }, [token, currentUserEmail]);

  const handleDoctorSelection = (docId) => {
    const doctorObj = doctors.find(d => String(d.id) === String(docId));
    setSelectedDoc(doctorObj || null);
    setForm({ date: "", time: "", reason: "" }); 
  };

  // ⚡️ Filter out already booked slots
  useEffect(() => {
    if (selectedDoc && form.date) {
      const bookedSlots = allAppointments
        .filter(app => String(app.doctorId) === String(selectedDoc.id) && app.appointmentDate === form.date)
        .map(app => app.appointmentTime);

      const freeSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
      setAvailableSlots(freeSlots);
    } else {
      setAvailableSlots([]); 
    }
  }, [selectedDoc, form.date, allAppointments]);

  const getTodayDateString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - offset).toISOString().split("T")[0];
  };

  const todayStr = getTodayDateString();

  const handleBook = async (e) => {
    e.preventDefault();

    if (!myPatientId) {
      return showToast("❌ Please go to 'Profile' and update your details first.");
    }
    if (!selectedDoc) return showToast("⚠️ Please select a doctor!");
    if (!form.time) return showToast("⚠️ Please select a free time slot!");
    
    try {
      const res = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          patientId: myPatientId, 
          doctorId: selectedDoc.id, 
          appointmentDate: form.date, 
          appointmentTime: form.time, 
          reason: form.reason || "General Checkup"
        })
      });

      if (res.ok) {
        showToast(`✅ Appointment successfully requested with Dr. ${selectedDoc.name}!`);
        fetchAppointments(); 
        closeModal();
      } else {
        const errorData = await res.json();
        showToast(`❌ Failed to book: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
      showToast("❌ Server error while booking.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDocDropdownOpen(false);
    setSelectedDoc(null);
    setForm({ date: "", time: "", reason: "" });
  };

  const getStatusStyle = (status) => {
    const s = (status || "PENDING").toLowerCase();
    if (s === "booked" || s === "confirmed" || s === "completed") return "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400";
    if (s === "cancelled") return "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400";
    return "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400";
  };

  // 🔢 Pagination Mathematics Configuration
  const totalItems = appointments.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  
  // Adjust safe-guard current page if items shrink
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [pageSize, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  // Slice original appointments array to represent only the current page view
  const currentPagedAppointments = appointments.slice(startIndex, startIndex + pageSize);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Always reset to page 1 when modifying size limits
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] px-6 py-5 text-slate-900 dark:text-white relative">
      {toast && (
        <div className="fixed top-24 right-6 z-[99999] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] text-slate-900 dark:text-white px-5 py-4 rounded-2xl shadow-xl font-semibold animate-in slide-in-from-right-10 fade-in duration-300">
          {toast}
        </div>
      )}

      <div className="max-w-[1650px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-blue-500 font-bold text-sm">Patient Portal</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Appointments</h1>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
          >
            <Plus size={20} />
            Book Appointment
          </button>
        </div>

        {appointments.length > 0 ? (
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-[#1e293b] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#1e293b] text-slate-500 dark:text-slate-400 text-[13px] font-semibold tracking-wide">
                    <th className="px-6 py-5 whitespace-nowrap">Appt ID</th>
                    <th className="px-6 py-5 whitespace-nowrap">
                      <span className="text-slate-300 dark:text-slate-600 mr-4 font-light">|</span> Doctor Name
                    </th>
                    <th className="px-6 py-5 whitespace-nowrap">
                      <span className="text-slate-300 dark:text-slate-600 mr-4 font-light">|</span> Date
                    </th>
                    <th className="px-6 py-5 whitespace-nowrap">
                      <span className="text-slate-300 dark:text-slate-600 mr-4 font-light">|</span> Time
                    </th>
                    <th className="px-6 py-5 whitespace-nowrap">
                      <span className="text-slate-300 dark:text-slate-600 mr-4 font-light">|</span> Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentPagedAppointments.map((app, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-slate-100 dark:border-[#1e293b] hover:bg-slate-50 dark:hover:bg-[#020817]/50 transition-colors last:border-0"
                    >
                      <td className="px-6 py-4 font-bold text-[13px] text-slate-700 dark:text-slate-300">
                        APT-{String(app.id || startIndex + index + 1).padStart(3, '0')}
                      </td>
                      <td className="px-6 py-4 text-[13px] font-medium text-slate-700 dark:text-slate-200">
                        {app.Doctor ? `${app.Doctor.name}` : "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-slate-600 dark:text-slate-400">
                        {app.appointmentDate}
                      </td>
                      <td className="px-6 py-4 text-[13px] font-bold text-slate-800 dark:text-slate-300">
                        {app.appointmentTime}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-md text-[11px] font-black uppercase tracking-wider ${getStatusStyle(app.status)}`}>
                          {app.status || "PENDING"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 📑 Dynamic Filter & Pagination Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 dark:border-[#1e293b] bg-slate-50/50 dark:bg-[#0f172a] text-sm text-slate-600 dark:text-slate-400 font-medium select-none">
              
              {/* Left Side: Page Size Picker */}
              <div className="flex items-center gap-2">
                <span>Page Size:</span>
                <div className="relative">
                  <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="appearance-none bg-white dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-lg pl-3 pr-8 py-1.5 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                </div>
              </div>

              {/* Right Side: Page Counts & Controls */}
              <div className="flex items-center gap-6">
                {/* Text Display: "1 to 5 of 5" */}
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{totalItems === 0 ? 0 : startIndex + 1}</span> to{" "}
                  <span className="font-bold text-slate-800 dark:text-slate-200">{endIndex}</span> of{" "}
                  <span className="font-bold text-slate-800 dark:text-slate-200">{totalItems}</span>
                </div>

                {/* Arrow Icons Controller */}
                <div className="flex items-center gap-1.5">
                  {/* First Page */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-md border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#020817] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e293b] disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-[#020817] transition-colors"
                  >
                    <ChevronsLeft size={16} />
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-md border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#020817] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e293b] disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-[#020817] transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {/* Center Text: "Page 1 of 1" */}
                  <span className="mx-2">
                    Page <span className="font-bold text-slate-800 dark:text-slate-200">{currentPage}</span> of{" "}
                    <span className="font-bold text-slate-800 dark:text-slate-200">{totalPages}</span>
                  </span>

                  {/* Next Page */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-md border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#020817] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e293b] disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-[#020817] transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-md border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#020817] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e293b] disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-[#020817] transition-colors"
                  >
                    <ChevronsRight size={16} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-5 shadow-sm">
            <EmptyState title="No Appointments" description="You have not booked any appointments yet." />
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">Book Appointment</h2>
              <button onClick={closeModal} className="p-2 bg-slate-100 dark:bg-[#1e293b] rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleBook} className="space-y-6">
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 ml-1">1. Select Doctor</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDocDropdownOpen(!isDocDropdownOpen)}
                    className="w-full flex items-center justify-between bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-xl px-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none text-left"
                  >
                    <span className={selectedDoc ? "text-slate-900 dark:text-white" : "text-slate-400"}>
                      {selectedDoc 
                        ? `${selectedDoc.name} - ${selectedDoc.specialization || "General"}` 
                        : "-- Choose a Doctor --"}
                    </span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isDocDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isDocDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 max-h-60 overflow-y-auto bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-xl shadow-xl animate-in fade-in slide-in-from-top-1 duration-100">
                      {doctors.map((doc) => (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => {
                            handleDoctorSelection(doc.id);
                            setIsDocDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-[#020817] text-slate-900 dark:text-white transition-colors border-b last:border-b-0 border-slate-100 dark:border-[#1e293b]"
                        >
                          {doc.name} - {doc.specialization || "General"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {selectedDoc && (selectedDoc.status === "On Leave" || selectedDoc.status === "Unavailable" || selectedDoc.status === "Off Duty") ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-start gap-3">
                  <AlertCircle size={22} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Doctor Unavailable</p>
                    <p className="text-sm mt-0.5">Dr. {selectedDoc.name} is currently {selectedDoc.status.toLowerCase()}.</p>
                  </div>
                </div>
              ) : selectedDoc && (
                <div className="space-y-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
                  
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 p-4 rounded-xl">
                    <p className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Doctor's Schedule</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                       <CalendarDays size={14}/> {selectedDoc.availableDays || "Monday - Friday"}
                    </p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mt-1">
                       <Clock size={14}/> {selectedDoc.availableTime || "09:00 AM - 05:00 PM"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 ml-1">2. Select Date</label>
                    <input 
                      type="date" required
                      className="w-full bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-xl px-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none dark:[color-scheme:dark]"
                      value={form.date} 
                      min={todayStr}
                      onChange={(e) => setForm({...form, date: e.target.value, time: ""})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 ml-1">3. Reason (Optional)</label>
                    <input 
                      type="text" placeholder="e.g. For sudden cough"
                      className="w-full bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-xl px-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                      value={form.reason} 
                      onChange={(e) => setForm({...form, reason: e.target.value})}
                    />
                  </div>

                  {form.date && (
                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 ml-1">4. Available Time Slots</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableSlots.length > 0 ? (
                          availableSlots.map(slot => (
                            <button 
                              type="button" key={slot}
                              onClick={() => setForm({...form, time: slot})}
                              className={`py-2.5 text-sm font-bold rounded-xl border transition-all ${
                                form.time === slot ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-slate-50 dark:bg-[#020817] border-slate-200 dark:border-[#1e293b] text-slate-500 hover:border-blue-500 hover:text-blue-500"
                              }`}
                            >
                              {slot}
                            </button>
                          ))
                        ) : (
                          <p className="col-span-3 text-sm text-red-500 font-semibold py-2">No slots available on this date. Please select another date.</p>
                        )}
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                  >
                    Confirm Booking
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserAppointments;