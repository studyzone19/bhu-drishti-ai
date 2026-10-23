const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/Landing.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import MiniSatelliteView')) {
  content = content.replace(
    'import RiskMapView from "../maps/RiskMapView";',
    'import RiskMapView from "../maps/RiskMapView";\nimport MiniSatelliteView from "../maps/MiniSatelliteView";'
  );
}

const satelliteBlockRegex = /<div className="relative bg-slate-100 h-\[220px\] w-full flex items-center justify-center overflow-hidden pointer-events-auto">[\s\S]*?<\/iframe>\s*<\/div>/;

const newSatelliteBlock = `<div className="relative bg-slate-100 h-[240px] w-full flex items-center justify-center overflow-hidden pointer-events-auto">
              <MiniSatelliteView />
            </div>`;

content = content.replace(satelliteBlockRegex, newSatelliteBlock);

fs.writeFileSync(file, content);
console.log("Success patch landing");
