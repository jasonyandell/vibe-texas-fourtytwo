#!/usr/bin/env node

/**
 * Fix GitHub Projects and Issues Setup
 * This script fixes issues with the initial GitHub setup:
 * 1. Adds missing labels to issues
 * 2. Adds issues to appropriate project boards
 * 3. Ensures projects are properly organized
 */

const { checkPrerequisites } = require('./lib/github-cli');
const {
  getAllIssues,
  categorizeIssue,
  addLabelsToIssue,
  addIssueToProject
} = require('./lib/issue-operations');

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
