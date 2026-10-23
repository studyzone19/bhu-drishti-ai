const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/maps/RiskMapView.jsx';
let content = fs.readFileSync(file, 'utf8');

// Rename constant blockedRoads to defaultBlockedRoads
content = content.replace('const blockedRoads = [', 'const defaultBlockedRoads = [');

// Inside RiskMapView, add state and useEffect
const riskMapViewRegex = /export default function RiskMapView\(\{\s*zones\s*=\s*\[\],\s*onSelectZone,\s*height\s*=\s*"600px"\s*\}\)\s*\{/;
const newRiskMapViewStart = `export default function RiskMapView({ zones = [], onSelectZone, height = "600px" }) {
  const [blockedRoads, setBlockedRoads] = React.useState(defaultBlockedRoads);
  
  React.useEffect(() => {
    const loadRoads = () => {
      const saved = localStorage.getItem('landguard_blocked_roads');
      if (saved) {
        setBlockedRoads(JSON.parse(saved));
      } else {
        localStorage.setItem('landguard_blocked_roads', JSON.stringify(defaultBlockedRoads));
      }
    };
    loadRoads();
    window.addEventListener('storage', loadRoads);
    window.addEventListener('roads_updated', loadRoads);
    return () => {
      window.removeEventListener('storage', loadRoads);
      window.removeEventListener('roads_updated', loadRoads);
    };
  }, []);
`;
content = content.replace(riskMapViewRegex, newRiskMapViewStart);

fs.writeFileSync(file, content);
console.log("Success update RiskMapView state");
