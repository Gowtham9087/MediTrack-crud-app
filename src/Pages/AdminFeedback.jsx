// AdminFeedback.jsx

import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState("");

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

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(`${API_URL}/feedbacks`);
      const data = await res.json();
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
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const deleteFeedback = async (id) => {
    try {
      await fetch(`${API_URL}/feedbacks/${id}`, {
        method: "DELETE",
      });

      showToast("Feedback deleted ✔️");
      fetchFeedbacks();
    } catch (err) {
      console.log(err);
      showToast("Delete failed ❌");
    }
  };

  return (
    <div
      className="w-full min-h-screen relative overflow-hidden"
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

      <div className="relative z-10 px-6 py-10">
        <h1 className="text-5xl font-bold text-center mb-3 text-white tracking-wide">
          User Feedback List
        </h1>

        <p className="text-center text-cyan-200 mb-10">
          View and manage all feedback submitted by users
        </p>

        <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-[0_0_40px_rgba(59,130,246,0.25)] text-white">
          <div className="mb-6">
            <p className="text-cyan-200 font-medium">
              Total Feedbacks: {feedbacks.length}
            </p>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[850px] text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="bg-white/10 text-cyan-300">
                  <th className="px-4 py-4 rounded-l-xl">#</th>
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Feedback</th>
                  <th className="px-4 py-4 rounded-r-xl">Action</th>
                </tr>
              </thead>

              <tbody>
                {feedbacks.map((f, i) => (
                  <tr
                    key={f.id}
                    className="bg-white/5 hover:bg-cyan-500/10 transition-all duration-300"
                  >
                    <td className="px-4 py-4 rounded-l-xl">{i + 1}</td>
                    <td className="px-4 py-4 font-semibold">{f.name}</td>
                    <td className="px-4 py-4">{f.email}</td>
                    <td className="px-4 py-4">{f.feedback}</td>

                    <td className="px-4 py-4 rounded-r-xl">
                      <button
                        onClick={() => setDeleteId(f.id)}
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 transition-all duration-300 text-white px-4 py-2 rounded-xl cursor-pointer shadow-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {feedbacks.length === 0 && (
            <div className="text-center mt-10">
              <p className="text-2xl text-cyan-200 mb-2">
                No Feedback Available
              </p>

              <p className="text-gray-300">
                User feedback will appear here once submitted
              </p>
            </div>
          )}
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[9998] px-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-8 rounded-3xl w-full max-w-md text-center shadow-[0_0_40px_rgba(239,68,68,0.35)]">
            <h2 className="text-3xl font-bold mb-4">Confirm Delete</h2>

            <p className="mb-6 text-gray-300">
              Are you sure you want to delete this feedback?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-500/80 hover:bg-gray-500 px-5 py-3 rounded-xl cursor-pointer transition-all duration-300"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deleteFeedback(deleteId);
                  setDeleteId(null);
                }}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 transition-all duration-300 px-5 py-3 rounded-xl cursor-pointer"
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