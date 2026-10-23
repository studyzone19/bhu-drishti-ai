const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/Landing.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldCardRegex = /<div className="bg-\[#111827\] border border-slate-800 rounded-xl p-3 shadow-lg">\s*<div className="flex items-center gap-2 mb-2">\s*<Activity className="h-3 w-3 text-red-500" \/>\s*<h3 className="text-\[10px\] font-bold tracking-wider">Risk Trend<\/h3>[\s\S]*?<\/div>\s*<\/div>/;

const newCardCode = `<div className="bg-[#111827] border border-slate-800 rounded-xl p-3 shadow-lg relative overflow-hidden flex flex-col justify-center">
               <div className="absolute left-0 top-0 h-full w-1" style={{backgroundColor: nearestRoad?.status === 'Blocked' ? '#ef4444' : nearestRoad?.status === 'At Risk' ? '#f97316' : '#22c55e'}}></div>
               <div className="flex items-center gap-2 mb-3">
                 <AlertTriangle className="h-4 w-4" style={{color: nearestRoad?.status === 'Blocked' ? '#ef4444' : nearestRoad?.status === 'At Risk' ? '#f97316' : '#22c55e'}} />
                 <h3 className="text-[10px] font-bold tracking-wider text-slate-400">NER ROAD STATUS</h3>
               </div>
               <div>
                  <h2 className="text-sm font-black text-white leading-tight mb-1">{nearestRoad ? nearestRoad.name : "Analyzing Network..."}</h2>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{color: nearestRoad?.status === 'Blocked' ? '#ef4444' : nearestRoad?.status === 'At Risk' ? '#f97316' : '#22c55e'}}>
                      {nearestRoad ? nearestRoad.status : "..."}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium truncate">{nearestRoad ? nearestRoad.reason : "Tap map to select a sector"}</span>
                  </div>
               </div>
            </div>`;

content = content.replace(oldCardRegex, newCardCode);

// Restore the WHY column back to what it was
const oldWhyCode = `<div className="absolute left-0 top-0 h-full w-1 bg-orange-500"></div>
                <div className="bg-orange-500/20 p-2 rounded-full text-orange-400">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold mb-0.5 tracking-wider">WHY</p>
                  <p className="text-xs font-bold text-white">AI DETECTED</p>
                  <p className="text-[10px] text-slate-500">Rain: {selectedZone?.rainfall24h || 94}mm, Moisture: {selectedZone?.soilMoisture || 81}%</p>
                </div>
             </div>`;

const badWhyRegex = /<div className="absolute left-0 top-0 h-full w-1" style=\{\{backgroundColor: nearestRoad[\s\S]*?<\/div>\s*<\/div>/;
content = content.replace(badWhyRegex, oldWhyCode);

fs.writeFileSync(file, content);
console.log("Success patched card");
