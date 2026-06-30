import React, { useEffect, useState, useRef } from "react";
import { API_URL } from "../../api";
import {
  CalendarDays, Clock, X, AlertCircle, Plus, ChevronDown,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Pill, MessageSquare, ChevronUp, Star, Send, Loader2,
  Calendar as CalendarIcon, Stethoscope
} from "lucide-react";
import EmptyState from "../../components/ui/EmptyState";

// ─── Doctor Schedule Tab ───────────────────────────────────────────────────
function DoctorSchedule({ token }) {
  const [schedules, setSchedules] = useState([]);

  const fetchSchedules = async () => {
    try {
      const res = await fetch(`${API_URL}/schedules?t=${new Date().getTime()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.schedules && Array.isArray(data.schedules)) setSchedules(data.schedules);
      }
    } catch (error) {
      console.error("Failed to fetch doctor schedules:", error);
    }
  };

  useEffect(() => {
    fetchSchedules();
    const id = setInterval(fetchSchedules, 5000);
    return () => clearInterval(id);
  }, [token]);

  const getStatusDetails = (status, isOnDutyToday) => {
    if (status !== "Available")
      return { text: "ON LEAVE", color: "text-red-500 bg-red-500/10 border-red-500/20", isAvailable: false };
    if (isOnDutyToday)
      return { text: "ON DUTY", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", isAvailable: true };
    return { text: "NEXT SHIFT", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", isAvailable: false };
  };

  if (schedules.length === 0)
    return <EmptyState title="No Doctors Available" description="There are currently no doctors scheduled." />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {schedules.map((doc, index) => {
        const statusInfo = getStatusDetails(doc.status, doc.isOnDutyToday);
        return (
          <div
            key={doc.id || index}
            className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-[#1e293b] p-6 sm:p-8 shadow-sm transition-all hover:border-blue-500/30"
          >
            <div className="flex justify-between items-start mb-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center">
                <Stethoscope size={24} />
              </div>
              <span className={`px-3 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${statusInfo.color}`}>
                <Clock size={12} strokeWidth={3} />
                {statusInfo.text}
              </span>
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">{doc.doctor}</h3>
              <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-1.5">
                {doc.specialization || "General"}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-4">
              <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Weekly Shift Schedule:
              </p>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 truncate">
                {doc.workingDays?.length > 0 ? doc.workingDays.join(" • ") : "Monday • Wednesday • Friday"}
              </p>
              <div className="w-full h-px bg-slate-200 dark:bg-[#1e293b] my-3.5" />
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                  <CalendarIcon size={15} />
                  <span className="text-sm font-medium">
                    {statusInfo.isAvailable ? "Available Today" : `Next Rotation: ${doc.day || "Soon"}`}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                  <Clock size={15} />
                  <span className="text-sm font-medium">{doc.time || "10:00 AM - 04:00 PM"}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
function UserAppointments() {
  const [activeTab, setActiveTab] = useState("appointments"); // "appointments" | "schedule"

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [myPatientId, setMyPatientId] = useState(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  const [openPrescription, setOpenPrescription] = useState(null);
  const [prescriptionCache, setPrescriptionCache] = useState({});
  const [loadingPrescription, setLoadingPrescription] = useState(null);

  const [openFeedback, setOpenFeedback] = useState(null);
  const [feedbackText, setFeedbackText] = useState({});
  const [feedbackRating, setFeedbackRating] = useState({});
  const [submittingFeedback, setSubmittingFeedback] = useState(null);
  const [submittedFeedback, setSubmittedFeedback] = useState({});

  const currentUserEmail = localStorage.getItem("userEmail");
  const currentUserName = localStorage.getItem("userName") || localStorage.getItem("user_userName") || "Patient";
  const token = localStorage.getItem("token");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDocDropdownOpen, setIsDocDropdownOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [form, setForm] = useState({ date: "", time: "", reason: "" });
  const [availableSlots, setAvailableSlots] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const allSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3500);
  };

  const fetchMyPatientProfile = () => {
    fetch(`${API_URL}/patients/email/${currentUserEmail}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { if (data?.id) setMyPatientId(data.id); })
      .catch(err => console.log("Profile fetch failed.", err));
  };

  const fetchAppointments = () => {
    fetch(`${API_URL}/appointments`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async res => { if (!res.ok) throw new Error("Blocked"); return res.json(); })
      .then(data => {
        if (Array.isArray(data)) {
          setAllAppointments(data);
          setAppointments(data.filter(app => app.Patient?.email === currentUserEmail));
        }
      })
      .catch(err => console.log(err.message));
  };

  useEffect(() => {
    fetchMyPatientProfile();
    fetch(`${API_URL}/doctors`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async res => { if (!res.ok) throw new Error("Blocked"); return res.json(); })
      .then(data => { if (Array.isArray(data)) setDoctors(data); })
      .catch(err => console.log(err.message));
    fetchAppointments();
    const intervalId = setInterval(fetchAppointments, 5000);
    return () => { clearInterval(intervalId); if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, [token, currentUserEmail]);

  useEffect(() => {
    if (!myPatientId) return;
    fetch(`${API_URL}/feedbacks/my?patientId=${myPatientId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const map = {};
          data.forEach(fb => { if (fb.appointmentId) map[fb.appointmentId] = true; });
          setSubmittedFeedback(map);
        }
      })
      .catch(() => {});
  }, [myPatientId]);

  const handleDoctorSelection = (docId) => {
    setSelectedDoc(doctors.find(d => String(d.id) === String(docId)) || null);
    setForm({ date: "", time: "", reason: "" });
  };

  useEffect(() => {
    if (selectedDoc && form.date) {
      const booked = allAppointments
        .filter(app => String(app.doctorId) === String(selectedDoc.id) && app.appointmentDate === form.date)
        .map(app => app.appointmentTime);
      setAvailableSlots(allSlots.filter(s => !booked.includes(s)));
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDoc, form.date, allAppointments]);

  const getTodayDateString = () => {
    const today = new Date();
    return new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  };
  const todayStr = getTodayDateString();

  const handleBook = async (e) => {
    e.preventDefault();
    if (!myPatientId) return showToast("❌ Please update your profile details first.");
    if (!selectedDoc) return showToast("⚠️ Please select a doctor!");
    if (!form.time) return showToast("⚠️ Please select a free time slot!");
    try {
      const res = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ patientId: myPatientId, doctorId: selectedDoc.id, appointmentDate: form.date, appointmentTime: form.time, reason: form.reason || "General Checkup" })
      });
      if (res.ok) {
        showToast(`✅ Appointment booked with Dr. ${selectedDoc.name}!`);
        fetchAppointments();
        closeModal();
      } else {
        const err = await res.json();
        showToast(`❌ Failed: ${err.message}`);
      }
    } catch { showToast("❌ Server error."); }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDocDropdownOpen(false);
    setSelectedDoc(null);
    setForm({ date: "", time: "", reason: "" });
  };

  const togglePrescription = async (appId, patientId) => {
    if (openPrescription === appId) { setOpenPrescription(null); return; }
    setOpenPrescription(appId);
    if (prescriptionCache[appId] !== undefined) return;
    setLoadingPrescription(appId);
    try {
      const res = await fetch(`${API_URL}/prescriptions`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      const mine = Array.isArray(data) ? data.filter(p => String(p.patientId) === String(patientId)) : [];
      mine.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPrescriptionCache(prev => ({ ...prev, [appId]: mine[0] || null }));
    } catch {
      setPrescriptionCache(prev => ({ ...prev, [appId]: null }));
    } finally {
      setLoadingPrescription(null);
    }
  };

  const toggleFeedback = (appId) => setOpenFeedback(prev => prev === appId ? null : appId);

  const handleFeedbackSubmit = async (app) => {
    const text = feedbackText[app.id] || "";
    const rating = feedbackRating[app.id] || 0;
    if (!text.trim()) return showToast("⚠️ Please write your feedback.");
    if (!rating) return showToast("⚠️ Please select a star rating.");
    setSubmittingFeedback(app.id);
    try {
      const res = await fetch(`${API_URL}/feedbacks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          patientId: myPatientId, doctorId: app.doctorId, rating, comment: text, feedback: text,
          appointmentId: app.id, name: localStorage.getItem("userName") || `Patient ${myPatientId}`,
          email: localStorage.getItem("userEmail") || "",
        })
      });
      if (res.ok) {
        setSubmittedFeedback(prev => ({ ...prev, [app.id]: true }));
        setOpenFeedback(null);
        showToast("✅ Feedback submitted!");
      } else { showToast("❌ Failed to submit feedback."); }
    } catch { showToast("❌ Server error."); }
    finally { setSubmittingFeedback(null); }
  };

  const getStatusStyle = (status) => {
    const s = (status || "PENDING").toLowerCase();
    if (s === "booked" || s === "confirmed" || s === "completed") return "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400";
    if (s === "cancelled") return "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400";
    return "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400";
  };

  const totalItems = appointments.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [pageSize, totalPages, currentPage]);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentPagedAppointments = appointments.slice(startIndex, startIndex + pageSize);

  // ─── Tab config ──────────────────────────────────────────────────────────
  const tabs = [
    { id: "appointments", label: "My Appointments", icon: <CalendarDays size={16} /> },
    { id: "schedule",     label: "Doctor Schedule",  icon: <Stethoscope size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] px-6 py-5 text-slate-900 dark:text-white relative">
      {toast && (
        <div className="fixed top-24 right-6 z-[99999] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] text-slate-900 dark:text-white px-5 py-4 rounded-2xl shadow-xl font-semibold animate-in slide-in-from-right-10 fade-in duration-300">
          {toast}
        </div>
      )}

      <div className="max-w-[1650px] mx-auto">

        {/* ── Header Row ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-blue-500 font-bold text-sm mb-1">Patient Portal</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              {getGreeting()},{" "}
              <span className="text-blue-500">{currentUserName}</span> 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
              Manage your appointments and track your health journey.
            </p>
          </div>
          {activeTab === "appointments" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] shrink-0"
            >
              <Plus size={20} /> Book Appointment
            </button>
          )}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 p-1 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-xl w-fit mb-6 shadow-sm">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-blue-400 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e293b]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: My Appointments ── */}
        {activeTab === "appointments" && (
          appointments.length > 0 ? (
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-[#1e293b] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-[#1e293b] text-slate-500 dark:text-slate-400 text-[13px] font-semibold tracking-wide">
                      <th className="px-6 py-5 whitespace-nowrap">Appt ID</th>
                      <th className="px-6 py-5 whitespace-nowrap"><span className="text-slate-300 dark:text-slate-600 mr-4 font-light">|</span>Doctor Name</th>
                      <th className="px-6 py-5 whitespace-nowrap"><span className="text-slate-300 dark:text-slate-600 mr-4 font-light">|</span>Date</th>
                      <th className="px-6 py-5 whitespace-nowrap"><span className="text-slate-300 dark:text-slate-600 mr-4 font-light">|</span>Time</th>
                      <th className="px-6 py-5 whitespace-nowrap"><span className="text-slate-300 dark:text-slate-600 mr-4 font-light">|</span>Status</th>
                      <th className="px-6 py-5 whitespace-nowrap"><span className="text-slate-300 dark:text-slate-600 mr-4 font-light">|</span>Prescription</th>
                      <th className="px-6 py-5 whitespace-nowrap"><span className="text-slate-300 dark:text-slate-600 mr-4 font-light">|</span>Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPagedAppointments.map((app, index) => {
                      const isCompleted = (app.status || "").toLowerCase() === "completed";
                      const isPrescriptionOpen = openPrescription === app.id;
                      const isFeedbackOpen = openFeedback === app.id;
                      const prescription = prescriptionCache[app.id];
                      const alreadySubmitted = submittedFeedback[app.id];

                      return (
                        <React.Fragment key={app.id}>
                          <tr className="border-b border-slate-100 dark:border-[#1e293b] hover:bg-slate-50 dark:hover:bg-[#020817]/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-[13px] text-slate-700 dark:text-slate-300">
                              APT-{String(app.id || startIndex + index + 1).padStart(3, "0")}
                            </td>
                            <td className="px-6 py-4 text-[13px] font-medium text-slate-700 dark:text-slate-200">
                              {app.Doctor ? app.Doctor.name : "Unknown"}
                            </td>
                            <td className="px-6 py-4 text-[13px] text-slate-600 dark:text-slate-400">{app.appointmentDate}</td>
                            <td className="px-6 py-4 text-[13px] font-bold text-slate-800 dark:text-slate-300">{app.appointmentTime}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1.5 rounded-md text-[11px] font-black uppercase tracking-wider ${getStatusStyle(app.status)}`}>
                                {app.status || "PENDING"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {isCompleted ? (
                                <button
                                  onClick={() => togglePrescription(app.id, app.patientId)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                                    isPrescriptionOpen
                                      ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                                      : "bg-purple-500/10 text-purple-500 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20"
                                  }`}
                                >
                                  <Pill size={12} /> View {isPrescriptionOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                </button>
                              ) : <span className="text-slate-400 text-[12px]">—</span>}
                            </td>
                            <td className="px-6 py-4">
                              {isCompleted ? (
                                alreadySubmitted ? (
                                  <span className="text-[11px] text-emerald-500 font-bold">✓ Submitted</span>
                                ) : (
                                  <button
                                    onClick={() => toggleFeedback(app.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                                      isFeedbackOpen
                                        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                        : "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                                    }`}
                                  >
                                    <MessageSquare size={12} /> Rate {isFeedbackOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                  </button>
                                )
                              ) : <span className="text-slate-400 text-[12px]">—</span>}
                            </td>
                          </tr>

                          {isPrescriptionOpen && (
                            <tr className="border-b border-slate-100 dark:border-[#1e293b] bg-purple-50/50 dark:bg-purple-500/5">
                              <td colSpan={7} className="px-6 py-4">
                                {loadingPrescription === app.id ? (
                                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Loader2 size={14} className="animate-spin" /> Loading prescription…
                                  </div>
                                ) : prescription ? (
                                  <div className="space-y-2">
                                    <p className="text-[11px] font-black text-purple-500 uppercase tracking-wider mb-2">
                                      Prescription · Dr. {prescription.Doctor?.name} · {new Date(prescription.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {(prescription.medicines || []).map((med, i) => {
                                        const sd = med.structuredData || {};
                                        return (
                                          <div key={i} className="bg-white dark:bg-[#0f172a] border border-purple-200 dark:border-purple-500/20 rounded-xl px-4 py-2.5 flex items-center gap-2.5">
                                            <Pill size={13} className="text-purple-500 shrink-0" />
                                            <div>
                                              <p className="text-[13px] font-bold text-slate-800 dark:text-white">{med.medicineName}</p>
                                              <p className="text-[11px] text-slate-500">
                                                {sd.doseQty && `${sd.doseQty} ${sd.doseUnit || ""}`}
                                                {sd.schedule?.length ? ` · ${sd.schedule.join(", ")}` : ""}
                                                {sd.duration ? ` · ${sd.duration}` : ""}
                                              </p>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-slate-400">No prescription found for this appointment.</p>
                                )}
                              </td>
                            </tr>
                          )}

                          {isFeedbackOpen && (
                            <tr className="border-b border-slate-100 dark:border-[#1e293b] bg-amber-50/50 dark:bg-amber-500/5">
                              <td colSpan={7} className="px-6 py-4">
                                <div className="max-w-lg space-y-3">
                                  <p className="text-[11px] font-black text-amber-500 uppercase tracking-wider">
                                    Rate your visit · Dr. {app.Doctor?.name}
                                  </p>
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                      <button key={star} onClick={() => setFeedbackRating(prev => ({ ...prev, [app.id]: star }))} className="transition-transform hover:scale-110">
                                        <Star size={20} className={star <= (feedbackRating[app.id] || 0) ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600"} />
                                      </button>
                                    ))}
                                    <span className="ml-2 text-[12px] text-slate-500 font-medium">{feedbackRating[app.id] || 0} / 5</span>
                                  </div>
                                  <textarea
                                    rows={2}
                                    placeholder="Share your experience…"
                                    value={feedbackText[app.id] || ""}
                                    onChange={e => setFeedbackText(prev => ({ ...prev, [app.id]: e.target.value }))}
                                    className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleFeedbackSubmit(app)}
                                      disabled={submittingFeedback === app.id}
                                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[12px] font-bold transition-all disabled:opacity-60"
                                    >
                                      {submittingFeedback === app.id ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                                      {submittingFeedback === app.id ? "Submitting…" : "Submit"}
                                    </button>
                                    <button onClick={() => setOpenFeedback(null)} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-[#1e293b] text-slate-500 text-[12px] font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 dark:border-[#1e293b] bg-slate-50/50 dark:bg-[#0f172a] text-sm text-slate-600 dark:text-slate-400 font-medium select-none">
                <div className="flex items-center gap-2">
                  <span>Page Size:</span>
                  <div className="relative">
                    <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="appearance-none bg-white dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-lg pl-3 pr-8 py-1.5 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{totalItems === 0 ? 0 : startIndex + 1}</span> to{" "}
                    <span className="font-bold text-slate-800 dark:text-slate-200">{endIndex}</span> of{" "}
                    <span className="font-bold text-slate-800 dark:text-slate-200">{totalItems}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-1.5 rounded-md border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#020817] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e293b] disabled:opacity-30 transition-colors"><ChevronsLeft size={16} /></button>
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-1.5 rounded-md border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#020817] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e293b] disabled:opacity-30 transition-colors"><ChevronLeft size={16} /></button>
                    <span className="mx-2">Page <span className="font-bold text-slate-800 dark:text-slate-200">{currentPage}</span> of <span className="font-bold text-slate-800 dark:text-slate-200">{totalPages}</span></span>
                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-1.5 rounded-md border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#020817] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e293b] disabled:opacity-30 transition-colors"><ChevronRight size={16} /></button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-1.5 rounded-md border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#020817] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e293b] disabled:opacity-30 transition-colors"><ChevronsRight size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-5 shadow-sm">
              <EmptyState title="No Appointments" description="You have not booked any appointments yet." />
            </div>
          )
        )}

        {/* ── Tab: Doctor Schedule ── */}
        {activeTab === "schedule" && (
          <DoctorSchedule token={token} />
        )}
      </div>

      {/* ── Book Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">Book Appointment</h2>
              <button onClick={closeModal} className="p-2 bg-slate-100 dark:bg-[#1e293b] rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleBook} className="space-y-6">
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 ml-1">1. Select Doctor</label>
                <div className="relative">
                  <button type="button" onClick={() => setIsDocDropdownOpen(!isDocDropdownOpen)} className="w-full flex items-center justify-between bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-xl px-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none text-left">
                    <span className={selectedDoc ? "text-slate-900 dark:text-white" : "text-slate-400"}>
                      {selectedDoc ? `${selectedDoc.name} - ${selectedDoc.specialization || "General"}` : "-- Choose a Doctor --"}
                    </span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isDocDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isDocDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 max-h-60 overflow-y-auto bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-xl shadow-xl">
                      {doctors.map((doc) => (
                        <button key={doc.id} type="button" onClick={() => { handleDoctorSelection(doc.id); setIsDocDropdownOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-[#020817] text-slate-900 dark:text-white transition-colors border-b last:border-b-0 border-slate-100 dark:border-[#1e293b]">
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
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"><CalendarDays size={14} /> {selectedDoc.availableDays || "Monday - Friday"}</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mt-1"><Clock size={14} /> {selectedDoc.availableTime || "09:00 AM - 05:00 PM"}</p>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 ml-1">2. Select Date</label>
                    <input type="date" required className="w-full bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-xl px-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none dark:[color-scheme:dark]" value={form.date} min={todayStr} onChange={(e) => setForm({ ...form, date: e.target.value, time: "" })} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 ml-1">3. Reason (Optional)</label>
                    <input type="text" placeholder="e.g. For sudden cough" className="w-full bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-xl px-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
                  </div>
                  {form.date && (
                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 ml-1">4. Available Time Slots</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableSlots.length > 0 ? availableSlots.map(slot => (
                          <button type="button" key={slot} onClick={() => setForm({ ...form, time: slot })} className={`py-2.5 text-sm font-bold rounded-xl border transition-all ${form.time === slot ? "bg-blue-400 border-blue-400 text-white shadow-md shadow-blue-500/20" : "bg-slate-50 dark:bg-[#020817] border-slate-200 dark:border-[#1e293b] text-slate-500 hover:border-blue-500 hover:text-blue-500"}`}>{slot}</button>
                        )) : <p className="col-span-3 text-sm text-red-500 font-semibold py-2">No slots available. Please select another date.</p>}
                      </div>
                    </div>
                  )}
                  <button type="submit" className="w-full py-4 mt-2 bg-blue-400 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]">Confirm Booking</button>
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