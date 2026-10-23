const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/Landing.jsx';
let content = fs.readFileSync(file, 'utf8');

const prefixSplit = content.split('<div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">');
if (prefixSplit.length < 2) { console.error("Could not find grid"); process.exit(1); }
const prefix = prefixSplit[0];

const suffixSplit = prefixSplit[1].split('      {/* Main 3-Column Content Area */}');
if (suffixSplit.length < 2) { console.error("Could not find Main Content Area"); process.exit(1); }
const suffix = '      {/* Main 3-Column Content Area */}' + suffixSplit[1];

const newMid = `<div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-3 shadow-lg">
               <div className="flex items-center gap-2 mb-2">
                 <CloudRain className="h-3 w-3 text-blue-500" />
                 <h3 className="text-[10px] font-bold tracking-wider">Rainfall Trend (mm)</h3>
               </div>
               <div className="h-20 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dynRain} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRainL" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRainL)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-xl p-3 shadow-lg">
               <div className="flex items-center gap-2 mb-2">
                 <Mountain className="h-3 w-3 text-orange-500" />
                 <h3 className="text-[10px] font-bold tracking-wider">Ground Movement (mm)</h3>
               </div>
               <div className="h-20 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dynMove} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorMoveL" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={[0, 20]} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="val" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorMoveL)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-xl p-3 shadow-lg relative overflow-hidden flex flex-col justify-center">
               <div className="absolute left-0 top-0 h-full w-1" style={{backgroundColor: nearestRoad?.status === 'Blocked' ? '#ef4444' : nearestRoad?.status === 'At Risk' ? '#f97316' : '#22c55e'}}></div>
               <div className="flex items-center gap-2 mb-3">
                 <AlertTriangle className="h-4 w-4" style={{color: nearestRoad?.status === 'Blocked' ? '#ef4444' : nearestRoad?.status === 'At Risk' ? '#f97316' : '#22c55e'}} />
                 <h3 className="text-[10px] font-bold tracking-wider text-slate-400">NER ROAD STATUS</h3>
               </div>
               <div>
                  <h2 className="text-sm font-black text-white leading-tight mb-1">{nearestRoad ? nearestRoad.name : "Analyzing Network..."}</h2>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{color: nearestRoad?.status === 'Blocked' ? '#ef4444' : nearestRoad?.status === 'At Risk' ? '#f97316' : '#22c55e'}}>
                      {nearestRoad ? nearestRoad.status : "..."}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium truncate">{nearestRoad ? nearestRoad.reason : "Tap map to select a sector"}</span>
                  </div>
               </div>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
              <h3 className="text-[10px] font-bold tracking-wider absolute top-3 left-3 flex items-center gap-1">
                <span className="text-blue-400">🧠</span> AI Risk
              </h3>
              <div className="mt-5 flex flex-col items-center justify-center relative">
                <div className="w-16 h-8 overflow-hidden relative">
                  <div className="w-16 h-16 rounded-full border-[8px] border-slate-800 absolute top-0 border-t-red-500 border-r-orange-500 border-l-yellow-500 transform rotate-45"></div>
                </div>
                <div className="absolute -bottom-1 text-center">
                   <span className="text-xl font-black text-white">{currentRiskScore}%</span>
                </div>
              </div>
              <span className="text-[9px] font-bold mt-2 tracking-widest px-2 py-0.5 rounded" style={{ color: currentRiskLevel === "CRITICAL" ? "#ef4444" : currentRiskLevel === "HIGH" ? "#f97316" : "#eab308", backgroundColor: "rgba(255,255,255,0.1)" }}>{currentRiskLevel} RISK</span>
            </div>
          </div>

          {/* Action Banner */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl flex flex-col md:flex-row shadow-lg overflow-hidden">
             <div className="flex-1 p-3 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-800 relative">
                <div className="absolute left-0 top-0 h-full w-1 bg-blue-500"></div>
                <div className="bg-blue-500/20 p-2 rounded-full text-blue-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold mb-0.5 tracking-wider">WHERE</p>
                  <p className="text-xs font-bold text-white">{selectedZone ? selectedZone.name : "Zone A"}</p>
                  <p className="text-[10px] text-slate-500">{selectedZone ? \`\${selectedZone.district}, \${selectedZone.state}\` : "NH-10, Assam"}</p>
                </div>
             </div>
             <div className="flex-1 p-3 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-800 relative">
                <div className="absolute left-0 top-0 h-full w-1 bg-yellow-500"></div>
                <div className="bg-yellow-500/20 p-2 rounded-full text-yellow-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold mb-0.5 tracking-wider">WHEN</p>
                  <p className="text-xs font-bold text-white">{whenStr}</p>
                  <p className="text-[10px] text-slate-500">Expected Risk Window</p>
                </div>
             </div>
             <div className="flex-1 p-3 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-800 relative">
                <div className="absolute left-0 top-0 h-full w-1 bg-orange-500"></div>
                <div className="bg-orange-500/20 p-2 rounded-full text-orange-400">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold mb-0.5 tracking-wider">WHY</p>
                  <p className="text-xs font-bold text-white">AI DETECTED</p>
                  <p className="text-[10px] text-slate-500">Rain: {selectedZone?.rainfall24h || 94}mm, Moisture: {selectedZone?.soilMoisture || 81}%</p>
                </div>
             </div>
             <div className="flex-[1.5] p-3 flex items-center justify-between bg-green-500/10 cursor-pointer hover:bg-green-500/20 transition-colors">
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
        </div>
      </section>
\n`;

fs.writeFileSync(file, prefix + newMid + suffix);
console.log("Success patched syntax");
