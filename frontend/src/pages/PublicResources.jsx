import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, CheckCircle, Mountain, Shield, Activity, Users, MapPin, Clock } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";
import translations from "../translations.js";
import Logo from "../components/Logo.jsx";

export default function PublicResources() {
  const { lang, toggle } = useLanguage();
  const t = translations[lang];
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  
  // Simulated real-time community feed
  const [feed, setFeed] = useState([
    { id: 1, type: "report", text: "Volunteer cleared minor debris on NH-10", time: "Just now", loc: "East Sikkim" },
    { id: 2, type: "sensor", text: "Soil moisture sensor recalibrated", time: "2m ago", loc: "Dima Hasao" },
    { id: 3, type: "alert", text: "Community awareness drive completed", time: "15m ago", loc: "Aizawl" }
  ]);
  
  const [activeVolunteers, setActiveVolunteers] = useState(1245);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLastUpdate(new Date().toLocaleTimeString());
      setActiveVolunteers(prev => prev + (Math.floor(Math.random() * 3) - 1));
      
      if (Math.random() > 0.6) {
        const events = [
          { type: "report", text: "Roadside drain cleared by locals", loc: "Kohima" },
          { type: "sensor", text: "New rainfall telemetry received", loc: "Imphal East" },
          { type: "alert", text: "Mock drill successfully concluded", loc: "Cherrapunji" },
          { type: "report", text: "Minor cracks reported near slope", loc: "Gangtok" }
        ];
        const newEvent = events[Math.floor(Math.random() * events.length)];
        setFeed(prev => [
          { id: Date.now(), time: "Just now", ...newEvent },
          ...prev.slice(0, 3)
        ]);
      }
    }, 3500);
    return () => window.clearInterval(timer);
  }, []);

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
              <BookOpen className="h-6 w-6 text-[#002b5e]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#002b5e] tracking-tight">Awareness & Resources</h1>
              <p className="text-sm text-slate-500 font-medium">Community preparedness and live network updates</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200 w-fit">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-600">Live Network</span>
            <span className="text-[10px] text-slate-400">({lastUpdate})</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Resources */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Safety Guidelines</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Resource 
                icon={Shield} 
                color="blue"
                title="Before heavy rainfall" 
                text="Stay away from steep slopes, drainage channels and known landslide areas." 
              />
              <Resource 
                icon={CheckCircle} 
                color="orange"
                title="During an alert" 
                text="Follow official instructions, move to a safe location and do not cross blocked roads." 
              />
              <Resource 
                icon={Activity} 
                color="red"
                title="Report a hazard" 
                text="Share the location and a clear description so response teams can verify it quickly." 
              />
              <Resource 
                icon={Mountain} 
                color="emerald"
                title="Stay informed" 
                text="Check the live risk map and early alerts regularly during the monsoon." 
              />
            </div>
          </div>

          {/* Live Feed Sidebar */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Live Community Feed</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-bold text-slate-600">Active Volunteers</span>
                </div>
                <span className="text-sm font-black text-blue-600 transition-colors duration-300">{activeVolunteers}</span>
              </div>
              
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {feed.map((item, idx) => (
                  <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-blue-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow absolute left-0 md:left-1/2 -translate-x-1/2"></div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-slate-100 bg-slate-50 shadow-sm ml-6 md:ml-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">{item.type}</span>
                        <span className="text-[9px] font-medium text-slate-400 flex items-center gap-1"><Clock className="w-2 h-2"/> {item.time}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 leading-tight mb-1.5">{item.text}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400"/>{item.loc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Resource({ icon: Icon, title, text, color }) { 
  const colorMap = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    red: "text-red-600 bg-red-50 border-red-100"
  };
  const theme = colorMap[color] || colorMap.blue;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <div className={`mb-3 h-10 w-10 rounded-full flex items-center justify-center border ${theme}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="font-bold text-slate-900 mb-1.5">{title}</h2>
      <p className="text-xs leading-relaxed text-slate-500 font-medium">{text}</p>
    </article>
  ); 
}
