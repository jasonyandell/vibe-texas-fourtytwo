/**
 * Prompt generation for story implementation
 */

import { getPriorityFromLabels } from './issue-utils.js';

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

export { generateStoryPrompt };