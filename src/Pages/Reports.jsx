import { useEffect, useState } from "react";
import {
  FileBarChart2,
  Download,
  TrendingUp,
  Users,
  CalendarDays,
  CreditCard,
} from "lucide-react";
import { API_URL } from "../api";
import { exportHospitalReport } from "../utils/exportHospitalReport";

function Reports() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
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
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center text-white">
        <p className="text-lg font-semibold animate-pulse text-blue-400">Loading Operational Intelligence Metrics...</p>
      </div>
    );
  }

  // Fallback defaults mapping out live database structures
  const summaryData = analytics?.summary || { patients: 0, appointments: 0, revenue: 0, growth: "+0%" };
  const performanceData = analytics?.performance || { patientGrowth: 0, appointmentCompletion: 0, revenueTarget: 0, feedbackSatisfaction: 0 };

  const reports = [
    {
      title: "Patient Report",
      description: "Complete patient records and registrations.",
      icon: Users,
      value: summaryData.patients?.toLocaleString() || "0",
      color: "bg-blue-600/20 text-blue-400",
    },
    {
      title: "Appointment Report",
      description: "Daily, weekly and monthly appointment summary.",
      icon: CalendarDays,
      value: summaryData.appointments?.toLocaleString() || "0",
      color: "bg-purple-600/20 text-purple-400",
    },
    {
      title: "Revenue Report",
      description: "Billing, payments and invoice analytics.",
      icon: CreditCard,
      value: `\u20B9${summaryData.revenue?.toLocaleString() || "0"}`,
      color: "bg-emerald-600/20 text-emerald-400",
    },
    {
      title: "Growth Report",
      description: "Hospital performance and activity trends.",
      icon: TrendingUp,
      value: summaryData.growth || "+0%",
      color: "bg-orange-600/20 text-orange-400",
    },
  ];

  const monthlyPerformance = [
    { name: "Patient Growth", value: `${performanceData.patientGrowth}%` },
    { name: "Appointment Completion", value: `${performanceData.appointmentCompletion}%` },
    { name: "Revenue Target", value: `${performanceData.revenueTarget}%` },
    { name: "Feedback Satisfaction", value: `${performanceData.feedbackSatisfaction}%` },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white px-6 py-7">
      <div className="max-w-[1650px] mx-auto">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-7">
          <div>
            <p className="text-blue-400 font-bold mb-2">Reports & Analytics</p>
            <h1 className="text-4xl font-black">Reports</h1>
            <p className="text-slate-400 mt-2">
              View hospital analytics, summaries and downloadable reports.
            </p>
          </div>

          <button 
            onClick={() => exportHospitalReport(analytics)}
            className="h-14 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            <Download size={20} />
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          {reports.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-3xl bg-[#0f172a] border border-[#1e293b] p-6 shadow-xl"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${item.color}`}>
                  <Icon size={26} />
                </div>
                <p className="text-slate-400">{item.title}</p>
                <h2 className="text-3xl font-black mt-2">{item.value}</h2>
                <p className="text-sm text-slate-500 mt-3">{item.description}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-3xl border border-[#1e293b] bg-[#0f172a]/80 p-8 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <FileBarChart2 size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black">Monthly Performance Summary</h2>
              <p className="text-slate-400">Hospital performance overview for the current month.</p>
            </div>
          </div>

          <div className="space-y-5">
            {monthlyPerformance.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">{item.name}</span>
                  <span className="font-bold text-blue-400">{item.value}</span>
                </div>
                <div className="h-3 bg-[#b5b5b5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                    style={{ width: item.value }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;