/**
 * GitHub API Client
 * Handles all GitHub operations through the CLI
 */

const { execSync } = require('child_process');
const fs = require('fs');

/**
 * Execute shell command and return output
 */
function exec(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    throw error;
  }
}

/**
 * Get all GitHub issues
 */
function getGitHubIssues(limit = 100) {
  console.log('📋 Fetching GitHub issues...');
  const output = exec(`gh issue list --limit ${limit} --json number,title,body,labels`);
  return JSON.parse(output);
}

/**
 * Update a GitHub issue with enhanced content
 */
function updateGitHubIssue(issueNumber, newBody) {
  console.log(`📝 Updating issue #${issueNumber}...`);
  
  // Escape the body content for shell command
  const tempFile = `temp-issue-${issueNumber}.md`;
  fs.writeFileSync(tempFile, newBody);
  
  try {
    exec(`gh issue edit ${issueNumber} --body-file "${tempFile}"`);
    console.log(`✅ Updated issue #${issueNumber}`);
  } finally {
    // Clean up temp file
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
}

module.exports = {
  getGitHubIssues,
  updateGitHubIssue
};