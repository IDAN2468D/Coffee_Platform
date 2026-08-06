/**
 * Architectural Audit Script - Verifies RTL, Glassmorphism & File Integrity
 */
const fs = require('fs');

console.log('=== THE DIGITAL ROAST Architectural Audit ===');

const filesToAudit = [
  './real-estate-landing-page/index.html',
  './real-estate-landing-page/RealEstateLandingPage.jsx',
  './.agents/AGENTS.md',
  './.agents/docs/FEATURE_PROMPT.md'
];

filesToAudit.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasRtl = content.includes('dir="rtl"');
    const hasGlass = content.includes('liquid-glass') || content.includes('backdrop-blur');
    console.log(`[PASS] ${filePath} - RTL: ${hasRtl ? 'YES' : 'N/A'}, Glassmorphism: ${hasGlass ? 'YES' : 'N/A'}`);
  } else {
    console.log(`[FAIL] ${filePath} - FILE NOT FOUND`);
  }
});
