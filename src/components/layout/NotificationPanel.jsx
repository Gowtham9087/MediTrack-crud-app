import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { API_URL } from "../../api";

function NotificationPanel({ role, token }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (role !== "admin" || !token) return;

      try {
        const res = await fetch(`${API_URL}/activity-logs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          const importantActions = [
            "FEEDBACK_SUBMITTED",
            "APPOINTMENT_BOOKED",
            "PATIENT_DELETED",
            "DOCTOR_ADDED",
          ];

          const filtered = data
            .filter((log) => importantActions.includes(log.action))
            .slice(0, 3);

          setNotifications(filtered);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, [role, token]);

  if (role !== "admin") return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 flex items-center justify-center hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-all"
      >
        <Bell size={18} />

        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {showNotifications && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setShowNotifications(false)}
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 mt-3 w-[360px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden z-[9999]"
          >
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-extrabold text-slate-800 dark:text-white text-lg">
                Notifications
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Important MediTrack alerts
              </p>
            </div>

            <div>
              {notifications.length > 0 ? (
                notifications.map((item) => (
                  <div
                    key={item._id}
                    className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center shrink-0">
                        <Bell size={18} />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                          {item.action.replaceAll("_", " ")}
                        </h3>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {item.details}
                        </p>

                        <p className="text-xs text-blue-600 mt-2 font-semibold">
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-10 text-center">
                  <p className="text-slate-500 dark:text-slate-400">
                    No important notifications
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationPanel;