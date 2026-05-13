import { useEffect, useState } from "react";
import { API_URL } from "../api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
  }, []);

  if (!stats) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#020617] text-white text-2xl font-bold">
        Loading Dashboard...
      </div>
    );
  }

  const cards = [
    { title: "Total Patients", value: stats.totalPatients, icon: "👥" },
    { title: "Total Feedbacks", value: stats.totalFeedbacks, icon: "💬" },
    { title: "Total Logs", value: stats.totalLogs, icon: "📋" },
    { title: "Male Patients", value: stats.maleCount, icon: "👨" },
    { title: "Female Patients", value: stats.femaleCount, icon: "👩" },
  ];

  return (
    <div
      className="min-h-[calc(100vh-80px)] relative overflow-hidden px-4 sm:px-6 py-10"
      style={{
        backgroundImage: "url('/doctor5.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#020617]/75 backdrop-blur-[3px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="inline-block mb-3 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-200 text-sm font-semibold">
            Admin Overview
          </p>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Admin Dashboard
          </h1>

          <p className="text-cyan-100 mt-3 text-sm sm:text-base">
            Track patients, feedbacks and activity logs in one place
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 text-white shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-2xl shadow-lg">
                  {card.icon}
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-200 border border-cyan-400/20">
                  Live
                </span>
              </div>

              <h2 className="text-slate-300 text-sm font-medium">
                {card.title}
              </h2>

              <p className="text-4xl font-extrabold mt-2">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 sm:p-8 text-white shadow-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Recent Activities
          </h2>

          <div className="space-y-4">
            {stats.recentLogs?.map((log) => (
              <div
                key={log._id}
                className="bg-white/10 border border-white/10 p-4 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-2 hover:bg-cyan-500/10 transition-all"
              >
                <span className="text-slate-100">{log.details}</span>

                <span className="text-cyan-300 text-sm">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}

            {stats.recentLogs?.length === 0 && (
              <p className="text-cyan-200">No recent activities found</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 sm:p-8 text-white shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              Activity Summary
            </h2>

            <div className="space-y-4">
              {stats.activitySummary?.map((item) => (
                <div
                  key={item._id}
                  className="bg-white/10 border border-white/10 p-4 rounded-2xl flex justify-between items-center"
                >
                  <span>{item._id}</span>

                  <span className="text-cyan-300 font-bold text-xl">
                    {item.count}
                  </span>
                </div>
              ))}

              {stats.activitySummary?.length === 0 && (
                <p className="text-cyan-200">No activity summary found</p>
              )}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 sm:p-8 text-white shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              Feedback Summary
            </h2>

            <div className="space-y-4">
              {stats.feedbackSummary?.map((item) => (
                <div
                  key={item._id}
                  className="bg-white/10 border border-white/10 p-4 rounded-2xl flex justify-between items-center"
                >
                  <span>{item._id}</span>

                  <span className="text-cyan-300 font-bold text-xl">
                    {item.totalFeedbacks}
                  </span>
                </div>
              ))}

              {stats.feedbackSummary?.length === 0 && (
                <p className="text-cyan-200">No feedback summary found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;