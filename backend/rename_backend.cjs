const fs = require('fs');
const path = require('path');

const directoryPath = 'h:/SIH/landguard-ai/landguard-ai/backend';

function processFiles(dir) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      // Skip node_modules and .git
      if (file === 'node_modules' || file === '.git' || file === 'uploads') return;
      
      if (fs.statSync(fullPath).isDirectory()) {
        processFiles(fullPath);
      } else if (fullPath.endsWith('.js') || fullPath.endsWith('.md')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let newContent = content.replace(/LANDGUARD AI/g, 'Bhu-Drishti');
        newContent = newContent.replace(/LANDGUARD/g, 'Bhu-Drishti');
        newContent = newContent.replace(/Landguard/g, 'Bhu-Drishti');
        newContent = newContent.replace(/landguard/g, 'Bhu-Drishti');
        if (content !== newContent) {
          fs.writeFileSync(fullPath, newContent);
          console.log(`Updated ${fullPath}`);
        }
      }
    });
  }
}

processFiles(directoryPath);
