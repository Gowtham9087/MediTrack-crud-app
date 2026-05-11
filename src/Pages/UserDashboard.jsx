// UserDashboard.jsx

import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";

function UserDashboard() {
  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");

  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const toastTimer = useRef(null);

  const [patientId, setPatientId] = useState(null);

  const [patient, setPatient] = useState({
    name: userName || "",
    email: userEmail || "",
    contact: "",
    address: "",
    age: "",
    gender: "",
    problem: "",
  });

  const showToast = (msg) => {
    setToast(msg);

    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    toastTimer.current = setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${API_URL}/patients/email/${userEmail}`);
      const myData = await res.json();

      if (myData) {
        setPatientId(myData.id);

        setPatient({
          name: myData.name || "",
          email: myData.email || "",
          contact: myData.contact || "",
          address: myData.address || "",
          age: myData.age || "",
          gender: myData.gender || "",
          problem: myData.problem || "",
        });
      }
    } catch (error) {
      console.log(error);
      showToast("Failed to fetch user data ❌");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
    };

    fetchData();

    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const savePatient = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/patients/${patientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patient),
      });

      if (!res.ok) {
        showToast("Update failed ❌");
        setLoading(false);
        return;
      }

      showToast("Your details updated successfully ✔️");
    } catch (error) {
      console.log(error);
      showToast("Update failed ❌");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen px-6 py-12 relative overflow-hidden"
      style={{
        backgroundImage: "url('/doctor5.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-24 right-6 z-[9999] bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-4 rounded-xl shadow-2xl font-semibold">
          {toast}
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-[0_0_40px_rgba(59,130,246,0.35)]">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white tracking-wide">
            User Dashboard
          </h1>

          <p className="text-cyan-200 mt-3">
            Manage and update your personal medical details
          </p>
        </div>

        <form
          onSubmit={savePatient}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <input
            name="name"
            value={patient.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="bg-white/20 border border-white/20 text-white placeholder-gray-300 px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
          />

          <input
            name="email"
            value={patient.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="bg-white/20 border border-white/20 text-white placeholder-gray-300 px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
          />

          <input
            name="contact"
            value={patient.contact}
            onChange={handleChange}
            placeholder="Contact Number"
            required
            className="bg-white/20 border border-white/20 text-white placeholder-gray-300 px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
          />

          <input
            name="age"
            type="number"
            value={patient.age}
            onChange={handleChange}
            placeholder="Age"
            required
            className="bg-white/20 border border-white/20 text-white placeholder-gray-300 px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
          />

          <select
            name="gender"
            value={patient.gender}
            onChange={handleChange}
            required
            className="bg-white/20 border border-white/20 text-white px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
          >
            <option value="" className="text-black">
              Select Gender
            </option>

            <option value="Male" className="text-black">
              Male
            </option>

            <option value="Female" className="text-black">
              Female
            </option>

            <option value="Other" className="text-black">
              Other
            </option>
          </select>

          <input
            name="address"
            value={patient.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="bg-white/20 border border-white/20 text-white placeholder-gray-300 px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
          />

          <textarea
            name="problem"
            value={patient.problem}
            onChange={handleChange}
            placeholder="Disease / Problem"
            required
            rows="4"
            className="md:col-span-2 bg-white/20 border border-white/20 text-white placeholder-gray-300 px-5 py-4 rounded-xl outline-none resize-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
          />

          <button
            disabled={loading}
            className="md:col-span-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 py-4 rounded-xl text-white font-semibold cursor-pointer shadow-lg hover:shadow-cyan-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update My Details"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserDashboard;