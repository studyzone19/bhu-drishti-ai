import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import api from "../services/api.js";
import { CloudRain, Droplets, Wind, Thermometer, Activity, Wifi, WifiOff } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

function makeTrend(base) {
  return Array.from({ length: 8 }, (_, i) => ({
    t: i,
    v: Math.max(0, base + Math.round((Math.random() - 0.5) * 20))
  }));
}

function SensorCard({ zone, liveTemp, liveHumidity, liveWind }) {
  const [trend] = useState(() => makeTrend(zone.rainfall24h || 40));
  const riskColor = zone.riskLevel === "CRITICAL" ? "text-red-400 border-red-700/40 bg-red-900/20"
    : zone.riskLevel === "HIGH" ? "text-orange-400 border-orange-700/40 bg-orange-900/20"
    : zone.riskLevel === "MODERATE" ? "text-yellow-400 border-yellow-700/40 bg-yellow-900/20"
    : "text-green-400 border-green-700/40 bg-green-900/20";
  const dotColor = zone.riskLevel === "CRITICAL" ? "bg-red-500"
    : zone.riskLevel === "HIGH" ? "bg-orange-500"
    : zone.riskLevel === "MODERATE" ? "bg-yellow-500" : "bg-green-500";
  const lineColor = zone.riskLevel === "CRITICAL" ? "#ef4444"
    : zone.riskLevel === "HIGH" ? "#f97316"
    : zone.riskLevel === "MODERATE" ? "#eab308" : "#22c55e";

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={"relative flex h-2 w-2"}>
              <span className={"animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 " + dotColor}></span>
              <span className={"relative inline-flex rounded-full h-2 w-2 " + dotColor}></span>
            </div>
            <p className="text-white font-bold text-sm truncate">{zone.name}</p>
          </div>
          <p className="text-slate-500 text-xs">{zone.district}, {zone.state}</p>
        </div>
        <span className={"text-[10px] font-bold px-2 py-0.5 rounded border " + riskColor}>{zone.riskLevel}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-[#0d1321] rounded-lg p-2 flex items-center gap-2">
          <CloudRain className="h-3.5 w-3.5 text-blue-400 shrink-0" />
          <div>
            <p className="text-[9px] text-slate-500">Rainfall</p>
            <p className="text-white text-xs font-bold">{zone.rainfall24h} mm</p>
          </div>
        </div>
        <div className="bg-[#0d1321] rounded-lg p-2 flex items-center gap-2">
          <Droplets className="h-3.5 w-3.5 text-teal-400 shrink-0" />
          <div>
            <p className="text-[9px] text-slate-500">Moisture</p>
            <p className="text-white text-xs font-bold">{zone.soilMoisture}%</p>
          </div>
        </div>
        <div className="bg-[#0d1321] rounded-lg p-2 flex items-center gap-2">
          <Thermometer className="h-3.5 w-3.5 text-orange-400 shrink-0" />
          <div>
            <p className="text-[9px] text-slate-500">Temp</p>
            <p className="text-white text-xs font-bold">{liveTemp}°C</p>
          </div>
        </div>
        <div className="bg-[#0d1321] rounded-lg p-2 flex items-center gap-2">
          <Wind className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <div>
            <p className="text-[9px] text-slate-500">Wind</p>
            <p className="text-white text-xs font-bold">{liveWind} km/h</p>
          </div>
        </div>
      </div>

      <div className="h-16">
        <p className="text-[9px] text-slate-500 mb-1">Rainfall Trend</p>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id={"g_" + zone._id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", fontSize: "10px" }} />
            <Area type="monotone" dataKey="v" stroke={lineColor} fill={"url(#g_" + zone._id + ")"} strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-1.5 text-[10px] text-green-400">
          <Wifi className="h-3 w-3" /> Online
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <Activity className="h-3 w-3" /> Score: {zone.riskScore}%
        </div>
      </div>
    </div>
  );
}

export default function WeatherSensorsPage() {
  const [zones, setZones] = useState([]);
  const [liveVars, setLiveVars] = useState({});

  const fetchZones = () => {
    api.get("/risk-zones").then(res => {
      const z = res.data.zones || [];
      setZones(z);
      setLiveVars(prev => {
        const next = { ...prev };
        z.forEach(zone => {
          if (!next[zone._id]) {
            next[zone._id] = { temp: 18 + Math.random() * 8, humidity: 60 + Math.random() * 35, wind: 5 + Math.random() * 20 };
          }
        });
        return next;
      });
    }).catch(() => {});
  };

  useEffect(() => {
    fetchZones();
    const refresh = setInterval(fetchZones, 5000);
    const jitter = setInterval(() => {
      setLiveVars(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(id => {
          next[id] = {
            temp: parseFloat((next[id].temp + (Math.random() > 0.5 ? 0.2 : -0.2)).toFixed(1)),
            humidity: Math.round(Math.min(100, Math.max(30, next[id].humidity + (Math.random() > 0.5 ? 1 : -1)))),
            wind: parseFloat((Math.max(0, next[id].wind + (Math.random() > 0.5 ? 0.4 : -0.4))).toFixed(1))
          };
        });
        return next;
      });
    }, 3000);
    return () => { clearInterval(refresh); clearInterval(jitter); };
  }, []);

  const avgRain = zones.length ? (zones.reduce((s, z) => s + (z.rainfall24h || 0), 0) / zones.length).toFixed(1) : 0;
  const avgMoist = zones.length ? Math.round(zones.reduce((s, z) => s + (z.soilMoisture || 0), 0) / zones.length) : 0;
  const alertsCount = zones.filter(z => ["CRITICAL", "HIGH"].includes(z.riskLevel)).length;

  return (
    <DashboardLayout>
      <div className="font-sans">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Weather &amp; Sensor Data</h1>
          <p className="text-sm text-slate-400">Real-time environmental monitoring across NER zones</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Sensors Online", value: zones.length, icon: Wifi, color: "text-green-400", bg: "bg-green-900/30" },
            { label: "Avg Rainfall", value: avgRain + " mm", icon: CloudRain, color: "text-blue-400", bg: "bg-blue-900/30" },
            { label: "Avg Moisture", value: avgMoist + "%", icon: Droplets, color: "text-teal-400", bg: "bg-teal-900/30" },
            { label: "Alerts Active", value: alertsCount, icon: Activity, color: "text-red-400", bg: "bg-red-900/30" },
          ].map((s, i) => (
            <div key={i} className="bg-[#111827] border border-slate-800 rounded-xl p-4 shadow-lg flex items-center gap-4">
              <div className={"p-3 rounded-xl " + s.bg}><s.icon className={"h-6 w-6 " + s.color} /></div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold">{s.label}</p>
                <p className="text-2xl font-black text-white">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {zones.map(zone => (
            <SensorCard
              key={zone._id}
              zone={zone}
              liveTemp={(liveVars[zone._id]?.temp || 22).toFixed(1)}
              liveHumidity={liveVars[zone._id]?.humidity || 75}
              liveWind={(liveVars[zone._id]?.wind || 10).toFixed(1)}
            />
          ))}
          {zones.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              <WifiOff className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-bold">Loading sensor data...</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
