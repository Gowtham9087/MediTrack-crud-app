import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";

function Login({ setRole }) {
  const navigate = useNavigate();

  const [login, setLogin] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      localStorage.setItem("role", data.role);
      localStorage.setItem("token", data.token);

      if (data.role === "admin") {
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        setRole("admin");
        navigate("/admin/dashboard");
        return;
      }

      if (data.role === "user") {
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);
        setRole("user");
        navigate("/feedback");
      }
    } catch (error) {
      console.log(error);
      setError("Login failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 sm:px-6 py-10 relative overflow-hidden"
      style={{
        backgroundImage: "url('/doctor6.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#020617]/75 backdrop-blur-[3px]" />

      <div className="absolute w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full top-10 left-5" />
      <div className="absolute w-72 h-72 bg-purple-500/20 blur-3xl rounded-full bottom-10 right-5" />

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/15 p-6 sm:p-8 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-3xl shadow-lg">
            🏥
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Welcome Back
          </h1>

          <p className="text-cyan-100 mt-2 text-sm sm:text-base">
            Login to continue with Medi Track
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-white text-sm font-semibold mb-2 block">
              Email Address
            </label>

            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={login.email}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl bg-white/15 border border-white/15 text-white placeholder-slate-300 outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/20 transition-all"
              required
            />
          </div>

          <div>
            <label className="text-white text-sm font-semibold mb-2 block">
              Password / Contact Number
            </label>

            <input
              name="password"
              type="password"
              placeholder="Enter password or contact number"
              value={login.password}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl bg-white/15 border border-white/15 text-white placeholder-slate-300 outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/20 transition-all"
              required
            />
          </div>
        </div>

        {error && (
          <div className="mt-5 bg-red-500/15 border border-red-400/40 text-red-100 px-4 py-3 rounded-2xl text-sm text-center font-medium">
            ⚠ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold cursor-pointer hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;