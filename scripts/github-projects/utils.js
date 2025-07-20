/**
 * Utility functions for GitHub Projects setup
 */

import { execSync } from 'child_process';

/**
 * Execute shell command and return output
 */
export function exec(command, options = {}) {
  try {
    return execSync(command, { 
      encoding: 'utf8', 
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options 
    }).trim();
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

/**
 * Check if GitHub CLI is installed and authenticated
 */
export function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...');
  
  try {
    exec('gh --version', { silent: true });
    console.log('✅ GitHub CLI is installed');
  } catch {
    console.error('❌ GitHub CLI is not installed. Please install it first:');
    console.error('   https://cli.github.com/');
    process.exit(1);
  }

  try {
    exec('gh auth status', { silent: true });
    console.log('✅ GitHub CLI is authenticated');
  } catch {
    console.error('❌ GitHub CLI is not authenticated. Please run:');
    console.error('   gh auth login');
    process.exit(1);
  }

  // Check if we're in a git repository
  try {
    exec('git rev-parse --git-dir', { silent: true });
    console.log('✅ In a git repository');
  } catch {
    console.error('❌ Not in a git repository');
    process.exit(1);
  }

  // Check if remote origin exists
  try {
    const remote = exec('git remote get-url origin', { silent: true });
    console.log(`✅ Remote origin: ${remote}`);
  } catch {
    console.error('❌ No remote origin configured');
    process.exit(1);
  }
}