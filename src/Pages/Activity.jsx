import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";
import {
  FileBarChart2, Download, TrendingUp, Users, CalendarDays, CreditCard,
  MessageSquare, Activity as ActivityIcon
} from "lucide-react";
import { exportHospitalReport } from "../utils/exportHospitalReport";

import EmptyState from "../components/ui/EmptyState";
import FeedbackTable from "../components/tables/FeedbackTable";
import DeleteFeedbackModal from "../components/feedback/DeleteFeedbackModal";
import ActivityLogsTable from "../components/tables/ActivityLogsTable";

function Activity() {
  const [activeTab, setActiveTab] = useState("reports"); // "reports" | "feedback" | "logs"
  const token = localStorage.getItem("token");

  /* ================= SHARED TOAST ================= */
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);
  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  /* ================= REPORTS STATE ================= */
  const [analytics, setAnalytics] = useState(null);
  const [reportsLoading, setReportsLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setAnalytics(await res.json());
      }
    } catch (err) {
      console.error("Failed fetching live metrics pipeline payload", err);
    } finally {
      setReportsLoading(false);
    }
  };

  const summaryData = analytics?.summary || { patients: 0, appointments: 0, revenue: 0, growth: "+0%" };
  const performanceData = analytics?.performance || { patientGrowth: 0, appointmentCompletion: 0, revenueTarget: 0, feedbackSatisfaction: 0 };

  const reports = [
    {
      title: "Patient Report",
      description: "Complete patient records and registrations.",
      icon: Users,
      value: summaryData.patients?.toLocaleString() || "0",
      color: "bg-blue-600/20 text-blue-500",
    },
    {
      title: "Appointment Report",
      description: "Daily, weekly and monthly appointment summary.",
      icon: CalendarDays,
      value: summaryData.appointments?.toLocaleString() || "0",
      color: "bg-purple-600/20 text-purple-500",
    },
    {
      title: "Revenue Report",
      description: "Billing, payments and invoice analytics.",
      icon: CreditCard,
      value: `\u20B9${summaryData.revenue?.toLocaleString() || "0"}`,
      color: "bg-emerald-600/20 text-emerald-500",
    },
    {
      title: "Growth Report",
      description: "Hospital performance and activity trends.",
      icon: TrendingUp,
      value: summaryData.growth || "+0%",
      color: "bg-orange-600/20 text-orange-500",
    },
  ];

  const monthlyPerformance = [
    { name: "Patient Growth", value: `${performanceData.patientGrowth}%` },
    { name: "Appointment Completion", value: `${performanceData.appointmentCompletion}%` },
    { name: "Revenue Target", value: `${performanceData.revenueTarget}%` },
    { name: "Feedback Satisfaction", value: `${performanceData.feedbackSatisfaction}%` },
  ];

  /* ================= FEEDBACK STATE ================= */
  const [feedbacks, setFeedbacks] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(`${API_URL}/feedbacks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Failed to fetch feedbacks ❌");
        return;
      }
      setFeedbacks(data);
    } catch (err) {
      console.log(err);
      showToast("Failed to fetch feedbacks ❌");
    }
  };

  const deleteFeedback = async (id) => {
    try {
      const res = await fetch(`${API_URL}/feedbacks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Delete failed ❌");
        return;
      }
      showToast("Feedback deleted ✔️");
      setDeleteId(null);
      fetchFeedbacks();
    } catch (err) {
      console.log(err);
      showToast("Delete failed ❌");
    }
  };

  /* ================= LOGS STATE ================= */
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_URL}/activity-logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLogs(data);
    } catch (error) {
      console.log(error);
    }
  };

  /* ================= LOAD ON MOUNT ================= */
  useEffect(() => {
    fetchAnalytics();
    fetchFeedbacks();
    fetchLogs();
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const tabs = [
    { key: "reports", label: "Reports", icon: FileBarChart2, count: null },
    { key: "feedback", label: "Feedback", icon: MessageSquare, count: feedbacks.length },
    { key: "logs", label: "Logs", icon: ActivityIcon, count: logs.length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-white px-6 py-5 relative">
      {toast && (
        <div className="fixed top-28 right-6 z-[99999] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] text-slate-900 dark:text-white px-5 py-4 rounded-2xl shadow-2xl font-semibold">
          {toast}
        </div>
      )}

      <div className="max-w-[1650px] mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div>
            <p className="text-blue-500 font-bold mb-1 text-sm">System Tracking</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Activity</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm max-w-md">
              {activeTab === "reports" && "View hospital analytics, summaries and downloadable reports."}
              {activeTab === "feedback" && "View and manage feedback submitted by patients."}
              {activeTab === "logs" && "Track all important admin and user activities."}
            </p>
          </div>

          {activeTab === "reports" && (
            <button
              onClick={() => exportHospitalReport(analytics)}
              className="h-12 px-6 rounded-2xl bg-blue-400 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] shrink-0"
            >
              <Download size={18} />
              Export Report
            </button>
          )}
        </div>

        {/* TABS */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                  isActive
                    ? "bg-blue-400 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon size={16} /> {tab.label}
                {tab.count !== null && (
                  <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-slate-100 dark:bg-[#1e293b]"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ================= REPORTS TAB ================= */}
        {activeTab === "reports" && (
          reportsLoading ? (
            <div className="py-20 flex items-center justify-center">
              <p className="text-lg font-semibold animate-pulse text-blue-400">Loading Operational Intelligence Metrics...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
                {reports.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] p-6 shadow-sm"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${item.color}`}>
                        <Icon size={26} />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400">{item.title}</p>
                      <h2 className="text-3xl font-black mt-2">{item.value}</h2>
                      <p className="text-sm text-slate-400 dark:text-slate-500 mt-3">{item.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-3xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0f172a]/80 p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-purple-600/20 text-purple-500 flex items-center justify-center">
                    <FileBarChart2 size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">Monthly Performance Summary</h2>
                    <p className="text-slate-500 dark:text-slate-400">Hospital performance overview for the current month.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {monthlyPerformance.map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                        <span className="font-bold text-blue-500">{item.value}</span>
                      </div>
                      <div className="h-3 bg-slate-200 dark:bg-[#1e293b] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-400 rounded-full transition-all duration-1000"
                          style={{ width: item.value }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )
        )}

        {/* ================= FEEDBACK TAB ================= */}
        {activeTab === "feedback" && (
          <>
            <div className="mb-5 pl-1">
              <div className="inline-flex items-center gap-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] px-3.5 py-1.5 rounded-xl shadow-sm">
                <MessageSquare size={14} className="text-blue-500" />
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Feedbacks</span>
                <span className="text-sm font-black text-slate-900 dark:text-white leading-none">{feedbacks.length}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-[#1e293b] shadow-sm overflow-x-auto">
              {feedbacks.length > 0 ? (
                <FeedbackTable feedbacks={feedbacks} setDeleteId={setDeleteId} />
              ) : (
                <div className="p-8">
                  <EmptyState
                    title="No Feedback Available"
                    description="User feedback will appear here once submitted."
                  />
                </div>
              )}
            </div>

            <DeleteFeedbackModal
              deleteId={deleteId}
              setDeleteId={setDeleteId}
              deleteFeedback={deleteFeedback}
            />
          </>
        )}

        {/* ================= LOGS TAB ================= */}
        {activeTab === "logs" && (
          <>
            <div className="mb-5 pl-1">
              <div className="inline-flex items-center gap-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] px-3.5 py-1.5 rounded-xl shadow-sm">
                <ActivityIcon size={14} className="text-blue-500" />
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Logs</span>
                <span className="text-sm font-black text-slate-900 dark:text-white leading-none">{logs.length}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200 dark:border-[#1e293b]">
              {logs.length > 0 ? (
                <ActivityLogsTable logs={logs} />
              ) : (
                <EmptyState
                  title="No Activity Logs Found"
                  description="System activities will appear here."
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Activity;