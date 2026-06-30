import { HelpCircle, Info, Mail } from "lucide-react";

function UserSettings() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] px-6 py-5 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-[1650px] mx-auto">

        <div className="mb-8">
          <p className="text-blue-500 font-bold text-sm">Account</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Help & Support</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
            Get assistance and learn more about MediTrack.
          </p>
        </div>

        <div className="flex flex-col gap-6">

          {/* HELP & SUPPORT — horizontal */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-[#1e293b] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <HelpCircle size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black mb-0.5">Help & Support</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Get assistance with your portal.</p>
              <div className="bg-slate-50 dark:bg-[#020817] rounded-2xl p-5 border border-slate-200 dark:border-[#1e293b] flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium flex-1">
                  If you are experiencing issues with booking an appointment, downloading your billing invoices, or viewing your laboratory reports, our administration team is here to help.
                </p>
                <div className="shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-[#1e293b] pt-4 sm:pt-0 sm:pl-8">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Contact Administrator
                  </p>
                  <a href="mailto:admin@meditrack.com" className="text-blue-600 dark:text-blue-400 font-bold text-base hover:underline flex items-center gap-2">
                    <Mail size={16} />
                    admin@meditrack.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ABOUT MEDITRACK — horizontal */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-[#1e293b] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Info size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black mb-0.5">About MediTrack</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Hospital management system overview</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-loose font-medium">
                MediTrack is a secure full-stack hospital intelligence dashboard. Core relational data — patient records, medical team rosters, transaction profiles, and lab analytics — are maintained in MySQL. Audit histories and platform footprints are streamed into MongoDB cluster collections under role-isolated access protocols.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserSettings;