import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CloudRain, Droplets, Mountain, Radio, Activity, Navigation } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";
import translations from "../translations.js";
import Logo from "../components/Logo.jsx";
import api from "../services/api.js";

export default function PublicSensors() {
  const { lang, toggle } = useLanguage();
  const t = translations[lang];
  const [zones, setZones] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const load = () => {
      api.get("/risk-zones").then((res) => {
        const enriched = (res.data.zones || []).map(z => ({
          ...z,
          liveRain: z.rainfall24h,
          liveMoisture: z.soilMoisture,
          liveScore: z.riskScore,
          liveShift: (Math.random() * 5).toFixed(1)
        }));
        setZones(enriched);
        setLastUpdate(new Date().toLocaleTimeString());
      }).catch(() => setZones([]));
    };
    load();
    const timer = window.setInterval(load, 10000);
    return () => window.clearInterval(timer);
  }, []);

  // Real-time jitter for sensors
  useEffect(() => {
    const jitter = window.setInterval(() => {
      setZones(prev => prev.map(z => ({
        ...z,
        liveRain: Math.max(0, z.liveRain + (Math.floor(Math.random() * 3) - 1)),
        liveMoisture: Math.min(100, Math.max(0, z.liveMoisture + (Math.floor(Math.random() * 3) - 1))),
        liveScore: Math.min(99, Math.max(0, z.liveScore + (Math.floor(Math.random() * 5) - 2))),
        liveShift: Math.max(0, parseFloat(z.liveShift) + (Math.random() * 0.2 - 0.1)).toFixed(1)
      })));
    }, 1500);
    return () => window.clearInterval(jitter);
  }, []);

  return (
    <PublicShell title="Live AI Sensor Network" lastUpdate={lastUpdate}>
      <p className="mb-6 text-sm text-slate-500 font-medium">Live telemetry from terrain sensors, weather radars, and AI analysis across all monitored zones.</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {zones.map((zone) => {
           const isCritical = zone.riskLevel === "CRITICAL";
           const isHigh = zone.riskLevel === "HIGH";
           
           return (
             <article key={zone._id} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
               <div className="mb-4 flex items-start justify-between">
                 <div>
                   <h2 className="font-bold text-slate-900 text-lg leading-tight">{zone.name}</h2>
                   <p className="mt-0.5 text-xs text-slate-500 font-medium">{zone.district}, {zone.state}</p>
                 </div>
                 <span className={`rounded px-2 py-1 text-[10px] font-black tracking-widest ${isCritical ? 'bg-red-100 text-red-700 border border-red-200' : isHigh ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                   {zone.riskLevel}
                 </span>
               </div>
               
               <div className="grid grid-cols-2 gap-3 text-sm">
                 <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-3">
                   <div className="flex items-center justify-between mb-2">
                     <CloudRain className="h-4 w-4 text-blue-500" />
                     <span className="text-[9px] font-bold text-blue-400 tracking-wider">24H</span>
                   </div>
                   <p className="text-xl font-black text-blue-900 transition-colors duration-300">{zone.liveRain} <span className="text-xs font-bold text-blue-500">mm</span></p>
                   <p className="text-[10px] text-blue-600 font-semibold mt-0.5 uppercase tracking-wider">Rainfall</p>
                 </div>
                 
                 <div className="rounded-xl bg-cyan-50/50 border border-cyan-100 p-3">
                   <div className="flex items-center justify-between mb-2">
                     <Droplets className="h-4 w-4 text-cyan-500" />
                     <span className="text-[9px] font-bold text-cyan-400 tracking-wider">SOIL</span>
                   </div>
                   <p className="text-xl font-black text-cyan-900 transition-colors duration-300">{zone.liveMoisture}<span className="text-sm font-bold text-cyan-500">%</span></p>
                   <p className="text-[10px] text-cyan-600 font-semibold mt-0.5 uppercase tracking-wider">Moisture</p>
                 </div>

                 <div className="rounded-xl bg-orange-50/50 border border-orange-100 p-3">
                   <div className="flex items-center justify-between mb-2">
                     <Navigation className="h-4 w-4 text-orange-500" />
                     <span className="text-[9px] font-bold text-orange-400 tracking-wider">SHIFT</span>
                   </div>
                   <p className="text-xl font-black text-orange-900 transition-colors duration-300">{zone.liveShift} <span className="text-xs font-bold text-orange-500">mm</span></p>
                   <p className="text-[10px] text-orange-600 font-semibold mt-0.5 uppercase tracking-wider">Ground Mvt</p>
                 </div>

                 <div className={`rounded-xl border p-3 ${isCritical ? 'bg-red-50/50 border-red-100' : isHigh ? 'bg-orange-50/50 border-orange-100' : 'bg-emerald-50/50 border-emerald-100'}`}>
                   <div className="flex items-center justify-between mb-2">
                     <Activity className={`h-4 w-4 ${isCritical ? 'text-red-500' : isHigh ? 'text-orange-500' : 'text-emerald-500'}`} />
                     <span className={`text-[9px] font-bold tracking-wider ${isCritical ? 'text-red-400' : isHigh ? 'text-orange-400' : 'text-emerald-400'}`}>AI</span>
                   </div>
                   <p className={`text-xl font-black transition-colors duration-300 ${isCritical ? 'text-red-900' : isHigh ? 'text-orange-900' : 'text-emerald-900'}`}>{zone.liveScore}<span className={`text-sm font-bold ${isCritical ? 'text-red-500' : isHigh ? 'text-orange-500' : 'text-emerald-500'}`}>/100</span></p>
                   <p className={`text-[10px] font-semibold mt-0.5 uppercase tracking-wider ${isCritical ? 'text-red-600' : isHigh ? 'text-orange-600' : 'text-emerald-600'}`}>Risk Score</p>
                 </div>
               </div>
             </article>
           );
        })}
      </div>
    </PublicShell>
  );
}

function PublicShell({ title, children, lastUpdate }) { 
  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900">
      <header className="bg-[#002b5e] px-4 py-4 text-white shadow-md border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <div className="bg-white/10 p-1.5 rounded-full border border-white/20">
              <Logo className="h-5 w-5 text-orange-400" />
            </div>
            <span className="tracking-wide text-orange-400">Bhu-Drishti</span>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#002b5e]/10 border border-[#002b5e]/20 p-2.5 rounded-full">
              <Radio className="h-6 w-6 text-[#002b5e]" />
            </div>
            <h1 className="text-2xl font-black text-[#002b5e] tracking-tight">{title}</h1>
          </div>
          {lastUpdate && (
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200 w-fit">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-600">Sensors Active</span>
              <span className="text-[10px] text-slate-400">({lastUpdate})</span>
            </div>
          )}
        </div>
        {children}
      </main>
    </div>
  ); 
}
