import { Activity } from "lucide-react";

const activities = [
  "New patient registered successfully",
  "Doctor profile updated",
  "Appointment booked for today",
  "Feedback submitted by patient",
];

function RecentActivities() {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
      <h2 className="text-lg font-extrabold text-slate-800 dark:text-white">
        Recent Activities
      </h2>

      <div className="mt-5 space-y-4">
        {activities.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center">
              <Activity size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-white">
                {item}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Just now
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivities;