import { useEffect, useState } from "react";
import { API_URL } from "../../api";
import { Calendar as CalendarIcon, Clock, Stethoscope } from "lucide-react";
import EmptyState from "../../components/ui/EmptyState";

function UserCalendar() {
  const [schedules, setSchedules] = useState([]);
  const token = localStorage.getItem("token");

  const fetchSchedules = async () => {
    try {
      const cacheBuster = new Date().getTime();
      const res = await fetch(`${API_URL}/schedules?t=${cacheBuster}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.schedules && Array.isArray(data.schedules)) {
          setSchedules(data.schedules);
        }
      }
    } catch (error) {
      console.error("Failed to fetch doctor schedules:", error);
    }
  };

  useEffect(() => {
    fetchSchedules();
    const intervalId = setInterval(() => fetchSchedules(), 5000);
    return () => clearInterval(intervalId);
  }, [token]);

  const getStatusDetails = (status, isOnDutyToday) => {
    if (status !== "Available") {
      return {
        text: "ON LEAVE",
        color: "text-red-500 bg-red-500/10 border-red-500/20",
        isAvailable: false,
      };
    }
    if (isOnDutyToday) {
      return {
        text: "ON DUTY",
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        isAvailable: true,
      };
    }
    return {
      text: "NEXT SHIFT",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      isAvailable: false,
    };
  };

  return (
    <div className="px-6 py-5 text-slate-900 dark:text-white">
      <div className="max-w-[1650px] mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <p className="text-blue-500 font-bold text-sm">Doctor Schedule</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
            View available doctors and their operational shifts.
          </p>
        </div>

        {/* DOCTOR CARDS — same level as Settings cards, directly on page bg */}
        {schedules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((doc, index) => {
              const statusInfo = getStatusDetails(doc.status, doc.isOnDutyToday);
              return (
                <div
                  key={doc.id || index}
                  // ✅ Exactly like Settings cards: #0f172a on #020817 page bg
                  className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-[#1e293b] p-6 sm:p-8 shadow-sm transition-all hover:border-blue-500/30"
                >
                  {/* Top Row */}
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center">
                      <Stethoscope size={24} />
                    </div>
                    <span className={`px-3 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${statusInfo.color}`}>
                      <Clock size={12} strokeWidth={3} />
                      {statusInfo.text}
                    </span>
                  </div>

                  {/* Doctor Info */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                      {doc.doctor}
                    </h3>
                    <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-1.5">
                      {doc.specialization || "General"}
                    </p>
                  </div>

                  {/* ✅ Inner box: #020817 inside #0f172a card — exactly like Settings inner elements */}
                  <div className="bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-4">
                    <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Weekly Shift Schedule:
                    </p>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 truncate">
                      {doc.workingDays && doc.workingDays.length > 0
                        ? doc.workingDays.join(" • ")
                        : "Monday • Wednesday • Friday"}
                    </p>

                    <div className="w-full h-px bg-slate-200 dark:bg-[#1e293b] my-3.5" />

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                        <CalendarIcon size={15} />
                        <span className="text-sm font-medium">
                          {statusInfo.isAvailable
                            ? "Available Today"
                            : `Next Rotation: ${doc.day || "Soon"}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                        <Clock size={15} />
                        <span className="text-sm font-medium">
                          {doc.time || "10:00 AM - 04:00 PM"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No Doctors Available"
            description="There are currently no doctors scheduled."
          />
        )}
      </div>
    </div>
  );
}

export default UserCalendar;