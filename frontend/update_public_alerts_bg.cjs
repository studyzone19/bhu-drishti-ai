const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicAlerts.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('className="min-h-screen bg-[#fff8f5]"', 'className="min-h-screen bg-[#f1f5f9]"');
content = content.replace('header className="bg-[#07983b]', 'header className="bg-[#002b5e]');
content = content.replace('Mountain className="h-6 w-6 text-yellow-300"', 'Mountain className="h-6 w-6 text-white"');

fs.writeFileSync(file, content);
console.log("Success patched PublicAlerts background");
