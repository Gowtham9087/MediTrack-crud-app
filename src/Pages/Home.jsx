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

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  const inputClass =
    "w-full bg-white/15 border border-white/15 text-white placeholder-slate-300 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/20 transition-all duration-300";

  return (
    <div
      className="min-h-[calc(100vh-80px)] relative overflow-hidden px-4 sm:px-6 py-10"
      style={{
        backgroundImage: "url('/doctor6.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#020617]/75 backdrop-blur-[3px]" />

      <div className="absolute w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full top-20 left-6" />
      <div className="absolute w-72 h-72 bg-purple-500/20 blur-3xl rounded-full bottom-16 right-6" />

      {toast && (
        <div className="fixed top-24 right-4 left-4 sm:left-auto sm:right-6 z-[99999] bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-5 py-4 rounded-2xl shadow-2xl font-semibold text-center animate-pulse">
          {toast}
        </div>
      )}

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <p className="inline-block mb-3 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-200 text-sm font-semibold">
            Admin Panel
          </p>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-wide">
            Add Patient Details
          </h1>

          <p className="text-cyan-100 mt-3 text-sm sm:text-base">
            Manage and store patient records securely
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl border border-white/15 p-5 sm:p-8 lg:p-10 rounded-3xl shadow-2xl">
          <form
            onSubmit={addPatient}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <input
              name="name"
              value={patient.name}
              placeholder="Patient Name"
              onChange={handleChange}
              required
              className={inputClass}
            />

            <input
              name="email"
              type="email"
              value={patient.email}
              placeholder="Email Address"
              onChange={handleChange}
              required
              className={inputClass}
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
              className={inputClass}
            />

            <input
              name="age"
              type="number"
              value={patient.age}
              placeholder="Age"
              onChange={handleChange}
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
              placeholder="Address"
              onChange={handleChange}
              required
              className={inputClass}
            />

            <textarea
              name="problem"
              value={patient.problem}
              placeholder="Disease / Problem"
              onChange={handleChange}
              required
              rows="4"
              className={`${inputClass} md:col-span-2 resize-none`}
            />

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 py-4 rounded-2xl font-bold text-white cursor-pointer shadow-lg hover:shadow-cyan-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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