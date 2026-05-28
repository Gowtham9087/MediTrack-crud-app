import { useState, useEffect } from "react";
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
  
  // ⚡️ FIXED: Define the "Dashboard" for all roles so the header knows when to show!
  const isDashboard = 
    location.pathname === "/admin/dashboard" || 
    location.pathname === "/doctor/dashboard" || 
    location.pathname === "/user";

  // 1. Clock Sync
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Notification polling — ONLY for Admin on the dashboard page
  useEffect(() => {
    if (role !== "admin") return;
    if (!isDashboard) return; 

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
        console.error("Failed pulling real-time notification wire:", err);
      }
    };

    fetchLiveNotifications();
    const streamInterval = setInterval(fetchLiveNotifications, 5000);
    
    return () => clearInterval(streamInterval);
  }, [token, role, isDashboard]);

  // 3. Native Fullscreen Canvas tracking
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white overflow-x-hidden">
      
      {/* Desktop Fixed Sidebar Container */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-[220px] z-50">
        <Sidebar role={role} logout={logout} setMobileMenu={setMobileMenu} />
      </div>

      {/* Mobile Responsive Drawer Overlay */}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenu(false)} />
          <div className="relative w-[240px] h-full bg-[#020817] border-r border-[#1e293b] p-5 flex flex-col justify-between animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#1e293b]/50 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
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

      {/* ⚡️ FULL HEADER: Renders ONLY on Main Dashboards ("My Queue") */}
      {isDashboard && (
        <header className="lg:ml-[220px] h-20 border-b border-[#1e293b] bg-[#020817] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenu(!mobileMenu)} 
              className="lg:hidden p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              <Menu size={20} />
            </button>
            
            <div className="text-[11px] sm:text-sm font-semibold text-slate-400 hidden sm:block">
              {time.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}{" • "}
              <span className="text-white font-black">
                {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3.5 relative">
            {role === "admin" && (
              <div className="hidden sm:flex h-9 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </div>
            )}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 rounded-xl bg-[#0f172a] border border-[#1e293b] hover:border-blue-500 text-slate-400 hover:text-white flex items-center justify-center transition-all"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {role === "admin" && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`w-10 h-10 rounded-xl bg-[#0f172a] border flex items-center justify-center transition-all ${
                    showNotifications ? "border-blue-500 text-white shadow-lg" : "border-[#1e293b] text-slate-400 hover:text-white hover:border-slate-500"
                  }`}
                >
                  <Bell size={18} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 border border-[#020817] text-white font-black text-[10px] flex items-center justify-center shadow-md animate-bounce">
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
                        <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">Live Stream</span>
                      </div>
                      
                      <div className="space-y-2 max-h-64 overflow-y-auto sidebar-scroll pr-1">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-4">No user actions detected yet.</p>
                        ) : (
                          notifications.map((notif) => (
                            <div 
                              key={notif._id || notif.id} 
                              className="p-3 bg-slate-50 dark:bg-[#020817] rounded-xl border border-slate-100 dark:border-[#1e293b]/60 flex gap-2.5 items-start transition-all"
                            >
                              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                                <Activity size={14} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-normal break-words">
                                  {notif.details}
                                </p>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block mt-1">
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

            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              className="hidden sm:flex w-10 h-10 rounded-xl bg-[#0f172a] border border-[#1e293b] hover:border-blue-500 text-slate-400 hover:text-white items-center justify-center transition-all"
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </header>
      )}

      {/* ⚡️ COMPACT MOBILE HEADER: Renders ONLY on Subpages (Desktop sees nothing!) */}
      {!isDashboard && (
        <div className="lg:hidden h-16 border-b border-[#1e293b] bg-[#020817] px-4 flex items-center sticky top-0 z-30">
          <button 
            onClick={() => setMobileMenu(true)} 
            className="p-2.5 rounded-xl bg-blue-600 text-white transition-all shadow-md active:scale-95"
          >
            <Menu size={20} />
          </button>
          <span className="ml-3 font-black text-lg text-white">Medi<span className="text-blue-500">Track</span></span>
        </div>
      )}

      {/* Main Panel App Area */}
      <main className={`lg:ml-[220px] bg-[#020817] min-h-screen overflow-x-hidden ${isDashboard ? "pt-0" : "pt-0 lg:pt-6"}`}>
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;