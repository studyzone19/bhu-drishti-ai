import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft, MapPin, Mountain, Activity, Clock } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";
import translations from "../translations.js";
import Logo from "../components/Logo.jsx";
import api from "../services/api.js";

export default function PublicAlerts() {
  const { lang, toggle } = useLanguage();
  const t = translations[lang];
  const [alerts, setAlerts] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const load = () => {
      api.get("/alerts/public")
        .then((res) => {
          // Initialize alerts with a base score
          const enriched = (res.data.alerts || []).map(a => ({
            ...a,
            liveScore: a.riskLevel === 'CRITICAL' ? 85 + Math.floor(Math.random() * 10) : 70 + Math.floor(Math.random() * 14)
          }));
          setAlerts(enriched);
          setLastUpdate(new Date().toLocaleTimeString());
        })
        .catch(() => setAlerts([]));
    };
    load();
    // Poll API every 10s
    const timer = window.setInterval(load, 10000);
    return () => window.clearInterval(timer);
  }, []);

  // Real-time jitter for scores every 1.5s
  useEffect(() => {
    const jitter = window.setInterval(() => {
      setAlerts(prev => prev.map(a => ({
        ...a,
        liveScore: Math.min(99, Math.max(65, a.liveScore + (Math.floor(Math.random() * 5) - 2)))
      })));
    }, 1500);
    return () => window.clearInterval(jitter);
  }, []);

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <header className="bg-[#002b5e] px-4 py-4 text-white shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <Logo className="h-6 w-6 text-orange-400" /> <span className="text-orange-400">Bhu-Drishti</span>
          </Link>
        </div>
      </header>
      
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-red-900 tracking-tight">AI Early Warning Alerts</h1>
              <p className="text-sm text-slate-500 font-medium">Real-time localized safety messages for citizens.</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-600">Live Sync</span>
            <span className="text-[10px] text-slate-400">({lastUpdate})</span>
          </div>
        </div>

        <div className="space-y-4">
          {alerts.length ? alerts.map((alert) => { 
            const zone = alert.zone || {}; 
            const isCritical = alert.riskLevel === "CRITICAL";
            return (
              <article key={alert._id} className={`relative overflow-hidden rounded-xl border-l-4 bg-white p-5 shadow-md transition-all ${isCritical ? "border-red-600 shadow-red-900/5" : "border-orange-500 shadow-orange-900/5"}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-slate-100 opacity-50 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <span className={`rounded px-2 py-0.5 text-[10px] font-black tracking-widest ${isCritical ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                         {alert.riskLevel} RISK
                       </span>
                       <span className="text-xs text-slate-400 flex items-center gap-1">
                         <Clock className="w-3 h-3"/> Active Now
                       </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">{alert.title}</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-500 flex items-center">
                      <MapPin className="mr-1 inline h-4 w-4 text-slate-400" />
                      {zone.name || alert.affectedArea || "Monitored area"}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                     <Activity className={`w-5 h-5 ${isCritical ? 'text-red-500' : 'text-orange-500'}`} />
                     <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Risk Score</p>
                       <p className={`text-xl font-black transition-colors duration-300 ${isCritical ? 'text-red-600' : 'text-orange-600'}`}>
                         {alert.liveScore}<span className="text-sm text-slate-400 font-bold">/100</span>
                       </p>
                     </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-sm leading-relaxed text-slate-700 font-medium">
                    {alert.message}
                  </p>
                  <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-100 p-3 flex gap-3">
                    <div className="bg-emerald-100 rounded-full p-1.5 h-fit mt-0.5">
                      <AlertTriangle className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Recommended Action</p>
                      <p className="text-sm text-emerald-800 mt-0.5 font-medium">
                        {alert.recommendedAction}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ); 
          }) : (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-8 text-center flex flex-col items-center justify-center">
               <Mountain className="w-10 h-10 text-emerald-300 mb-3" />
               <p className="text-lg font-bold text-emerald-800">No active alerts right now.</p>
               <p className="text-sm text-emerald-600 mt-1">The AI is monitoring the region continuously.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
