import { useRef, useState } from "react";
import { API_URL } from "../api";

import PageHeader from "../components/ui/PageHeader";
import FeedbackProfileCard from "../components/feedback/FeedbackProfileCard";
import FeedbackForm from "../components/feedback/FeedbackForm";

function Feedback() {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");

  const [feedback, setFeedback] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    if (!token) {
      showToast("No token provided. Please login again ❌");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: userName, email: userEmail, feedback }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Feedback failed ❌");
        setLoading(false);
        return;
      }
      setFeedback("");
      showToast("Feedback submitted successfully ✔️");
    } catch (error) {
      console.log(error);
      showToast("Feedback failed ❌");
    }
    setLoading(false);
  };

  // ✅ Fixed: dark bg matches #020817 page, input uses #0f172a like other pages
  const inputClass =
    "w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] px-4 sm:px-6 py-8 transition-all duration-300">
      {toast && (
        <div className="fixed top-24 right-4 left-4 sm:left-auto sm:right-6 z-[99999] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] text-slate-900 dark:text-white px-5 py-4 rounded-2xl shadow-xl font-semibold text-center animate-in slide-in-from-right-10 fade-in duration-300">
          {toast}
        </div>
      )}

      <div className="max-w-[1100px] mx-auto">
        <PageHeader
          badge="Patient Portal"
          title="Give Feedback"
          description="Share your experience and help us improve MediTrack."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FeedbackProfileCard userName={userName} userEmail={userEmail} />
          <FeedbackForm
            userName={userName}
            userEmail={userEmail}
            feedback={feedback}
            setFeedback={setFeedback}
            submitFeedback={submitFeedback}
            loading={loading}
            inputClass={inputClass}
          />
        </div>
      </div>
    </div>
  );
}

export default Feedback;