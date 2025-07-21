/**
 * Story File Manager
 * Handles story file operations and matching
 */

const fs = require('fs');
const path = require('path');

/**
 * Get story file content
 */
function getStoryContent(storiesDir, storyFile) {
  const filePath = path.join(storiesDir, storyFile);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  Story file not found: ${filePath}`);
    return null;
  }
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Find matching story file for an issue
 */
function findStoryFile(storiesDir, issueTitle) {
  const storyFiles = fs.readdirSync(storiesDir).filter(file => file.endsWith('.md'));
  
  // Try exact title match first
  for (const file of storyFiles) {
    const content = getStoryContent(storiesDir, file);
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

module.exports = {
  getStoryContent,
  findStoryFile
};