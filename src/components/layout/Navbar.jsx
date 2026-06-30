import { useEffect, useState } from "react";
import {
  Search,
  Sun,
  Moon,
  Maximize2,
  Menu,
} from "lucide-react";

import NotificationPanel from "./NotificationPanel";

function Navbar({
  role,
  userName,
  token,
  darkMode,
  setDarkMode,
  setMobileMenu,
}) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 lg:left-[220px] right-0 h-[58px] bg-[#020817]/95 backdrop-blur-xl border-b border-[#14213d] z-40">
      <div className="h-full px-4 flex items-center justify-between gap-3">

        {/* LEFT SPACE */}
        <div className="hidden lg:block w-[20px]" />

        {/* SEARCH */}
        <div className="hidden lg:flex flex-1 max-w-[320px]">
          <div className="w-full h-9 rounded-xl bg-[#0f172a] border border-[#1e293b] flex items-center px-3 gap-2">
            <Search size={15} className="text-slate-500" />

            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-slate-500"
            />

            <span className="px-2 py-0.5 rounded-lg bg-[#020817] border border-[#1e293b] text-[10px] text-slate-400">
              ⌘K
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          {/* DATE */}
          <div className="hidden xl:block text-right min-w-fit mr-1">
            <p className="text-slate-400 text-[10px] leading-none">
              {time.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "short",
              })}
            </p>

            <p className="text-white text-sm font-black mt-1 leading-none">
              {time.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* STATUS */}
          <div className="hidden lg:flex items-center gap-2 bg-[#0f172a] border border-[#1e293b] rounded-xl px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

            <span className="text-emerald-400 text-xs font-bold">
              Live
            </span>
          </div>

          {/* THEME */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 rounded-xl bg-[#0f172a] border border-[#1e293b] text-slate-300 hover:text-white flex items-center justify-center transition-all"
          >
            {darkMode ? (
              <Sun size={16} />
            ) : (
              <Moon size={16} />
            )}
          </button>

          {/* NOTIFICATIONS */}
          <NotificationPanel
            role={role}
            token={token}
          />

          {/* FULLSCREEN */}
          <button className="hidden md:flex w-9 h-9 rounded-xl bg-[#0f172a] border border-[#1e293b] text-slate-300 hover:text-white items-center justify-center transition-all">
            <Maximize2 size={16} />
          </button>

          {/* PROFILE */}
          <div className="flex items-center gap-2 bg-[#0f172a] border border-[#1e293b] rounded-xl px-2.5 py-1.5">
            <div className="w-8 h-8 rounded-xl bg-blue-400 text-white flex items-center justify-center font-black text-xs">
              {role === "admin"
                ? "A"
                : userName?.charAt(0) || "U"}
            </div>

            <div className="hidden md:block">
              <p className="text-white font-bold text-xs leading-none">
                {role === "admin"
                  ? "Admin"
                  : userName || "User"}
              </p>

              <p className="text-slate-400 text-[10px] mt-1 leading-none capitalize">
                {role === "admin"
                  ? "Super Admin"
                  : role}
              </p>
            </div>
          </div>

          {/* MOBILE MENU */}
          <button
            onClick={() => setMobileMenu(true)}
            className="lg:hidden w-9 h-9 rounded-xl bg-[#0f172a] border border-[#1e293b] text-white flex items-center justify-center"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;