#!/usr/bin/env node

/**
 * Fix GitHub Projects and Issues Setup
 * This script fixes issues with the initial GitHub setup:
 * 1. Adds missing labels to issues
 * 2. Adds issues to appropriate project boards
 * 3. Ensures projects are properly organized
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

// Project mapping
const PROJECT_MAPPING = {
  'rules': 3, // Texas 42 Rules Research
  'e2e-tests': 2, // E2E Test Fixes  
  'story': 1, // Texas 42 Development Board
  'core-features': 1 // Also goes to main board
};

// Issue categorization based on title patterns
const ISSUE_CATEGORIES = {
  'rules-research': { labels: ['story', 'rules'], project: 3 },
  'fix-e2e': { labels: ['story', 'e2e-tests'], project: 2 },
  'initial-features': { labels: ['story', 'core-features'], project: 1 },
  'github-migration': { labels: ['story'], project: 1 },
  'domino-point-system': { labels: ['story'], project: 1 },
  'default-story': { labels: ['story'], project: 1 }
};

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

/**
 * Process all issues
 */
function processIssues(issues) {
  console.log('\n🔧 Processing issues...');
  
  let processed = 0;
  let labeled = 0;
  let projected = 0;
  
  for (const issue of issues) {
    console.log(`\n📝 Processing issue #${issue.number}: ${issue.title}`);
    
    // Categorize the issue
    const category = categorizeIssue(issue.title);
    
    // Add labels if missing
    const existingLabels = issue.labels.map(l => l.name);
    const missingLabels = category.labels.filter(label => !existingLabels.includes(label));
    
    if (missingLabels.length > 0) {
      if (addLabelsToIssue(issue.number, missingLabels)) {
        labeled++;
      }
    } else {
      console.log(`✅ Issue #${issue.number} already has correct labels`);
    }
    
    // Add to project
    if (addIssueToProject(issue.number, category.project)) {
      projected++;
    }
    
    processed++;
  }
  
  return { processed, labeled, projected };
}

/**
 * Main execution function
 */
async function main() {
  console.log('🔧 GitHub Projects Fix Automation');
  console.log('==================================\n');
  
  // Check prerequisites
  checkPrerequisites();
  
  // Get all issues
  const issues = getAllIssues();
  
  if (issues.length === 0) {
    console.log('❌ No issues found to process');
    return;
  }
  
  // Process issues
  const results = processIssues(issues);
  
  // Summary
  console.log('\n🎉 Fix Complete!');
  console.log('================');
  console.log(`✅ Processed ${results.processed} issues`);
  console.log(`✅ Added labels to ${results.labeled} issues`);
  console.log(`✅ Added ${results.projected} issues to projects`);
  
  console.log('\n📋 Next Steps:');
  console.log('1. Visit GitHub Projects to verify issues are properly organized');
  console.log('2. Set up project columns and automation in the web interface');
  console.log('3. Review issue labels and adjust if needed');
  
  console.log('\n🔗 Project URLs:');
  console.log('   Main Development: https://github.com/users/jasonyandell/projects/1');
  console.log('   E2E Test Fixes: https://github.com/users/jasonyandell/projects/2');
  console.log('   Rules Research: https://github.com/users/jasonyandell/projects/3');
}

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
