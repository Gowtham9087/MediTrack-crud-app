import { useState } from "react";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

function FeedbackTable({ feedbacks, setDeleteId }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(feedbacks.length / PAGE_SIZE);
  const paginated = feedbacks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-[#1e293b] text-slate-500 dark:text-slate-400 text-[13px] font-semibold tracking-wide">
            <th className="px-6 py-5 whitespace-nowrap">ID</th>
            <th className="px-6 py-5 whitespace-nowrap"><span className="text-slate-300 dark:text-slate-600 mr-4 font-light">|</span>Name</th>
            <th className="px-6 py-5 whitespace-nowrap"><span className="text-slate-300 dark:text-slate-600 mr-4 font-light">|</span>Email</th>
            <th className="px-6 py-5 whitespace-nowrap"><span className="text-slate-300 dark:text-slate-600 mr-4 font-light">|</span>Feedback</th>
            <th className="px-6 py-5 whitespace-nowrap"><span className="text-slate-300 dark:text-slate-600 mr-4 font-light">|</span>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((fb, index) => (
            <tr key={fb._id} className="border-b border-slate-100 dark:border-[#1e293b] hover:bg-slate-50 dark:hover:bg-[#020817]/50 transition-colors last:border-0">
              <td className="px-6 py-4 font-bold text-[13px] text-slate-700 dark:text-slate-300">
                {(page - 1) * PAGE_SIZE + index + 1}
              </td>
              <td className="px-6 py-4 text-[13px] font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">{fb.name || "Unknown"}</td>
              <td className="px-6 py-4 text-[13px] text-slate-600 dark:text-slate-400 whitespace-nowrap">{fb.email || "—"}</td>
              <td className="px-6 py-4 text-[13px] text-slate-600 dark:text-slate-400 max-w-[320px]">
                <span className="line-clamp-2">{fb.feedback || fb.message || "—"}</span>
              </td>
              <td className="px-6 py-4">
                <button type="button" onClick={() => setDeleteId(fb._id)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all" title="Delete Feedback">
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ⚡️ FIXED: Pagination Container is now Mobile Responsive */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 px-6 py-4 border-t border-slate-100 dark:border-[#1e293b]">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, feedbacks.length)} of {feedbacks.length}
          </p>
          
          {/* ⚡️ Added flex-wrap here in case there are many pages */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-[#1e293b] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1e293b] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all shrink-0 ${
                  p === page
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 dark:border-[#1e293b] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1e293b]"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-[#1e293b] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1e293b] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackTable;