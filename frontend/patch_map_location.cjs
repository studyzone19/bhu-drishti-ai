const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/maps/RiskMapView.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add userLocation to the props
content = content.replace('export default function RiskMapView({ zones, height, standalone = false, onSelectZone }) {', 
                          'export default function RiskMapView({ zones, height, standalone = false, onSelectZone, userLocation }) {');

// 2. Create the MapFlyTo component and User Marker
const extraMapComponents = `
function MapFlyTo({ center }) {
  const map = useMapEvents({});
  React.useEffect(() => {
    if (center) {
      map.flyTo(center, 9, { duration: 2 });
    }
  }, [center, map]);
  return null;
}
`;

// Inject right before MapInteractionHandler function
content = content.replace('function MapInteractionHandler({ onZoom, onSelectZone }) {', extraMapComponents + '\nfunction MapInteractionHandler({ onZoom, onSelectZone }) {');

// 3. Add the MapFlyTo component and User Marker inside MapContainer
const mapContainerTarget = '<MapInteractionHandler onZoom={setCurrentZoom} onSelectZone={onSelectZone} />';
const mapComponentsToAdd = `<MapInteractionHandler onZoom={setCurrentZoom} onSelectZone={onSelectZone} />
        {userLocation && <MapFlyTo center={userLocation} />}
        {userLocation && (
          <Marker position={userLocation} icon={L.divIcon({
            html: \`<div class="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-ping"></div>\`,
            className: "user-location-marker",
            iconSize: [20, 20]
          })}>
            <Popup>Your Current Location</Popup>
          </Marker>
        )}`;

content = content.replace(mapContainerTarget, mapComponentsToAdd);

fs.writeFileSync(file, content);
console.log("Success patched RiskMapView for geolocation");
