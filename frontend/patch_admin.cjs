const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace static "94 mm" with liveMetrics.rain
content = content.replace('<h2 className="text-2xl font-bold text-white">94 mm</h2>', '<h2 className="text-2xl font-bold text-white">{liveMetrics.rain} mm</h2>');

// Replace static "78%" with liveMetrics.moisture
content = content.replace('<h2 className="text-2xl font-bold text-white">78%</h2>', '<h2 className="text-2xl font-bold text-white">{liveMetrics.moisture}%</h2>');

// Replace static "18 mm" with liveMetrics.movement
content = content.replace('<h2 className="text-2xl font-bold text-white">18 mm</h2>', '<h2 className="text-2xl font-bold text-white">{liveMetrics.movement} mm</h2>');

// Replace static "HIGH" for OVERALL RISK with dynamic class and value
const overallRiskHTML = `<div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
            <div className="flex items-center gap-4 z-10">
              <div className="bg-red-500/20 p-3 rounded-full text-red-500">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold tracking-wider mb-1">OVERALL RISK</p>
                <h2 className="text-3xl font-black text-red-500">HIGH</h2>
              </div>
            </div>`;

const newOverallRiskHTML = `<div className={\`absolute top-0 left-0 w-1 h-full \${currentRiskLevel === 'CRITICAL' ? 'bg-red-600' : currentRiskLevel === 'HIGH' ? 'bg-orange-500' : 'bg-yellow-500'}\`}></div>
            <div className="flex items-center gap-4 z-10">
              <div className={\`p-3 rounded-full \${currentRiskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : currentRiskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-500' : 'bg-yellow-500/20 text-yellow-500'}\`}>
                <AlertTriangle className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold tracking-wider mb-1">OVERALL RISK</p>
                <h2 className={\`text-3xl font-black \${currentRiskLevel === 'CRITICAL' ? 'text-red-500' : currentRiskLevel === 'HIGH' ? 'text-orange-500' : 'text-yellow-500'}\`}>{currentRiskLevel}</h2>
              </div>
            </div>`;

content = content.replace(overallRiskHTML, newOverallRiskHTML);

// Fix the AI Risk Score block which currently has 99% hardcoded or uses currentRiskScore without formatting
// In the JSX, we have <span className="text-4xl font-black text-white ml-2">{currentRiskScore}%</span> which is already partially dynamic. Let's make sure it's fully using the liveMetrics.score.
content = content.replace('<span className="text-4xl font-black text-white ml-2">99%</span>', '<span className="text-4xl font-black text-white ml-2">{Math.round(currentRiskScore)}%</span>');
content = content.replace('<p className="font-bold text-lg mt-1 text-red-500">MODERATE RISK</p>', '<p className={`font-bold text-lg mt-1 ${currentRiskLevel === \'CRITICAL\' ? \'text-red-500\' : currentRiskLevel === \'HIGH\' ? \'text-orange-500\' : \'text-yellow-500\'}`}>{currentRiskLevel} RISK</p>');
content = content.replace('Rain: {selectedZone ? selectedZone.rainfall24h : 92}mm, Moisture: {selectedZone ? selectedZone.soilMoisture : 81}%', 'Rain: {liveMetrics.rain}mm, Moisture: {liveMetrics.moisture}%');
content = content.replace('<span className="text-4xl font-black text-white ml-2">{currentRiskScore}%</span>', '<span className="text-4xl font-black text-white ml-2">{Math.round(currentRiskScore)}%</span>');

fs.writeFileSync(file, content);
console.log("Done");
