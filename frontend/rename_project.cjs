const fs = require('fs');
const path = require('path');

const directoryPath = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages';
const componentsPath = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/components';
const appJsx = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/App.jsx';

function processFiles(dir) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        processFiles(fullPath);
      } else if (fullPath.endsWith('.jsx')) {
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
processFiles(componentsPath);
if (fs.existsSync(appJsx)) {
    let content = fs.readFileSync(appJsx, 'utf8');
    let newContent = content.replace(/LANDGUARD AI/g, 'Bhu-Drishti');
    if (content !== newContent) {
      fs.writeFileSync(appJsx, newContent);
      console.log(`Updated ${appJsx}`);
    }
}
