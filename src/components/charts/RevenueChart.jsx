import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 25000 },
  { month: "Feb", revenue: 32000 },
  { month: "Mar", revenue: 28000 },
  { month: "Apr", revenue: 41000 },
  { month: "May", revenue: 48000 },
  { month: "Jun", revenue: 56000 },
];

function RevenueChart() {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
      <h2 className="text-lg font-extrabold text-slate-800 dark:text-white">
        Revenue Analytics
      </h2>

      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Monthly hospital revenue overview
      </p>

      <div className="h-72 mt-6">
       <ResponsiveContainer width="99%" height={260}>
          <LineChart data={data}>
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueChart;