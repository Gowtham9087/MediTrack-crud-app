import { MessageSquare, Send } from "lucide-react";

function FeedbackForm({
  userName,
  userEmail,
  feedback,
  setFeedback,
  submitFeedback,
  loading,
  inputClass,
}) {
  return (
    <form
      onSubmit={submitFeedback}
      className="lg:col-span-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-[2rem] p-6 sm:p-8 shadow-sm transition-colors duration-300"
    >
      <div className="flex items-center gap-3 mb-7">
        <div className="w-12 h-12 rounded-2xl bg-purple-400 text-white flex items-center justify-center">
          <MessageSquare size={22} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Feedback Form
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Your feedback will be visible to admin.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <input
          value={userName || ""}
          readOnly
          className={inputClass}
        />
        <input
          value={userEmail || ""}
          readOnly
          className={inputClass}
        />
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your feedback..."
          required
          className={`${inputClass} h-44 resize-none`}
        />
      </div>

      <button
        disabled={loading}
        className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-500 active:scale-[0.98] transition-all py-4 rounded-2xl text-white font-extrabold shadow-lg shadow-blue-500/20 disabled:opacity-60"
      >
        <Send size={20} />
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}

export default FeedbackForm;