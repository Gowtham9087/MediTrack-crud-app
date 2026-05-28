import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";
import { MessageSquare } from "lucide-react";

import EmptyState from "../components/ui/EmptyState";
import FeedbackTable from "../components/tables/FeedbackTable";
import DeleteFeedbackModal from "../components/feedback/DeleteFeedbackModal";

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState("");

  const toastTimer = useRef(null);
  const token = localStorage.getItem("token");

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(`${API_URL}/feedbacks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Failed to fetch feedbacks ❌");
        return;
      }
      setFeedbacks(data);
    } catch (err) {
      console.log(err);
      showToast("Failed to fetch feedbacks ❌");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const deleteFeedback = async (id) => {
    try {
      const res = await fetch(`${API_URL}/feedbacks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Delete failed ❌");
        return;
      }
      showToast("Feedback deleted ✔️");
      setDeleteId(null);
      fetchFeedbacks();
    } catch (err) {
      console.log(err);
      showToast("Delete failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] text-slate-900 dark:text-white px-6 py-5 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-24 right-6 z-[99999] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] text-slate-900 dark:text-white px-5 py-4 rounded-2xl shadow-xl font-semibold animate-in slide-in-from-right-10 fade-in duration-300">
          {toast}
        </div>
      )}

      <div className="max-w-[1650px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <p className="text-blue-500 font-bold mb-1 text-sm">Feedback Management</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">User Feedbacks</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
              View and manage feedback submitted by patients.
            </p>
          </div>
        </div>

        {/* Badge */}
        <div className="mb-5 pl-1">
          <div className="inline-flex items-center gap-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] px-3.5 py-1.5 rounded-xl shadow-sm">
            <MessageSquare size={14} className="text-blue-500" />
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Feedbacks</span>
            <span className="text-sm font-black text-slate-900 dark:text-white leading-none">{feedbacks.length}</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-[#1e293b] shadow-sm overflow-x-auto">
          {feedbacks.length > 0 ? (
            <FeedbackTable feedbacks={feedbacks} setDeleteId={setDeleteId} />
          ) : (
            <div className="p-8">
              <EmptyState
                title="No Feedback Available"
                description="User feedback will appear here once submitted."
              />
            </div>
          )}
        </div>
      </div>

      <DeleteFeedbackModal
        deleteId={deleteId}
        setDeleteId={setDeleteId}
        deleteFeedback={deleteFeedback}
      />
    </div>
  );
}

export default AdminFeedback;