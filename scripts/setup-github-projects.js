#!/usr/bin/env node

/**
 * GitHub Projects Setup Automation
 * 
 * This script automates the creation of GitHub Projects and populates them
 * with issues converted from the stories/ directory.
 * 
 * Prerequisites:
 * - GitHub CLI installed and authenticated (gh auth login)
 * - Repository already exists on GitHub
 * - Run from project root directory
 * 
 * Usage:
 *   node scripts/setup-github-projects.js
 */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CONFIG, projectMapping } from './github-projects/config.js';
import { checkPrerequisites } from './github-projects/utils.js';
import { createProject, addIssuesToProjects } from './github-projects/project-manager.js';
import { parseStoryFiles, createIssuesFromStories } from './github-projects/story-parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 GitHub Projects Setup Automation');
  console.log('=====================================\n');

  // Check prerequisites
  checkPrerequisites();

  // Create projects
  console.log('\n📋 Creating GitHub Projects...');

  const mainProject = createProject(CONFIG.mainProject);
  const e2eProject = createProject(CONFIG.e2eProject);
  const rulesProject = createProject(CONFIG.rulesProject);

  // Parse story files
  const stories = parseStoryFiles(projectRoot);

  // Create issues from stories
  const issues = createIssuesFromStories(stories);

  // Add issues to projects
  addIssuesToProjects(issues, projectMapping);

  // Summary
  console.log('\n🎉 Setup Complete!');
  console.log('==================');
  console.log(`✅ Created ${Object.keys(CONFIG).length} projects`);
  console.log(`✅ Created ${issues.length} issues from story files`);
  console.log(`✅ Added issues to appropriate project boards`);

  console.log('\n📋 Next Steps:');
  console.log('1. Visit your GitHub repository to see the created projects and issues');
  console.log('2. Manually set up project columns in the web interface');
  console.log('3. Configure project automation rules if desired');

  if (mainProject) {
    console.log(`\n🔗 Main Project: ${mainProject.projectUrl}`);
  }

  console.log('\n💡 Tip: You can also use the GitHub web interface to:');
  console.log('   - Drag issues between project columns');
  console.log('   - Set up automation rules');
  console.log('   - Customize project views and filters');
}

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});