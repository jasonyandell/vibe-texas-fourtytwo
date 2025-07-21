/**
 * Story file parsing and issue creation
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { exec } from './utils.js';

/**
 * Parse story files and extract metadata
 */
export function parseStoryFiles(projectRoot) {
  console.log('\n📚 Parsing story files...');
  
  const storiesDir = join(projectRoot, 'stories');
  const storyFiles = readdirSync(storiesDir).filter(file => file.endsWith('.md'));
  
  const stories = [];
  
  for (const file of storyFiles) {
    const filePath = join(storiesDir, file);
    const content = readFileSync(filePath, 'utf8');
    
    // Extract title (first # heading)
    const titleMatch = content.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : file.replace('.md', '');
    
    // Extract overview/description
    const overviewMatch = content.match(/## Overview\s*\n(.*?)(?=\n##|\n$)/s);
    const overview = overviewMatch ? overviewMatch[1].trim() : '';
    
    // Determine story category
    let category = 'main';
    if (file.includes('fix-e2e')) {
      category = 'e2e';
    } else if (file.includes('rules-research')) {
      category = 'rules';
    }
    
    // Determine labels
    const labels = ['story'];
    if (file.includes('fix-e2e')) labels.push('e2e-tests');
    if (file.includes('rules-research')) labels.push('rules');
    if (file.includes('initial-features')) labels.push('core-features');
    
    stories.push({
      file,
      title,
      overview,
      category,
      labels,
      content
    });
  }
  
  console.log(`✅ Found ${stories.length} story files`);
  return stories;
}

/**
 * Create GitHub issues from story files
 */
export function createIssuesFromStories(stories) {
  console.log('\n🎫 Creating GitHub issues from stories...');
  
  const createdIssues = [];
  
  for (const story of stories) {
    console.log(`📝 Creating issue: ${story.title}`);
    
    // Create issue body with reference to story file
    const issueBody = `${story.overview}

## Story File
This issue is based on the story file: \`stories/${story.file}\`

## Implementation
Please follow the detailed requirements in the story file for implementation.

---
*This issue was automatically created from the story file during GitHub migration.*`;

    // Create the issue
    const labelsStr = story.labels.join(',');
    const createCmd = `gh issue create --title "${story.title}" --body "${issueBody}" --label "${labelsStr}"`;
    
    try {
      const issueUrl = exec(createCmd, { silent: true });
      console.log(`✅ Issue created: ${issueUrl}`);
      
      createdIssues.push({
        ...story,
        issueUrl,
        issueNumber: issueUrl.match(/issues\/(\d+)/)?.[1]
      });
    } catch (error) {
      console.error(`❌ Failed to create issue for ${story.title}`);
      console.error(error.message);
    }
  }
  
  return createdIssues;
}