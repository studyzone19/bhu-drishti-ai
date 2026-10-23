const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/Landing.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add new state variables
const stateHookTarget = 'const [userLocked, setUserLocked] = useState(false);';
const newStates = `const [userLocked, setUserLocked] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [emergencyZone, setEmergencyZone] = useState(null);`;

content = content.replace(stateHookTarget, newStates);

// 2. Add geolocation effect
const effectTarget = 'useEffect(() => {';
const geolocationEffect = `useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLocation([lat, lng]);
        },
        (err) => {
          console.log("Geolocation error:", err);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation && zones.length > 0 && !userLocked) {
      // Find nearest zone
      let minDiff = Infinity;
      let closest = zones[0];
      for (let z of zones) {
        if (!z.latitude || !z.longitude) continue;
        const diff = Math.abs(z.latitude - userLocation[0]) + Math.abs(z.longitude - userLocation[1]);
        if (diff < minDiff) {
          minDiff = diff;
          closest = z;
        }
      }
      
      setSelectedZone(closest);
      setUserLocked(true);
      
      // If within high/critical risk and reasonably close
      if (['HIGH', 'CRITICAL'].includes(closest.riskLevel)) {
        setEmergencyZone(closest);
        setShowEmergencyAlert(true);
      }
    }
  }, [userLocation, zones, userLocked]);

  useEffect(() => {`;

content = content.replace(effectTarget, geolocationEffect);

// 3. Add Emergency Alert Modal right before the </DashboardLayout> (or at the bottom of the return)
// The return structure ends with </DashboardLayout>. Let's inject right before it.
const modalCode = `
      {showEmergencyAlert && emergencyZone && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0b1121] border-2 border-red-500 rounded-2xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.3)] animate-pulse relative overflow-hidden" style={{animationDuration: '2s'}}>
            <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-500/20 p-3 rounded-full border border-red-500/50">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight uppercase">Emergency Alert</h2>
                <p className="text-sm font-bold text-red-400">High Risk Zone Detected</p>
              </div>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-slate-200 text-sm leading-relaxed mb-3">
                Your current location is within or near the <strong className="text-white">{emergencyZone.name}</strong> danger zone.
              </p>
              <p className="text-red-400 font-bold text-sm bg-red-500/10 p-3 rounded border border-red-500/30">
                ⚠️ WARNING: A severe landslide is predicted in this area within the next 3 to 6 hours due to critical soil saturation and weather conditions.
              </p>
            </div>
            
            <button 
              onClick={() => setShowEmergencyAlert(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-red-900/50"
            >
              I Understand, Show Dashboard
            </button>
          </div>
        </div>
      )}
`;

content = content.replace('</DashboardLayout>', modalCode + '\n    </DashboardLayout>');

// 4. Pass userLocation to RiskMapView
content = content.replace('<RiskMapView zones={zones} height="650px"', '<RiskMapView zones={zones} height="650px" userLocation={userLocation}');

fs.writeFileSync(file, content);
console.log("Success patched geolocation to Landing");
