import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import RiskMapView from "../maps/RiskMapView.jsx";
import RiskBadge from "../components/RiskBadge.jsx";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function RiskMapPage({ standalone = false }) {
  const { user } = useAuth();
  const [zones, setZones] = useState([]);
  const [selected, setSelected] = useState(null);
  const [predicting, setPredicting] = useState(false);

  async function load() {
    const res = await api.get("/risk-zones");
    const nextZones = res.data.zones;
    setZones(nextZones);
    setSelected((current) => current ? nextZones.find((zone) => zone._id === current._id) || null : null);
  }
  useEffect(() => {
    load();
    const refreshId = window.setInterval(load, 10000);
    return () => window.clearInterval(refreshId);
  }, []);

  async function runPrediction() {
    if (!selected) return;
    setPredicting(true);
    try {
      const res = await api.post(`/risk-zones/${selected._id}/predict`);
      setSelected(res.data.zone);
      await load();
    } finally {
      setPredicting(false);
    }
  }

  const content = (
    <div className="p-6 max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h1 className="font-display text-2xl font-semibold mb-1">Live GIS risk map</h1>
        <p className="text-slate-500 text-sm mb-4">Assam · Arunachal Pradesh · Meghalaya · Manipur · Mizoram · Nagaland · Tripura · Sikkim</p>
        <RiskMapView zones={zones} onSelectZone={setSelected} height="620px" />
      </div>
      <div>
        <h2 className="font-display text-lg font-semibold mb-3">Zone details</h2>
        {!selected ? (
          <p className="text-sm text-slate-500">Click a zone on the map to see its details here.</p>
        ) : (
          <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium">{selected.name}</p>
              <RiskBadge level={selected.riskLevel} />
            </div>
            <p className="text-sm text-slate-600">{selected.district}, {selected.state}</p>
            <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-slate-200">
              <p className="text-slate-500">Risk score</p><p>{selected.riskScore}/100</p>
              <p className="text-slate-500">Rainfall 24h</p><p>{selected.rainfall24h} mm</p>
              <p className="text-slate-500">Rainfall 72h</p><p>{selected.rainfall72h} mm</p>
              <p className="text-slate-500">Soil moisture</p><p>{selected.soilMoisture}%</p>
              <p className="text-slate-500">Slope</p><p>{selected.slope}°</p>
              <p className="text-slate-500">Elevation</p><p>{selected.elevation} m</p>
              <p className="text-slate-500">Historical incidents</p><p>{selected.historicalLandslides}</p>
              <p className="text-slate-500">Population affected</p><p>{selected.population}</p>
              <p className="text-slate-500">Road status</p><p>{selected.roadStatus?.replace("_", " ")}</p>
              <p className="text-slate-500">Prediction source</p><p className="capitalize">{selected.predictionSource?.replace("_", " ")}</p>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <p className="text-slate-500 text-sm mb-1">Recommended action</p>
              <p className="text-sm">{selected.recommendedAction || "No recommendation yet — run a prediction."}</p>
            </div>
            {user?.role === "admin" && (
              <button
                onClick={runPrediction}
                disabled={predicting}
                className="w-full mt-2 py-2 rounded-lg bg-terrain-500 hover:bg-terrain-400 text-slate-950 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {predicting ? "Running prediction..." : "Re-run AI prediction"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return standalone ? <div className="min-h-screen bg-[#f1f5f9]">{content}</div> : <DashboardLayout>{content}</DashboardLayout>;
}
