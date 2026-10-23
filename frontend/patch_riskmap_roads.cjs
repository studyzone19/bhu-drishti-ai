const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/maps/RiskMapView.jsx';
let content = fs.readFileSync(file, 'utf8');

const defaultRoadsCode = `const defaultBlockedRoads = [
  { id: "nh6", name: "NH-6 (Shillong - Silchar)", reason: "Severe Landslide", status: "Blocked", positions: [[25.5, 91.8], [25.3, 92.1], [25.0, 92.5], [24.8, 92.8]] },
  { id: "nh10", name: "NH-10 (Siliguri - Gangtok)", reason: "Active Mudslide", status: "Blocked", positions: [[26.7, 88.4], [26.9, 88.5], [27.1, 88.5], [27.3, 88.6]] },
  { id: "nh2", name: "NH-2 (Kohima - Imphal)", reason: "Road Cave-in", status: "Blocked", positions: [[25.6, 94.1], [25.2, 94.0], [24.8, 93.9]] },
  { id: "nh13", name: "NH-13 (Tawang - Pasighat)", reason: "High Moisture Alert", status: "At Risk", positions: [[27.5, 91.8], [27.8, 92.5], [28.1, 93.5], [28.0, 95.3]] },
  { id: "nh44", name: "NH-44 (Agartala - Shillong)", reason: "Edge Subsidence", status: "At Risk", positions: [[23.8, 91.2], [24.1, 91.5], [24.6, 91.9], [25.5, 91.8]] },
  { id: "nh27", name: "NH-27 (Silchar - Lumding)", reason: "Clear", status: "Open", positions: [[24.8, 92.8], [25.1, 92.9], [25.5, 93.1], [25.8, 93.2]] },
  { id: "nh15", name: "NH-15 (Tezpur - Dibrugarh)", reason: "Clear", status: "Open", positions: [[26.6, 92.8], [26.8, 93.5], [27.2, 94.2], [27.4, 94.9]] },
  { id: "nh54", name: "NH-54 (Silchar - Aizawl)", reason: "Clear", status: "Open", positions: [[24.8, 92.8], [24.4, 92.8], [24.1, 92.7], [23.7, 92.7]] },
  { id: "nh37", name: "NH-37 (Guwahati - Jorhat)", reason: "Clear", status: "Open", positions: [[26.1, 91.7], [26.2, 92.5], [26.6, 93.2], [26.7, 94.2]] },
  { id: "nh29", name: "NH-29 (Dimapur - Kohima)", reason: "Clear", status: "Open", positions: [[25.8, 93.7], [25.7, 93.9], [25.6, 94.1]] }
];`;

content = content.replace(/const defaultBlockedRoads = \[[\s\S]+?\];/, defaultRoadsCode);

// Update rendering logic
const renderingOld = /<LayersControl\.Overlay checked name="Authority Blocked Roads">[\s\S]*?<\/LayersControl\.Overlay>/;
const renderingNew = `<LayersControl.Overlay checked name="NER Highway Network">
            <LayerGroup>
              {blockedRoads.map((road) => {
                let rColor = "#10b981"; // Open
                let rWeight = 4;
                let rDash = "";
                if (road.status === "Blocked") { rColor = "#ef4444"; rWeight = 6; rDash = "10, 10"; }
                if (road.status === "At Risk") { rColor = "#f59e0b"; rWeight = 5; rDash = "5, 5"; }
                
                return (
                <Polyline
                  key={road.id}
                  positions={road.positions}
                  color={rColor}
                  weight={rWeight}
                  dashArray={rDash}
                  opacity={0.9}
                >
                  <Tooltip sticky className={\`custom-hover-tooltip border-2 \${road.status === 'Blocked' ? 'border-red-500' : road.status === 'At Risk' ? 'border-orange-500' : 'border-green-500'}\`}>
                    <div className={\`font-bold mb-1 \${road.status === 'Blocked' ? 'text-red-500' : road.status === 'At Risk' ? 'text-orange-500' : 'text-green-500'}\`}>
                      {road.status === 'Blocked' ? '🚧 ' : road.status === 'At Risk' ? '⚠️ ' : '✅ '}{road.name}
                    </div>
                    <div className="text-xs text-white">Status: {road.status}</div>
                    <div className="text-xs text-slate-300 mt-1">{road.reason}</div>
                  </Tooltip>
                </Polyline>
              )})}
            </LayerGroup>
          </LayersControl.Overlay>`;
content = content.replace(renderingOld, renderingNew);

fs.writeFileSync(file, content);
console.log("Success RiskMap roads");
