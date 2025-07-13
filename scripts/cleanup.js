#!/usr/bin/env node

/**
 * Cleanup script for Texas 42 project
 * Removes build artifacts, logs, and temporary files
 */

const fs = require('fs');
const path = require('path');

const CLEANUP_PATHS = [
  'node_modules/.cache',
  'frontend/node_modules/.cache',
  'backend/node_modules/.cache',
  'frontend/dist',
  'backend/dist',
  'frontend/coverage',
  'backend/coverage',
  'frontend/test-results',
  'frontend/playwright-report',
  'frontend/playwright/.cache',
  'backend/logs',
  '.env',
  'frontend/.env',
  'backend/.env'
];

function removeDirectory(dirPath) {
  const fullPath = path.resolve(dirPath);
  
  if (!fs.existsSync(fullPath)) {
    return false;
  }
  
  try {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`✓ Removed: ${dirPath}`);
    return true;
  } catch (error) {
    console.log(`⚠️  Could not remove ${dirPath}: ${error.message}`);
    return false;
  }
}

function main() {
  console.log('🧹 Cleaning up Texas 42 project...\n');
  
  let removedCount = 0;
  let totalCount = 0;
  
  for (const cleanupPath of CLEANUP_PATHS) {
    totalCount++;
    if (removeDirectory(cleanupPath)) {
      removedCount++;
    }
  }
  
  console.log();
  console.log(`🎉 Cleanup complete! Removed ${removedCount}/${totalCount} items.`);
  console.log('\n📝 Note: You may need to run `npm install` and `npm run setup-env` after cleanup.');
}

if (require.main === module) {
  main();
}

module.exports = { removeDirectory };
