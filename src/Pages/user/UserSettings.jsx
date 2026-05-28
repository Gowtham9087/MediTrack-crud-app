import { useState, useEffect } from "react";
import { User, Moon, Sun, Settings2, HelpCircle, Info } from "lucide-react";

function UserSettings() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const currentUserName = localStorage.getItem("userName") || "Gowtham G";

  // Check the initial theme when the component loads
  useEffect(() => {
    if (document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // ⚡️ REAL THEME TOGGLE LOGIC
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] px-6 py-5 text-slate-900 dark:text-white transition-colors duration-300 relative">
      <div className="max-w-[1650px] mx-auto">
        
        {/* HEADER SECTION */}
        <div className="mb-8">
          <p className="text-blue-500 font-bold text-sm">Account</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
            Manage your personal preferences, app themes, and get support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* PROFILE DETAILS CARD */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-[#1e293b] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black">Profile Details</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage your personal information.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                Full Name
              </label>
              <input 
                type="text" 
                readOnly
                value={currentUserName}
                className="w-full bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* APPEARANCE / THEME CARD (Matches Admin UI) */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-[#1e293b] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Settings2 size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black">Appearance</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Change app visual mode.</p>
              </div>
            </div>

            <div className="w-full bg-slate-50 dark:bg-[#020817] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-slate-600 dark:text-slate-400">
                  {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Theme Mode</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Current: {isDarkMode ? "Dark Mode" : "Light Mode"}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={toggleTheme}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md active:scale-95"
              >
                Switch
              </button>
            </div>
          </div>

          {/* HELP & SUPPORT MODULE */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-[#1e293b] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <HelpCircle size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black">Help & Support</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Get assistance with your portal.</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#020817] rounded-2xl p-5 border border-slate-200 dark:border-[#1e293b]">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4 font-medium">
                If you are experiencing issues with booking an appointment, downloading your billing invoices, or viewing your laboratory reports, our administration team is here to help.
              </p>
              <div className="border-t border-slate-200 dark:border-[#1e293b] pt-4">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Contact Administrator
                </p>
                <a href="mailto:admin@meditrack.com" className="text-blue-600 dark:text-blue-400 font-bold text-lg hover:underline">
                  admin@meditrack.com
                </a>
              </div>
            </div>
          </div>

          {/* ABOUT MEDITRACK (Matches Admin UI) */}
          <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-[#1e293b] p-6 sm:p-8 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Info size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black">About MediTrack</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Hospital management system overview</p>
              </div>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-loose font-medium">
              MediTrack is a secure full-stack hospital intelligence dashboard built using React context structures over modular decoupled web infrastructure. Core relational vectors—such as patient records registers, medical team rosters, transaction profiles, and lab analytics sheets—are maintained inside high-performance MySQL data architectures. Audit track histories, evaluations, and platform footprints are streamed inside recurrent NoSQL MongoDB cluster collections under role-isolated access protocols.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserSettings;