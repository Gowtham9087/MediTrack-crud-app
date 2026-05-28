import { useState } from "react";
import { ClipboardList, Clock, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

function ActivityLogsTable({ logs }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(logs.length / PAGE_SIZE);
  const paginated = logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ⚡️ TIGHTER PAGINATION LOGIC: Shows max 5 items to fit mobile screens perfectly
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-[#1e293b] text-slate-500 dark:text-slate-400 text-[13px] font-semibold tracking-wide">
            <th className="px-6 py-5 whitespace-nowrap">Action</th>
            <th className="px-6 py-5 whitespace-nowrap"><span className="text-slate-300 dark:text-slate-600 mr-4 font-light">|</span>Role</th>
            <th className="px-6 py-5 whitespace-nowrap"><span className="text-slate-300 dark:text-slate-600 mr-4 font-light">|</span>Details</th>
            <th className="px-6 py-5 whitespace-nowrap"><span className="text-slate-300 dark:text-slate-600 mr-4 font-light">|</span>Time</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((log) => (
            <tr key={log._id} className="border-b border-slate-100 dark:border-[#1e293b] hover:bg-slate-50 dark:hover:bg-[#020817]/50 transition-colors last:border-0">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <ClipboardList size={15} />
                  </div>
                  <span className="font-bold text-[13px] text-slate-900 dark:text-white">{log.action}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold capitalize">
                  {log.userRole}
                </span>
              </td>
              <td className="px-6 py-4 text-[13px] text-slate-600 dark:text-slate-400 max-w-[300px]">
                <span className="line-clamp-2">{log.details}</span>
              </td>
              <td className="px-6 py-4 text-[13px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Container */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 px-6 py-4 border-t border-slate-100 dark:border-[#1e293b]">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, logs.length)} of {logs.length}
          </p>
          
          {/* ⚡️ FIXED: Reduced gap slightly on mobile (gap-1.5) to ensure it fits on one line */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-[#1e293b] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1e293b] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <ChevronLeft size={15} />
            </button>
            
            {getPageNumbers().map((p, index) => (
              p === "..." ? (
                <span key={`ellipsis-${index}`} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 dark:text-slate-500 text-[11px] sm:text-xs font-bold shrink-0">
                  ...
                </span>
              ) : (
                <button
                  key={`page-${p}`}
                  onClick={() => setPage(p)}
                  /* ⚡️ FIXED: Made buttons slightly smaller on mobile (w-7 h-7 text-[11px]) */
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
                    p === page
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 dark:border-[#1e293b] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1e293b]"
                  }`}
                >
                  {p}
                </button>
              )
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-[#1e293b] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1e293b] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityLogsTable;