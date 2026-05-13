import { useRef, useState } from "react";
import { API_URL } from "../api";

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
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          feedback,
        }),
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

  const inputClass =
    "w-full bg-white/15 border border-white/15 text-white placeholder-slate-300 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/20 transition-all";

  return (
    <div
      className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 sm:px-6 py-10 relative overflow-hidden"
      style={{
        backgroundImage: "url('/doctor5.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#020617]/75 backdrop-blur-[3px]" />

      {toast && (
        <div className="fixed top-24 right-4 left-4 sm:left-auto sm:right-6 z-[99999] bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-5 py-4 rounded-2xl shadow-2xl font-semibold text-center">
          {toast}
        </div>
      )}

      <form
        onSubmit={submitFeedback}
        className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-2xl border border-white/15 p-5 sm:p-8 lg:p-10 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-3xl shadow-lg">
            💬
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Give Feedback
          </h1>

          <p className="text-cyan-100 mt-3 text-sm sm:text-base">
            Share your experience and help us improve
          </p>
        </div>

        <div className="space-y-5">
          <input value={userName || ""} readOnly className={inputClass} />
          <input value={userEmail || ""} readOnly className={inputClass} />

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback..."
            required
            className={`${inputClass} h-40 resize-none`}
          />
        </div>

        <button
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:-translate-y-1 active:scale-[0.98] transition-all py-4 rounded-2xl text-white font-bold shadow-lg disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}

export default Feedback;