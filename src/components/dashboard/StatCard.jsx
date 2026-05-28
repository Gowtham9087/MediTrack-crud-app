import { motion } from "framer-motion";

function StatCard({ title, value, icon: Icon, color, growth, subtitle }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white dark:bg-[#111827] shadow-xl p-6"
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 opacity-20 blur-3xl ${color}`}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <h2 className="text-3xl font-extrabold mt-2 text-slate-800 dark:text-white">
            {value}
          </h2>

          {growth && (
            <p className="mt-3 text-sm font-semibold text-green-500">
              {growth}
            </p>
          )}

          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${color}`}
        >
          <Icon size={28} />
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;