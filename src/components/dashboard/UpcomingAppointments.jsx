import { CalendarDays } from "lucide-react";

const appointments = [
  { patient: "Arun Kumar", doctor: "Dr. Raj", time: "10:30 AM" },
  { patient: "Priya S", doctor: "Dr. Meena", time: "12:00 PM" },
  { patient: "Karthik", doctor: "Dr. Kumar", time: "03:15 PM" },
];

function UpcomingAppointments() {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
      <h2 className="text-lg font-extrabold text-slate-800 dark:text-white">
        Upcoming Appointments
      </h2>

      <div className="mt-5 space-y-4">
        {appointments.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-2xl bg-slate-100 dark:bg-slate-800 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 flex items-center justify-center">
                <CalendarDays size={18} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">
                  {item.patient}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {item.doctor}
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-blue-600">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpcomingAppointments;