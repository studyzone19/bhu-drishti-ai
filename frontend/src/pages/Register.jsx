import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mountain } from "lucide-react";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const homeByRole = { admin: "/admin", field_officer: "/officer", citizen: "/citizen" };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "citizen", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register(form);
      navigate(homeByRole[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9] px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <Logo className="w-6 h-6 text-orange-500" />
          <span className="font-display font-semibold text-lg">Bhu-Drishti</span>
        </Link>
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
          <h1 className="font-display text-xl font-semibold mb-1">Create account</h1>
          <p className="text-sm text-slate-500 mb-6">Citizens can self-register. Admin accounts are provisioned separately in production.</p>
          {error && <p className="text-sm text-risk-critical mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-slate-600 block mb-1.5">Full name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#f1f5f9] border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-terrain-400" />
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#f1f5f9] border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-terrain-400" />
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1.5">Password</label>
              <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-[#f1f5f9] border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-terrain-400" />
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1.5">Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full bg-[#f1f5f9] border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-terrain-400">
                <option value="citizen">Citizen</option>
                <option value="field_officer">Field Officer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg bg-terrain-500 hover:bg-terrain-400 text-slate-950 font-medium transition-colors disabled:opacity-50">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
          <p className="text-sm text-slate-500 mt-5 text-center">
            Already registered? <Link to="/login" className="text-terrain-400">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
