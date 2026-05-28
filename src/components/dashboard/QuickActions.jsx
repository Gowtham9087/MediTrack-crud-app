import { Link } from "react-router-dom";
import { UserPlus, Stethoscope, CalendarPlus, FileText } from "lucide-react";

const actions = [
  { label: "Add Patient", to: "/admin/add", icon: UserPlus },
  { label: "Add Doctor", to: "/admin/doctors", icon: Stethoscope },
  { label: "Appointments", to: "/admin/appointments", icon: CalendarPlus },
  { label: "Reports", to: "/admin/reports", icon: FileText },
];

function QuickActions() {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
      <h2 className="text-lg font-extrabold text-slate-800 dark:text-white">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4 mt-5">
        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.to}
              className="rounded-2xl p-4 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white transition-all group"
            >
              <Icon className="mb-3 text-blue-600 group-hover:text-white" />
              <p className="text-sm font-bold">{item.label}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;