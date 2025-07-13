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

import { execSync } from 'child_process';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Configuration
const CONFIG = {
  // Main development project
  mainProject: {
    title: "Texas 42 Development Board",
    description: "Main development tracking for Texas 42 Web Game stories and features",
    columns: [
      { name: "📋 Backlog", description: "Planned stories and features" },
      { name: "🚧 In Progress", description: "Currently being worked on" },
      { name: "👀 Review", description: "Ready for code review" },
      { name: "✅ Done", description: "Completed and merged" }
    ]
  },
  
  // E2E fixes project
  e2eProject: {
    title: "E2E Test Fixes",
    description: "Tracking E2E test fixes and improvements",
    columns: [
      { name: "📋 To Fix", description: "E2E tests that need fixing" },
      { name: "🔧 Fixing", description: "Currently being fixed" },
      { name: "✅ Fixed", description: "Tests now passing" }
    ]
  },

  // Rules research project
  rulesProject: {
    title: "Texas 42 Rules Research",
    description: "Research and validation of Texas 42 game rules",
    columns: [
      { name: "📚 Research", description: "Rules to research" },
      { name: "📝 Documenting", description: "Writing documentation" },
      { name: "✅ Complete", description: "Research complete" }
    ]
  }
};

/**
 * Execute shell command and return output
 */
function exec(command, options = {}) {
  try {
    return execSync(command, { 
      encoding: 'utf8', 
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options 
    }).trim();
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

/**
 * Check if GitHub CLI is installed and authenticated
 */
function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...');
  
  try {
    exec('gh --version', { silent: true });
    console.log('✅ GitHub CLI is installed');
  } catch {
    console.error('❌ GitHub CLI is not installed. Please install it first:');
    console.error('   https://cli.github.com/');
    process.exit(1);
  }

  try {
    exec('gh auth status', { silent: true });
    console.log('✅ GitHub CLI is authenticated');
  } catch {
    console.error('❌ GitHub CLI is not authenticated. Please run:');
    console.error('   gh auth login');
    process.exit(1);
  }

  // Check if we're in a git repository
  try {
    exec('git rev-parse --git-dir', { silent: true });
    console.log('✅ In a git repository');
  } catch {
    console.error('❌ Not in a git repository');
    process.exit(1);
  }

  // Check if remote origin exists
  try {
    const remote = exec('git remote get-url origin', { silent: true });
    console.log(`✅ Remote origin: ${remote}`);
  } catch {
    console.error('❌ No remote origin configured');
    process.exit(1);
  }
}

/**
 * Create a GitHub project with specified configuration
 */
function createProject(config) {
  console.log(`\n📋 Creating project: ${config.title}`);
  
  // Create the project
  const createCmd = `gh project create --title "${config.title}" --owner "@me"`;
  const projectUrl = exec(createCmd, { silent: true });
  console.log(`✅ Project created: ${projectUrl}`);
  console.log(`📝 Description: ${config.description}`);
  
  // Extract project number from URL
  const projectNumber = projectUrl.match(/projects\/(\d+)/)?.[1];
  if (!projectNumber) {
    console.error('❌ Could not extract project number from URL');
    return null;
  }

  // Add custom columns (GitHub creates default columns, we'll modify them)
  console.log('📝 Setting up project columns...');
  
  // Note: GitHub CLI doesn't have direct column management yet
  // This would need to be done via the web interface or GraphQL API
  console.log('⚠️  Column setup needs to be done manually in the GitHub web interface');
  console.log(`   Project URL: ${projectUrl}`);
  console.log('   Recommended columns:');
  config.columns.forEach(col => {
    console.log(`   - ${col.name}: ${col.description}`);
  });

  return { projectNumber, projectUrl };
}

/**
 * Parse story files and extract metadata
 */
function parseStoryFiles() {
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
function createIssuesFromStories(stories) {
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
  const stories = parseStoryFiles();
  
  // Create issues from stories
  const issues = createIssuesFromStories(stories);
  
  // Summary
  console.log('\n🎉 Setup Complete!');
  console.log('==================');
  console.log(`✅ Created ${Object.keys(CONFIG).length} projects`);
  console.log(`✅ Created ${issues.length} issues from story files`);
  
  console.log('\n📋 Next Steps:');
  console.log('1. Visit your GitHub repository to see the created projects and issues');
  console.log('2. Manually set up project columns in the web interface');
  console.log('3. Add issues to appropriate project boards');
  console.log('4. Configure project automation rules if desired');
  
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
