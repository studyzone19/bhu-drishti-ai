const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/maps/RiskMapView.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Import LayersControl and LayerGroup
content = content.replace(
  'import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip, useMapEvents } from "react-leaflet";',
  'import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip, useMapEvents, LayersControl, LayerGroup } from "react-leaflet";'
);

// 2. Expand cityZones
const newCityZones = `const cityZones = [
  // Assam
  { _id: 'c1', name: "Guwahati Nilachal Hill", state: "Assam", district: "Kamrup Metro", latitude: 26.1667, longitude: 91.7083, riskLevel: "MODERATE", riskScore: 45, rainfall24h: 30, soilMoisture: 60 },
  { _id: 'c9', name: "Silchar Barail Range", state: "Assam", district: "Cachar", latitude: 24.9500, longitude: 92.9000, riskLevel: "HIGH", riskScore: 65, rainfall24h: 60, soilMoisture: 70 },
  { _id: 'c11', name: "Tezpur Bank", state: "Assam", district: "Sonitpur", latitude: 26.6338, longitude: 92.8000, riskLevel: "LOW", riskScore: 25, rainfall24h: 15, soilMoisture: 45 },
  { _id: 'c12', name: "Dibrugarh Plains", state: "Assam", district: "Dibrugarh", latitude: 27.4728, longitude: 94.9120, riskLevel: "MODERATE", riskScore: 55, rainfall24h: 40, soilMoisture: 75 },
  // Meghalaya
  { _id: 'c2', name: "Shillong Peak Slopes", state: "Meghalaya", district: "East Khasi Hills", latitude: 25.5398, longitude: 91.8596, riskLevel: "HIGH", riskScore: 78, rainfall24h: 85, soilMoisture: 80 },
  { _id: 'c13', name: "Cherrapunji Ridge", state: "Meghalaya", district: "East Khasi Hills", latitude: 25.2866, longitude: 91.7315, riskLevel: "CRITICAL", riskScore: 98, rainfall24h: 210, soilMoisture: 95 },
  { _id: 'c14', name: "Tura Hills", state: "Meghalaya", district: "West Garo Hills", latitude: 25.5144, longitude: 90.2031, riskLevel: "MODERATE", riskScore: 60, rainfall24h: 50, soilMoisture: 65 },
  // Arunachal
  { _id: 'c3', name: "Itanagar Foothills", state: "Arunachal Pradesh", district: "Papum Pare", latitude: 27.0844, longitude: 93.6053, riskLevel: "LOW", riskScore: 30, rainfall24h: 30, soilMoisture: 38 },
  { _id: 'c15', name: "Tawang Slopes", state: "Arunachal Pradesh", district: "Tawang", latitude: 27.5861, longitude: 91.8660, riskLevel: "HIGH", riskScore: 82, rainfall24h: 65, soilMoisture: 72 },
  { _id: 'c16', name: "Ziro Valley", state: "Arunachal Pradesh", district: "Lower Subansiri", latitude: 27.6253, longitude: 93.8291, riskLevel: "MODERATE", riskScore: 40, rainfall24h: 25, soilMoisture: 50 },
  // Mizoram
  { _id: 'c4', name: "Aizawl Durtlang Hills", state: "Mizoram", district: "Aizawl", latitude: 23.7535, longitude: 92.7161, riskLevel: "CRITICAL", riskScore: 92, rainfall24h: 110, soilMoisture: 90 },
  { _id: 'c17', name: "Lunglei Range", state: "Mizoram", district: "Lunglei", latitude: 22.8805, longitude: 92.7431, riskLevel: "HIGH", riskScore: 85, rainfall24h: 90, soilMoisture: 88 },
  // Manipur
  { _id: 'c5', name: "Imphal Valley Edge", state: "Manipur", district: "Imphal West", latitude: 24.8170, longitude: 93.9368, riskLevel: "LOW", riskScore: 20, rainfall24h: 10, soilMoisture: 40 },
  { _id: 'c18', name: "Churachandpur Hill", state: "Manipur", district: "Churachandpur", latitude: 24.3333, longitude: 93.6667, riskLevel: "MODERATE", riskScore: 55, rainfall24h: 45, soilMoisture: 60 },
  // Tripura
  { _id: 'c6', name: "Agartala Baramura Range", state: "Tripura", district: "West Tripura", latitude: 23.8315, longitude: 91.5000, riskLevel: "MODERATE", riskScore: 50, rainfall24h: 40, soilMoisture: 65 },
  { _id: 'c19', name: "Dharmanagar Hills", state: "Tripura", district: "North Tripura", latitude: 24.3733, longitude: 92.1648, riskLevel: "LOW", riskScore: 35, rainfall24h: 20, soilMoisture: 45 },
  // Nagaland
  { _id: 'c7', name: "Kohima Pulie Badze", state: "Nagaland", district: "Kohima", latitude: 25.6500, longitude: 94.0833, riskLevel: "HIGH", riskScore: 70, rainfall24h: 75, soilMoisture: 75 },
  { _id: 'c10', name: "Dimapur Chumukedima", state: "Nagaland", district: "Dimapur", latitude: 25.7954, longitude: 93.7663, riskLevel: "MODERATE", riskScore: 40, rainfall24h: 25, soilMoisture: 55 },
  { _id: 'c20', name: "Mokokchung Ridge", state: "Nagaland", district: "Mokokchung", latitude: 26.3300, longitude: 94.5300, riskLevel: "HIGH", riskScore: 75, rainfall24h: 80, soilMoisture: 78 },
  // Sikkim
  { _id: 'c8', name: "Gangtok Tathangchen", state: "Sikkim", district: "East Sikkim", latitude: 27.3389, longitude: 88.6065, riskLevel: "CRITICAL", riskScore: 88, rainfall24h: 95, soilMoisture: 85 },
  { _id: 'c21', name: "Namchi Slopes", state: "Sikkim", district: "South Sikkim", latitude: 27.1667, longitude: 88.3500, riskLevel: "MODERATE", riskScore: 50, rainfall24h: 40, soilMoisture: 65 }
];`;
content = content.replace(/const cityZones = \[[\s\S]*?\];/, newCityZones);

