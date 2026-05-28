import { UserCircle, LogIn, LayoutDashboard } from "lucide-react";

function FeedbackProfileCard({ userName, userEmail }) {
  return (
    // ✅ Same card pattern as Settings: #0f172a on #020817 page bg
    <div className="overflow-hidden self-start bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-[2rem] p-6 sm:p-8 shadow-sm transition-colors duration-300">

      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
        <UserCircle size={28} />
      </div>

      {/* User Info */}
      <h2 className="text-2xl font-black text-slate-900 dark:text-white">
        {userName || "User"}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mt-1 break-all text-sm">
        {userEmail}
      </p>

      {/* ✅ Inner boxes: #020817 inside #0f172a — same as Settings inner elements */}
      <div className="mt-8 space-y-4">
        <div className="bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <LayoutDashboard size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              Portal
            </p>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              Patient Feedback
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <LogIn size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              Status
            </p>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              Logged In
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedbackProfileCard;