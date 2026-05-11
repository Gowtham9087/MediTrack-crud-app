// Feedback.jsx

import { useRef, useState } from "react";
import { API_URL } from "../api";

function Feedback() {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");

  const [feedback, setFeedback] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);

    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    toastTimer.current = setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          feedback: feedback,
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

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{
        backgroundImage: "url('/doctor5.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      {toast && (
        <div className="fixed top-24 right-6 z-[9999] bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-4 rounded-xl shadow-2xl font-semibold">
          {toast}
        </div>
      )}

      <form
        onSubmit={submitFeedback}
        className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-[0_0_40px_rgba(59,130,246,0.35)]"
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white tracking-wide">
            Give Feedback
          </h1>

          <p className="text-cyan-200 mt-3">
            Share your experience and help us improve
          </p>
        </div>

        <label className="text-white text-sm font-medium mb-2 block">
          Name
        </label>
        <input
          value={userName}
          readOnly
          className="w-full mb-5 bg-white/20 border border-white/20 text-white px-5 py-4 rounded-xl outline-none cursor-not-allowed"
        />

        <label className="text-white text-sm font-medium mb-2 block">
          Email
        </label>
        <input
          value={userEmail}
          readOnly
          className="w-full mb-5 bg-white/20 border border-white/20 text-white px-5 py-4 rounded-xl outline-none cursor-not-allowed"
        />

        <label className="text-white text-sm font-medium mb-2 block">
          Feedback
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your feedback..."
          required
          className="w-full h-40 bg-white/20 border border-white/20 text-white placeholder-gray-300 px-5 py-4 rounded-xl outline-none resize-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
        />

        <button
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 py-4 rounded-xl text-white font-semibold cursor-pointer shadow-lg hover:shadow-cyan-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}

export default Feedback;