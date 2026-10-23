const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/Landing.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add showSideMenu state
content = content.replace(
  'const [selectedZone, setSelectedZone] = useState(null);',
  'const [selectedZone, setSelectedZone] = useState(null);\n  const [showSideMenu, setShowSideMenu] = useState(false);'
);

// 2. Extract the left column content
const leftColRegex = /\{\/\* Left Column: Quick Links & Warnings \*\/\}\s*<div className="lg:col-span-3 space-y-6">([\s\S]*?)<\/div>\s*\{\/\* Center Column: Map & Analytics \*\/\}/;
const match = content.match(leftColRegex);
if(!match) {
  console.log("Could not find left column");
  process.exit(1);
}
const leftColContent = match[1].trim();

// 3. Remove Left Column and change Center Column span to lg:col-span-9
let newContent = content.replace(leftColRegex, '{/* Center Column: Map & Analytics */}');
newContent = newContent.replace('<div className="lg:col-span-6 space-y-6">', '<div className="lg:col-span-9 space-y-6">');

// 4. Inject floating menu into Map container
const floatingMenuHTML = `
            <div 
              className="absolute top-4 left-4 z-[1000]"
              onMouseEnter={() => setShowSideMenu(true)}
              onMouseLeave={() => setShowSideMenu(false)}
            >
              <button className="bg-white/90 backdrop-blur-sm p-2.5 rounded-lg shadow-lg border border-slate-200 hover:bg-white transition-colors text-[#002b5e]">
                <Menu className="h-6 w-6" />
              </button>
              
              {showSideMenu && (
                <div className="absolute top-0 left-0 w-80 shadow-2xl transition-all duration-200 origin-top-left space-y-4">
                  ${leftColContent}
                </div>
              )}
            </div>
            <RiskMapView zones={zones} height="650px" onSelectZone={setSelectedZone} />`;

newContent = newContent.replace(
  '<RiskMapView zones={zones} height="650px" onSelectZone={setSelectedZone} />',
  floatingMenuHTML
);

newContent = newContent.replace(
  '<div className="p-2">',
  '<div className="p-2 relative">'
);

fs.writeFileSync(file, newContent);
console.log("Successfully patched menu!");
