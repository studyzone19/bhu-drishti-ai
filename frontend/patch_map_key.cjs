const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/maps/RiskMapView.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/landguard_blocked_roads/g, 'Bhu-Drishti_blocked_roads');
content = content.replace(/LANDGUARD AI/g, 'Bhu-Drishti');
content = content.replace(/LANDGUARD/g, 'Bhu-Drishti');
content = content.replace(/Landguard/g, 'Bhu-Drishti');
// No need to replace lowercase landguard globally here, we just need the localStorage key which we did

fs.writeFileSync(file, content);
console.log("Patched RiskMapView keys");
