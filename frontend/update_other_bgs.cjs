const fs = require('fs');

const files = [
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicAwareness.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicResources.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicSensors.jsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace Backgrounds
    content = content.replace(/bg-\[#f4fbf5\]/g, 'bg-[#f1f5f9]');
    content = content.replace(/bg-\[#fff8f5\]/g, 'bg-[#f1f5f9]');
    
    // Replace Header
    content = content.replace(/bg-\[#07983b\]/g, 'bg-[#002b5e]');
    
    // Replace text-yellow-300 on mountain to text-white
    content = content.replace(/text-yellow-300/g, 'text-white');
    
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
});
