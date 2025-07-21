#!/usr/bin/env node

/**
 * Cross-platform prerequisite checker for Texas 42 project
 * Verifies that all required tools are installed and properly configured
 */

const { REQUIRED_TOOLS } = require('./prereqs/config');
const { checkTool, checkDockerRunning } = require('./prereqs/checkers');

function main() {
  console.log('🔍 Checking prerequisites for Texas 42 development...\n');
  
  let allGood = true;
  const results = [];
  
  // Check required tools
  for (const tool of REQUIRED_TOOLS) {
    const result = checkTool(tool);
    results.push({ tool, result });
    console.log(result.message);
    
    if (!result.success) {
      allGood = false;
      console.log(`   Install from: ${tool.installUrl}`);
    }
  }
  
  // Check if Docker is running
  const dockerResult = checkDockerRunning();
  console.log(dockerResult.message);
  if (!dockerResult.success) {
    allGood = false;
  }
  
  console.log();
  
  if (allGood) {
    console.log('🎉 All prerequisites are satisfied! You\'re ready to develop.');
    process.exit(0);
  } else {
    console.log('❌ Some prerequisites are missing. Please install the required tools and try again.');
    console.log('\nFor detailed setup instructions, see: docs/DEVELOPER.md');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

// Re-export for backward compatibility
const { parseVersion, compareVersions } = require('./prereqs/version-utils');
module.exports = { checkTool, parseVersion, compareVersions };