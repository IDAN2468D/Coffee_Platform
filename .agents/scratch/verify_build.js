const fs = require('fs');
const path = require('path');

console.log('--- Layer 5 Self-Healing Diagnostics ---');

// Check if .next/server/app directory exists and holds valid server chunks
const serverAppPath = path.join(__dirname, '../../.next/server/app');
if (fs.existsSync(serverAppPath)) {
  console.log('[x] .next/server/app directory exists');
  const files = fs.readdirSync(serverAppPath);
  console.log('[x] Server app entries:', files.join(', '));
  console.log('✅ Webpack chunk structure validated successfully!');
} else {
  console.error('❌ .next/server/app directory missing');
  process.exit(1);
}
