import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { API_URL } from "../api";

function DoctorLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      if (data.role !== "doctor") {
        setError("Access denied. Not a doctor account.");
        setLoading(false);
        return;
      }

      // Store with role-specific keys (matches App.jsx ProtectedRoute)
      localStorage.setItem("doctor_token", data.token);
      localStorage.setItem("doctor_userName", data.user.name);
      localStorage.setItem("doctor_role", "doctor");

      navigate("/doctor/dashboard");
    } catch (err) {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] " +
    "text-slate-900 dark:text-white placeholder-slate-400 px-5 h-[56px] rounded-2xl " +
    "outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-[2rem] p-8 shadow-xl">

        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <Stethoscope size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Doctor Portal
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Sign in to manage your appointments
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`${inputClass} !pl-12`}
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password (your phone number)"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`${inputClass} !pl-12 !pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Hint */}
          <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl px-4 py-3">
            <span className="text-lg">🔑</span>
            <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
              Use your <span className="font-black">Email</span> and{" "}
              <span className="font-black">Phone Number</span> as password.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[56px] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            <LogIn size={20} />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Contact your administrator if you don't have login credentials.
        </p>
      </div>
    </div>
  );
}

export default DoctorLogin;