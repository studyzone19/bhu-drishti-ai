import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const statusStyles = {
  OPEN: "text-risk-low", AT_RISK: "text-risk-moderate",
  BLOCKED: "text-risk-critical", UNDER_RESTORATION: "text-terrain-400",
};
const nextStatus = { OPEN: "AT_RISK", AT_RISK: "BLOCKED", BLOCKED: "UNDER_RESTORATION", UNDER_RESTORATION: "OPEN" };

export default function RoadsPage() {
  const { user } = useAuth();
  const [roads, setRoads] = useState([]);

  async function load() {
    const res = await api.get("/roads");
    setRoads(res.data.roads);
  }
  useEffect(() => { load(); }, []);

  async function cycleStatus(road) {
    await api.put(`/roads/${road._id}`, { status: nextStatus[road.status] });
    load();
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="font-display text-2xl font-semibold mb-1">Road connectivity</h1>
        <p className="text-slate-500 text-sm mb-6">Status across highways and district roads in monitored zones.</p>

        <div className="bg-white shadow-sm border border-slate-200 rounded-xl divide-y divide-slate-800">
          {roads.map((road) => (
            <div key={road._id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium">{road.name}</p>
                <p className="text-sm text-slate-500">{road.location}</p>
                {road.blockageReason && <p className="text-xs text-slate-600 mt-0.5">{road.blockageReason}</p>}
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-semibold ${statusStyles[road.status]}`}>{road.status.replace("_", " ")}</span>
                {(user.role === "admin" || user.role === "field_officer") && (
                  <button onClick={() => cycleStatus(road)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:border-terrain-400 hover:text-terrain-400 transition-colors">
                    Update
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
