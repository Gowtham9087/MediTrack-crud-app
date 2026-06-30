import { useState, useEffect, useRef } from "react";
import { 
  CalendarDays, Pill, CheckCircle2, Clock, Plus, Trash2, X, 
  FileText, Sun, CloudSun, Moon, Coffee, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Check
} from "lucide-react";
import { API_URL } from "../../api";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [prescribedAppointmentIds, setPrescribedAppointmentIds] = useState(new Set());
  const [inventory, setInventory] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  const [prescriptionList, setPrescriptionList] = useState([]);
  
  const [isCustomMed, setIsCustomMed] = useState(false);
  // Multi-select: array of selected medicine names from inventory
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [customMedInput, setCustomMedInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [doseQty, setDoseQty] = useState("1");
  const [doseUnit, setDoseUnit] = useState("Tablet");
  const [durationVal, setDurationVal] = useState("5");
  const [durationUnit, setDurationUnit] = useState("Days");
  
  const [freqMorning, setFreqMorning] = useState(true);
  const [freqAfternoon, setFreqAfternoon] = useState(false);
  const [freqNight, setFreqNight] = useState(true);
  
  const [mealTiming, setMealTiming] = useState("After Food");
  const [notesInput, setNotesInput] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const currentDoctorName = localStorage.getItem("doctor_userName") || "Doctor";
  const currentDoctorId = localStorage.getItem("doctor_userId");
  const token = localStorage.getItem("doctor_token");

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3500);
  };

  const fetchData = async () => {
    try {
      const appRes = await fetch(`${API_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (appRes.ok) {
        const appData = await appRes.json();
        const myAppointments = appData.filter(
          (app) => String(app.doctorId) === String(currentDoctorId)
        );
        setAppointments(myAppointments);
      }

      const presRes = await fetch(`${API_URL}/prescriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (presRes.ok) {
        const presData = await presRes.json();
        const myPrescriptions = Array.isArray(presData)
          ? presData.filter((p) => String(p.doctorId) === String(currentDoctorId))
          : [];
        const doneIds = new Set(myPrescriptions.map((p) => String(p.appointmentId)));
        setPrescribedAppointmentIds(doneIds);
      }

      const invRes = await fetch(`${API_URL}/medicines`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (invRes.ok) {
        const invData = await invRes.json();
        if (Array.isArray(invData)) setInventory(invData);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentDoctorId, token]);

  const pendingAppointments = appointments.filter(
    (app) => !prescribedAppointmentIds.has(String(app.id))
  );

  const totalItems = pendingAppointments.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [pageSize, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentPagedAppointments = pendingAppointments.slice(startIndex, startIndex + pageSize);

  const resetForm = () => {
    setSelectedMeds([]);
    setCustomMedInput("");
    setDoseQty("1");
    setDoseUnit("Tablet");
    setDurationVal("5");
    setDurationUnit("Days");
    setFreqMorning(true);
    setFreqAfternoon(false);
    setFreqNight(true);
    setMealTiming("After Food");
    setNotesInput("");
  };

  const openPrescriptionModal = (appointment) => {
    setSelectedAppointment(appointment);
    setPrescriptionList([]);
    resetForm();
    setIsPrescriptionModalOpen(true);
  };

  const closePrescriptionModal = () => {
    setIsPrescriptionModalOpen(false);
    setSelectedAppointment(null);
  };

  const toggleMedSelection = (medName) => {
    setSelectedMeds(prev =>
      prev.includes(medName)
        ? prev.filter(m => m !== medName)
        : [...prev, medName]
    );
  };

  const handleAddMedicine = () => {
    const medsToAdd = isCustomMed
      ? (customMedInput.trim() ? [customMedInput.trim()] : [])
      : selectedMeds;

    if (medsToAdd.length === 0) {
      return showToast("⚠️ Please select or enter at least one medicine.");
    }
    if (!freqMorning && !freqAfternoon && !freqNight) {
      return showToast("⚠️ Please select at least one time of day.");
    }

    const times = [];
    if (freqMorning) times.push("Morning");
    if (freqAfternoon) times.push("Afternoon");
    if (freqNight) times.push("Night");

    const newMeds = medsToAdd.map(medName => ({
      medicineName: medName,
      dosage: `${doseQty} ${doseUnit} - ${times.length} time(s) a day (${times.join(", ")})`,
      structuredData: {
        doseQty,
        doseUnit,
        duration: `${durationVal} ${durationUnit}`,
        schedule: times,
        mealTiming,
      },
      notes: notesInput || "None",
      isCustom: isCustomMed,
    }));

    setPrescriptionList(prev => [...prev, ...newMeds]);
    resetForm();
    showToast(`✅ ${newMeds.length} medicine${newMeds.length > 1 ? "s" : ""} added to cart.`);
  };

  const handleRemoveMedicine = (indexToRemove) => {
    setPrescriptionList(prescriptionList.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmitPrescription = async () => {
    if (prescriptionList.length === 0)
      return showToast("⚠️ Add at least one medicine to the prescription!");

    try {
      const res = await fetch(`${API_URL}/prescriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId: selectedAppointment.patientId,
          doctorId: currentDoctorId,
          appointmentId: selectedAppointment.id,
          medicines: prescriptionList,
        }),
      });

      if (res.ok) {
        showToast("✅ Prescription sent successfully!");
        setPrescribedAppointmentIds((prev) => new Set([...prev, String(selectedAppointment.id)]));
        closePrescriptionModal();
      } else {
        showToast("❌ Failed to save prescription. Check server.");
      }
    } catch (error) {
      console.error(error);
      showToast("✅ Simulated save (Backend route pending)");
      setPrescribedAppointmentIds((prev) => new Set([...prev, String(selectedAppointment.id)]));
      closePrescriptionModal();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] px-4 sm:px-6 py-5 text-slate-900 dark:text-white transition-colors duration-300 relative">

      {toast && (
        <div className="fixed top-24 right-4 sm:right-6 z-[99999] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] text-slate-900 dark:text-white px-5 py-4 rounded-2xl shadow-xl font-semibold">
          {toast}
        </div>
      )}

      <div className="max-w-[1650px] mx-auto">
        <div className="mb-8">
          <p className="text-blue-500 font-bold text-sm mb-1">Doctor Portal</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight line-clamp-1">
            Welcome, Dr. {currentDoctorName}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
            Manage your daily appointments and patient prescriptions.
          </p>
        </div>

        <div className="bg-white dark:bg-[#0f172a] rounded-[24px] border border-slate-200 dark:border-[#1e293b] p-5 sm:p-6 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-2 border-b border-slate-100 dark:border-[#1e293b]">
            <div className="flex items-center gap-4 w-full">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <CalendarDays size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-black">Today's Queue</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Patients waiting for consultation.</p>
              </div>
              {pendingAppointments.length > 0 && (
                <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black px-3 py-1.5 rounded-full whitespace-nowrap">
                  {pendingAppointments.length} pending
                </span>
              )}
            </div>
          </div>

          {/* MOBILE VIEW */}
          <div className="sm:hidden space-y-4">
            {currentPagedAppointments.length > 0 ? (
              currentPagedAppointments.map((app) => (
                <div key={app.id} className="bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-[#1e293b] pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[14px] text-slate-900 dark:text-white line-clamp-1 pr-2">
                      {app.Patient ? app.Patient.name : "Unknown Patient"}
                    </h3>
                    <span className="text-[12px] font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1 shrink-0">
                      <Clock size={12} /> {app.appointmentTime}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-1">
                    <span className="font-semibold capitalize">{app.reason || "General Checkup"}</span>
                  </p>
                  <button
                    onClick={() => openPrescriptionModal(app)}
                    className="w-full bg-blue-400 hover:bg-blue-500 text-white text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    <Pill size={16} /> Write Prescription
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-[#1e293b] rounded-full flex items-center justify-center border border-slate-100 dark:border-[#1e293b] mx-auto">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                  </div>
                  <p className="font-bold text-[13px] text-slate-500">All caught up!</p>
                </div>
              </div>
            )}
          </div>

          {/* DESKTOP VIEW */}
          <div className="hidden sm:block overflow-x-auto border border-slate-200 dark:border-[#1e293b] rounded-2xl bg-white dark:bg-[#0f172a]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-500 dark:text-[#94a3b8] text-[13px] border-b border-slate-200 dark:border-[#1e293b] bg-slate-50/50 dark:bg-[#020817]/50">
                  <th className="px-6 py-4 font-semibold w-[30%]">Patient Name</th>
                  <th className="px-6 py-4 font-semibold w-[20%]">Time</th>
                  <th className="px-6 py-4 font-semibold w-[30%]">Reason</th>
                  <th className="pl-6 pr-12 py-4 font-semibold w-[20%] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#1e293b]">
                {currentPagedAppointments.length > 0 ? (
                  currentPagedAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-[#1e293b]/50 transition-colors">
                      <td className="px-6 py-4 text-[14px] font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {app.Patient ? app.Patient.name : "Unknown Patient"}
                      </td>
                      <td className="px-6 py-4 text-[14px] font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {app.appointmentTime}
                      </td>
                      <td className="px-6 py-4 text-[14px] font-semibold text-slate-700 dark:text-slate-300 capitalize truncate max-w-[250px]">
                        {app.reason || "General Checkup"}
                      </td>
                      <td className="pl-6 pr-12 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => openPrescriptionModal(app)}
                          className="inline-flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-md active:scale-95"
                        >
                          <Pill size={14} /> Write Prescription
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-16 text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-[#1e293b] rounded-full flex items-center justify-center border border-slate-100 dark:border-[#1e293b] mx-auto">
                          <CheckCircle2 size={20} className="text-emerald-400" />
                        </div>
                        <p className="font-bold text-[13px] text-slate-500">All caught up!</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {pendingAppointments.length > 0 && (
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
            )}
          </div>
        </div>
      </div>

      {/* PRESCRIPTION MODAL */}
      {isPrescriptionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] w-full max-w-6xl rounded-[24px] shadow-2xl flex flex-col max-h-[90dvh] overflow-hidden">
            
            <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-slate-100 dark:border-[#1e293b] flex justify-between items-center bg-slate-50/50 dark:bg-[#020817]/50">
              <div>
                <h2 className="text-lg sm:text-2xl font-black flex items-center gap-2 sm:gap-3">
                  <FileText className="text-blue-500 w-5 sm:w-6" /> Issue Prescription
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Patient: <span className="font-bold text-blue-500">{selectedAppointment?.Patient?.name}</span>
                </p>
              </div>
              <button onClick={closePrescriptionModal} className="p-2 bg-slate-200/50 dark:bg-[#1e293b] rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
              
              {/* LEFT: Form */}
              <div className="flex-1 p-5 sm:p-8 overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-[#1e293b]">
                <h3 className="text-[12px] sm:text-[13px] font-black text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                  <Plus size={16} /> Add Medicine
                </h3>

                <div className="space-y-5">
                  {/* Inventory / Custom toggle */}
                  <div className="flex gap-4 sm:gap-6 bg-slate-50 dark:bg-[#020817] p-1.5 sm:p-2 rounded-xl w-max border border-slate-200 dark:border-[#1e293b]">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-bold cursor-pointer px-2 sm:px-3 py-1">
                      <input type="radio" checked={!isCustomMed} onChange={() => { setIsCustomMed(false); resetForm(); }} className="accent-blue-600 w-4 h-4" />
                      Inventory
                    </label>
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-bold cursor-pointer px-2 sm:px-3 py-1">
                      <input type="radio" checked={isCustomMed} onChange={() => { setIsCustomMed(true); resetForm(); }} className="accent-blue-600 w-4 h-4" />
                      Custom
                    </label>
                  </div>

                  {/* Medicine selector */}
                  <div>
                    <label className="block text-[11px] sm:text-[12px] font-bold text-slate-500 mb-2">
                      Medicine Name {!isCustomMed && <span className="text-blue-500 ml-1">— select multiple</span>}
                    </label>

                    {isCustomMed ? (
                      <input
                        type="text"
                        placeholder="e.g. Amoxicillin 500mg"
                        className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-[#1e293b] rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500"
                        value={customMedInput}
                        onChange={(e) => setCustomMedInput(e.target.value)}
                      />
                    ) : (
                      <div className="relative" ref={dropdownRef}>
                        {/* Trigger button */}
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-[#1e293b] rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 flex items-center justify-between text-left"
                        >
                          <span className={selectedMeds.length === 0 ? "text-slate-400" : "text-slate-900 dark:text-white"}>
                            {selectedMeds.length === 0
                              ? "-- Select medicines --"
                              : `${selectedMeds.length} medicine${selectedMeds.length > 1 ? "s" : ""} selected`}
                          </span>
                          <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        {/* Selected pills */}
                        {selectedMeds.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {selectedMeds.map(med => (
                              <span key={med} className="flex items-center gap-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 text-[11px] font-bold px-2.5 py-1 rounded-full">
                                {med}
                                <button onClick={() => toggleMedSelection(med)} className="hover:text-red-500 transition-colors ml-0.5">
                                  <X size={11} />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Dropdown list */}
                        {isDropdownOpen && (
                          <div className="absolute z-50 w-full mt-1 max-h-56 overflow-y-auto bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-xl shadow-xl">
                            {inventory.length === 0 ? (
                              <p className="text-sm text-slate-400 text-center py-4">No inventory found.</p>
                            ) : (
                              inventory.map((med) => {
                                const isSelected = selectedMeds.includes(med.name);
                                return (
                                  <button
                                    key={med.id}
                                    type="button"
                                    onClick={() => toggleMedSelection(med.name)}
                                    className={`w-full text-left px-4 py-3 text-sm font-semibold flex items-center justify-between gap-3 border-b last:border-b-0 border-slate-100 dark:border-[#1e293b] transition-colors ${
                                      isSelected
                                        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                        : "hover:bg-slate-50 dark:hover:bg-[#1e293b] text-slate-800 dark:text-slate-200"
                                    }`}
                                  >
                                    <span>{med.name} <span className="text-slate-400 font-normal text-[12px]">({med.stock > 0 ? `${med.stock} in stock` : "Out of stock"})</span></span>
                                    <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                                      isSelected ? "bg-blue-500 border-blue-500" : "border-slate-300 dark:border-[#1e293b]"
                                    }`}>
                                      {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                                    </span>
                                  </button>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Dosage + Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] sm:text-[12px] font-bold text-slate-500 mb-2">Dosage</label>
                      <div className="flex gap-2">
                        <input type="number" min="0.5" step="0.5" className="w-16 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-[#1e293b] rounded-xl px-2 py-3 text-sm font-semibold outline-none focus:border-blue-500 text-center" value={doseQty} onChange={(e) => setDoseQty(e.target.value)} />
                        <select className="flex-1 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-[#1e293b] rounded-xl px-3 py-3 text-sm font-semibold outline-none focus:border-blue-500" value={doseUnit} onChange={(e) => setDoseUnit(e.target.value)}>
                          <option>Tablet</option>
                          <option>Capsule</option>
                          <option>ml</option>
                          <option>Drops</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] sm:text-[12px] font-bold text-slate-500 mb-2">Duration</label>
                      <div className="flex gap-2">
                        <input type="number" min="1" className="w-16 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-[#1e293b] rounded-xl px-2 py-3 text-sm font-semibold outline-none focus:border-blue-500 text-center" value={durationVal} onChange={(e) => setDurationVal(e.target.value)} />
                        <select className="flex-1 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-[#1e293b] rounded-xl px-3 py-3 text-sm font-semibold outline-none focus:border-blue-500" value={durationUnit} onChange={(e) => setDurationUnit(e.target.value)}>
                          <option>Days</option>
                          <option>Weeks</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div>
                    <label className="block text-[11px] sm:text-[12px] font-bold text-slate-500 mb-2">Schedule</label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <button onClick={() => setFreqMorning(!freqMorning)} className={`flex flex-col items-center gap-1 sm:gap-1.5 py-2 sm:py-3 rounded-xl border-2 transition-all ${freqMorning ? 'border-amber-400 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0f172a] text-slate-400'}`}>
                        <Sun size={18} /> <span className="text-[10px] sm:text-xs font-bold">Morning</span>
                      </button>
                      <button onClick={() => setFreqAfternoon(!freqAfternoon)} className={`flex flex-col items-center gap-1 sm:gap-1.5 py-2 sm:py-3 rounded-xl border-2 transition-all ${freqAfternoon ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400' : 'border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0f172a] text-slate-400'}`}>
                        <CloudSun size={18} /> <span className="text-[10px] sm:text-xs font-bold">Afternoon</span>
                      </button>
                      <button onClick={() => setFreqNight(!freqNight)} className={`flex flex-col items-center gap-1 sm:gap-1.5 py-2 sm:py-3 rounded-xl border-2 transition-all ${freqNight ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0f172a] text-slate-400'}`}>
                        <Moon size={18} /> <span className="text-[10px] sm:text-xs font-bold">Night</span>
                      </button>
                    </div>
                  </div>

                  {/* Meal Timing */}
                  <div>
                    <label className="block text-[11px] sm:text-[12px] font-bold text-slate-500 mb-2">Meal Timing</label>
                    <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-[#1e293b] p-1.5 rounded-xl w-max">
                      {["Before Food", "After Food", "Empty Stomach"].map((timing) => (
                        <button key={timing} onClick={() => setMealTiming(timing)} className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${mealTiming === timing ? 'bg-white dark:bg-[#0f172a] text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                          {timing}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div>
                    <label className="block text-[11px] sm:text-[12px] font-bold text-slate-500 mb-2">Instructions (Optional)</label>
                    <input type="text" placeholder="e.g. Drink plenty of water" className="w-full bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-[#1e293b] rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500" value={notesInput} onChange={(e) => setNotesInput(e.target.value)} />
                  </div>

                  <button onClick={handleAddMedicine} className="w-full py-3.5 bg-blue-400 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 font-bold rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2 mt-2">
                    <Plus size={18} /> Add to Patient Cart
                    {!isCustomMed && selectedMeds.length > 1 && (
                      <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full ml-1">
                        {selectedMeds.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* RIGHT: Cart */}
              <div className="flex-1 bg-slate-50 dark:bg-[#020817] p-5 sm:p-8 overflow-y-auto flex flex-col">
                <div className="flex justify-between items-end mb-5">
                  <h3 className="text-[12px] sm:text-[13px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Pill size={16} /> Current Cart ({prescriptionList.length})
                  </h3>
                </div>

                <div className="flex-1">
                  {prescriptionList.length > 0 ? (
                    <div className="space-y-3">
                      {prescriptionList.map((item, index) => (
                        <div key={index} className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] p-4 sm:p-5 rounded-2xl shadow-sm relative group">
                          <button onClick={() => handleRemoveMedicine(index)} className="absolute top-3 right-3 p-1.5 sm:p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-100 lg:opacity-0 group-hover:opacity-100">
                            <Trash2 size={16} />
                          </button>
                          <div className="pr-8">
                            <h4 className="font-bold text-[14px] sm:text-[15px] flex items-center gap-2 flex-wrap">
                              {item.medicineName}
                              {item.isCustom && <span className="text-[9px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded uppercase tracking-wider">Custom</span>}
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <div className="bg-slate-100 dark:bg-[#1e293b] text-slate-700 dark:text-slate-300 text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 rounded-md flex items-center gap-1">
                                <Pill size={12} className="text-blue-500" /> {item.structuredData?.doseQty} {item.structuredData?.doseUnit}
                              </div>
                              <div className="bg-slate-100 dark:bg-[#1e293b] text-slate-700 dark:text-slate-300 text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 rounded-md flex items-center gap-1">
                                <Clock size={12} className="text-indigo-500" /> {item.structuredData?.schedule?.join(", ")}
                              </div>
                            </div>
                            <div className="mt-3 text-[11px] sm:text-[12px] text-slate-500 font-medium flex items-center gap-1.5 border-t border-slate-100 dark:border-[#1e293b] pt-2">
                              <Coffee size={12} /> <span className="font-bold">{item.structuredData?.mealTiming}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-10">
                      <div className="w-14 h-14 bg-slate-100 dark:bg-[#1e293b] rounded-full flex items-center justify-center mb-3">
                        <FileText size={20} className="text-slate-300" />
                      </div>
                      <p className="font-semibold text-sm">The cart is empty</p>
                      <p className="text-xs mt-1">Add medicines from the form.</p>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-5 border-t border-slate-200 dark:border-[#1e293b] sticky bottom-0 bg-slate-50 dark:bg-[#020817] pb-2">
                  <button onClick={handleSubmitPrescription} className="w-full py-3.5 bg-blue-400 text-white font-black rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95">
                    <CheckCircle2 size={18} /> Submit Prescription
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;