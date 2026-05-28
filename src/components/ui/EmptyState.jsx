import { Inbox } from "lucide-react";

function EmptyState({
  title = "No Data Found",
  description = "There is nothing to display right now.",
}) {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xl">
      <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
        <Inbox
          size={34}
          className="text-slate-400"
        />
      </div>

      <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">
        {title}
      </h2>

      <p className="text-slate-500 dark:text-slate-400 mt-2">
        {description}
      </p>
    </div>
  );
}

export default EmptyState;