import { useState, useEffect } from "react";
import {
  Pill, Clock, Calendar, Coffee, FileText, ChevronDown, ChevronUp,
  Sun, CloudSun, Moon, AlertCircle, Loader2
} from "lucide-react";
import { API_URL } from "../../api";

function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const token     = localStorage.getItem("user_token");
  const patientId = localStorage.getItem("user_userId");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await fetch(`${API_URL}/prescriptions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        const mine = Array.isArray(data)
          ? data.filter((p) => String(p.patientId) === String(patientId))
          : [];

        mine.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPrescriptions(mine);
      } catch (err) {
        console.error(err);
        setError("Could not load prescriptions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientId, token]);

  const scheduleIcons = {
    Morning:   <Sun size={13} className="text-amber-500" />,
    Afternoon: <CloudSun size={13} className="text-orange-500" />,
    Night:     <Moon size={13} className="text-indigo-500" />,
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] px-6 py-5 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">My Prescriptions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
            View and download your prescribed medications here.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24 text-slate-400 gap-3">
            <Loader2 size={22} className="animate-spin" />
            <span className="font-semibold text-sm">Loading prescriptions…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-5 py-4 rounded-2xl flex items-center gap-3 font-semibold text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && prescriptions.length === 0 && (
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-[2rem] p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-100 dark:bg-[#1e293b] rounded-full flex items-center justify-center mb-4">
              <FileText size={26} className="text-slate-300 dark:text-slate-500" />
            </div>
            <p className="font-bold text-slate-700 dark:text-slate-300">No prescriptions yet</p>
            <p className="text-sm text-slate-400 mt-1">
              Prescriptions from your doctor will appear here after consultation.
            </p>
          </div>
        )}

        {/* Prescription Cards */}
        {!loading && !error && prescriptions.length > 0 && (
          <div className="space-y-4">
            {prescriptions.map((prescription) => {
              const isOpen    = expandedId === prescription.id;
              const medicines = prescription.medicines || [];

              return (
                <div
                  key={prescription.id}
                  className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-[1.5rem] shadow-sm overflow-hidden"
                >
                  {/* Card Header */}
                  <button
                    onClick={() => setExpandedId(isOpen ? null : prescription.id)}
                    className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 dark:hover:bg-[#020817]/40 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Pill size={20} />
                      </div>
                      <div>
                        <p className="font-black text-[15px]">
                          {medicines.length} Medicine{medicines.length !== 1 ? "s" : ""} Prescribed
                        </p>
                        <p className="text-[12px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <Calendar size={12} /> {formatDate(prescription.createdAt)}
                          {prescription.Doctor && (
                            <span className="ml-2 text-blue-500 font-semibold">
                              · Dr. {prescription.Doctor.name}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-slate-400">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {/* Expanded Medicine List */}
                  {isOpen && (
                    <div className="px-6 pb-6 border-t border-slate-100 dark:border-[#1e293b] pt-4 space-y-3">
                      {medicines.map((med, idx) => {
                        const sd       = med.structuredData || {};
                        const schedule = sd.schedule || [];

                        return (
                          <div
                            key={idx}
                            className="bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-5"
                          >
                            <h4 className="font-bold text-[15px] text-slate-900 dark:text-white flex items-center gap-2">
                              {med.medicineName}
                              {med.isCustom && (
                                <span className="text-[9px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded uppercase tracking-wider">
                                  Custom
                                </span>
                              )}
                            </h4>

                            <div className="flex flex-wrap gap-2 mt-3">
                              {/* Dosage */}
                              {(sd.doseQty || sd.doseUnit) && (
                                <span className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] text-slate-700 dark:text-slate-300 text-[12px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                  <Pill size={13} className="text-blue-500" />
                                  {sd.doseQty} {sd.doseUnit}
                                </span>
                              )}

                              {/* Schedule */}
                              {schedule.length > 0 && (
                                <span className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] text-slate-700 dark:text-slate-300 text-[12px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                  <Clock size={13} className="text-indigo-500" />
                                  {schedule.map((s, i) => (
                                    <span key={i} className="flex items-center gap-1">
                                      {scheduleIcons[s]} {s}
                                      {i < schedule.length - 1 && (
                                        <span className="text-slate-300 mx-0.5">·</span>
                                      )}
                                    </span>
                                  ))}
                                </span>
                              )}

                              {/* Duration */}
                              {sd.duration && (
                                <span className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] text-slate-700 dark:text-slate-300 text-[12px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                  <Calendar size={13} className="text-emerald-500" />
                                  For {sd.duration}
                                </span>
                              )}
                            </div>

                            {/* Meal timing + notes */}
                            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-[#1e293b] text-[13px] text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium flex-wrap">
                              <Coffee size={13} />
                              <span className="text-slate-700 dark:text-slate-300 font-bold">
                                {sd.mealTiming || "—"}
                              </span>
                              {med.notes && med.notes !== "None" && (
                                <span className="text-slate-400">· {med.notes}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientPrescriptions;