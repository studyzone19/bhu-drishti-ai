const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/Landing.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div className="flex-1 p-3 flex items-center gap-3 bg-red-500\/5 relative">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const newPanel = `<div className="flex-[1.5] p-3 flex items-center justify-between bg-green-500/10 cursor-pointer hover:bg-green-500/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500/20 p-2 rounded-full text-green-500">
                    <PersonStanding className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-green-500/70 font-bold mb-0.5 tracking-wider">ACTION</p>
                    <p className="text-xs font-bold text-green-500">{actionStr}</p>
                    <p className="text-[10px] text-slate-400">Protect lives and infrastructure</p>
                  </div>
                </div>
                <Link to="/login" className="flex items-center gap-1 text-[10px] font-bold text-green-500 hover:underline">
                  Join Network <ChevronRight className="h-3 w-3" />
                </Link>
             </div>
          </div>
        </div>`;

content = content.replace(regex, newPanel);
fs.writeFileSync(file, content);
console.log("Success action patch");
