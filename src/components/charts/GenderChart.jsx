import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Male", value: 58 },
  { name: "Female", value: 42 },
];

const COLORS = ["#2563eb", "#ec4899"];

function GenderChart() {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
      <h2 className="text-lg font-extrabold text-slate-800 dark:text-white">
        Patient Ratio
      </h2>

      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Gender distribution
      </p>

      <div className="h-72 mt-6">
        <ResponsiveContainer width="99%" height={260}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GenderChart;