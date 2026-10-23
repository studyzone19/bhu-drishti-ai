const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/maps/RiskMapView.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Import Polyline
content = content.replace(
  'import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip, useMapEvents, LayersControl, LayerGroup } from "react-leaflet";',
  'import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip, useMapEvents, LayersControl, LayerGroup, Polyline } from "react-leaflet";'
);

// 2. Add blockedRoads data
const blockedRoadsCode = `
const blockedRoads = [
  {
    id: "road1",
    name: "NH-6 Blocked",
    reason: "Severe Landslide Debris",
    status: "Blocked by SDMA",
    positions: [
      [25.55, 91.88],
      [25.48, 91.95],
      [25.40, 92.05]
    ]
  },
  {
    id: "road2",
    name: "NH-2 Blocked",
    reason: "Road Cave-in",
    status: "Restricted by NHAI",
    positions: [
      [25.66, 94.10],
      [25.58, 94.08],
      [25.50, 94.05]
    ]
  },
  {
    id: "road3",
    name: "NH-10 Blocked",
    reason: "Active Mudslide",
    status: "Emergency Block by Authority",
    positions: [
      [27.30, 88.55],
      [27.20, 88.52],
      [27.10, 88.50]
    ]
  }
];
`;

content = content.replace('const colorFor = {', blockedRoadsCode + '\nconst colorFor = {');

// 3. Render Blocked Roads inside LayersControl
const renderRoadsCode = `
          <LayersControl.Overlay checked name="Authority Blocked Roads">
            <LayerGroup>
              {blockedRoads.map((road) => (
                <Polyline
                  key={road.id}
                  positions={road.positions}
                  color="#ff0000"
                  weight={6}
                  dashArray="10, 10"
                  opacity={0.8}
                >
                  <Tooltip sticky className="custom-hover-tooltip border-red-500 border-2">
                    <div className="font-bold text-red-500 mb-1">🚧 {road.name}</div>
                    <div className="text-xs text-white">{road.reason}</div>
                    <div className="text-xs text-orange-400 font-semibold mt-1">{road.status}</div>
                  </Tooltip>
                </Polyline>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
`;

content = content.replace(
  '          <LayersControl.Overlay checked name="Landslide Risk Heatmap">',
  renderRoadsCode + '\n          <LayersControl.Overlay checked name="Landslide Risk Heatmap">'
);

fs.writeFileSync(file, content);
console.log("Success patched roads");
