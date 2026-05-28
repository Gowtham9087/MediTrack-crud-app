import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", patients: 120 },
  { month: "Feb", patients: 180 },
  { month: "Mar", patients: 240 },
  { month: "Apr", patients: 210 },
  { month: "May", patients: 310 },
  { month: "Jun", patients: 420 },
];

function PatientChart() {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
      <h2 className="text-lg font-extrabold text-slate-800 dark:text-white">
        Patient Growth
      </h2>

      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Monthly patient registration overview
      </p>

      <div className="h-72 mt-6">
        <ResponsiveContainer width="99%" height={260}>
          <AreaChart data={data}>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="patients"
              stroke="#2563eb"
              fill="#2563eb"
              fillOpacity={0.18}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PatientChart;