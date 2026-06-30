import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { 
  Maximize2, 
  Minimize2, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Stethoscope,
  Activity
} from "lucide-react";
import Sidebar from "./Sidebar";
import { API_URL } from "../../api"; 

function DashboardLayout({
  children,
  role,
  darkMode,
  setDarkMode,
  mobileMenu,
  setMobileMenu,
  logout,
}) {
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem(`${role}_token`);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Notifications — admin only
  useEffect(() => {
    if (role !== "admin") return;
    const fetchLiveNotifications = async () => {
      try {
        const res = await fetch(`${API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.userNotifications) {
            setNotifications(data.userNotifications.slice(0, 5));
          }
        }
      } catch (err) {
        console.error("Notification fetch failed:", err);
      }
    };
    fetchLiveNotifications();
    const id = setInterval(fetchLiveNotifications, 5000);
    return () => clearInterval(id);
  }, [token, role]);

  // Fullscreen tracking
  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white overflow-x-hidden">

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-[220px] z-50">
        <Sidebar role={role} logout={logout} setMobileMenu={setMobileMenu} />
      </div>

      {/* Mobile Drawer */}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenu(false)} />
          <div className="relative w-[240px] h-full bg-[#020817] border-r border-[#1e293b] p-5 flex flex-col justify-between animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#1e293b]/50 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-400 flex items-center justify-center">
                    <Stethoscope size={16} />
                  </div>
                  <span className="font-black text-lg">MediTrack</span>
                </div>
                <button onClick={() => setMobileMenu(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <Sidebar role={role} logout={logout} setMobileMenu={setMobileMenu} />
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER — always visible on desktop, compact on mobile ── */}
      <header className="lg:ml-[220px] h-[58px] border-b border-[#1e293b] bg-[#020817]/95 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">

        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="lg:hidden p-2.5 rounded-xl bg-blue-400 text-white hover:bg-blue-500 transition-all shadow-md active:scale-95"
          >
            <Menu size={20} />
          </button>

          {/* Date + time */}
          <div className="hidden sm:block text-[11px] sm:text-sm font-semibold text-slate-400">
            {time.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}
            {" • "}
            <span className="text-white font-black">
              {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3 relative">

          {/* Live badge — admin only */}
          {role === "admin" && (
            <div className="hidden sm:flex h-9 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </div>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 rounded-xl bg-[#0f172a] border border-[#1e293b] hover:border-blue-500 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Notifications — admin only */}
          {role === "admin" && (
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`w-9 h-9 rounded-xl bg-[#0f172a] border flex items-center justify-center transition-all ${
                  showNotifications ? "border-blue-500 text-white" : "border-[#1e293b] text-slate-400 hover:text-white hover:border-slate-500"
                }`}
              >
                <Bell size={16} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 border border-[#020817] text-white font-black text-[10px] flex items-center justify-center shadow-md">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 mt-3 w-[300px] sm:w-[340px] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1e293b] pb-2">
                      <p className="font-black text-sm text-slate-900 dark:text-white">Notifications</p>
                      <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">Live</span>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">No user actions detected yet.</p>
                      ) : (
                        notifications.map((notif) => (
                          <div key={notif._id || notif.id} className="p-3 bg-slate-50 dark:bg-[#020817] rounded-xl border border-slate-100 dark:border-[#1e293b]/60 flex gap-2.5 items-start">
                            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                              <Activity size={14} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-normal break-words">{notif.details}</p>
                              <span className="text-[10px] text-slate-400 font-bold block mt-1">
                                {new Date(notif.createdAt || notif.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            className="hidden sm:flex w-9 h-9 rounded-xl bg-[#0f172a] border border-[#1e293b] hover:border-blue-500 text-slate-400 hover:text-white items-center justify-center transition-all"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="lg:ml-[220px] bg-[#020817] min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;