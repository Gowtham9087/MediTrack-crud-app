import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import { Lock, Mail, Stethoscope, Eye, EyeOff, ShieldCheck, KeyRound } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState("login"); // "login" | "forgot" | "otp" | "reset"

  const [login, setLogin] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverWaking, setServerWaking] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // OTP flow
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Wake up backend
  useEffect(() => {
    setServerWaking(true);
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; });
    }, 1000);
    fetch("https://meditrack-crud-app1.onrender.com")
      .then(() => { setServerWaking(false); clearInterval(timer); setCountdown(0); })
      .catch(() => { setServerWaking(false); clearInterval(timer); setCountdown(0); });
    return () => clearInterval(timer);
  }, []);

  // Resend timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  const clearMessages = () => { setError(""); setSuccess(""); };

  // ─── Login ──────────────────────────────────────────────────────────────────
  const handleChange = (e) => { setLogin({ ...login, [e.target.name]: e.target.value }); clearMessages(); };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Invalid credentials"); setLoading(false); return; }

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
    } catch (err) {
      if (err.message === "Failed to fetch") {
        setError("Server is waking up, please wait 30 seconds and try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
    setLoading(false);
  };

  // ─── Send OTP ───────────────────────────────────────────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return setError("Please enter your email");
    setLoading(true);
    clearMessages();
    try {
      const res = await fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Failed to send OTP");
      setSuccess(data.message);
      setStep("otp");
      setResendTimer(60);
    } catch { setError("Failed to send OTP. Please try again."); }
    finally { setLoading(false); }
  };

  // ─── OTP input ───────────────────────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
  };

  // ─── Verify OTP ─────────────────────────────────────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return setError("Please enter the complete 6-digit OTP");
    setLoading(true);
    clearMessages();
    try {
      const res = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: otpValue }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Invalid OTP");
      setSuccess("OTP verified! Set your new password.");
      setStep("reset");
    } catch { setError("Verification failed. Please try again."); }
    finally { setLoading(false); }
  };

  // ─── Reset Password ──────────────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return setError("Passwords do not match");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    clearMessages();
    try {
      const res = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Reset failed");
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        setStep("login");
        setForgotEmail(""); setOtp(["", "", "", "", "", ""]);
        setNewPassword(""); setConfirmPassword("");
        clearMessages();
      }, 2000);
    } catch { setError("Reset failed. Please try again."); }
    finally { setLoading(false); }
  };

  // ─── Resend OTP ──────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    clearMessages();
    try {
      const res = await fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message);
      setSuccess("OTP resent successfully!");
      setOtp(["", "", "", "", "", ""]);
      setResendTimer(60);
    } catch { setError("Failed to resend OTP."); }
    finally { setLoading(false); }
  };

  const renderError = () => error && (
    <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-sm text-center font-semibold">⚠ {error}</div>
  );
  const renderSuccess = () => success && (
    <div className="mt-4 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-2xl text-sm text-center font-semibold">✅ {success}</div>
  );

  const leftText = {
    login:  { heading: <>Secure <br /> Healthcare <br /> Portal</>,       sub: "One dashboard for all hospital operations." },
    forgot: { heading: <>Forgot <br /> Your <br /> Password?</>,          sub: "Enter your email to receive a verification code." },
    otp:    { heading: <>OTP <br /> Verification</>,                      sub: "Enter the 6-digit code sent to your email." },
    reset:  { heading: <>Reset <br /> Password</>,                        sub: "Set a new secure password for your account." },
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center px-4 py-10 relative overflow-hidden">
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
                <h1 className="text-3xl font-black">Medi<span className="text-blue-500">Track</span></h1>
                <p className="text-slate-500 text-sm">Hospital Management System</p>
              </div>
            </div>
            <h2 className="text-5xl font-black leading-tight text-white">{leftText[step].heading}</h2>
            <p className="text-slate-400 mt-5 text-base leading-relaxed">{leftText[step].sub}</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="p-8 sm:p-10 lg:p-14 flex items-center">
          <div className="w-full max-w-md mx-auto">

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Stethoscope size={24} />
              </div>
              <h1 className="text-2xl font-black">Medi<span className="text-blue-500">Track</span></h1>
            </div>

            {/* ── LOGIN ─────────────────────────────────────────────────────── */}
            {step === "login" && (
              <form onSubmit={handleLogin}>
                <div className="mb-8">
                  <p className="text-blue-400 font-bold text-sm mb-1">Welcome Back</p>
                  <h1 className="text-3xl font-black">Login to Account</h1>
                </div>

                {serverWaking && (
                  <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-3 rounded-2xl text-sm text-center font-semibold">
                    ⏳ Server is starting up, please wait...{" "}
                    <span className="text-white font-black text-base">{countdown}s</span>
                    <div className="mt-2 w-full bg-yellow-500/10 rounded-full h-1.5">
                      <div className="bg-yellow-400 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${((30 - countdown) / 30) * 100}%` }} />
                    </div>
                  </div>
                )}
                {!serverWaking && countdown === 0 && (
                  <div className="mb-4 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-2xl text-sm text-center font-semibold">
                    ✅ Server is ready! You can login now.
                  </div>
                )}

                <div className="mb-4">
                  <label className="text-slate-300 text-sm font-semibold mb-2 block">Email Address</label>
                  <div className="bg-[#020817] border border-[#1e293b] rounded-2xl px-4 py-4 flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    <Mail size={18} className="text-slate-500 shrink-0" />
                    <input type="email" name="email" value={login.email} onChange={handleChange} placeholder="Enter your email" required className="bg-transparent outline-none w-full text-white placeholder-slate-500 text-sm" />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="text-slate-300 text-sm font-semibold mb-2 block">Password</label>
                  <div className="bg-[#020817] border border-[#1e293b] rounded-2xl px-4 py-4 flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    <Lock size={18} className="text-slate-500 shrink-0" />
                    <input type={showPassword ? "text" : "password"} name="password" value={login.password} onChange={handleChange} placeholder="Enter your password / phone number" required className="bg-transparent outline-none w-full text-white placeholder-slate-500 text-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-500 hover:text-white transition-all shrink-0">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                    <input type="checkbox" className="accent-blue-600" /> Remember me
                  </label>
                  <button type="button" onClick={() => { setStep("forgot"); clearMessages(); }} className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                    Forgot password?
                  </button>
                </div>

                {renderError()}

                <button type="submit" disabled={loading || serverWaking} className="w-full mt-6 py-4 rounded-2xl bg-blue-400 hover:bg-blue-500 text-white font-bold text-base transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? "Logging in..." : serverWaking ? `Please wait ${countdown}s...` : "Login"}
                </button>
              </form>
            )}

            {/* ── FORGOT ────────────────────────────────────────────────────── */}
            {step === "forgot" && (
              <form onSubmit={handleSendOTP}>
                <div className="mb-8">
                  <p className="text-blue-400 font-bold text-sm mb-1">Password Recovery</p>
                  <h1 className="text-3xl font-black">Forgot Password</h1>
                  <p className="text-slate-400 text-sm mt-2">Enter your registered email to receive an OTP.</p>
                </div>

                <div className="mb-6">
                  <label className="text-slate-300 text-sm font-semibold mb-2 block">Email Address</label>
                  <div className="bg-[#020817] border border-[#1e293b] rounded-2xl px-4 py-4 flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    <Mail size={18} className="text-slate-500 shrink-0" />
                    <input type="email" value={forgotEmail} onChange={(e) => { setForgotEmail(e.target.value); clearMessages(); }} placeholder="Enter your registered email" required className="bg-transparent outline-none w-full text-white placeholder-slate-500 text-sm" />
                  </div>
                </div>

                {renderError()}
                {renderSuccess()}

                <button type="submit" disabled={loading} className="w-full mt-2 py-4 rounded-2xl bg-blue-400 hover:bg-blue-500 text-white font-bold text-base transition-all shadow-lg shadow-blue-500/20 disabled:opacity-60">
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
                <button type="button" onClick={() => { setStep("login"); clearMessages(); }} className="w-full mt-3 py-4 rounded-2xl border border-[#1e293b] text-slate-400 hover:text-white font-semibold text-base transition-all">
                  ← Back to Login
                </button>
              </form>
            )}

            {/* ── OTP ───────────────────────────────────────────────────────── */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOTP}>
                <div className="mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                    <ShieldCheck size={28} className="text-blue-400" />
                  </div>
                  <p className="text-blue-400 font-bold text-sm mb-1">Verification</p>
                  <h1 className="text-3xl font-black">Enter OTP</h1>
                  <p className="text-slate-400 text-sm mt-2">
                    We sent a 6-digit code to <span className="text-white font-semibold">{forgotEmail}</span>
                  </p>
                </div>

                <div className="flex gap-3 justify-center mb-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-black bg-[#020817] border border-[#1e293b] rounded-2xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  ))}
                </div>

                <p className="text-center text-sm text-slate-400 mb-4 mt-4">
                  Didn't receive the code?{" "}
                  <button type="button" onClick={handleResend} disabled={resendTimer > 0} className="text-blue-400 font-semibold hover:text-blue-300 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors">
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                  </button>
                </p>

                {renderError()}
                {renderSuccess()}

                <button type="submit" disabled={loading || otp.join("").length !== 6} className="w-full py-4 rounded-2xl bg-blue-400 hover:bg-blue-500 text-white font-bold text-base transition-all shadow-lg shadow-blue-500/20 disabled:opacity-60">
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
                <button type="button" onClick={() => { setStep("forgot"); clearMessages(); }} className="w-full mt-3 py-4 rounded-2xl border border-[#1e293b] text-slate-400 hover:text-white font-semibold text-base transition-all">
                  ← Back
                </button>
              </form>
            )}

            {/* ── RESET ─────────────────────────────────────────────────────── */}
            {step === "reset" && (
              <form onSubmit={handleResetPassword}>
                <div className="mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                    <KeyRound size={28} className="text-emerald-400" />
                  </div>
                  <p className="text-emerald-400 font-bold text-sm mb-1">Almost Done</p>
                  <h1 className="text-3xl font-black">Reset Password</h1>
                  <p className="text-slate-400 text-sm mt-2">Set a new password for your account.</p>
                </div>

                <div className="mb-4">
                  <label className="text-slate-300 text-sm font-semibold mb-2 block">New Password</label>
                  <div className="bg-[#020817] border border-[#1e293b] rounded-2xl px-4 py-4 flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    <Lock size={18} className="text-slate-500 shrink-0" />
                    <input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => { setNewPassword(e.target.value); clearMessages(); }} placeholder="Enter new password" required className="bg-transparent outline-none w-full text-white placeholder-slate-500 text-sm" />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="text-slate-500 hover:text-white shrink-0">
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-slate-300 text-sm font-semibold mb-2 block">Confirm Password</label>
                  <div className="bg-[#020817] border border-[#1e293b] rounded-2xl px-4 py-4 flex items-center gap-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    <Lock size={18} className="text-slate-500 shrink-0" />
                    <input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); clearMessages(); }} placeholder="Confirm new password" required className="bg-transparent outline-none w-full text-white placeholder-slate-500 text-sm" />
                  </div>
                </div>

                {renderError()}
                {renderSuccess()}

                <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-60">
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            <p className="text-center text-slate-600 text-xs mt-6">MediTrack © 2026 Hospital Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;