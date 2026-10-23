import React, { useState } from "react";
import { MapContainer, TileLayer, Circle, Tooltip, useMapEvents } from "react-leaflet";
import L from "leaflet";

function MiniMapEvents({ setZoom }) {
  useMapEvents({
    zoomend: (e) => setZoom(e.target.getZoom()),
  });
  return null;
}

export default function MiniSatelliteView() {
  const [zoom, setZoom] = useState(6.5);

  const riskZones = [
    { center: [25.3, 91.8], color: "#ef4444", radius: 35000, label: "CRITICAL LANDSLIDE ZONE", forest: "45%", moisture: "92%", shift: "18mm" },
    { center: [26.8, 93.5], color: "#eab308", radius: 45000, label: "MODERATE LANDSLIDE ZONE", forest: "68%", moisture: "75%", shift: "6mm" },
    { center: [27.5, 95.0], color: "#22c55e", radius: 55000, label: "SAFE ZONE", forest: "88%", moisture: "40%", shift: "0mm" },
  ];

  return (
    <div style={{ height: "100%", width: "100%", background: "#070b14", position: "relative" }}>
      <MapContainer
        center={[26.2, 93.0]}
        zoom={6.5}
        minZoom={6}
        maxZoom={12}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        zoomControl={false}
        attributionControl={false}
      >
        <MiniMapEvents setZoom={setZoom} />
        
        {/* Base Satellite */}
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        
        {/* Live Weather Overlays (Clouds + Rainfall Radar) */}
        <TileLayer 
          url="https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=931c3858c973dfd720b66b26cf98886f" 
          opacity={0.8} 
        />
        <TileLayer 
          url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=931c3858c973dfd720b66b26cf98886f" 
          opacity={0.8} 
        />

        {/* Risk Zones */}
        {riskZones.map((zone, i) => (
          <Circle 
            key={i} 
            center={zone.center} 
            radius={zone.radius} 
            pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.2, weight: 2 }}
          >
            {zoom >= 8 && (
              <Tooltip permanent direction="center" className="bg-slate-900/90 text-white border-0 shadow-lg p-2 rounded-lg text-xs font-mono">
                <div className="font-bold text-center mb-1" style={{color: zone.color}}>{zone.label}</div>
                <div>Forest: {zone.forest}</div>
                <div>Moisture: {zone.moisture}</div>
                <div>Shift: {zone.shift}</div>
              </Tooltip>
            )}
          </Circle>
        ))}
      </MapContainer>
      
      {/* Zoom Hint */}
      {zoom < 8 && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-[1000] bg-black/60 text-white text-[10px] px-3 py-1 rounded-full pointer-events-none backdrop-blur-sm">
          Zoom in to view terrain analytics
        </div>
      )}
    </div>
  );
}
