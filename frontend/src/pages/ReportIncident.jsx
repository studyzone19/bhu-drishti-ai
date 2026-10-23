import React, { useState } from "react";
import { MapPin, Upload, Camera } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import api from "../services/api.js";

const incidentTypes = [
  "Landslide", "Ground Crack", "Slope Movement", "Rockfall",
  "Road Blockage", "Flood-related slope failure", "Other",
];

export default function ReportIncident() {
  const [form, setForm] = useState({
    type: "Landslide", description: "", latitude: "", longitude: "",
    location: "", severity: "MODERATE",
  });
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setStatus({ type: "error", msg: "Geolocation is not available in this browser." });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setForm((f) => ({ ...f, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) })),
      () => setStatus({ type: "error", msg: "Could not fetch location. Enter coordinates manually." })
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (image) data.append("image", image);
      const res = await api.post("/incidents", data, { headers: { "Content-Type": "multipart/form-data" } });
      setResult(res.data.incident);
      setStatus({ type: "success", msg: "Report submitted. Status: PENDING review." });
    } catch (err) {
      setStatus({ type: "error", msg: err.response?.data?.message || "Submission failed." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-2xl p-4 sm:p-6">
        <h1 className="font-display text-2xl font-semibold mb-1">Report an incident</h1>
        <p className="text-sm text-slate-500 mb-6">Geo-tagged reports help field officers verify risk faster.</p>

        {status && (
          <div className={`mb-5 rounded-lg border px-4 py-3 text-sm ${status.type === "success" ? "border-risk-low/40 bg-risk-low/15 text-risk-low" : "border-risk-critical/40 bg-risk-critical/15 text-risk-critical"}`}>
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white shadow-sm p-4 sm:p-6">
          <div>
            <label className="mb-1.5 block text-sm text-slate-600">Incident type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-[#f1f5f9] px-3 py-2 text-sm focus:border-terrain-400 focus:outline-none">
              {incidentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-600">Description</label>
            <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-[#f1f5f9] px-3 py-2 text-sm focus:border-terrain-400 focus:outline-none" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-600">Location name</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-[#f1f5f9] px-3 py-2 text-sm focus:border-terrain-400 focus:outline-none" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-slate-600">Latitude</label>
              <input required value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-[#f1f5f9] px-3 py-2 text-sm focus:border-terrain-400 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate-600">Longitude</label>
              <input required value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-[#f1f5f9] px-3 py-2 text-sm focus:border-terrain-400 focus:outline-none" />
            </div>
          </div>

          <button type="button" onClick={useCurrentLocation}
            className="flex items-center gap-2 text-sm text-terrain-400 transition-colors hover:text-terrain-500">
            <MapPin className="h-4 w-4" /> Use my current location
          </button>

          <div>
            <label className="mb-1.5 block text-sm text-slate-600">Severity</label>
            <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-[#f1f5f9] px-3 py-2 text-sm focus:border-terrain-400 focus:outline-none">
              {["LOW", "MODERATE", "HIGH", "CRITICAL"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-600">Photo (optional)</label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-700 px-3 py-3 text-sm text-slate-600 transition-colors hover:border-terrain-400">
              <Camera className="h-4 w-4" />
              {image ? image.name : "Upload photo"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
            </label>
            <p className="mt-1 text-xs text-slate-600">If uploaded, a demo AI image check runs automatically (clearly labeled as mock inference).</p>
          </div>

          <button type="submit" disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-terrain-500 py-2.5 font-medium text-slate-950 transition-colors hover:bg-terrain-400 disabled:opacity-50">
            <Upload className="h-4 w-4" /> {submitting ? "Submitting..." : "Submit report"}
          </button>
        </form>

        {result?.aiAnalysis?.detected && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-white shadow-sm p-5">
            <p className="mb-2 text-sm text-slate-600">Demo image analysis (mock inference)</p>
            <p>Detected: <span className="font-medium">{result.aiAnalysis.detected}</span></p>
            <p>Severity: <span className="font-medium">{result.aiAnalysis.severity}</span></p>
            <p>Confidence: <span className="font-medium">{Math.round(result.aiAnalysis.confidence * 100)}%</span></p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
