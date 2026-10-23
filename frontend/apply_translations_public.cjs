const fs = require('fs');

// Apply useLanguage to all public pages
const publicPages = [
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicAlerts.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicAwareness.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicSensors.jsx',
  'h:/SIH/landguard-ai/landguard-ai/frontend/src/pages/PublicResources.jsx',
];

publicPages.forEach(file => {
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf8');

  // Add imports if not present
  if (!c.includes('useLanguage')) {
    c = c.replace(
      /import {([^}]+)} from "lucide-react";/,
      match => match + '\nimport { useLanguage } from "../context/LanguageContext.jsx";\nimport translations from "../translations.js";'
    );
  }

  // Add hook call right after the function declaration
  const fnMatch = c.match(/export default function \w+\(\) \{/);
  if (fnMatch && !c.includes('const { lang, toggle }')) {
    c = c.replace(fnMatch[0], fnMatch[0] + '\n  const { lang, toggle } = useLanguage();\n  const t = translations[lang];');
  }

  // Common header translations across public pages
  c = c.replace(/Early Warning \& Landslide Risk Monitoring System/g, '{t.tagline}');
  c = c.replace(/>Authority Login</g, '>{t.authorityLogin}<');
  c = c.replace(/>Home</g, '>{t.home}<');
  c = c.replace(/>Risk Map</g, '>{t.riskMap}<');
  c = c.replace(/>Warnings</g, '>{t.warnings}<');
  c = c.replace(/>Live Sensor Data</g, '>{t.liveSensorData}<');
  c = c.replace(/>Report Incident</g, '>{t.reportIncident}<');

  fs.writeFileSync(file, c);
  console.log('Patched', file);
});
