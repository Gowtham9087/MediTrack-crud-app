// Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";

function Login({ setRole }) {
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      if (data.role === "admin") {
        localStorage.setItem("role", "admin");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");

        setRole("admin");
        navigate("/admin/add");
        return;
      }

      if (data.role === "user") {
        localStorage.setItem("role", "user");
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);

        setRole("user");
        navigate("/user");
      }
    } catch (error) {
      console.log(error);
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{
        backgroundImage: "url('/doctor6.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-[0_0_40px_rgba(59,130,246,0.35)]"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-wide">
            Medi Track
          </h1>
          <p className="text-cyan-200 mt-2 text-sm">
            Secure patient management login
          </p>
        </div>

        <label className="text-white text-sm font-medium mb-2 block">
          Email Address
        </label>
        <input
          name="email"
          type="email"
          placeholder="Enter Your Email"
          value={login.email}
          onChange={handleChange}
          className="w-full mb-5 px-5 py-4 rounded-xl bg-white/20 border border-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/25 transition-all duration-300"
          required
        />

        <label className="text-white text-sm font-medium mb-2 block">
          Password / Contact Number
        </label>
        <input
          name="password"
          type="password"
          placeholder="Password or Contact Number"
          value={login.password}
          onChange={handleChange}
          className="w-full px-5 py-4 rounded-xl bg-white/20 border border-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/25 transition-all duration-300"
          required
        />

        {error && (
          <div className="mt-5 bg-red-500/20 border border-red-400/40 text-red-100 px-4 py-3 rounded-xl text-sm text-center font-medium">
            ⚠ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-7 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-cyan-500/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;