// 3. Add LayersControl wrapper inside MapContainer
const mapStartRegex = /<MapContainer[^>]*>[\s\S]*?<ZoomListener onZoom=\{setCurrentZoom\} \/>/;
const layersCode = `
        <LayersControl position="topright">
          
          <LayersControl.BaseLayer checked name="Terrain & Forest Cover (Esri)">
            <LayerGroup>
              <TileLayer
                attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
            </LayerGroup>
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Street & District Map (OSM)">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay name="Live Clouds & Weather">
            <TileLayer
              url="https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=931c3858c973dfd720b66b26cf98886f"
              opacity={0.8}
            />
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Live Rainfall (Precipitation)">
            <TileLayer
              url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=931c3858c973dfd720b66b26cf98886f"
              opacity={0.8}
            />
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Landslide Risk Heatmap">
            <LayerGroup>
`;
let newContent = content.replace(mapStartRegex, (match) => {
  return match + layersCode;
});

// Remove the old TileLayers from the code manually
newContent = newContent.replace(/\{\/\* Esri World Imagery[\s\S]*?maxZoom=\{19\}\s*\/>/g, '');
newContent = newContent.replace(/\{\/\* Esri Boundaries and Places[\s\S]*?maxZoom=\{19\}\s*\/>/g, '');
newContent = newContent.replace(/\{\/\* Esri Transportation[\s\S]*?maxZoom=\{19\}\s*\/>/g, '');

// Close LayerGroup and LayersControl before the end of MapContainer
const mapEndRegex = /<\/MapContainer>/;
newContent = newContent.replace(mapEndRegex, '            </LayerGroup>\n          </LayersControl.Overlay>\n        </LayersControl>\n      </MapContainer>');

fs.writeFileSync(file, newContent);
console.log("Success RiskMapView");
