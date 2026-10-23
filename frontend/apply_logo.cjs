const fs = require('fs');

const filesToUpdate = [
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/Landing.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/AdminDashboard.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicAlerts.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicAwareness.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicResources.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicSensors.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/Login.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/Register.jsx'
];

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if we need to add the import
    if (content.includes('<Mountain className="h-6 w-6 text-orange-400"') || 
        content.includes('<Mountain className="h-5 w-5 text-orange-400"') || 
        content.includes('<Mountain className="h-8 w-8 text-orange-400"') ||
        content.includes('<Mountain className="h-7 w-7" />')) {
      
      // Import Logo
      if (!content.includes('import Logo')) {
        // Add import after other imports
        content = content.replace(/import {([^}]+)} from "lucide-react";/, (match) => {
            return match + '\nimport Logo from "../components/Logo.jsx";';
        });
      }
      
      // Replace Mountain tags that are specifically used as logos
      content = content.replace(/<Mountain className="h-6 w-6 text-orange-400" \/>/g, '<Logo className="h-6 w-6 text-orange-400" />');
      content = content.replace(/<Mountain className="h-5 w-5 text-orange-400" \/>/g, '<Logo className="h-5 w-5 text-orange-400" />');
      content = content.replace(/<Mountain className="h-8 w-8 text-orange-400" \/>/g, '<Logo className="h-8 w-8 text-orange-400" />');
      
      // Specifically for Landing page which has a larger mountain in a blue circle
      content = content.replace(/<Mountain className="h-7 w-7" \/>/g, '<Logo className="h-7 w-7" />');

      fs.writeFileSync(file, content);
      console.log('Patched Logo in', file);
    }
  }
});
