import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";

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
    const fetchData = async () => {
      await fetchFeedbacks();
    };

    fetchData();

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
      fetchFeedbacks();
    } catch (err) {
      console.log(err);
      showToast("Delete failed ❌");
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-80px)] relative overflow-hidden px-4 sm:px-6 py-10"
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

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <p className="inline-block mb-3 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-200 text-sm font-semibold">
            Feedback Management
          </p>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            User Feedback List
          </h1>

          <p className="text-cyan-100 mt-3 text-sm sm:text-base">
            View and manage feedback submitted by users
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl border border-white/15 p-5 sm:p-8 rounded-3xl shadow-2xl text-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Feedbacks</h2>
            <p className="text-cyan-200 font-semibold">
              Total: {feedbacks.length}
            </p>
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[850px] text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="bg-white/10 text-cyan-300">
                  <th className="px-4 py-4 rounded-l-2xl">#</th>
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Feedback</th>
                  <th className="px-4 py-4 rounded-r-2xl">Action</th>
                </tr>
              </thead>

              <tbody>
                {feedbacks.map((f, i) => (
                  <tr
                    key={f._id || f.id}
                    className="bg-white/5 hover:bg-cyan-500/10 transition-all"
                  >
                    <td className="px-4 py-4 rounded-l-2xl">{i + 1}</td>
                    <td className="px-4 py-4 font-semibold">{f.name}</td>
                    <td className="px-4 py-4">{f.email}</td>
                    <td className="px-4 py-4">{f.feedback}</td>

                    <td className="px-4 py-4 rounded-r-2xl">
                      <button
                        onClick={() => setDeleteId(f._id || f.id)}
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 transition-all text-white px-4 py-2 rounded-xl shadow-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {feedbacks.map((f, i) => (
              <div
                key={f._id || f.id}
                className="bg-white/10 border border-white/10 rounded-3xl p-5 shadow-xl"
              >
                <p className="text-xs text-cyan-300 font-semibold">
                  Feedback #{i + 1}
                </p>

                <h2 className="text-xl font-bold mt-1">{f.name}</h2>
                <p className="text-sm text-slate-300">{f.email}</p>

                <p className="mt-4 text-slate-100 leading-relaxed">
                  {f.feedback}
                </p>

                <button
                  onClick={() => setDeleteId(f._id || f.id)}
                  className="w-full mt-5 bg-gradient-to-r from-red-500 to-pink-500 px-4 py-3 rounded-2xl font-semibold"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {feedbacks.length === 0 && (
            <div className="text-center mt-10">
              <p className="text-2xl text-cyan-200 mb-2">
                No Feedback Available
              </p>
              <p className="text-slate-300">
                User feedback will appear here once submitted
              </p>
            </div>
          )}
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-[9998] px-4">
          <div className="bg-[#0B1120]/90 backdrop-blur-2xl border border-white/15 text-white p-6 sm:p-8 rounded-3xl w-full max-w-md text-center shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Confirm Delete
            </h2>

            <p className="mb-6 text-slate-300">
              Are you sure you want to delete this feedback?
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-slate-600 hover:bg-slate-500 px-5 py-3 rounded-2xl"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deleteFeedback(deleteId);
                  setDeleteId(null);
                }}
                className="bg-gradient-to-r from-red-500 to-pink-500 px-5 py-3 rounded-2xl font-semibold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminFeedback;