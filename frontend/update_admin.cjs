const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

const roadManagementCode = `
          {/* Road Management Panel */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl shadow-lg flex flex-col mt-4">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-red-900/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="font-bold text-sm text-red-500 tracking-wider">ROAD MANAGEMENT</h3>
              </div>
            </div>
            <div className="p-4 space-y-4">
               <p className="text-xs text-slate-400">Block a road to alert citizens and update Live Map immediately.</p>
               <div>
                  <label className="text-xs text-slate-400 mb-1 block">Select Highway</label>
                  <select id="roadSelect" className="w-full bg-[#1e293b] border border-slate-700 rounded p-2 text-white text-sm">
                    <option value='{"id":"road4","name":"NH-44 Blocked","reason":"Massive Landslide","status":"Blocked by Authority","positions":[[25.0,92.5],[24.9,92.6],[24.8,92.65]]}'>NH-44 (Tripura Border)</option>
                    <option value='{"id":"road5","name":"NH-37 Blocked","reason":"Flooding & Debris","status":"Restricted by SDMA","positions":[[26.5,93.0],[26.6,93.2],[26.65,93.3]]}'>NH-37 (Assam)</option>
                    <option value='{"id":"road6","name":"NH-54 Blocked","reason":"Road Cave-in","status":"Blocked by PWD","positions":[[24.5,92.8],[24.4,92.8],[24.3,92.85]]}'>NH-54 (Mizoram)</option>
                  </select>
               </div>
               <button 
                 onClick={() => {
                   const roadData = JSON.parse(document.getElementById("roadSelect").value);
                   const existingStr = localStorage.getItem('landguard_blocked_roads');
                   const existing = existingStr ? JSON.parse(existingStr) : [];
                   // Avoid duplicates
                   if(!existing.find(r => r.id === roadData.id)) {
                     const newRoads = [...existing, roadData];
                     localStorage.setItem('landguard_blocked_roads', JSON.stringify(newRoads));
                     window.dispatchEvent(new Event('roads_updated')); // Notify local map
                     alert("Road " + roadData.name + " blocked successfully! Live map updated.");
                   } else {
                     alert("Road is already blocked.");
                   }
                 }}
                 className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition-colors text-sm"
               >
                 AUTHORIZE ROAD BLOCK
               </button>
               <button 
                 onClick={() => {
                   // Reset to default
                   const defaultRoads = [
                     {"id":"road1","name":"NH-6 Blocked","reason":"Severe Landslide Debris","status":"Blocked by SDMA","positions":[[25.55,91.88],[25.48,91.95],[25.4,92.05]]},
                     {"id":"road2","name":"NH-2 Blocked","reason":"Road Cave-in","status":"Restricted by NHAI","positions":[[25.66,94.1],[25.58,94.08],[25.5,94.05]]},
                     {"id":"road3","name":"NH-10 Blocked","reason":"Active Mudslide","status":"Emergency Block by Authority","positions":[[27.3,88.55],[27.2,88.52],[27.1,88.5]]}
                   ];
                   localStorage.setItem('landguard_blocked_roads', JSON.stringify(defaultRoads));
                   window.dispatchEvent(new Event('roads_updated'));
                   alert("Cleared custom road blocks.");
                 }}
                 className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded transition-colors text-xs"
               >
                 CLEAR BLOCKS
               </button>
            </div>
          </div>
`;

// Insert after the ACTIVE ALERTS div closes
// The ACTIVE ALERTS div closes right before `</div>` (the grid column close) and `{/* Charts */}`
const targetRegex = /<\/div>\s*<\/div>\s*\{\/\* Charts \*\/\}/;
content = content.replace(targetRegex, '</div>\n' + roadManagementCode + '\n        </div>\n\n        {/* Charts */}');

// The outer column needs flex flex-col to stack ALERTS and ROAD MANAGEMENT
content = content.replace(
  '<div className="bg-[#111827] border border-slate-800 rounded-xl shadow-lg flex flex-col">',
  '<div className="flex flex-col gap-4">\n          <div className="bg-[#111827] border border-slate-800 rounded-xl shadow-lg flex flex-col flex-1">'
);

// We added a wrapper `<div className="flex flex-col gap-4">`, so we need an extra closing `</div>` before the end of the column.
// `targetRegex` was `</div>\n</div>\n{/* Charts */}`.
// We replaced it with `</div>\nROAD_MANAGEMENT\n</div>\n{/* Charts */}`
// Actually, `</div>\n</div>` meant `</div>` (end of Active Alerts) and `</div>` (end of grid right column).
// Let's refine the replacement carefully.

// Let's use string manipulation instead of complex regex
let lines = content.split('\n');
let alertsStart = -1;
let chartsStart = -1;
for(let i=0; i<lines.length; i++){
  if (lines[i].includes('ACTIVE ALERTS')) alertsStart = i;
  if (lines[i].includes('{/* Charts */}')) chartsStart = i;
}

if(alertsStart > -1 && chartsStart > -1) {
  // Between alertsStart and chartsStart, find the exact structure
  // Instead of manual regex, just insert roadManagementCode before the `</div>` that precedes `{/* Charts */}`
  let insertIndex = chartsStart - 1;
  while(insertIndex > 0 && !lines[insertIndex].includes('</div>')) {
    insertIndex--;
  }
  
  // Actually, let's just use string replace on a known block
}
