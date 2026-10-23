import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import api from "../services/api.js";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Activity, BarChart3, TrendingUp, AlertTriangle } from "lucide-react";

const RISK_COLORS = { CRITICAL: "#ef4444", HIGH: "#f97316", MODERATE: "#eab308", LOW: "#22c55e" };

const trendData30 = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  Meghalaya: 40 + Math.round(Math.sin(i * 0.3) * 20 + Math.random() * 10),
  Assam: 30 + Math.round(Math.sin(i * 0.25) * 15 + Math.random() * 8),
  Manipur: 25 + Math.round(Math.sin(i * 0.2) * 12 + Math.random() * 7),
  Mizoram: 20 + Math.round(Math.sin(i * 0.35) * 10 + Math.random() * 6),
}));

export default function AnalyticsPage() {
  const [zones, setZones] = useState([]);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    api.get("/risk-zones").then(res => setZones(res.data.zones || [])).catch(() => {});
    api.get("/analytics/overview").then(r => setOverview(r.data.data)).catch(() => {});
    const interval = setInterval(() => {
      api.get("/risk-zones").then(res => setZones(res.data.zones || [])).catch(() => {});
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const critCount = zones.filter(z => z.riskLevel === "CRITICAL").length;
  const highCount = zones.filter(z => z.riskLevel === "HIGH").length;
  const modCount = zones.filter(z => z.riskLevel === "MODERATE").length;
  const lowCount = zones.filter(z => z.riskLevel === "LOW").length;
  const avgScore = zones.length ? Math.round(zones.reduce((s, z) => s + (z.riskScore || 0), 0) / zones.length) : 0;

  const riskDist = [
    { name: "Critical", value: critCount, color: RISK_COLORS.CRITICAL },
    { name: "High", value: highCount, color: RISK_COLORS.HIGH },
    { name: "Moderate", value: modCount, color: RISK_COLORS.MODERATE },
    { name: "Low", value: lowCount, color: RISK_COLORS.LOW },
  ].filter(d => d.value > 0);

  const topZones = [...zones].sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0)).slice(0, 10)
    .map(z => ({ name: z.name.slice(0, 16), score: z.riskScore || 0, fill: RISK_COLORS[z.riskLevel] || "#64748b" }));

  const incidentTypes = [
    { type: "Landslide", count: critCount + 3 },
    { type: "Road Block", count: highCount + 2 },
    { type: "Soil Movement", count: modCount + 1 },
    { type: "Rockfall", count: Math.max(1, lowCount) },
    { type: "Flooding", count: Math.max(1, critCount - 1) },
  ];

  const kpis = [
    { label: "Total Zones", value: zones.length || 0, icon: Activity, color: "text-blue-400", bg: "bg-blue-900/30" },
    { label: "Critical + High", value: critCount + highCount, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-900/30" },
    { label: "Avg Risk Score", value: avgScore + "%", icon: TrendingUp, color: "text-orange-400", bg: "bg-orange-900/30" },
    { label: "Active Incidents", value: critCount + highCount + modCount, icon: BarChart3, color: "text-purple-400", bg: "bg-purple-900/30" },
  ];

  const tooltipStyle = { backgroundColor: "#0f172a", borderColor: "#1e293b", fontSize: "11px" };

  return (
    <DashboardLayout>
      <div className="font-sans">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
          <p className="text-sm text-slate-400">Comprehensive risk analytics for North Eastern Region</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {kpis.map((k, i) => (
            <div key={i} className="bg-[#111827] border border-slate-800 rounded-xl p-4 shadow-lg flex items-center gap-4">
              <div className={"p-3 rounded-xl " + k.bg}><k.icon className={"h-6 w-6 " + k.color} /></div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold">{k.label}</p>
                <p className="text-2xl font-black text-white">{k.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Pie */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-xl">
            <h2 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-400" /> Risk Distribution
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDist} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false} fontSize={11}>
                    {riskDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Incidents by type */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-xl">
            <h2 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-400" /> Incidents by Type
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentTypes} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="type" type="category" stroke="#64748b" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* 30-day trend */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-xl">
            <h2 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-400" /> 30-Day Risk Trend
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData30} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "10px" }} />
                  <Line type="monotone" dataKey="Meghalaya" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Assam" stroke="#eab308" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Manipur" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Mizoram" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top zones */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-xl">
            <h2 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-400" /> Top 10 Zones by Risk Score
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topZones} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} angle={-35} textAnchor="end" height={50} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="score" radius={[3, 3, 0, 0]} barSize={18}>
                    {topZones.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
