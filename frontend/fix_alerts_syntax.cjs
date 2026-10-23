const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicAlerts.jsx';
let content = fs.readFileSync(file, 'utf8');

// replace escaped template literals
content = content.replace(/\\\$/g, '$');
content = content.replace(/\\`/g, '`');

fs.writeFileSync(file, content);
console.log("Success patched syntax");
