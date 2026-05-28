import { useEffect } from "react";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Info,
  UserCog,
} from "lucide-react";

function Settings({ darkMode, setDarkMode }) {
  
  // Synchronize the root html element class on toggle execution
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-[#020817] text-white px-6 py-7">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Title Header */}
        <div className="mb-7">
          <p className="text-blue-400 font-bold mb-2">System Preferences</p>
          <h1 className="text-4xl font-black tracking-tight">Settings</h1>
          <p className="text-slate-400 mt-2">
            Manage MediTrack preferences, theme toggles, and system infrastructure profiles.
          </p>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Card 1: Appearance Module */}
          <div className="rounded-3xl bg-[#0f172a] border border-[#1e293b] p-6 shadow-xl flex flex-col justify-between">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <SettingsIcon size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-black">Appearance</h2>
                <p className="text-slate-400 text-sm">Change app visual mode</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="w-full rounded-2xl bg-[#020817] border border-[#1e293b] p-5 flex items-center justify-between hover:border-blue-500 transition-all active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {darkMode ? (
                  <Moon className="text-blue-400" size={24} />
                ) : (
                  <Sun className="text-orange-400" size={24} />
                )}

                <div className="text-left">
                  <p className="font-bold text-white">Theme Mode</p>
                  <p className="text-slate-400 text-sm">
                    Current: {darkMode ? "Dark Mode" : "Light Mode"}
                  </p>
                </div>
              </div>

              <span className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/10 select-none transition-all">
                Switch
              </span>
            </button>
          </div>

          {/* Card 2: Admin Profile Display */}
          <div className="rounded-3xl bg-[#0f172a] border border-[#1e293b] p-6 shadow-xl flex flex-col justify-between">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <UserCog size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-black">Admin Profile</h2>
                <p className="text-slate-400 text-sm">Logged in account details</p>
              </div>
            </div>

            <div className="space-y-3 bg-[#020817] border border-[#1e293b] p-5 rounded-2xl text-slate-300 text-sm font-medium">
              <p><span className="text-slate-500">Name:</span> Admin</p>
              <p><span className="text-slate-500">Role:</span> Super Admin</p>
              <p><span className="text-slate-500">Access:</span> Full Hospital Management</p>
            </div>
          </div>

          {/* Card 3: About App Core Summary */}
          <div className="xl:col-span-2 rounded-3xl bg-[#0f172a] border border-[#1e293b] p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                <Info size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-black">About MediTrack</h2>
                <p className="text-slate-400 text-sm">Hospital management system overview</p>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              MediTrack is a secure full-stack hospital intelligence dashboard built using React context structures 
              over modular decoupled web infrastructure. Core relational vectors—such as patient records registers, 
              medical team rosters, transaction profiles, and lab analytics sheets—are maintained inside high-performance 
              MySQL data architectures. Audit track histories, evaluations, and platform footprints are streamed inside 
              recurrent NoSQL MongoDB cluster collections under role-isolated access protocols.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;