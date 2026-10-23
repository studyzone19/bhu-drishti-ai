const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/maps/RiskMapView.jsx';
let content = fs.readFileSync(file, 'utf8');

const newRow = `
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Landslide Prob.</span>
                    <span className="text-xs font-bold text-white">{zone.riskScore}%</span>
                  </div>`;

// Insert the new row right before the Rainfall row
content = content.replace(
  /<div className="flex justify-between items-center">\s*<span className="text-xs text-slate-400">Rainfall<\/span>/g,
  newRow.trim() + '\n                  <div className="flex justify-between items-center">\n                    <span className="text-xs text-slate-400">Rainfall</span>'
);

fs.writeFileSync(file, content);
console.log("Success patch");
