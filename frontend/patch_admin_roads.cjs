const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldFormRegex = /<label className="text-xs text-slate-400 mb-1 block">Select Highway<\/label>[\s\S]*?AUTHORIZE ROAD BLOCK\s*<\/button>/;

const newFormCode = `<label className="text-xs text-slate-400 mb-1 block">Select Highway</label>
                  <select id="roadSelect" className="w-full bg-[#1e293b] border border-slate-700 rounded p-2 text-white text-sm outline-none mb-3">
                    <option value='{"id":"nh6","name":"NH-6 (Shillong - Silchar)","positions":[[25.5,91.8],[25.3,92.1],[25.0,92.5],[24.8,92.8]]}'>NH-6 (Shillong - Silchar)</option>
                    <option value='{"id":"nh10","name":"NH-10 (Siliguri - Gangtok)","positions":[[26.7,88.4],[26.9,88.5],[27.1,88.5],[27.3,88.6]]}'>NH-10 (Siliguri - Gangtok)</option>
                    <option value='{"id":"nh2","name":"NH-2 (Kohima - Imphal)","positions":[[25.6,94.1],[25.2,94.0],[24.8,93.9]]}'>NH-2 (Kohima - Imphal)</option>
                    <option value='{"id":"nh13","name":"NH-13 (Tawang - Pasighat)","positions":[[27.5,91.8],[27.8,92.5],[28.1,93.5],[28.0,95.3]]}'>NH-13 (Tawang - Pasighat)</option>
                    <option value='{"id":"nh44","name":"NH-44 (Agartala - Shillong)","positions":[[23.8,91.2],[24.1,91.5],[24.6,91.9],[25.5,91.8]]}'>NH-44 (Agartala - Shillong)</option>
                    <option value='{"id":"nh27","name":"NH-27 (Silchar - Lumding)","positions":[[24.8,92.8],[25.1,92.9],[25.5,93.1],[25.8,93.2]]}'>NH-27 (Silchar - Lumding)</option>
                    <option value='{"id":"nh15","name":"NH-15 (Tezpur - Dibrugarh)","positions":[[26.6,92.8],[26.8,93.5],[27.2,94.2],[27.4,94.9]]}'>NH-15 (Tezpur - Dibrugarh)</option>
                    <option value='{"id":"nh54","name":"NH-54 (Silchar - Aizawl)","positions":[[24.8,92.8],[24.4,92.8],[24.1,92.7],[23.7,92.7]]}'>NH-54 (Silchar - Aizawl)</option>
                    <option value='{"id":"nh37","name":"NH-37 (Guwahati - Jorhat)","positions":[[26.1,91.7],[26.2,92.5],[26.6,93.2],[26.7,94.2]]}'>NH-37 (Guwahati - Jorhat)</option>
                    <option value='{"id":"nh29","name":"NH-29 (Dimapur - Kohima)","positions":[[25.8,93.7],[25.7,93.9],[25.6,94.1]]}'>NH-29 (Dimapur - Kohima)</option>
                  </select>
                  
                  <label className="text-xs text-slate-400 mb-1 block">Set Status</label>
                  <select id="statusSelect" className="w-full bg-[#1e293b] border border-slate-700 rounded p-2 text-white text-sm outline-none mb-3">
                    <option value="Blocked">Blocked</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Open">Open</option>
                  </select>

                  <label className="text-xs text-slate-400 mb-1 block">Reason / Details</label>
                  <input type="text" id="reasonInput" placeholder="e.g. Cleared, Landslide, Mudslide..." className="w-full bg-[#1e293b] border border-slate-700 rounded p-2 text-white text-sm outline-none mb-4" defaultValue="Updated by SDMA" />
               </div>
               <button 
                 onClick={() => {
                   const roadBase = JSON.parse(document.getElementById("roadSelect").value);
                   const status = document.getElementById("statusSelect").value;
                   const reason = document.getElementById("reasonInput").value;
                   
                   const existingStr = localStorage.getItem('landguard_blocked_roads');
                   let existing = existingStr ? JSON.parse(existingStr) : [];
                   
                   existing = existing.filter(r => r.id !== roadBase.id);
                   
                   const newRoad = { ...roadBase, status, reason };
                   const newRoads = [...existing, newRoad];
                   
                   localStorage.setItem('landguard_blocked_roads', JSON.stringify(newRoads));
                   window.dispatchEvent(new Event('roads_updated'));
                   alert("Road " + roadBase.name + " updated to " + status + "!");
                 }}
                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors text-sm mb-2"
               >
                 UPDATE ROAD STATUS
               </button>`;

content = content.replace(oldFormRegex, newFormCode);

const clearRegex = /const defaultRoads = \[[^;]+;/;
const defaultRoadsArray = `const defaultRoads = [
  { id: "nh6", name: "NH-6 (Shillong - Silchar)", reason: "Severe Landslide", status: "Blocked", positions: [[25.5, 91.8], [25.3, 92.1], [25.0, 92.5], [24.8, 92.8]] },
  { id: "nh10", name: "NH-10 (Siliguri - Gangtok)", reason: "Active Mudslide", status: "Blocked", positions: [[26.7, 88.4], [26.9, 88.5], [27.1, 88.5], [27.3, 88.6]] },
  { id: "nh2", name: "NH-2 (Kohima - Imphal)", reason: "Road Cave-in", status: "Blocked", positions: [[25.6, 94.1], [25.2, 94.0], [24.8, 93.9]] },
  { id: "nh13", name: "NH-13 (Tawang - Pasighat)", reason: "High Moisture Alert", status: "At Risk", positions: [[27.5, 91.8], [27.8, 92.5], [28.1, 93.5], [28.0, 95.3]] },
  { id: "nh44", name: "NH-44 (Agartala - Shillong)", reason: "Edge Subsidence", status: "At Risk", positions: [[23.8, 91.2], [24.1, 91.5], [24.6, 91.9], [25.5, 91.8]] },
  { id: "nh27", name: "NH-27 (Silchar - Lumding)", reason: "Clear", status: "Open", positions: [[24.8, 92.8], [25.1, 92.9], [25.5, 93.1], [25.8, 93.2]] },
  { id: "nh15", name: "NH-15 (Tezpur - Dibrugarh)", reason: "Clear", status: "Open", positions: [[26.6, 92.8], [26.8, 93.5], [27.2, 94.2], [27.4, 94.9]] },
  { id: "nh54", name: "NH-54 (Silchar - Aizawl)", reason: "Clear", status: "Open", positions: [[24.8, 92.8], [24.4, 92.8], [24.1, 92.7], [23.7, 92.7]] },
  { id: "nh37", name: "NH-37 (Guwahati - Jorhat)", reason: "Clear", status: "Open", positions: [[26.1, 91.7], [26.2, 92.5], [26.6, 93.2], [26.7, 94.2]] },
  { id: "nh29", name: "NH-29 (Dimapur - Kohima)", reason: "Clear", status: "Open", positions: [[25.8, 93.7], [25.7, 93.9], [25.6, 94.1]] }
];`;

content = content.replace(clearRegex, defaultRoadsArray);

// Also change button text from "CLEAR BLOCKS" to "RESET ALL TO DEFAULT"
content = content.replace('CLEAR BLOCKS', 'RESET ALL TO DEFAULT');

fs.writeFileSync(file, content);
console.log("Success patched AdminDashboard form");
