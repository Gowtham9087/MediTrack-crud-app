import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import { Lock, Mail, Stethoscope, Eye, EyeOff } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [login, setLogin] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverWaking, setServerWaking] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Wake up backend when page loads
  useEffect(() => {
    setServerWaking(true);
    setCountdown(30);

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Ping server
    fetch("https://meditrack-crud-app1.onrender.com")
      .then(() => {
        setServerWaking(false);
        clearInterval(timer);
        setCountdown(0);
      })
      .catch(() => {
        setServerWaking(false);
        clearInterval(timer);
        setCountdown(0);
      });

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      if (data.role === "admin") {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_userName", data.user.name);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);
        navigate("/admin/dashboard");
        return;
      }

      if (data.role === "doctor") {
        localStorage.setItem("doctor_token", data.token);
        localStorage.setItem("doctor_userName", data.user.name);
        localStorage.setItem("doctor_userId", String(data.userId));
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userId", String(data.userId));
        navigate("/doctor/dashboard");
        return;
      }

      if (data.role === "user") {
        localStorage.setItem("user_token", data.token);
        localStorage.setItem("user_userName", data.user.name);
        localStorage.setItem("user_userId", String(data.userId));
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);
        navigate("/user");
        return;
      }

    } catch (error) {
      console.log(error);
      if (error.message === "Failed to fetch") {
        setError("Server is waking up, please wait 30 seconds and try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full -top-40 -left-40" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-[130px] rounded-full -bottom-40 -right-40" />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-[2rem] overflow-hidden border border-[#1e293b] bg-[#0f172a]/80 shadow-2xl backdrop-blur-xl">

        {/* Left Panel */}
        <div className="hidden lg:flex flex-col justify-center p-12 border-r border-[#1e293b] relative overflow-hidden">
          <div className="absolute w-72 h-72 bg-blue-600/10 rounded-full -top-20 -right-20" />
          <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full -bottom-32 -left-32" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Stethoscope size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black">
                  Medi<span className="text-blue-500">Track</span>
                </h1>
                <p className="text-slate-500 text-sm">Hospital Management System</p>
              </div>
            </div>

            <h2 className="text-5xl font-black leading-tight text-white">
              Secure <br /> Healthcare <br /> Portal
            </h2>

            <p className="text-slate-400 mt-5 text-base leading-relaxed">
              One dashboard for all hospital operations.
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="p-8 sm:p-10 lg:p-14 flex items-center">
          <form onSubmit={handleLogin} className="w-full max-w-md mx-auto">

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Stethoscope size={24} />
              </div>
              <h1 className="text-2xl font-black">
                Medi<span className="text-blue-500">Track</span>
              </h1>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <p className="text-blue-400 font-bold text-sm mb-1">Welcome Back</p>
              <h1 className="text-3xl font-black">Login to Account</h1>
            </div>

            {/* Server waking up banner with countdown */}
            {serverWaking && (
              <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-3 rounded-2xl text-sm text-center font-semibold">
                ⏳ Server is starting up, please wait...{" "}
                <span className="text-white font-black text-base">{countdown}s</span>
                <div className="mt-2 w-full bg-yellow-500/10 rounded-full h-1.5">
                  <div
                    className="bg-yellow-400 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${((30 - countdown) / 30) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Server ready banner */}
            {!serverWaking && countdown === 0 && (
              <div className="mb-4 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-2xl text-sm text-center font-semibold">
                ✅ Server is ready! You can login now.
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label className="text-slate-300 text-sm font-semibold mb-2 block">
                Email Address
              </label>
              <div className="bg-[#020817] border border-[#1e293b] rounded-2xl px-4 py-4 flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <Mail size={18} className="text-slate-500 shrink-0" />
                <input
                  type="email"
                  name="email"
                  value={login.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="bg-transparent outline-none w-full text-white placeholder-slate-500 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="text-slate-300 text-sm font-semibold mb-2 block">
                Password
              </label>
              <div className="bg-[#020817] border border-[#1e293b] rounded-2xl px-4 py-4 flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <Lock size={18} className="text-slate-500 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={login.password}
                  onChange={handleChange}
                  placeholder="Enter your password / phone number"
                  required
                  className="bg-transparent outline-none w-full text-white placeholder-slate-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 hover:text-white transition-all shrink-0"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" className="accent-blue-600" />
                Remember me
              </label>
              <button
                type="button"
                className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-sm text-center font-semibold">
                ⚠ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || serverWaking}
              className="w-full mt-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : serverWaking ? `Please wait ${countdown}s...` : "Login"}
            </button>

            <p className="text-center text-slate-600 text-xs mt-6">
              MediTrack © 2026 Hospital Management System
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;