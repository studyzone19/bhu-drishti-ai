const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/Landing.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldMarquee = `<marquee className="flex-1" speed="50">
          ⚠️ CRITICAL LANDSLIDE RISK in CHERRAPUNJI RIDGE (Meghalaya) due to heavy rainfall (150mm/24h). ⚠️ MODERATE RISK flagged for Itanagar Foothills (Arunachal Pradesh). Stay clear of vulnerable slopes.
        </marquee>`;

const newMarquee = `<marquee className="flex-1" speed="50">
          {topZones.length > 0 
            ? topZones.filter(z => ['CRITICAL', 'HIGH'].includes(z.riskLevel)).map(z => \`⚠️ \${z.riskLevel} LANDSLIDE RISK in \${z.name.toUpperCase()} (\${z.state}) due to \${z.rainfall24h > 100 ? 'heavy rainfall (' + z.rainfall24h + 'mm/24h)' : 'critical soil moisture (' + z.soilMoisture + '%)\'}.\`).join("   ") + "   Stay clear of vulnerable slopes and monitor local alerts."
            : "✅ All monitored regions are currently showing normal stability. Regular AI monitoring is in progress."}
        </marquee>`;

content = content.replace(oldMarquee, newMarquee);

fs.writeFileSync(file, content);
console.log("Success patched marquee");
