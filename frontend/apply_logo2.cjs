const fs = require('fs');

const filesToUpdate = [
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/AdminDashboard.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicAwareness.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/Login.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/Register.jsx'
];

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    if (content.includes('<Mountain')) {
      if (!content.includes('import Logo')) {
        content = content.replace(/import {([^}]+)} from "lucide-react";/, (match) => {
            return match + '\nimport Logo from "../components/Logo.jsx";';
        });
      }
      
      content = content.replace(/<Mountain className="h-8 w-8" \/>/g, '<Logo className="h-8 w-8 text-white" />');
      content = content.replace(/<Mountain className="h-5 w-5" \/>/g, '<Logo className="h-5 w-5 text-white" />');
      content = content.replace(/<Mountain className="w-6 h-6 text-terrain-400" strokeWidth=\{1\.75\} \/>/g, '<Logo className="w-6 h-6 text-orange-500" />');
      
      fs.writeFileSync(file, content);
      console.log('Patched Logo in', file);
    }
  }
});
