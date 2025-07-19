#!/usr/bin/env node

/**
 * GitHub Project Board Workflow System
 * 
 * This script implements a GitHub project board-based workflow that follows
 * the plan.md implementation pattern. Instead of checking off stories in a
 * markdown file, it works with GitHub project boards to:
 * 
 * 1. Query GitHub project boards for workable issues
 * 2. Follow the plan.md implementation steps for each story/issue
 * 3. Manage PR workflow (merge approved, fix blocking comments, review)
 * 4. Implement stories using TDD approach with task management
 * 
 * Usage:
 *   node scripts/project-board-workflow.js [options]
 * 
 * Options:
 *   --project <number>    GitHub project number to work with (default: 2)
 *   --dry-run            Show what would be done without executing
 *   --help               Show this help message
 * 
 * Prerequisites:
 * - GitHub CLI installed and authenticated (gh auth login)
 * - Repository already exists on GitHub
 * - Run from project root directory
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Configuration
const CONFIG = {
  defaultProject: 2,
  owner: 'jasonyandell',
  repo: 'vibe-texas-fourtytwo',
  workableStatuses: ['Backlog', 'In Progress', 'Todo'],
  priorityLabels: {
    'priority-1-critical': 1,
    'priority-2-high': 2,
    'priority-3-medium': 3,
    'priority-4-low': 4,
    'priority-5-later': 5
  },
  storyLabels: ['story', 'feature', 'enhancement'],
  designDocPath: 'docs/design.md',
  trackerPath: 'docs/story-tracker.md'
};

/**
 * Execute command and return result
 */
function exec(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      cwd: projectRoot,
      ...options
    });
    return { stdout: result.trim(), success: true };
  } catch (error) {
    if (options.silent) {
      return { 
        stdout: '', 
        stderr: error.message, 
        success: false,
        code: error.status || 1 
      };
    }
    throw error;
  }
}

/**
 * Logging utilities
 */
const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  header: (msg) => {
    console.log('\n' + '='.repeat(50));
    console.log(`🚀 ${msg}`);
    console.log('='.repeat(50));
  },
  step: (step, msg) => console.log(`\n${step}. ${msg}`)
};

/**
 * Check if GitHub CLI is installed and authenticated
 */
function checkPrerequisites() {
  log.info('Checking prerequisites...');
  
  const ghVersion = exec('gh --version', { silent: true });
  if (!ghVersion.success) {
    log.error('GitHub CLI is not installed. Please install it first:');
    log.error('   https://cli.github.com/');
    process.exit(1);
  }
  log.success('GitHub CLI is installed');

  const ghAuth = exec('gh auth status', { silent: true });
  if (!ghAuth.success) {
    log.error('GitHub CLI is not authenticated. Please run:');
    log.error('   gh auth login');
    process.exit(1);
  }
  log.success('GitHub CLI is authenticated');

  // Check if we're in the right directory
  if (!existsSync(join(projectRoot, 'docs/design.md'))) {
    log.error('docs/design.md not found. Run from project root.');
    process.exit(1);
  }
  log.success('Project structure validated');
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    project: CONFIG.defaultProject,
    dryRun: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--project':
        options.project = parseInt(args[++i]);
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--help':
        options.help = true;
        break;
      default:
        log.error(`Unknown option: ${args[i]}`);
        options.help = true;
    }
  }

  return options;
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
GitHub Project Board Workflow System

Usage: node scripts/project-board-workflow.js [options]

Options:
  --project <number>    GitHub project number to work with (default: ${CONFIG.defaultProject})
  --dry-run            Show what would be done without executing
  --help               Show this help message

This script follows the plan.md implementation pattern but works with GitHub
project boards instead of markdown checklists.
`);
}

/**
 * Query GitHub project board for issues
 */
async function queryProjectBoard(projectNumber) {
  log.info(`Querying GitHub Project #${projectNumber}...`);

  const result = exec(`gh project item-list ${projectNumber} --owner ${CONFIG.owner} --format json`, { silent: true });
  if (!result.success) {
    log.error(`Failed to query project #${projectNumber}: ${result.stderr}`);
    return [];
  }

  try {
    const projectData = JSON.parse(result.stdout);
    return projectData.items || [];
  } catch (error) {
    log.error(`Failed to parse project data: ${error.message}`);
    return [];
  }
}

