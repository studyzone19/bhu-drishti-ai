const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '        </div>\n        </div>\n\n        {/* Charts */}',
  '        </div>\n\n        {/* Charts */}'
);

fs.writeFileSync(file, content);
console.log("Fixed extra div");
