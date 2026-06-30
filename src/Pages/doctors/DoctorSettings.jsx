import { User, HelpCircle, Info, Stethoscope } from "lucide-react";

function DoctorSettings() {
  const currentDoctorName = localStorage.getItem("doctor_userName") || "Doctor";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] px-4 sm:px-6 py-5 text-slate-900 dark:text-white transition-colors duration-300 relative">
      <div className="max-w-[1650px] mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <p className="text-blue-500 font-bold text-sm">Doctor Portal</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
            Manage your personal preferences and get support.
          </p>
        </div>

        {/* CHANGED: each card is now full-width, stacked one below another */}
        <div className="flex flex-col gap-4 sm:gap-6 pb-20 sm:pb-0">

          {/* PROFILE DETAILS */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-[#1e293b] p-5 sm:p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black">Profile Details</h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Your doctor account information.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={`Dr. ${currentDoctorName}`}
                  className="w-full bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                  Role
                </label>
                <div className="w-full bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-xl px-4 py-3.5 flex items-center gap-3">
                  <Stethoscope size={16} className="text-blue-500" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Attending Doctor</span>
                </div>
              </div>
            </div>
          </div>

          {/* HELP & SUPPORT */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-[#1e293b] p-5 sm:p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <HelpCircle size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black">Help & Support</h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Get assistance with your portal.</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#020817] rounded-2xl p-5 border border-slate-200 dark:border-[#1e293b] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium max-w-2xl">
                If you are experiencing issues with viewing appointments, submitting prescriptions, or accessing patient records, our administration team is available to assist you.
              </p>
              <div className="sm:border-l sm:border-slate-200 dark:sm:border-[#1e293b] sm:pl-6 shrink-0">
                <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Contact Administrator
                </p>
                <a href="mailto:admin@meditrack.com" className="text-blue-600 dark:text-blue-400 font-bold text-base sm:text-lg hover:underline break-all">
                  admin@meditrack.com
                </a>
              </div>
            </div>
          </div>

          {/* ABOUT MEDITRACK */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-[#1e293b] p-5 sm:p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Info size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black">About MediTrack</h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Hospital management system overview.</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-loose font-medium">
              MediTrack is a secure full-stack hospital intelligence dashboard built using React over modular decoupled web infrastructure. Core relational vectors—patient records, medical team rosters, transaction profiles, and lab analytics—are maintained inside high-performance MySQL architectures. Audit histories and platform footprints are streamed inside NoSQL MongoDB cluster collections under role-isolated access protocols.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DoctorSettings;