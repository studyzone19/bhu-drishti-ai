import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const homeByRole = { admin: "/admin", field_officer: "/officer", citizen: "/citizen" };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function performLogin(emailToUse, passwordToUse) {
    setError("");
    setLoading(true);
    try {
      const cleanEmail = emailToUse.trim();
      const cleanPass = passwordToUse.trim();
      const user = await login(cleanEmail, cleanPass);
      navigate(homeByRole[user.role] || "/");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.code === "ERR_NETWORK"
          ? "Unable to reach server. Please ensure backend is running on port 5000."
          : "Login failed. Check your email and password.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await performLogin(form.email, form.password);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-6 justify-center group">
          <Logo className="w-8 h-8 text-orange-500 group-hover:scale-105 transition" />
          <div className="text-left">
            <span className="font-display font-bold text-xl tracking-tight text-white block">
              Bhu-Drishti
            </span>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 block -mt-1">
              Early Warning System
            </span>
          </div>
        </Link>

        {/* Manual Login Card */}
        <div className="bg-slate-900 border border-slate-800 shadow-xl rounded-2xl p-6">
          <h1 className="font-display text-lg font-semibold text-white mb-1">Sign in with credentials</h1>
          <p className="text-xs text-slate-400 mb-5">
            Enter your registered authority or citizen email and password.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-400 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">Email address</label>
              <input
                type="text"
                required
                value={form.email}
                placeholder="e.g. admin@Bhu-Drishti.ai"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">Password</label>
              <input
                type="password"
                required
                value={form.password}
                placeholder="••••••••"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-blue-600/20"
            >
              {loading ? "Signing in..." : "Sign in"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-xs text-slate-400 mt-5 text-center">
            Need a new account?{" "}
            <Link to="/register" className="text-blue-400 hover:underline">
              Register here
            </Link>
          </p>
        </div>

        {/* Demo Reference Footer */}
        <div className="mt-4 p-3 bg-slate-900/40 border border-slate-800/60 rounded-xl text-[11px] text-slate-400 text-center leading-relaxed">
          <p className="font-medium text-slate-300 mb-1">Demo Credentials:</p>
          <div className="space-y-0.5">
            <p>Admin: <code className="text-blue-400">admin@Bhu-Drishti.ai</code> / <code className="text-slate-300">Admin@123</code></p>
            <p>Field Officer: <code className="text-emerald-400">officer@Bhu-Drishti.ai</code> / <code className="text-slate-300">Officer@123</code></p>
            <p>Citizen: <code className="text-amber-400">citizen@Bhu-Drishti.ai</code> / <code className="text-slate-300">Citizen@123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
