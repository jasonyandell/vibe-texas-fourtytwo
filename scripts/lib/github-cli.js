const { execSync } = require('child_process');

/**
 * Execute command and return result
 */
function exec(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    return { stdout: result, code: 0 };
  } catch (error) {
    if (options.silent) {
      return { stdout: '', stderr: error.message, code: error.status || 1 };
    }
    throw error;
  }
}

/**
 * Check prerequisites
 */
function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...');

  const ghVersion = exec('gh --version', { silent: true });
  if (ghVersion.code !== 0) {
    console.error('❌ GitHub CLI is not installed');
    process.exit(1);
  }
  console.log('✅ GitHub CLI is installed');

  const ghAuth = exec('gh auth status', { silent: true });
  if (ghAuth.code !== 0) {
    console.error('❌ GitHub CLI is not authenticated');
    process.exit(1);
  }
  console.log('✅ GitHub CLI is authenticated');
}

module.exports = {
  exec,
  checkPrerequisites
};