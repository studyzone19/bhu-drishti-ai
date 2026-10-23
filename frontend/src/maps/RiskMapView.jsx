import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip, useMapEvents, LayersControl, LayerGroup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { ChevronRight, ArrowUpRight } from "lucide-react";


const defaultBlockedRoads = [
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
];

const colorFor = {
  LOW: "#3F9142",
  MODERATE: "#D6A428",
  HIGH: "#D97A2E",
  CRITICAL: "#C2432E",
};

const INDIA_CENTER = [26.0, 91.5];
const INDIA_BOUNDS = [[21.5, 89.0], [29.5, 98.0]];

const createPinIcon = (level, scale = 1) => {
  const color = colorFor[level] || "#888";
  const size = 36 * scale;
  const offset = size / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="white" stroke="none"/></svg>`;
  return L.divIcon({
    html: `<div style="width: ${size}px; height: ${size}px; filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.6));">${svg}</div>`,
    className: "custom-map-pin",
    iconSize: [size, size],
    iconAnchor: [offset, size],
    popupAnchor: [0, -size],
  });
};

const stateLabels = [
  { name: "Assam",             nameHi: "असम",                pos: [26.2006, 92.9376] },
  { name: "Arunachal Pradesh", nameHi: "अरुणाचल प्रदेश",   pos: [28.0180, 94.7278] },
  { name: "Meghalaya",         nameHi: "मेघालय",             pos: [25.4670, 91.3662] },
  { name: "Nagaland",          nameHi: "नागालैंड",           pos: [26.1584, 94.5624] },
  { name: "Manipur",           nameHi: "मणिपुर",             pos: [24.6637, 93.9063] },
  { name: "Mizoram",           nameHi: "मिज़ोरम",            pos: [23.1645, 92.9376] },
  { name: "Tripura",           nameHi: "त्रिपुरा",           pos: [23.9408, 91.9882] },
  { name: "Sikkim",            nameHi: "सिक्किम",            pos: [27.5330, 88.5122] }
];

const cityZones = [
  // Assam
  { _id: 'c1',  name: "Guwahati Nilachal Hill",   nameHi: "गुवाहाटी नीलाचल पहाड़ी",   state: "Assam",             district: "Kamrup Metro",    latitude: 26.1667, longitude: 91.7083, riskLevel: "MODERATE", riskScore: 45, rainfall24h: 30,  soilMoisture: 60 },
  { _id: 'c9',  name: "Silchar Barail Range",      nameHi: "सिलचर बराइल श्रृंखला",      state: "Assam",             district: "Cachar",          latitude: 24.9500, longitude: 92.9000, riskLevel: "HIGH",     riskScore: 65, rainfall24h: 60,  soilMoisture: 70 },
  { _id: 'c11', name: "Tezpur Bank",               nameHi: "तेज़पुर तट",                 state: "Assam",             district: "Sonitpur",        latitude: 26.6338, longitude: 92.8000, riskLevel: "LOW",      riskScore: 25, rainfall24h: 15,  soilMoisture: 45 },
  { _id: 'c12', name: "Dibrugarh Plains",          nameHi: "डिब्रूगढ़ मैदान",            state: "Assam",             district: "Dibrugarh",       latitude: 27.4728, longitude: 94.9120, riskLevel: "MODERATE", riskScore: 55, rainfall24h: 40,  soilMoisture: 75 },
  // Meghalaya
  { _id: 'c2',  name: "Shillong Peak Slopes",      nameHi: "शिलांग चोटी की ढलान",       state: "Meghalaya",         district: "East Khasi Hills", latitude: 25.5398, longitude: 91.8596, riskLevel: "HIGH",     riskScore: 78, rainfall24h: 85,  soilMoisture: 80 },
  { _id: 'c13', name: "Cherrapunji Ridge",          nameHi: "चेरापूंजी रिज",              state: "Meghalaya",         district: "East Khasi Hills", latitude: 25.2866, longitude: 91.7315, riskLevel: "CRITICAL", riskScore: 98, rainfall24h: 210, soilMoisture: 95 },
  { _id: 'c14', name: "Tura Hills",                nameHi: "तुरा पहाड़ियाँ",             state: "Meghalaya",         district: "West Garo Hills", latitude: 25.5144, longitude: 90.2031, riskLevel: "MODERATE", riskScore: 60, rainfall24h: 50,  soilMoisture: 65 },
  // Arunachal
  { _id: 'c3',  name: "Itanagar Foothills",        nameHi: "ईटानगर की तलहटी",           state: "Arunachal Pradesh", district: "Papum Pare",      latitude: 27.0844, longitude: 93.6053, riskLevel: "LOW",      riskScore: 30, rainfall24h: 30,  soilMoisture: 38 },
  { _id: 'c15', name: "Tawang Slopes",             nameHi: "तवांग की ढलानें",            state: "Arunachal Pradesh", district: "Tawang",          latitude: 27.5861, longitude: 91.8660, riskLevel: "HIGH",     riskScore: 82, rainfall24h: 65,  soilMoisture: 72 },
  { _id: 'c16', name: "Ziro Valley",               nameHi: "ज़ीरो घाटी",                 state: "Arunachal Pradesh", district: "Lower Subansiri", latitude: 27.6253, longitude: 93.8291, riskLevel: "MODERATE", riskScore: 40, rainfall24h: 25,  soilMoisture: 50 },
  // Mizoram
  { _id: 'c4',  name: "Aizawl Durtlang Hills",     nameHi: "आइज़ोल दुर्तलांग पहाड़ियाँ", state: "Mizoram",          district: "Aizawl",          latitude: 23.7535, longitude: 92.7161, riskLevel: "CRITICAL", riskScore: 92, rainfall24h: 110, soilMoisture: 90 },
  { _id: 'c17', name: "Lunglei Range",             nameHi: "लुंगलेई श्रृंखला",           state: "Mizoram",           district: "Lunglei",         latitude: 22.8805, longitude: 92.7431, riskLevel: "HIGH",     riskScore: 85, rainfall24h: 90,  soilMoisture: 88 },
  // Manipur
  { _id: 'c5',  name: "Imphal Valley Edge",        nameHi: "इम्फाल घाटी किनारा",        state: "Manipur",           district: "Imphal West",     latitude: 24.8170, longitude: 93.9368, riskLevel: "LOW",      riskScore: 20, rainfall24h: 10,  soilMoisture: 40 },
  { _id: 'c18', name: "Churachandpur Hill",        nameHi: "चुराचांदपुर पहाड़ी",         state: "Manipur",           district: "Churachandpur",   latitude: 24.3333, longitude: 93.6667, riskLevel: "MODERATE", riskScore: 55, rainfall24h: 45,  soilMoisture: 60 },
  // Tripura
  { _id: 'c6',  name: "Agartala Baramura Range",   nameHi: "अगरतला बारामुरा श्रृंखला",  state: "Tripura",           district: "West Tripura",    latitude: 23.8315, longitude: 91.5000, riskLevel: "MODERATE", riskScore: 50, rainfall24h: 40,  soilMoisture: 65 },
  { _id: 'c19', name: "Dharmanagar Hills",         nameHi: "धर्मनगर पहाड़ियाँ",          state: "Tripura",           district: "North Tripura",   latitude: 24.3733, longitude: 92.1648, riskLevel: "LOW",      riskScore: 35, rainfall24h: 20,  soilMoisture: 45 },
  // Nagaland
  { _id: 'c7',  name: "Kohima Pulie Badze",        nameHi: "कोहिमा पुली बड्ज़े",         state: "Nagaland",          district: "Kohima",          latitude: 25.6500, longitude: 94.0833, riskLevel: "HIGH",     riskScore: 70, rainfall24h: 75,  soilMoisture: 75 },
  { _id: 'c10', name: "Dimapur Chumukedima",       nameHi: "दीमापुर चुमुकेदिमा",         state: "Nagaland",          district: "Dimapur",         latitude: 25.7954, longitude: 93.7663, riskLevel: "MODERATE", riskScore: 40, rainfall24h: 25,  soilMoisture: 55 },
  { _id: 'c20', name: "Mokokchung Ridge",          nameHi: "मोकोकचुंग रिज",              state: "Nagaland",          district: "Mokokchung",      latitude: 26.3300, longitude: 94.5300, riskLevel: "HIGH",     riskScore: 75, rainfall24h: 80,  soilMoisture: 78 },
  // Sikkim
  { _id: 'c8',  name: "Gangtok Tathangchen",       nameHi: "गैंगटोक तथांगचेन",           state: "Sikkim",            district: "East Sikkim",     latitude: 27.3389, longitude: 88.6065, riskLevel: "CRITICAL", riskScore: 88, rainfall24h: 95,  soilMoisture: 85 },
  { _id: 'c21', name: "Namchi Slopes",             nameHi: "नामची की ढलानें",            state: "Sikkim",            district: "South Sikkim",    latitude: 27.1667, longitude: 88.3500, riskLevel: "MODERATE", riskScore: 50, rainfall24h: 40,  soilMoisture: 65 }
];




function MapFlyTo({ center }) {
  const map = useMapEvents({});
  React.useEffect(() => {
    if (center) {
      map.flyTo(center, 9, { duration: 2 });
    }
  }, [center, map]);
  return null;
}

function MapInteractionHandler({ onZoom, onSelectZone }) {
  useMapEvents({
    zoomend: (e) => onZoom(e.target.getZoom()),
    click: (e) => {
      // Dynamic zone generation for ANY clicked village/city
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      const risks = ["LOW", "MODERATE", "HIGH", "CRITICAL"];
      const randomRisk = risks[Math.floor(Math.random() * risks.length)];
      
      const dynamicZone = {
        _id: `dynamic_${lat}_${lng}`,
        name: `Village (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
        state: "NER Region",
        district: "Local District",
        latitude: lat,
        longitude: lng,
        riskLevel: randomRisk,
        riskScore: Math.floor(Math.random() * 80) + 20,
        rainfall24h: Math.floor(Math.random() * 200),
        rainfall72h: Math.floor(Math.random() * 400),
        soilMoisture: Math.floor(Math.random() * 60) + 30,
        slope: Math.floor(Math.random() * 45) + 5,
        elevation: Math.floor(Math.random() * 2000) + 100,
        historicalLandslides: Math.floor(Math.random() * 10),
        population: Math.floor(Math.random() * 10000) + 500,
        roadStatus: ["OPEN", "AT_RISK", "BLOCKED"][Math.floor(Math.random() * 3)],
        predictionSource: "AI Model Simulator"
      };
      
      if(onSelectZone) onSelectZone(dynamicZone);
    }
  });
  return null;
}

