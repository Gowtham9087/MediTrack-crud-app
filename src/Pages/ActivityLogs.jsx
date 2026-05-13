import { useEffect, useState } from "react";
import { API_URL } from "../api";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem("token");

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

  useEffect(() => {
   const fetchLogsData = async () => {
      await fetchLogs();
    };
    fetchLogsData();
  }, []);

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
        <div className="text-center mb-8">
          <p className="inline-block mb-3 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-200 text-sm font-semibold">
            System Tracking
          </p>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Activity Logs
          </h1>

          <p className="text-cyan-100 mt-3 text-sm sm:text-base">
            Track all important admin and user activities
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 sm:p-8 text-white shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Logs</h2>

            <p className="text-cyan-200 font-semibold">
              Total: {logs.length}
            </p>
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[900px] border-separate border-spacing-y-3 text-left">
              <thead>
                <tr className="bg-white/10 text-cyan-300">
                  <th className="p-4 rounded-l-2xl">Action</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Details</th>
                  <th className="p-4 rounded-r-2xl">Time</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log._id}
                    className="bg-white/5 hover:bg-cyan-500/10 transition-all"
                  >
                    <td className="p-4 rounded-l-2xl font-semibold">
                      {log.action}
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-200 text-sm">
                        {log.userRole}
                      </span>
                    </td>

                    <td className="p-4">{log.details}</td>

                    <td className="p-4 rounded-r-2xl text-cyan-200">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {logs.map((log, i) => (
              <div
                key={log._id}
                className="bg-white/10 border border-white/10 rounded-3xl p-5 shadow-xl"
              >
                <p className="text-xs text-cyan-300 font-semibold">
                  Log #{i + 1}
                </p>

                <h2 className="text-xl font-bold mt-1">{log.action}</h2>

                <div className="mt-4 space-y-2 text-sm text-slate-200">
                  <p>
                    <span className="text-cyan-300">Role:</span>{" "}
                    {log.userRole}
                  </p>

                  <p>
                    <span className="text-cyan-300">Details:</span>{" "}
                    {log.details}
                  </p>

                  <p>
                    <span className="text-cyan-300">Time:</span>{" "}
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {logs.length === 0 && (
            <div className="text-center mt-10">
              <p className="text-2xl text-cyan-200 mb-2">
                No Activity Logs Found
              </p>

              <p className="text-slate-300">
                System activities will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityLogs;