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

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const STORIES_DIR = 'stories';
const REPO_OWNER = 'jasonyandell';
const REPO_NAME = 'vibe-texas-fourtytwo';

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
function getGitHubIssues() {
  console.log('📋 Fetching GitHub issues...');
  const output = exec('gh issue list --limit 100 --json number,title,body,labels');
  return JSON.parse(output);
}

/**
 * Get story file content
 */
function getStoryContent(storyFile) {
  const filePath = path.join(STORIES_DIR, storyFile);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Story file not found: ${filePath}`);
    return null;
  }
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Find matching story file for an issue
 */
function findStoryFile(issueTitle) {
  const storyFiles = fs.readdirSync(STORIES_DIR).filter(file => file.endsWith('.md'));
  
  // Try exact title match first
  for (const file of storyFiles) {
    const content = getStoryContent(file);
    if (content && content.includes(`# ${issueTitle}`)) {
      return file;
    }
  }
  
  // Try partial title match
  const normalizedTitle = issueTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  for (const file of storyFiles) {
    const fileName = file.replace('.md', '').toLowerCase().replace(/[-_]/g, ' ');
    if (normalizedTitle.includes(fileName) || fileName.includes(normalizedTitle)) {
      return file;
    }
  }
  
  return null;
}

/**
 * Format story content for GitHub issue
 */
function formatStoryForGitHub(storyContent, storyFile) {
  // Add header linking back to story file
  const header = `> **📖 Story Source:** [\`stories/${storyFile}\`](https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/main/stories/${storyFile})
> 
> This issue was automatically generated from the story file. Please refer to the source file for the most up-to-date information.

---

`;
  
  // Clean up the story content for GitHub
  let formatted = storyContent
    // Remove any existing GitHub issue references
    .replace(/> \*\*📖 Story Source:.*?\n---\n\n/s, '')
    // Ensure proper spacing around headers
    .replace(/^(#{1,6})\s*/gm, '$1 ')
    // Clean up any extra whitespace
    .replace(/\n{3,}/g, '\n\n');
  
  return header + formatted;
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

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting GitHub Issues Enhancement...\n');
  
  try {
    // Get all GitHub issues
    const issues = getGitHubIssues();
    console.log(`📊 Found ${issues.length} GitHub issues\n`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const issue of issues) {
      console.log(`\n🔍 Processing: #${issue.number} - ${issue.title}`);
      
      // Find matching story file
      const storyFile = findStoryFile(issue.title);
      if (!storyFile) {
        console.log(`⚠️  No matching story file found for: ${issue.title}`);
        skippedCount++;
        continue;
      }
      
      console.log(`📄 Found story file: ${storyFile}`);
      
      // Get story content
      const storyContent = getStoryContent(storyFile);
      if (!storyContent) {
        console.log(`❌ Could not read story file: ${storyFile}`);
        skippedCount++;
        continue;
      }
      
      // Check if issue already has enhanced content
      if (issue.body && issue.body.includes('📖 Story Source:')) {
        console.log(`✅ Issue already enhanced, skipping`);
        skippedCount++;
        continue;
      }
      
      // Format content for GitHub
      const enhancedBody = formatStoryForGitHub(storyContent, storyFile);
      
      // Update the issue
      updateGitHubIssue(issue.number, enhancedBody);
      updatedCount++;
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
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
