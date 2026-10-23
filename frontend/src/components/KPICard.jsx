import React from "react";

export default function KPICard({ label, value, icon: Icon, accent = "text-terrain-400" }) {
  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-5 flex items-center justify-between">
      <div>
        <p className="text-slate-600 text-sm">{label}</p>
        <p className="text-2xl font-display font-semibold mt-1">{value}</p>
      </div>
      {Icon && <Icon className={`w-8 h-8 ${accent}`} strokeWidth={1.5} />}
    </div>
  );
}
