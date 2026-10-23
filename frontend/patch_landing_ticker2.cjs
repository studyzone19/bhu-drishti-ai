const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/Landing.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the Analyzing Network logic with the new ticker logic
const searchString = '{nearestRoad ? nearestRoad.name : "Analyzing Network..."}';
const replaceString = '{userLocked && nearestRoad ? nearestRoad.name : (blockedRoads.length > 0 ? blockedRoads[tickerIndex].name : defaultRoads[tickerIndex].name)}';
content = content.replace(searchString, replaceString);

const searchStatus = '{nearestRoad ? nearestRoad.status : "..."}';
const replaceStatus = '{userLocked && nearestRoad ? nearestRoad.status : (blockedRoads.length > 0 ? blockedRoads[tickerIndex].status : defaultRoads[tickerIndex].status)}';
content = content.replace(searchStatus, replaceStatus);

const searchReason = '{nearestRoad ? nearestRoad.reason : "Tap map to select a sector"}';
const replaceReason = '{userLocked && nearestRoad ? nearestRoad.reason : (blockedRoads.length > 0 ? blockedRoads[tickerIndex].reason : defaultRoads[tickerIndex].reason)}';
content = content.replace(searchReason, replaceReason);

// Color logic
const searchColor = "color: nearestRoad?.status === 'Blocked' ? '#ef4444' : nearestRoad?.status === 'At Risk' ? '#f97316' : '#22c55e'";
const replaceColor = "color: (userLocked && nearestRoad ? nearestRoad.status : (blockedRoads.length > 0 ? blockedRoads[tickerIndex].status : defaultRoads[tickerIndex].status)) === 'Blocked' ? '#ef4444' : (userLocked && nearestRoad ? nearestRoad.status : (blockedRoads.length > 0 ? blockedRoads[tickerIndex].status : defaultRoads[tickerIndex].status)) === 'At Risk' ? '#f97316' : '#22c55e'";
content = content.replace(searchColor, replaceColor);

fs.writeFileSync(file, content);
console.log("Success patched landing ticker again");
