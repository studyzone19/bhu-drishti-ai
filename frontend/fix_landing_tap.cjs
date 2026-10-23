const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/Landing.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the old userLocked effect
content = content.replace('useEffect(() => { if (selectedZone) setUserLocked(true); }, [selectedZone]);', '');

// 2. Change nearestRoad logic to use defaultRoads if blockedRoads is empty
const oldNearestRoad = `  const nearestRoad = React.useMemo(() => {
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
  }, [selectedZone, blockedRoads]);`;

const newNearestRoad = `  const nearestRoad = React.useMemo(() => {
    if (!selectedZone) return null;
    const roadsToSearch = blockedRoads.length > 0 ? blockedRoads : defaultRoads;
    if (!roadsToSearch.length) return null;
    let minDiff = Infinity;
    let closest = roadsToSearch[0];
    for (let r of roadsToSearch) {
      if (!r.positions) return roadsToSearch[0]; // fallback
      
      const pLat = r.positions[0][0];
      const pLng = r.positions[0][1];
      const diff = Math.abs(pLat - selectedZone.latitude) + Math.abs(pLng - selectedZone.longitude);
      if (diff < minDiff) {
        minDiff = diff;
        closest = r;
      }
    }
    return closest;
  }, [selectedZone, blockedRoads]);`;

content = content.replace(oldNearestRoad, newNearestRoad);

// 3. We need `defaultRoads` to have positions so the math works!
const oldDefaultRoads = `  const defaultRoads = [
    { name: 'NH-6 (Meghalaya)', status: 'At Risk', reason: 'High Soil Moisture Detected' },
    { name: 'NH-10 (Sikkim)', status: 'Open', reason: 'Stable Terrain' },
    { name: 'NH-2 (Nagaland)', status: 'Blocked', reason: 'Landslide Debris Cleared' },
    { name: 'NH-29 (Assam)', status: 'Open', reason: 'Normal Operations' },
    { name: 'NH-208 (Tripura)', status: 'At Risk', reason: 'Heavy Rainfall Warning' }
  ];`;

const newDefaultRoads = `  const defaultRoads = [
    { id: "nh6", name: 'NH-6 (Meghalaya)', status: 'At Risk', reason: 'High Soil Moisture Detected', positions: [[25.5, 91.8]] },
    { id: "nh10", name: 'NH-10 (Sikkim)', status: 'Open', reason: 'Stable Terrain', positions: [[26.7, 88.4]] },
    { id: "nh2", name: 'NH-2 (Nagaland)', status: 'Blocked', reason: 'Landslide Debris Cleared', positions: [[25.6, 94.1]] },
    { id: "nh29", name: 'NH-29 (Assam)', status: 'Open', reason: 'Normal Operations', positions: [[25.8, 93.7]] },
    { id: "nh44", name: 'NH-44 (Tripura)', status: 'At Risk', reason: 'Heavy Rainfall Warning', positions: [[23.8, 91.2]] }
  ];`;

content = content.replace(oldDefaultRoads, newDefaultRoads);

// 4. Update the onSelectZone handler to set userLocked
content = content.replace(
  '<RiskMapView zones={zones} height="650px" onSelectZone={setSelectedZone} />',
  '<RiskMapView zones={zones} height="650px" onSelectZone={(z) => { setSelectedZone(z); setUserLocked(true); }} />'
);

fs.writeFileSync(file, content);
console.log("Success patched map tap");