function MapUpdater({ selectedZone }) {
  const map = useMap();
  React.useEffect(() => {
    if (selectedZone && selectedZone.latitude && selectedZone.longitude) {
      map.setView([selectedZone.latitude, selectedZone.longitude], 9, { animate: true });
    }
  }, [selectedZone, map]);
  return null;
}

export default function RiskMapView({ zones = [], onSelectZone, height = "600px", userLocation = null, selectedZone = null }) {
  const [blockedRoads, setBlockedRoads] = React.useState(defaultBlockedRoads);
  
  React.useEffect(() => {
    const loadRoads = () => {
      const saved = localStorage.getItem('Bhu-Drishti_blocked_roads');
      if (saved) {
        setBlockedRoads(JSON.parse(saved));
      } else {
        localStorage.setItem('Bhu-Drishti_blocked_roads', JSON.stringify(defaultBlockedRoads));
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

  const [currentZoom, setCurrentZoom] = React.useState(6);

  React.useEffect(() => {
    if (!document.getElementById("marker-popup-style")) {
      const style = document.createElement("style");
      style.id = "marker-popup-style";
      style.innerHTML = `
        .leaflet-popup-content-wrapper {
          background: #0b1121 !important;
          color: white !important;
          border: 1px solid #1e293b !important;
          border-radius: 12px !important;
          padding: 0 !important;
          overflow: hidden !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.8) !important;
        }
        .leaflet-popup-tip { background: #0b1121 !important; border-top: 1px solid #1e293b !important; border-left: 1px solid #1e293b !important; }
        .leaflet-popup-content { margin: 0 !important; width: 260px !important; color: white !important; }
        .leaflet-container a.leaflet-popup-close-button { color: #94a3b8 !important; padding: 8px !important; }
        .leaflet-popup-content p { margin: 0 !important; }
        
        .state-label-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          color: white !important;
          font-weight: 700 !important;
          font-size: 14px !important;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9), 1px -1px 2px rgba(0,0,0,0.9), -1px 1px 2px rgba(0,0,0,0.9), 0px 4px 6px rgba(0,0,0,0.8) !important;
        }
        
        .custom-hover-tooltip {
          background: #0b1121 !important;
          color: white !important;
          border: 1px solid #1e293b !important;
          border-radius: 6px !important;
          font-weight: bold !important;
          box-shadow: 0 4px 6px rgba(0,0,0,0.5) !important;
        }
        .custom-hover-tooltip.leaflet-tooltip-top:before {
          border-top-color: #1e293b !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={{ height }} className="rounded-xl overflow-hidden shadow-lg bg-[#070b14] border border-slate-800 relative">
      <MapContainer
        center={[26.0, 93.0]} // Center of NER
        zoom={6.5}
        minZoom={6.5}
        zoomSnap={0.5}
        maxZoom={18}
        maxBounds={[[21.5, 89.0], [29.5, 98.0]]}
        maxBoundsViscosity={1.0}
        style={{ height: "100%", width: "100%", background: "#070b14", zIndex: 0 }}
      >
        <MapInteractionHandler onZoom={setCurrentZoom} onSelectZone={onSelectZone} />
        <MapUpdater selectedZone={selectedZone} />
        {userLocation && <MapFlyTo center={userLocation} />}
        {userLocation && (
          <Marker position={userLocation} icon={L.divIcon({
            html: `<div class="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-ping"></div>`,
            className: "user-location-marker",
            iconSize: [20, 20]
          })}>
            <Popup>Your Current Location</Popup>
          </Marker>
        )}
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


          <LayersControl.Overlay checked name="NER Highway Network">
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
                  <Tooltip sticky className={`custom-hover-tooltip border-2 ${road.status === 'Blocked' ? 'border-red-500' : road.status === 'At Risk' ? 'border-orange-500' : 'border-green-500'}`}>
                    <div className={`font-bold mb-1 ${road.status === 'Blocked' ? 'text-red-500' : road.status === 'At Risk' ? 'text-orange-500' : 'text-green-500'}`}>
                      {road.status === 'Blocked' ? '🚧 ' : road.status === 'At Risk' ? '⚠️ ' : '✅ '}{road.name}
                    </div>
                    <div className="text-xs text-white">Status: {road.status}</div>
                    <div className="text-xs text-slate-300 mt-1">{road.reason}</div>
                  </Tooltip>
                </Polyline>
              )})}
            </LayerGroup>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Landslide Risk Heatmap">
            <LayerGroup>

        
        
        
        
        
        
        
        {/* Heatmap simulation using large blurred circles */}
        {zones.map((zone) => (
          <React.Fragment key={"heat-"+zone._id}>
            <Circle 
              center={[zone.latitude, zone.longitude]} 
              radius={80000} 
              pathOptions={{ fillColor: colorFor[zone.riskLevel], color: 'transparent', fillOpacity: 0.25 }} 
            />
            <Circle 
              center={[zone.latitude, zone.longitude]} 
              radius={40000} 
              pathOptions={{ fillColor: colorFor[zone.riskLevel], color: 'transparent', fillOpacity: 0.4 }} 
            />
            <Circle 
              center={[zone.latitude, zone.longitude]} 
              radius={15000} 
              pathOptions={{ fillColor: colorFor[zone.riskLevel], color: 'transparent', fillOpacity: 0.6 }} 
            />
          </React.Fragment>
        ))}

        {/* State Labels */}
        {stateLabels.map(state => (
           <Marker key={state.name} position={state.pos} opacity={0}>
             <Tooltip permanent direction="center" className="state-label-tooltip">
               {state.name}
             </Tooltip>
           </Marker>
        ))}

        {zones.map((zone) => (
          <Marker
            key={zone._id}
            position={[zone.latitude, zone.longitude]}
            icon={createPinIcon(zone.riskLevel)}
            eventHandlers={{ click: () => onSelectZone?.(zone) }}
          >
            {/* Show zone name on hover */}
            <Tooltip direction="top" offset={[0, -36]} className="custom-hover-tooltip">
              {zone.name}
            </Tooltip>
            
            <Popup>
              <div className="flex flex-col p-4 bg-[#070b14] text-white">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorFor[zone.riskLevel] }}></div>
                    <h3 className="font-bold text-sm tracking-wide m-0 leading-none">{zone.name}</h3>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Current Risk</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: colorFor[zone.riskLevel], color: '#fff' }}>
                      {zone.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Landslide Prob.</span>
                    <span className="text-xs font-bold text-white">{zone.riskScore}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Rainfall</span>
                    <span className="text-xs font-bold text-white">{zone.rainfall24h} mm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Soil Moisture</span>
                    <span className="text-xs font-bold text-white">{zone.soilMoisture}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Movement</span>
                    <span className="text-xs font-bold text-white">+{Math.floor(zone.riskScore / 5)} mm</span>
                  </div>
                </div>
                {zone.riskLevel === 'HIGH' || zone.riskLevel === 'CRITICAL' ? (
                  <p className="text-xs text-red-500 font-bold mb-4 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" /> Risk increasing
                  </p>
                ) : null}
                <button 
                  className="w-full py-2 flex items-center justify-center gap-2 bg-transparent border border-blue-500/50 hover:bg-blue-500/20 text-blue-400 text-xs font-bold rounded transition-colors"
                  onClick={() => window.location.href = '/public-sensors'}
                >
                  View Details <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {currentZoom >= 8 && cityZones.map((zone) => (
          <Marker
            key={zone._id}
            position={[zone.latitude, zone.longitude]}
            icon={createPinIcon(zone.riskLevel, 0.75)}
            eventHandlers={{ click: () => onSelectZone?.(zone) }}
          >
            <Tooltip direction="top" offset={[0, -27]} className="custom-hover-tooltip">
              {zone.name}
            </Tooltip>
            
            <Popup>
              <div className="flex flex-col p-4 bg-[#070b14] text-white">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorFor[zone.riskLevel] }}></div>
                    <h3 className="font-bold text-sm tracking-wide m-0 leading-none">{zone.name}</h3>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Current Risk</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: colorFor[zone.riskLevel], color: '#fff' }}>
                      {zone.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Landslide Prob.</span>
                    <span className="text-xs font-bold text-white">{zone.riskScore}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Rainfall</span>
                    <span className="text-xs font-bold text-white">{zone.rainfall24h} mm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Soil Moisture</span>
                    <span className="text-xs font-bold text-white">{zone.soilMoisture}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Movement</span>
                    <span className="text-xs font-bold text-white">+{Math.floor(zone.riskScore / 5)} mm</span>
                  </div>
                </div>
                {zone.riskLevel === 'HIGH' || zone.riskLevel === 'CRITICAL' ? (
                  <p className="text-xs text-red-500 font-bold mb-4 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" /> Risk increasing
                  </p>
                ) : null}
                <button 
                  className="w-full py-2 flex items-center justify-center gap-2 bg-transparent border border-blue-500/50 hover:bg-blue-500/20 text-blue-400 text-xs font-bold rounded transition-colors"
                  onClick={() => window.location.href = '/public-sensors'}
                >
                  View Details <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
                  </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>

      {/* Legend Overlay matching the image */}
      <div className="absolute bottom-4 left-4 z-[400] bg-[#0b1121]/90 backdrop-blur-sm border border-slate-700 rounded-lg p-3 shadow-xl">
        <h4 className="text-xs font-bold text-white mb-2 tracking-wider">Risk Level</h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#C2432E]"></div><span className="text-xs font-semibold text-slate-200">Critical</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#D97A2E]"></div><span className="text-xs font-semibold text-slate-200">High</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#D6A428]"></div><span className="text-xs font-semibold text-slate-200">Moderate</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#3F9142]"></div><span className="text-xs font-semibold text-slate-200">Low</span></div>
        </div>
      </div>
    </div>
  );
}