/**
 * Filter issues for workable status and story labels
 */
function filterWorkableIssues(issues) {
  return issues.filter(issue => {
    // Must have workable status
    const hasWorkableStatus = CONFIG.workableStatuses.includes(issue.status);

    // Must have story-related labels
    const hasStoryLabel = issue.labels && issue.labels.some(label =>
      CONFIG.storyLabels.includes(label)
    );

    return hasWorkableStatus && hasStoryLabel;
  });
}

/**
 * Sort issues by priority
 */
function sortIssuesByPriority(issues) {
  return issues.map(issue => ({
    ...issue,
    priority: getPriorityFromLabels(issue.labels || [])
  })).sort((a, b) => {
    // Sort by priority first, then by issue number
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return a.number - b.number;
  });
}

/**
 * Get priority number from issue labels
 */
function getPriorityFromLabels(labels) {
  for (const label of labels) {
    if (CONFIG.priorityLabels[label]) {
      return CONFIG.priorityLabels[label];
    }
  }
  return 6; // Default priority for unlabeled issues
}

/**
 * Check for open PRs that need attention
 */
async function checkOpenPRs() {
  log.info('Checking for open PRs...');

  const result = exec('gh pr list --state open --json number,title,reviewDecision,mergeable,author', { silent: true });
  if (!result.success) {
    log.warning('Failed to query PRs');
    return { approved: [], needsReview: [], needsFixes: [] };
  }

  try {
    const prs = JSON.parse(result.stdout);

    const approved = prs.filter(pr => pr.reviewDecision === 'APPROVED' && pr.mergeable === 'MERGEABLE');
    const needsReview = prs.filter(pr => !pr.reviewDecision);
    const needsFixes = prs.filter(pr => pr.reviewDecision === 'CHANGES_REQUESTED');

    return { approved, needsReview, needsFixes };
  } catch (error) {
    log.error(`Failed to parse PR data: ${error.message}`);
    return { approved: [], needsReview: [], needsFixes: [] };
  }
}

/**
 * Generate Augment Code prompt for story implementation
 */
function generateStoryPrompt(issue) {
  return `Implement exactly one GitHub issue following the plan.md workflow pattern.

**Implementation Steps:**
0. Read and understand story-tracker.md to understand the implementation workflow so far
1. Read and understand the GitHub issue #${issue.number}: "${issue.title}"
2. Use task management tools to break down the issue into specific implementation tasks
3. Implement the issue following TDD approach (write tests first, then implementation)
4. Run all existing tests to ensure no regressions
5. Update the story-tracker.md file with a detailed summary of what was implemented along with any implementation notes, design decisions, or plan modifications
6. Create a feature branch, commit changes, and create a PR for the issue

**Issue Details:**
- Issue #${issue.number}: ${issue.title}
- Status: ${issue.status}
- Priority: ${getPriorityFromLabels(issue.labels || [])}
- Labels: ${(issue.labels || []).join(', ')}

**Important Requirements:**
- Implement only THIS issue - do not proceed to other issues automatically
- Follow the consolidated design.md file as the authoritative source for all design decisions
- Use frontend for move validation, backend for all other game computation
- Create comprehensive tests for each implemented feature
- Ensure all tests pass before marking the issue complete
- Ask for permission before installing any new dependencies

**Branch Naming Convention:**
issue-${issue.number}-${issue.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30)}

**Commit Message Format:**
issue: ${issue.title} - fixes #${issue.number}

{detailed description of changes}

- Specific change 1
- Specific change 2
- Addresses issue requirements

Closes #${issue.number}`;
}

export {
  CONFIG,
  exec,
  log,
  checkPrerequisites,
  parseArgs,
  showHelp,
  queryProjectBoard,
  filterWorkableIssues,
  sortIssuesByPriority,
  getPriorityFromLabels,
  checkOpenPRs,
  generateStoryPrompt
};
