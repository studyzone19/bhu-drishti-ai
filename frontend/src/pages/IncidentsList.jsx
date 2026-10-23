import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const statuses = ["PENDING", "VERIFIED", "ASSIGNED", "ACTION_TAKEN", "RESOLVED"];
const statusColor = {
  PENDING: "text-risk-moderate", VERIFIED: "text-terrain-400", ASSIGNED: "text-terrain-400",
  ACTION_TAKEN: "text-risk-high", RESOLVED: "text-risk-low",
};

export default function IncidentsList() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);

  async function load() {
    const params = user.role === "citizen" ? { mine: true } : {};
    const res = await api.get("/incidents", { params });
    setIncidents(res.data.incidents);
  }
  useEffect(() => { load(); }, []);

  async function advanceStatus(incident) {
    const idx = statuses.indexOf(incident.status);
    const next = statuses[Math.min(idx + 1, statuses.length - 1)];
    await api.put(`/incidents/${incident._id}`, { status: next });
    load();
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="font-display text-2xl font-semibold mb-1">
          {user.role === "citizen" ? "My reports" : "Citizen incident reports"}
        </h1>
        <p className="text-slate-500 text-sm mb-6">Track reports from submission through field verification and resolution.</p>

        <div className="space-y-3">
          {incidents.length === 0 && <p className="text-slate-500 text-sm">No incidents to show yet.</p>}
          {incidents.map((inc) => (
            <div key={inc._id} className="bg-white shadow-sm border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium">{inc.type} · {inc.location || `${inc.latitude.toFixed(3)}, ${inc.longitude.toFixed(3)}`}</p>
                <p className="text-sm text-slate-500 truncate">{inc.description}</p>
                {inc.reportedBy?.name && <p className="text-xs text-slate-600 mt-1">Reported by {inc.reportedBy.name}</p>}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs font-semibold ${statusColor[inc.status]}`}>{inc.status.replace("_", " ")}</span>
                {user.role !== "citizen" && inc.status !== "RESOLVED" && (
                  <button onClick={() => advanceStatus(inc)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:border-terrain-400 hover:text-terrain-400 transition-colors">
                    Advance
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
