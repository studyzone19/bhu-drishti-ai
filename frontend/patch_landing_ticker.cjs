const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/Landing.jsx';
let content = fs.readFileSync(file, 'utf8');

const defaultRoadsCode = `
  const defaultRoads = [
    { name: 'NH-6 (Meghalaya)', status: 'At Risk', reason: 'High Soil Moisture Detected' },
    { name: 'NH-10 (Sikkim)', status: 'Open', reason: 'Stable Terrain' },
    { name: 'NH-2 (Nagaland)', status: 'Blocked', reason: 'Landslide Debris Cleared' },
    { name: 'NH-29 (Assam)', status: 'Open', reason: 'Normal Operations' },
    { name: 'NH-208 (Tripura)', status: 'At Risk', reason: 'Heavy Rainfall Warning' }
  ];

  const [tickerIndex, setTickerIndex] = useState(0);
  const [userLocked, setUserLocked] = useState(false);

  useEffect(() => {
    if (userLocked) return;
    const interval = window.setInterval(() => {
      setTickerIndex(prev => (prev + 1) % (blockedRoads.length > 0 ? blockedRoads.length : defaultRoads.length));
    }, 2500);
    return () => window.clearInterval(interval);
  }, [blockedRoads, userLocked]);
`;

// Insert the new state and effect right after blockedRoads declaration
content = content.replace(
  `const [blockedRoads, setBlockedRoads] = useState([]);`,
  `const [blockedRoads, setBlockedRoads] = useState([]);\n${defaultRoadsCode}`
);

// Modify the nearestRoad useMemo to trigger userLocked
content = content.replace(
  `const nearestRoad = React.useMemo(() => {`,
  `useEffect(() => { if (selectedZone) setUserLocked(true); }, [selectedZone]);\n\n  const nearestRoad = React.useMemo(() => {`
);

// In the render block, replace the nearestRoad rendering with the ticker logic
const oldRender = `<div>
                    <h2 className="text-sm font-black text-white leading-tight mb-1">{nearestRoad ? nearestRoad.name : "Analyzing Network..."}</h2>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold uppercase tracking-widest" style={{color: nearestRoad?.status === 'Blocked' ? '#ef4444' : nearestRoad?.status === 'At Risk' ? '#f97316' : '#22c55e'}}>
                        {nearestRoad ? nearestRoad.status : "..."}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium truncate">{nearestRoad ? nearestRoad.reason : "Tap map to select a sector"}</span>
                    </div>
                 </div>`;

const newRender = `<div>
                    <h2 className="text-sm font-black text-white leading-tight mb-1">
                      {userLocked && nearestRoad ? nearestRoad.name : (blockedRoads.length > 0 ? blockedRoads[tickerIndex].name : defaultRoads[tickerIndex].name)}
                    </h2>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold uppercase tracking-widest transition-colors duration-300" style={{color: (userLocked && nearestRoad ? nearestRoad.status : (blockedRoads.length > 0 ? blockedRoads[tickerIndex].status : defaultRoads[tickerIndex].status)) === 'Blocked' ? '#ef4444' : (userLocked && nearestRoad ? nearestRoad.status : (blockedRoads.length > 0 ? blockedRoads[tickerIndex].status : defaultRoads[tickerIndex].status)) === 'At Risk' ? '#f97316' : '#22c55e'}}>
                        {userLocked && nearestRoad ? nearestRoad.status : (blockedRoads.length > 0 ? blockedRoads[tickerIndex].status : defaultRoads[tickerIndex].status)}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium truncate transition-all duration-300">
                        {userLocked && nearestRoad ? nearestRoad.reason : (blockedRoads.length > 0 ? blockedRoads[tickerIndex].reason : defaultRoads[tickerIndex].reason)}
                      </span>
                    </div>
                 </div>`;

content = content.replace(oldRender, newRender);

fs.writeFileSync(file, content);
console.log("Success patched landing ticker");
