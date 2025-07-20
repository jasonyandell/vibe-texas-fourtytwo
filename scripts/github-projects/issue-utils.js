/**
 * Issue filtering and sorting utilities
 */

import { CONFIG } from './core.js';

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

export {
  filterWorkableIssues,
  sortIssuesByPriority,
  getPriorityFromLabels
};