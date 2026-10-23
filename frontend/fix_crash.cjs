const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/Landing.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add safe calculation right before the return statement inside Landing component
const hookMarker = 'const nearestRoad = React.useMemo(() => {';
const newVars = `
  const activeRoadList = blockedRoads.length > 0 ? blockedRoads : defaultRoads;
  const safeTickerIndex = activeListLength => tickerIndex % activeListLength;
  const currentTickerRoad = activeRoadList[safeTickerIndex(activeRoadList.length)];
  
  const nearestRoad = React.useMemo(() => {`;
content = content.replace(hookMarker, newVars);

// 2. We need displayRoad, which depends on nearestRoad, so we put it AFTER nearestRoad hook
const nearestRoadEnd = '}, [selectedZone, blockedRoads]);';
const postVars = `}, [selectedZone, blockedRoads]);

  const displayRoad = (userLocked && nearestRoad) ? nearestRoad : currentTickerRoad;
`;
content = content.replace(nearestRoadEnd, postVars);


// 3. Replace the whole NER ROAD STATUS block
const rx = /<div className="bg-\[#111827\] border border-slate-800 rounded-xl p-3 shadow-lg relative overflow-hidden flex flex-col justify-center">[\s\S]*?(?=<div className="bg-\[#111827\] border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col items-center justify-center relative overflow-hidden">)/;

const newBlock = `<div className="bg-[#111827] border border-slate-800 rounded-xl p-3 shadow-lg relative overflow-hidden flex flex-col justify-center">
                 <div className="absolute left-0 top-0 h-full w-1 transition-colors duration-300" style={{backgroundColor: displayRoad?.status === 'Blocked' ? '#ef4444' : displayRoad?.status === 'At Risk' ? '#f97316' : '#22c55e'}}></div>
                 <div className="flex items-center gap-2 mb-3">
                   <AlertTriangle className="h-4 w-4 transition-colors duration-300" style={{color: displayRoad?.status === 'Blocked' ? '#ef4444' : displayRoad?.status === 'At Risk' ? '#f97316' : '#22c55e'}} />
                   <h3 className="text-[10px] font-bold tracking-wider text-slate-400">NER ROAD STATUS</h3>
                 </div>
                 <div>
                    <h2 className="text-sm font-black text-white leading-tight mb-1">{displayRoad ? displayRoad.name : "Analyzing..."}</h2>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold uppercase tracking-widest transition-colors duration-300" style={{color: displayRoad?.status === 'Blocked' ? '#ef4444' : displayRoad?.status === 'At Risk' ? '#f97316' : '#22c55e'}}>
                        {displayRoad ? displayRoad.status : "..."}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium truncate transition-all duration-300">
                        {displayRoad ? displayRoad.reason : "Loading network data"}
                      </span>
                    </div>
                 </div>
              </div>
              
              `;

content = content.replace(rx, newBlock);

fs.writeFileSync(file, content);
console.log("Success patched crash");
