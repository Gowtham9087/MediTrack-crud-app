import { useEffect, useState } from "react";
import { API_URL } from "../api";

import {
  Users,
  CalendarDays,
  CreditCard,
  Stethoscope,
  Activity,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching live dashboard metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center text-white">
        <p className="text-lg font-semibold animate-pulse text-blue-400">
          Loading Live Hospital Analytics...
        </p>
      </div>
    );
  }

  // Fallback defaults if stats fails to load properties cleanly
  const currentStats = stats || {
    totalPatients: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    totalDoctors: 0,
    maleCount: 0,
    femaleCount: 0,
  };

  // Connected all cards to live backend data streams (Critical metrics removed)
  const topCards = [
    {
      title: "Total Patients",
      value: currentStats.totalPatients,
      icon: Users,
      color: "bg-blue-600",
    },
    {
      title: "Appointments",
      value: currentStats.totalAppointments,
      icon: CalendarDays,
      color: "bg-purple-600",
    },
    {
      title: "Total Revenue",
      value: `₹${Number(currentStats.totalRevenue || 0).toLocaleString("en-IN")}`,
      icon: CreditCard,
      color: "bg-emerald-600",
    },
    {
      title: "Doctors",
      value: currentStats.totalDoctors,
      icon: Stethoscope,
      color: "bg-orange-500",
    },
  ];

  const patientTrend = currentStats.patientTrend || [
    { day: "Mon", value: 0 },
    { day: "Tue", value: 0 },
    { day: "Wed", value: 0 },
    { day: "Thu", value: 0 },
    { day: "Fri", value: 0 },
    { day: "Sat", value: 0 },
    { day: "Sun", value: 0 },
  ];

  const appointmentData = currentStats.appointmentTrend || [
    { week: "Week 1", value: 0 },
    { week: "Week 2", value: 0 },
    { week: "Week 3", value: 0 },
    { week: "Week 4", value: 0 },
  ];

  const genderData = [
    { name: "Male", value: currentStats.maleCount || 0 },
    { name: "Female", value: currentStats.femaleCount || 0 },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white px-5 py-5">
      <div className="max-w-[1650px] mx-auto space-y-5">
        <div>
          <h1 className="text-3xl font-black">
            Welcome back, <span className="text-blue-500">Admin</span> 👋
          </h1>
          <p className="text-slate-400 mt-1">
            Here&apos;s what&apos;s happening in your hospital today.
          </p>
        </div>

        {/* Real-time Cards Grid Container (Changed layout columns count from xl:grid-cols-5 to xl:grid-cols-4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {topCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-3xl border border-[#1e293b] bg-[#0f172a] p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{card.title}</p>
                    <h2 className="text-3xl font-black mt-2 tracking-tight">
                      {card.value}
                    </h2>
                  </div>

                  <div
                    className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center text-white shadow-lg`}
                  >
                    <Icon size={25} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Analytics Graphics Layout Blocks */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-[#1e293b] bg-[#0f172a] p-5 min-w-0">
            <h2 className="text-xl font-black">Patient Trend</h2>
            <p className="text-slate-400 text-sm mt-1">This week overview</p>

            <div className="h-[260px] min-w-0 mt-5">
              <ResponsiveContainer width="99%" height={260}>
                <AreaChart data={patientTrend}>
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.15}
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-[#1e293b] bg-[#0f172a] p-5 min-w-0">
            <h2 className="text-xl font-black">Gender Distribution</h2>
            <p className="text-slate-400 text-sm mt-1">Patient demographics ratio</p>

            <div className="h-[260px] min-w-0 mt-5 flex items-center justify-center">
              <ResponsiveContainer width="99%" height={240}>
                <PieChart>
                  <Pie
                    data={genderData}
                    dataKey="value"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    <Cell fill="#2563eb" />
                    <Cell fill="#ec4899" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-8 text-sm font-bold mt-2">
              <p>
                <span className="text-blue-500 mr-1.5">●</span> Male{" "}
                {currentStats.maleCount || 0}
              </p>
              <p>
                <span className="text-pink-500 mr-1.5">●</span> Female{" "}
                {currentStats.femaleCount || 0}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-[#1e293b] bg-[#0f172a] p-5 min-w-0">
            <h2 className="text-xl font-black">Appointments</h2>
            <p className="text-slate-400 text-sm mt-1">Monthly overview</p>

            <div className="h-[260px] min-w-0 mt-5">
              <ResponsiveContainer width="99%" height={260}>
                <BarChart data={appointmentData}>
                  <XAxis dataKey="week" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Real-time Logs Feed Container */}
        <div className="rounded-3xl border border-[#1e293b] bg-[#0f172a] p-5 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-black">Recent Activities</h2>
              <p className="text-slate-400 text-sm">Latest system actions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {currentStats.recentLogs && currentStats.recentLogs.length > 0 ? (
              currentStats.recentLogs.slice(0, 4).map((log) => (
                <div
                  key={log._id || log.id}
                  className="rounded-2xl bg-[#020817] border border-[#1e293b] p-4 flex items-center gap-3"
                >
                  <div className="w-11 h-11 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Activity size={19} />
                  </div>

                  <div>
                    <p className="font-semibold text-sm">{log.details}</p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {new Date(log.createdAt || log.time).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm p-4 col-span-2">
                No recent system actions found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;