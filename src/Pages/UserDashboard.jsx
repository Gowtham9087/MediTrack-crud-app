import { useEffect, useRef, useState } from "react";
import { API_URL } from "../api";

function UserDashboard() {
  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");
  const token = localStorage.getItem("token");

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

  const inputClass =
    "w-full bg-white/15 border border-white/15 text-white placeholder-slate-300 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/20 transition-all";

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${API_URL}/patients/email/${userEmail}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const myData = await res.json();

      if (!res.ok) {
        showToast(myData.message || "Failed to fetch user data ❌");
        return;
      }

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
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const savePatient = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (patient.contact.length !== 10) {
      showToast("Contact number must be 10 digits ❌");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/patients/${patientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patient),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Update failed ❌");
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

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <p className="inline-block mb-3 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-200 text-sm font-semibold">
            User Profile
          </p>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            User Dashboard
          </h1>

          <p className="text-cyan-100 mt-3 text-sm sm:text-base">
            Manage and update your personal medical details
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl border border-white/15 p-5 sm:p-8 lg:p-10 rounded-3xl shadow-2xl">
          <form
            onSubmit={savePatient}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <input
              name="name"
              value={patient.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className={inputClass}
            />

            <input
              name="email"
              value={patient.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className={inputClass}
            />

            <input
              name="contact"
              value={patient.contact}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) {
                  setPatient({ ...patient, contact: value });
                }
              }}
              placeholder="Contact Number"
              required
              className={inputClass}
            />

            <input
              name="age"
              type="number"
              value={patient.age}
              onChange={handleChange}
              placeholder="Age"
              required
              className={inputClass}
            />

            <select
              name="gender"
              value={patient.gender}
              onChange={handleChange}
              required
              className={inputClass}
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
              className={inputClass}
            />

            <textarea
              name="problem"
              value={patient.problem}
              onChange={handleChange}
              placeholder="Disease / Problem"
              required
              rows="4"
              className={`${inputClass} md:col-span-2 resize-none`}
            />

            <button
              disabled={loading}
              className="md:col-span-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 py-4 rounded-2xl text-white font-bold cursor-pointer shadow-lg disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update My Details"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;