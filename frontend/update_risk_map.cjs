const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/maps/RiskMapView.jsx';
let content = fs.readFileSync(file, 'utf8');

const mapClickRegex = /function ZoomListener[^}]+\}[\s\S]+?return null;\s*\}/;

const newMapClickCode = `function MapInteractionHandler({ onZoom, onSelectZone }) {
  useMapEvents({
    zoomend: (e) => onZoom(e.target.getZoom()),
    click: (e) => {
      // Dynamic zone generation for ANY clicked village/city
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      const risks = ["LOW", "MODERATE", "HIGH", "CRITICAL"];
      const randomRisk = risks[Math.floor(Math.random() * risks.length)];
      
      const dynamicZone = {
        _id: \`dynamic_\${lat}_\${lng}\`,
        name: \`Village (\${lat.toFixed(2)}, \${lng.toFixed(2)})\`,
        state: "NER Region",
        district: "Local District",
        latitude: lat,
        longitude: lng,
        riskLevel: randomRisk,
        riskScore: Math.floor(Math.random() * 80) + 20,
        rainfall24h: Math.floor(Math.random() * 200),
        soilMoisture: Math.floor(Math.random() * 60) + 30
      };
      
      if(onSelectZone) onSelectZone(dynamicZone);
    }
  });
  return null;
}`;

content = content.replace(mapClickRegex, newMapClickCode);

content = content.replace(
  '<MiniMapEvents setZoom={setCurrentZoom} />',
  '<MapInteractionHandler onZoom={setCurrentZoom} onSelectZone={onSelectZone} />'
);

// Fallback replacement if it was called ZoomListener
content = content.replace(
  '<ZoomListener onZoom={setCurrentZoom} />',
  '<MapInteractionHandler onZoom={setCurrentZoom} onSelectZone={onSelectZone} />'
);

fs.writeFileSync(file, content);
console.log("Success update RiskMapView");
