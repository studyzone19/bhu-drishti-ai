const fs = require('fs');

const files = [
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicAlerts.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicResources.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicSensors.jsx'
];

const target = '<Link to="/public-awareness" className="text-sm hover:text-yellow-200"><ArrowLeft className="mr-1 inline h-4 w-4" /> Back</Link>';

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes(target)) {
      content = content.replace(target, '');
      fs.writeFileSync(file, content);
      console.log('Removed from', file);
    } else {
      console.log('Target not found in', file);
    }
  }
});
