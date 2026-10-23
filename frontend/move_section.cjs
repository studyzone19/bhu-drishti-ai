const fs = require('fs');
const file = 'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/Landing.jsx';
let content = fs.readFileSync(file, 'utf8');

const aiPreviewStart = content.indexOf('{/* AI Risk Assessment Preview */}');
const nextSectionStart = content.indexOf('{/* Current Weather Across Major NER Cities */}');

if (aiPreviewStart !== -1 && nextSectionStart !== -1) {
  const aiSection = content.substring(aiPreviewStart, nextSectionStart);
  
  // Remove it from current position
  content = content.replace(aiSection, '');
  
  // Find where to insert
  const mainStart = content.indexOf('{/* Main 3-Column Content Area */}');
  
  // Insert before Main Area
  if (mainStart !== -1) {
    content = content.substring(0, mainStart) + aiSection + content.substring(mainStart);
    fs.writeFileSync(file, content);
    console.log('Moved AI section successfully.');
  } else {
    console.log('Could not find Main Area to insert.');
  }
} else {
  console.log('Could not find AI section.');
}
