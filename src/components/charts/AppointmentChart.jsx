import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", appointments: 18 },
  { day: "Tue", appointments: 25 },
  { day: "Wed", appointments: 20 },
  { day: "Thu", appointments: 34 },
  { day: "Fri", appointments: 28 },
  { day: "Sat", appointments: 16 },
];

function AppointmentChart() {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
      <h2 className="text-lg font-extrabold text-slate-800 dark:text-white">
        Appointments
      </h2>

      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Weekly appointment summary
      </p>

      <div className="h-72 mt-6">
       <ResponsiveContainer width="99%" height={260}>
          <BarChart data={data}>
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="appointments" fill="#06b6d4" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AppointmentChart;