import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { Activity } from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import ActivityLogsTable from "../components/tables/ActivityLogsTable";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  const token = localStorage.getItem("token");

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_URL}/activity-logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setLogs(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f5f7fb] dark:bg-[#0f172a] px-4 sm:px-6 py-8 transition-all duration-300">
      <div className="max-w-[1300px] mx-auto">
        <PageHeader
          badge="System Tracking"
          title="Activity Logs"
          description="Track all important admin and user activities."
          action={
            <div className="bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 shadow-sm rounded-3xl px-5 py-4 flex items-center gap-3 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
                <Activity size={22} />
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Total Logs
                </p>

                <p className="font-extrabold text-slate-900 dark:text-white text-xl">
                  {logs.length}
                </p>
              </div>
            </div>
          }
        />

        <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-all">
          {logs.length > 0 ? (
            <ActivityLogsTable logs={logs} />
          ) : (
            <EmptyState
              title="No Activity Logs Found"
              description="System activities will appear here."
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityLogs;