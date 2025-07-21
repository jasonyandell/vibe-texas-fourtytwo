#!/usr/bin/env node

/**
 * Enhance GitHub Issues with Full Story Content
 * 
 * This script has been refactored into modules for better maintainability.
 * See the enhance-github-issues/ directory for the implementation.
 */

const { main } = require('./enhance-github-issues/index');

// Run the script
if (require.main === module) {
  main();
}
