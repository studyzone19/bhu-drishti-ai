const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  / \}\}\r?\n\s+>\r?\n\s+CLEAR BLOCKS/,
  ` }}\n                 className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded transition-colors text-xs">\n                 CLEAR BLOCKS`
);

fs.writeFileSync(file, content);
console.log("Fixed class");
