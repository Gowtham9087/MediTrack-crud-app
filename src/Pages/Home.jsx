import { useRef, useState } from "react";
import { API_URL } from "../api";

function Home() {
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const toastTimer = useRef(null);

  const [patient, setPatient] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    age: "",
    gender: "",
    problem: "",
  });

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const showToast = (msg) => {
    setToast(msg);

    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    toastTimer.current = setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const addPatient = async (e) => {
    e.preventDefault();

    if (
      !patient.name.trim() ||
      !patient.email.trim() ||
      !patient.contact.trim() ||
      !patient.age ||
      !patient.gender ||
      !patient.address.trim() ||
      !patient.problem.trim()
    ) {
      showToast("Please fill all fields ❌");
      return;
    }

    if (patient.contact.length !== 10) {
      showToast("Mobile number must be 10 digits ❌");
      return;
    }

    if (Number(patient.age) <= 0) {
      showToast("Please enter valid age ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patient),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Patient already exists ❌");
        setLoading(false);
        return;
      }

      showToast("Patient added successfully ✔️");

      setPatient({
        name: "",
        email: "",
        contact: "",
        address: "",
        age: "",
        gender: "",
        problem: "",
      });
    } catch (error) {
      console.log(error);
      showToast("Something went wrong ❌");
    }

    setLoading(false);
  };

  return (
    <div
      className="w-full min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('/doctor6.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-24 right-6 z-[99999] bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-4 rounded-xl shadow-2xl font-semibold animate-pulse">
          {toast}
        </div>
      )}

      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-[0_0_40px_rgba(59,130,246,0.35)]">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-white tracking-wide">
              Add Patient Details
            </h1>

            <p className="text-cyan-200 mt-3">
              Manage and store patient records securely
            </p>
          </div>

          <form
            onSubmit={addPatient}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <input
              name="name"
              value={patient.name}
              placeholder="Patient Name"
              onChange={handleChange}
              required
              className="bg-white/20 border border-white/20 text-white placeholder-gray-300 px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
            />

            <input
              name="email"
              type="email"
              value={patient.email}
              placeholder="Email Address"
              onChange={handleChange}
              required
              className="bg-white/20 border border-white/20 text-white placeholder-gray-300 px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
            />

            <input
              name="contact"
              type="tel"
              value={patient.contact}
              placeholder="Mobile Number"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setPatient({ ...patient, contact: value });
              }}
              maxLength="10"
              required
              className="bg-white/20 border border-white/20 text-white placeholder-gray-300 px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
            />

            <input
              name="age"
              type="number"
              value={patient.age}
              placeholder="Age"
              onChange={handleChange}
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
              placeholder="Address"
              onChange={handleChange}
              required
              className="bg-white/20 border border-white/20 text-white placeholder-gray-300 px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
            />

            <textarea
              name="problem"
              value={patient.problem}
              placeholder="Disease / Problem"
              onChange={handleChange}
              required
              rows="4"
              className="md:col-span-2 bg-white/20 border border-white/20 text-white placeholder-gray-300 px-5 py-4 rounded-xl outline-none resize-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
            />

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 py-4 rounded-xl font-semibold text-white cursor-pointer shadow-lg hover:shadow-cyan-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Adding Patient..." : "Add Patient"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;