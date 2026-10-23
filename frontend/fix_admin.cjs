const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded transition-colors text-xs"\r?\n\s+alert\("Road "\s*\+\s*roadData\.name\s*\+\s*" blocked successfully! Live map updated\."\);[\s\S]+?CLEAR BLOCKS\s*<\/button>\s*<\/div>\s*<\/div>/, 
`>
                 CLEAR BLOCKS
               </button>
            </div>
          </div>
`);

fs.writeFileSync(file, content);
console.log("Fixed duplicate lines");
