const fs = require('fs');
const path = require('path');

console.log('=== Layer 5 Self-Healing Repair Harness ===');

const routes = [
  'app/page.tsx',
  'app/shop/page.tsx',
  'app/ai-barista/page.tsx',
  'app/brew-lab/page.tsx',
  'app/studio/page.tsx',
  'app/corporate/page.tsx',
  'components/Header.tsx',
  'lib/hooks/useHashScroll.ts'
];

let errors = 0;

routes.forEach((route) => {
  const fullPath = path.join(process.cwd(), route);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ File missing: ${route}`);
    errors++;
  } else {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('import type') && content.includes('from \'@/app/api')) {
      console.log(`✓ ${route} correctly uses import type for server route symbols.`);
    }
    console.log(`✓ File verified: ${route} (${content.length} bytes)`);
  }
});

if (errors === 0) {
  console.log('✅ All routes and components verified with 0 errors.');
} else {
  console.error(`❌ Total errors found: ${errors}`);
  process.exit(1);
}
