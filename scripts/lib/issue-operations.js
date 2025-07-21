const { exec } = require('./github-cli');
const { ISSUE_CATEGORIES } = require('./issue-config');

/**
 * Get all issues from the repository
 */
function getAllIssues() {
  console.log('\n📋 Fetching all issues...');

  const result = exec('gh issue list --repo jasonyandell/vibe-texas-fourtytwo --json number,title,labels --limit 100', { silent: true });
  if (result.code !== 0) {
    console.error('❌ Failed to fetch issues:', result.stderr);
    return [];
  }

  try {
    const issues = JSON.parse(result.stdout);
    console.log(`✅ Found ${issues.length} issues`);
    return issues;
  } catch (error) {
    console.error('❌ Failed to parse issues JSON:', error.message);
    return [];
  }
}

/**
 * Categorize issue based on title
 */
function categorizeIssue(title) {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('rules research') || titleLower.includes('research story')) {
    return ISSUE_CATEGORIES['rules-research'];
  }
  if (titleLower.includes('fix') && titleLower.includes('e2e')) {
    return ISSUE_CATEGORIES['fix-e2e'];
  }
  if (titleLower.includes('initial features') || titleLower.includes('core domino')) {
    return ISSUE_CATEGORIES['initial-features'];
  }
  if (titleLower.includes('github') && titleLower.includes('migration')) {
    return ISSUE_CATEGORIES['github-migration'];
  }
  if (titleLower.includes('domino point system')) {
    return ISSUE_CATEGORIES['domino-point-system'];
  }
  
  return ISSUE_CATEGORIES['default-story'];
}

/**
 * Add labels to an issue
 */
function addLabelsToIssue(issueNumber, labels) {
  const labelsStr = labels.join(',');
  const cmd = `gh issue edit ${issueNumber} --repo jasonyandell/vibe-texas-fourtytwo --add-label "${labelsStr}"`;
  const result = exec(cmd, { silent: true });

  if (result.code === 0) {
    console.log(`✅ Added labels [${labelsStr}] to issue #${issueNumber}`);
    return true;
  } else {
    console.log(`⚠️  Failed to add labels to issue #${issueNumber}: ${result.stderr}`);
    return false;
  }
}

/**
 * Add issue to project
 */
function addIssueToProject(issueNumber, projectNumber) {
  const issueUrl = `https://github.com/jasonyandell/vibe-texas-fourtytwo/issues/${issueNumber}`;
  const cmd = `gh project item-add ${projectNumber} --owner jasonyandell --url "${issueUrl}"`;
  const result = exec(cmd, { silent: true });

  if (result.code === 0) {
    console.log(`✅ Added issue #${issueNumber} to project ${projectNumber}`);
    return true;
  } else {
    console.log(`⚠️  Failed to add issue #${issueNumber} to project ${projectNumber}: ${result.stderr}`);
    return false;
  }
}

module.exports = {
  getAllIssues,
  categorizeIssue,
  addLabelsToIssue,
  addIssueToProject
};