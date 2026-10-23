const fs = require('fs');

const filesDarkHeader = [
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicAlerts.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicAwareness.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicResources.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicSensors.jsx'
];

filesDarkHeader.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(
      '<span className="tracking-wide">Bhu-Drishti</span>', 
      '<span className="tracking-wide text-orange-400">Bhu-Drishti</span>'
    );
    content = content.replace(
      '<Mountain className="h-6 w-6 text-white" /> Bhu-Drishti', 
      '<Mountain className="h-6 w-6 text-orange-400" /> <span className="text-orange-400">Bhu-Drishti</span>'
    );
    // In case the mountain icon was left as text-white in some files (like PublicSensors)
    content = content.replace(
      '<Mountain className="h-5 w-5 text-white" />', 
      '<Mountain className="h-5 w-5 text-orange-400" />'
    );
    fs.writeFileSync(file, content);
  }
});

const landing = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/Landing.jsx';
if (fs.existsSync(landing)) {
    let content = fs.readFileSync(landing, 'utf8');
    content = content.replace(
      '<h1 className="text-xl font-bold text-[#002b5e]', 
      '<h1 className="text-xl font-black text-orange-600'
    );
    fs.writeFileSync(landing, content);
}
console.log("Updated brand colors");
