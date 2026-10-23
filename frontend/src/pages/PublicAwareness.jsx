import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home, Map, Menu, Mountain } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";
import translations from "../translations.js";
import Logo from "../components/Logo.jsx";
import api from "../services/api.js";
import RiskMapView from "../maps/RiskMapView.jsx";

const alertColors = {
  CRITICAL: "bg-red-600 text-white",
  HIGH: "bg-orange-500 text-white",
  MODERATE: "bg-yellow-300 text-slate-900",
  LOW: "bg-emerald-500 text-white",
};

export default function PublicAwareness() {
  const { lang, toggle } = useLanguage();
  const t = translations[lang];
  const [zones, setZones] = useState([]);
  const [language, setLanguage] = useState("English");
  const [menuOpen, setMenuOpen] = useState(false);

  async function loadZones() {
    try {
      const response = await api.get("/risk-zones");
      setZones(response.data.zones || []);
    } catch {
      setZones([]);
    }
  }

  useEffect(() => {
    loadZones();
    const refreshId = window.setInterval(loadZones, 10000);
    return () => window.clearInterval(refreshId);
  }, []);

  const alerts = useMemo(
    () => zones.filter((zone) => ["HIGH", "CRITICAL"].includes(zone.riskLevel)).slice(0, 6),
    [zones]
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900">
      <header className="border-b border-emerald-900/20 bg-[#002b5e] text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between border-b border-white/20 py-2 text-[10px] sm:text-xs">
            <span>Emergency Helpline: <strong>112</strong></span>
            <div className="flex items-center gap-1">
              {["English", "Bangla", "हिंदी"].map((item) => (
                <button key={item} onClick={() => setLanguage(item)} className={`rounded px-2 py-1 ${language === item ? "bg-white text-emerald-800" : "hover:bg-white/15"}`}>{item}</button>
              ))}
              <button aria-label="Search" className="rounded p-1 hover:bg-white/15">⌕</button>
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <Link to="/" className="flex items-center gap-2 font-bold tracking-tight"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300 text-emerald-900"><Logo className="h-5 w-5 text-white" /></span><span>Bhu-Drishti</span></Link>
            <nav className="hidden items-center gap-6 text-xs font-semibold md:flex"><Link to="/" className="hover:text-yellow-200"><Home className="mr-1 inline h-3.5 w-3.5" />{t.home}</Link><Link to="/citizen/map" className="hover:text-yellow-200"><Map className="mr-1 inline h-3.5 w-3.5" />{t.riskMap}</Link></nav>
            <button aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)} className="rounded p-2 hover:bg-white/15 md:hidden"><Menu className="h-5 w-5" /></button>
          </div>
          {menuOpen && <nav className="grid gap-2 border-t border-white/20 py-3 text-sm md:hidden"><Link to="/" onClick={() => setMenuOpen(false)}>{t.home}</Link><Link to="/citizen/map" onClick={() => setMenuOpen(false)}>{t.riskMap}</Link></nav>}
        </div>
      </header>

      <div className="bg-white px-4 py-2 shadow-sm"><div className="mx-auto max-w-6xl rounded border border-emerald-700 bg-white px-3 py-1 text-center text-xs font-bold text-emerald-800 sm:text-sm">Landslide Warning and Community Safety Information</div></div>

      <main className="mx-auto max-w-6xl px-4 py-5">
        <section id="map" className="grid gap-4 rounded-lg border-2 border-emerald-800 bg-white p-3 shadow-sm lg:grid-cols-[1fr_190px]">
          <RiskMapView zones={zones} height="430px" />
          <aside>
            <div className="mb-2 flex items-center gap-2 font-bold text-emerald-800"><AlertTriangle className="h-4 w-4" /> Alert List</div>
            <div className="space-y-2">{alerts.length ? alerts.map((zone) => <div key={zone._id} className={`rounded px-3 py-2 text-xs font-bold ${alertColors[zone.riskLevel] || alertColors.MODERATE}`}><p>{zone.district || zone.name}</p><p className="mt-0.5 text-[10px] font-normal">{zone.riskLevel} risk · {zone.riskScore}/100</p></div>) : <p className="rounded bg-emerald-50 p-3 text-xs text-emerald-800">No active high-risk zones.</p>}</div>
            <div className="mt-3 space-y-1 rounded border border-emerald-100 bg-emerald-50 p-2 text-[10px] text-emerald-900"><p><span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />No Risk</p><p><span className="mr-1 inline-block h-2 w-2 rounded-full bg-yellow-400" />Moderate Risk</p><p><span className="mr-1 inline-block h-2 w-2 rounded-full bg-orange-500" />High Risk</p><p><span className="mr-1 inline-block h-2 w-2 rounded-full bg-red-600" />Critical Risk</p></div>
          </aside>
        </section>

      </main>
    </div>
  );
}
