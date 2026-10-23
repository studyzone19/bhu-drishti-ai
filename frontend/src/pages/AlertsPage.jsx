import React, { useEffect, useState } from "react";
import { AlertTriangle, Clock, MapPin, Activity } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import RiskBadge from "../components/RiskBadge.jsx";
import api from "../services/api.js";

export default function AlertsPage() {
  const [zones, setZones] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchZones = () => {
    api.get("/risk-zones").then((res) => {
      setZones(res.data.zones || []);
      setLastUpdated(new Date());
    }).catch(() => {});
  };

  useEffect(() => {
    fetchZones();
    const refreshId = window.setInterval(fetchZones, 5000); // 5 sec live sync
    return () => window.clearInterval(refreshId);
  }, []);

  const activeAlerts = zones.filter(z => ['CRITICAL', 'HIGH'].includes(z.riskLevel));

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-300">
          <div>
            <h1 className="text-3xl font-black text-[#002b5e] mb-2 flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-red-500" /> Early Warnings
            </h1>
            <p className="text-slate-600 font-medium">Real-time alerts automatically triggered by Bhu-Drishti AI for CRITICAL and HIGH risk zones.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
             <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
             </div>
             <span className="text-xs font-bold text-slate-600">LIVE SYNC</span>
          </div>
        </div>

        <div className="space-y-4">
          {activeAlerts.length === 0 && (
            <div className="bg-white p-8 text-center rounded-xl border border-slate-200 shadow-sm">
              <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-slate-800 font-bold text-lg">No Active Warnings</p>
              <p className="text-slate-500 text-sm mt-1">All monitored regions are currently stable. AI monitoring is active.</p>
            </div>
          )}
          
          {activeAlerts.map((zone) => {
            const isCritical = zone.riskLevel === 'CRITICAL';
            
            // Generate dynamic alert text based on actual real-time zone data
            const primaryReason = zone.rainfall24h > 100 
              ? `Heavy rainfall of ${zone.rainfall24h}mm` 
              : `Critical soil moisture saturation at ${zone.soilMoisture}%`;
              
            const recommendation = isCritical
              ? "Immediate evacuation recommended. Halt all transport and deploy emergency response teams."
              : "Restrict unnecessary travel. Deploy field inspection teams within 6 hours.";
              
            const factors = [
              `Rainfall (24h): ${zone.rainfall24h} mm`,
              `Soil Moisture: ${zone.soilMoisture}%`,
              `AI Risk Score: ${zone.riskScore}%`
            ];

            return (
              <div key={zone._id} className="bg-white shadow-md border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`px-5 py-3 border-b flex justify-between items-center ${isCritical ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'}`}>
                   <div className="flex items-center gap-2">
                     <AlertTriangle className={`w-5 h-5 ${isCritical ? 'text-red-600' : 'text-orange-500'}`} />
                     <h3 className={`font-bold text-lg ${isCritical ? 'text-red-700' : 'text-orange-700'}`}>
                        {isCritical ? 'CRITICAL' : 'HIGH'} Alert: {zone.name}
                     </h3>
                   </div>
                   <RiskBadge level={zone.riskLevel} />
                </div>
                
                <div className="p-5">
                  <p className="text-slate-800 font-medium mb-4">
                    Landslide risk is currently <strong className={isCritical ? 'text-red-600' : 'text-orange-600'}>{zone.riskLevel.toLowerCase()}</strong> in {zone.name} due to {primaryReason.toLowerCase()}. Please avoid unsafe slopes and follow local authority guidance.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 bg-slate-50 rounded-lg p-4 mb-4 border border-slate-100">
                    <div>
                      <h4 className="text-xs font-black tracking-widest text-slate-500 mb-2 uppercase flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" /> Main Factors
                      </h4>
                      <ul className="space-y-1">
                        {factors.map((f, i) => (
                          <li key={i} className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#002b5e]"></span> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-black tracking-widest text-slate-500 mb-2 uppercase flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Recommended Action
                      </h4>
                      <p className="text-sm font-bold text-[#002b5e] leading-snug">{recommendation}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-400 mt-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" /> {zone.district}, {zone.state}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" /> Updated Live
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
