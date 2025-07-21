#!/usr/bin/env node

/**
 * Enhance GitHub Issues with Full Story Content
 * 
 * This script updates existing GitHub issues to include complete story content
 * from the corresponding markdown files in the stories/ directory.
 * 
 * Features:
 * - Updates issue descriptions with full story content
 * - Preserves existing issue metadata (labels, assignees, etc.)
 * - Adds proper formatting for GitHub markdown
 * - Links back to original story files
 * - Handles all story types (main stories, rules research, E2E fixes)
 */

const config = require('./config');
const { getGitHubIssues, updateGitHubIssue } = require('./github-client');
const { findStoryFile, getStoryContent } = require('./story-manager');
const { formatStoryForGitHub, isIssueEnhanced } = require('./formatter');

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting GitHub Issues Enhancement...\n');
  
  try {
    // Get all GitHub issues
    const issues = getGitHubIssues(config.GITHUB_ISSUE_LIMIT);
    console.log(`📊 Found ${issues.length} GitHub issues\n`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const issue of issues) {
      console.log(`\n🔍 Processing: #${issue.number} - ${issue.title}`);
      
      // Check if issue already has enhanced content
      if (isIssueEnhanced(issue.body)) {
        console.log(`✅ Issue already enhanced, skipping`);
        skippedCount++;
        continue;
      }
      
      // Find matching story file
      const storyFile = findStoryFile(config.STORIES_DIR, issue.title);
      if (!storyFile) {
        console.log(`⚠️  No matching story file found for: ${issue.title}`);
        skippedCount++;
        continue;
      }
      
      console.log(`📄 Found story file: ${storyFile}`);
      
      // Get story content
      const storyContent = getStoryContent(config.STORIES_DIR, storyFile);
      if (!storyContent) {
        console.log(`❌ Could not read story file: ${storyFile}`);
        skippedCount++;
        continue;
      }
      
      // Format content for GitHub
      const enhancedBody = formatStoryForGitHub(
        storyContent, 
        storyFile, 
        config.REPO_OWNER, 
        config.REPO_NAME
      );
      
      // Update the issue
      updateGitHubIssue(issue.number, enhancedBody);
      updatedCount++;
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, config.RATE_LIMIT_DELAY));
    }
    
    console.log(`\n🎉 Enhancement Complete!`);
    console.log(`✅ Updated: ${updatedCount} issues`);
    console.log(`⚠️  Skipped: ${skippedCount} issues`);
    
  } catch (error) {
    console.error('\n❌ Error during enhancement:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };