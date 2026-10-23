const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/Landing.jsx';
let content = fs.readFileSync(file, 'utf8');

const hookRegex = /const \[showSideMenu, setShowSideMenu\] = useState\(false\);/;
const hookInsert = `const [showSideMenu, setShowSideMenu] = useState(false);
  const [blockedRoads, setBlockedRoads] = useState([]);
  
  useEffect(() => {
    const loadRoads = () => {
      const saved = localStorage.getItem('landguard_blocked_roads');
      if (saved) setBlockedRoads(JSON.parse(saved));
    };
    loadRoads();
    window.addEventListener('storage', loadRoads);
    window.addEventListener('roads_updated', loadRoads);
    return () => {
      window.removeEventListener('storage', loadRoads);
      window.removeEventListener('roads_updated', loadRoads);
    }
  }, []);
  
  const nearestRoad = React.useMemo(() => {
    if (!selectedZone || !blockedRoads.length) return null;
    let minDiff = Infinity;
    let closest = blockedRoads[0];
    for (let r of blockedRoads) {
      const pLat = r.positions[0][0];
      const pLng = r.positions[0][1];
      const diff = Math.abs(pLat - selectedZone.latitude) + Math.abs(pLng - selectedZone.longitude);
      if (diff < minDiff) {
        minDiff = diff;
        closest = r;
      }
    }
    return closest;
  }, [selectedZone, blockedRoads]);
`;
content = content.replace(hookRegex, hookInsert);

const whyRegex = /<div className="absolute left-0 top-0 h-full w-1 bg-orange-500"><\/div>[\s\S]*?WHY<\/p>[\s\S]*?<\/div>\s*<\/div>/;

const highwayCode = `<div className="absolute left-0 top-0 h-full w-1" style={{backgroundColor: nearestRoad?.status === 'Blocked' ? '#ef4444' : nearestRoad?.status === 'At Risk' ? '#f97316' : '#22c55e'}}></div>
                <div className="bg-slate-800/50 p-2 rounded-full" style={{color: nearestRoad?.status === 'Blocked' ? '#ef4444' : nearestRoad?.status === 'At Risk' ? '#f97316' : '#22c55e'}}>
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold mb-0.5 tracking-wider">NEAREST HIGHWAY</p>
                  <p className="text-xs font-bold text-white">{nearestRoad ? nearestRoad.name : "Analyzing..."}</p>
                  <p className="text-[10px] font-bold" style={{color: nearestRoad?.status === 'Blocked' ? '#ef4444' : nearestRoad?.status === 'At Risk' ? '#f97316' : '#22c55e'}}>{nearestRoad ? nearestRoad.status.toUpperCase() : "..."} - {nearestRoad?.reason}</p>
                </div>
             </div>`;

content = content.replace(whyRegex, highwayCode);

fs.writeFileSync(file, content);
console.log("Success patched Landing dashboard");
