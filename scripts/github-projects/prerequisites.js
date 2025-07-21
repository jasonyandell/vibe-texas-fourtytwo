/**
 * Prerequisites checking module
 */

import { existsSync } from 'fs';
import { join } from 'path';
import { exec } from './command-utils.js';
import { log, projectRoot } from './core.js';

/**
 * Check if GitHub CLI is installed and authenticated
 */
function checkPrerequisites() {
  log.info('Checking prerequisites...');
  
  const ghVersion = exec('gh --version', { silent: true });
  if (!ghVersion.success) {
    log.error('GitHub CLI is not installed. Please install it first:');
    log.error('   https://cli.github.com/');
    process.exit(1);
  }
  log.success('GitHub CLI is installed');

  const ghAuth = exec('gh auth status', { silent: true });
  if (!ghAuth.success) {
    log.error('GitHub CLI is not authenticated. Please run:');
    log.error('   gh auth login');
    process.exit(1);
  }
  log.success('GitHub CLI is authenticated');

  // Check if we're in the right directory
  if (!existsSync(join(projectRoot, 'docs/design.md'))) {
    log.error('docs/design.md not found. Run from project root.');
    process.exit(1);
  }
  log.success('Project structure validated');
}

export { checkPrerequisites };