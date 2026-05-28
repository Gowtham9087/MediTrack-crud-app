import { useState, useEffect } from "react";
import {
  Users, Search, Calendar, FileText, Pill, Clock,
  ChevronRight, Activity, Coffee, ArrowLeft, ChevronDown, ChevronLeft, ChevronsLeft, ChevronsRight
} from "lucide-react";
import { API_URL } from "../../api";

function DoctorPatients() {
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [patients, setPatients] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [allPrescriptions, setAllPrescriptions] = useState([]);
  
  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("appointments"); // 'appointments' or 'prescriptions'

  // 📄 Pagination States (For the Patient List)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const currentDoctorId = localStorage.getItem("doctor_userId");
  const token = localStorage.getItem("doctor_token");

  // Fetch all data for this doctor
  const fetchData = async () => {
    setLoading(true);
    try {
      const appRes = await fetch(`${API_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let myAppointments = [];
      if (appRes.ok) {
        const appData = await appRes.json();
        myAppointments = appData.filter((app) => String(app.doctorId) === String(currentDoctorId));
        setAllAppointments(myAppointments);
      }

      const uniquePatientsMap = new Map();
      myAppointments.forEach(app => {
        if (app.Patient && !uniquePatientsMap.has(app.Patient.id)) {
          uniquePatientsMap.set(app.Patient.id, app.Patient);
        }
      });
      setPatients(Array.from(uniquePatientsMap.values()));

      const presRes = await fetch(`${API_URL}/prescriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (presRes.ok) {
        const presData = await presRes.json();
        const myPrescriptions = Array.isArray(presData)
          ? presData.filter((p) => String(p.doctorId) === String(currentDoctorId))
          : [];
        setAllPrescriptions(myPrescriptions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    } catch (err) {
      console.error("Error fetching unified patient data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentDoctorId, token]);

  // Helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔢 Pagination Mathematics Configuration
  const totalItems = filteredPatients.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  
  // Reset to page 1 whenever the user types a new search query
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [pageSize, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  const currentPagedPatients = filteredPatients.slice(startIndex, startIndex + pageSize);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const selectedPatientAppointments = allAppointments
    .filter(a => String(a.patientId) === String(selectedPatient?.id))
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
    
  const selectedPatientPrescriptions = allPrescriptions
    .filter(p => String(p.patientId) === String(selectedPatient?.id));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] px-4 sm:px-6 py-5 text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* ⚡️ Use 100dvh for mobile safespace */}
      <div className="max-w-[1650px] mx-auto h-[calc(100dvh-100px)] flex flex-col">
        
        {/* Header - Hidden on mobile if a patient is selected to save space! */}
        <div className={`mb-6 shrink-0 ${selectedPatient ? "hidden lg:block" : "block"}`}>
          <p className="text-blue-500 font-bold text-sm mb-1">Unified Directory</p>
          <h1 className="text-3xl font-black tracking-tight">Patient Files</h1>
        </div>

        {/* Main Split Layout */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
          
          {/* ⚡️ LEFT PANEL: Hides on mobile when a patient is selected */}
          <div className={`w-full lg:w-[350px] xl:w-[450px] flex-col bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-[2rem] shadow-sm overflow-hidden shrink-0 ${selectedPatient ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-[#1e293b]">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-xl pl-10 pr-4 py-3 text-sm font-semibold outline-none focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-2">
              {loading ? (
                <div className="text-center py-10 text-slate-400 text-sm font-semibold animate-pulse">Loading patients...</div>
              ) : currentPagedPatients.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm font-semibold">No patients found.</div>
              ) : (
                currentPagedPatients.map(patient => (
                  <button
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${
                      selectedPatient?.id === patient.id 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                      : "hover:bg-slate-50 dark:hover:bg-[#1e293b] text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                      selectedPatient?.id === patient.id ? "bg-white/20 text-white" : "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                    }`}>
                      {patient.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{patient.name}</p>
                      <p className={`text-xs truncate ${selectedPatient?.id === patient.id ? "text-blue-100" : "text-slate-400"}`}>
                        {patient.email || "No email"}
                      </p>
                    </div>
                    <ChevronRight size={16} className={selectedPatient?.id === patient.id ? "text-white" : "text-slate-300 dark:text-slate-600"} />
                  </button>
                ))
              )}
            </div>

            {/* 📑 Patient List Pagination Toolbar (Horizontal match) */}
            {filteredPatients.length > 0 && (
              <div className="px-3 py-4 border-t border-slate-200 dark:border-[#1e293b] bg-slate-50/50 dark:bg-[#020817]/50 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-slate-600 dark:text-slate-400 font-medium select-none">
                
                {/* Left Side: Page Size Picker */}
                <div className="flex items-center gap-2">
                  <span>Page Size:</span>
                  <div className="relative">
                    <select
                      value={pageSize}
                      onChange={handlePageSizeChange}
                      className="appearance-none bg-white dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-lg pl-3 pr-8 py-1 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                  </div>
                </div>

                {/* Middle: Items count */}
                <div className="whitespace-nowrap">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{totalItems === 0 ? 0 : startIndex + 1}</span> to{" "}
                  <span className="font-bold text-slate-800 dark:text-slate-200">{endIndex}</span> of{" "}
                  <span className="font-bold text-slate-800 dark:text-slate-200">{totalItems}</span>
                </div>

                {/* Right Side: Navigation Controls */}
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-1.5 rounded-md border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#020817] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e293b] disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-[#020817] transition-colors"><ChevronsLeft size={16} /></button>
                  <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-1.5 rounded-md border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#020817] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e293b] disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-[#020817] transition-colors"><ChevronLeft size={16} /></button>
                  
                  <span className="mx-1 whitespace-nowrap">
                    Page <span className="font-bold text-slate-800 dark:text-slate-200">{currentPage}</span> of{" "}
                    <span className="font-bold text-slate-800 dark:text-slate-200">{totalPages}</span>
                  </span>

                  <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-1.5 rounded-md border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#020817] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e293b] disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-[#020817] transition-colors"><ChevronRight size={16} /></button>
                  <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-1.5 rounded-md border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#020817] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e293b] disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-[#020817] transition-colors"><ChevronsRight size={16} /></button>
                </div>

              </div>
            )}
          </div>

          {/* ⚡️ RIGHT PANEL: Hides on mobile until a patient is selected */}
          <div className={`flex-1 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-[2rem] shadow-sm flex-col overflow-hidden ${!selectedPatient ? 'hidden lg:flex' : 'flex'}`}>
            {!selectedPatient ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <div className="w-20 h-20 bg-slate-50 dark:bg-[#1e293b] rounded-full flex items-center justify-center mb-4">
                  <Users size={32} className="text-slate-300 dark:text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400">Select a Patient</h3>
                <p className="text-sm mt-1 max-w-sm">Choose a patient from the list on the left to view their full appointment and prescription history.</p>
              </div>
            ) : (
              <>
                {/* Profile Header */}
                <div className="p-5 sm:p-8 border-b border-slate-100 dark:border-[#1e293b] bg-slate-50/50 dark:bg-[#020817]/50 shrink-0">
                  
                  {/* ⚡️ MOBILE BACK BUTTON */}
                  <button 
                    onClick={() => setSelectedPatient(null)}
                    className="lg:hidden flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold mb-4 bg-white dark:bg-[#0f172a] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 w-max shadow-sm transition-all"
                  >
                    <ArrowLeft size={16} /> Back to Patients
                  </button>
                  
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-lg shadow-blue-500/30 shrink-0">
                      {selectedPatient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black">{selectedPatient.name}</h2>
                      <div className="flex flex-wrap gap-3 sm:gap-4 mt-1 sm:mt-2 text-[11px] sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5"><Activity size={14}/> {selectedPatient.contact || "No Contact"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="px-5 sm:px-8 pt-4 border-b border-slate-100 dark:border-[#1e293b] flex gap-4 sm:gap-6 shrink-0 overflow-x-auto hide-scrollbar">
                  <button 
                    onClick={() => setActiveTab("appointments")}
                    className={`pb-4 text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 border-b-2 transition-all whitespace-nowrap ${
                      activeTab === "appointments" ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    <Calendar size={16} /> Appointments ({selectedPatientAppointments.length})
                  </button>
                  <button 
                    onClick={() => setActiveTab("prescriptions")}
                    className={`pb-4 text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 border-b-2 transition-all whitespace-nowrap ${
                      activeTab === "prescriptions" ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    <FileText size={16} /> Prescriptions ({selectedPatientPrescriptions.length})
                  </button>
                </div>

                {/* Tab Content Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 pb-20 sm:pb-8">
                  
                  {/* APPOINTMENTS TAB */}
                  {activeTab === "appointments" && (
                    <div className="space-y-4">
                      {selectedPatientAppointments.length === 0 ? (
                        <p className="text-slate-400 text-center py-10 font-medium text-sm">No appointments found for this patient.</p>
                      ) : (
                        selectedPatientAppointments.map((app) => (
                          <div key={app.id} className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                            <div>
                              <p className="font-black text-[15px] sm:text-lg">{app.reason || "General Checkup"}</p>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1 bg-slate-100 dark:bg-[#1e293b] px-2 sm:px-2.5 py-1 rounded-md"><Calendar size={12}/> {formatDate(app.appointmentDate)}</span>
                                <span className="flex items-center gap-1 bg-slate-100 dark:bg-[#1e293b] px-2 sm:px-2.5 py-1 rounded-md"><Clock size={12}/> {app.appointmentTime}</span>
                              </div>
                            </div>
                            <span className={`px-3 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider rounded-lg w-max ${
                              app.status === 'Booked' ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                            }`}>
                              {app.status || "Completed"}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* PRESCRIPTIONS TAB */}
                  {activeTab === "prescriptions" && (
                    <div className="space-y-4 sm:space-y-6">
                      {selectedPatientPrescriptions.length === 0 ? (
                        <p className="text-slate-400 text-center py-10 font-medium text-sm">No prescriptions issued for this patient yet.</p>
                      ) : (
                        selectedPatientPrescriptions.map((pres) => (
                          <div key={pres.id} className="border border-slate-200 dark:border-[#1e293b] rounded-2xl overflow-hidden">
                            <div className="bg-slate-50 dark:bg-[#1e293b]/50 px-4 sm:px-5 py-3 border-b border-slate-200 dark:border-[#1e293b] flex items-center justify-between">
                              <p className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                                <Calendar size={14}/> Issued {formatDate(pres.createdAt)}
                              </p>
                              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 bg-white dark:bg-[#0f172a] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                {pres.medicines?.length || 0} items
                              </span>
                            </div>
                            <div className="p-3 sm:p-5 space-y-3">
                              {pres.medicines?.map((med, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 p-3 sm:p-4 bg-white dark:bg-[#0f172a] rounded-xl border border-slate-100 dark:border-[#1e293b]">
                                  <div>
                                    <h4 className="font-bold text-[13px] sm:text-[14px] flex items-center gap-1.5 sm:gap-2">
                                      <Pill size={14} className="text-blue-500"/> {med.medicineName}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] sm:text-xs text-slate-500 font-medium">
                                      <span className="bg-slate-50 dark:bg-[#1e293b] px-2 py-1 rounded">{med.structuredData?.doseQty} {med.structuredData?.doseUnit}</span>
                                      <span className="bg-slate-50 dark:bg-[#1e293b] px-2 py-1 rounded">{med.structuredData?.schedule?.join(", ")}</span>
                                      <span className="bg-slate-50 dark:bg-[#1e293b] px-2 py-1 rounded">For {med.structuredData?.duration}</span>
                                    </div>
                                  </div>
                                  {med.structuredData?.mealTiming && (
                                    <span className="text-[10px] sm:text-xs font-bold bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-md flex items-center gap-1 shrink-0 w-max">
                                      <Coffee size={12}/> {med.structuredData.mealTiming}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                </div>
              </>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default DoctorPatients;