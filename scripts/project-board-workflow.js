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

// Import all modules
import { CONFIG, log, parseArgs, showHelp } from './github-projects/core.js';
import { exec } from './github-projects/command-utils.js';
import { checkPrerequisites } from './github-projects/prerequisites.js';
import { queryProjectBoard } from './github-projects/project-queries.js';
import { checkOpenPRs } from './github-projects/pr-management.js';
import { filterWorkableIssues, sortIssuesByPriority, getPriorityFromLabels } from './github-projects/issue-utils.js';
import { generateStoryPrompt } from './github-projects/prompts.js';

// Main execution function
async function main() {
  const options = parseArgs();
  
  if (options.help) {
    showHelp();
    process.exit(0);
  }

  checkPrerequisites();

  log.header('GitHub Project Board Workflow');
  log.info(`Working with project #${options.project}`);

  // Check for open PRs first
  const prs = await checkOpenPRs();
  
  if (prs.approved.length > 0) {
    log.success(`Found ${prs.approved.length} approved PRs ready to merge`);
    // In a real workflow, we'd handle these
  }

  if (prs.needsFixes.length > 0) {
    log.warning(`Found ${prs.needsFixes.length} PRs needing fixes`);
    // In a real workflow, we'd handle these
  }

  // Query project board
  const allIssues = await queryProjectBoard(options.project);
  const workableIssues = filterWorkableIssues(allIssues);
  const prioritizedIssues = sortIssuesByPriority(workableIssues);

  log.info(`Found ${prioritizedIssues.length} workable issues`);

  if (prioritizedIssues.length > 0) {
    const nextIssue = prioritizedIssues[0];
    log.step(1, `Next issue to work on: #${nextIssue.number} - ${nextIssue.title}`);
    
    if (!options.dryRun) {
      const prompt = generateStoryPrompt(nextIssue);
      console.log('\n' + '='.repeat(50));
      console.log('GENERATED PROMPT:');
      console.log('='.repeat(50));
      console.log(prompt);
    }
  } else {
    log.info('No workable issues found in the project board');
  }
}

// Run main function
main().catch(error => {
  log.error(`Fatal error: ${error.message}`);
  process.exit(1);
});

// Re-export everything for backward compatibility
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