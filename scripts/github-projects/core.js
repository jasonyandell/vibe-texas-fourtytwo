#!/usr/bin/env node

/**
 * Core execution logic for GitHub Project Board Workflow
 */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

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

// Logging utilities
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

// Parse command line arguments
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

// Show help message
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

export {
  CONFIG,
  log,
  parseArgs,
  showHelp,
  projectRoot
};