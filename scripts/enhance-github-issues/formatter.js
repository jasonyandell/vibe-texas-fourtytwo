/**
 * Content Formatter
 * Formats story content for GitHub issues
 */

/**
 * Format story content for GitHub issue
 */
function formatStoryForGitHub(storyContent, storyFile, repoOwner, repoName) {
  // Add header linking back to story file
  const header = `> **📖 Story Source:** [\`stories/${storyFile}\`](https://github.com/${repoOwner}/${repoName}/blob/main/stories/${storyFile})
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
 * Check if issue already has enhanced content
 */
function isIssueEnhanced(issueBody) {
  return issueBody && issueBody.includes('📖 Story Source:');
}

module.exports = {
  formatStoryForGitHub,
  isIssueEnhanced
};