const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

const staticAlerts = `{[
                 { zone: "Zone A", type: "Critical Risk", color: "bg-red-500", time: "2 min ago" },
                 { zone: "Zone C", type: "High Risk", color: "bg-orange-500", time: "18 min ago" },
                 { zone: "Zone B", type: "Moderate Risk", color: "bg-yellow-500", time: "42 min ago" },
                 { zone: "Zone D", type: "Monitoring", color: "bg-blue-400", time: "1 hr ago" },
               ].map((a, i) => (
                 <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors border-b border-slate-800/50 last:border-0">
                   <div className="flex items-center gap-3">
                     <div className={\`w-3 h-3 rounded-full \${a.color} shadow-[0_0_8px_rgba(0,0,0,0.5)]\`} />
                     <div>
                       <p className="font-bold text-sm text-white">{a.zone}</p>
                       <p className="text-xs text-slate-400">{a.type}</p>
                     </div>`;

const dynamicAlerts = `{zones.slice(0, 5).map((z, i) => {
                 const timeAgo = [2, 14, 25, 42, 58][i % 5] + " min ago";
                 const riskColor = z.riskLevel === 'CRITICAL' ? 'bg-red-500' : z.riskLevel === 'HIGH' ? 'bg-orange-500' : z.riskLevel === 'MODERATE' ? 'bg-yellow-500' : 'bg-blue-400';
                 return (
                 <div key={i} onClick={() => setSelectedZone(z)} className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors border-b border-slate-800/50 last:border-0">
                   <div className="flex items-center gap-3">
                     <div className={\`w-3 h-3 rounded-full \${riskColor} shadow-[0_0_8px_rgba(0,0,0,0.5)]\`} />
                     <div>
                       <p className="font-bold text-sm text-white">{z.name}</p>
                       <p className="text-xs text-slate-400">{z.riskLevel} Risk</p>
                     </div>`;

content = content.replace(staticAlerts, dynamicAlerts);
fs.writeFileSync(file, content);
console.log("Done Active Alerts");
