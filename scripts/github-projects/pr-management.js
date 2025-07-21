/**
 * Pull Request management functions
 */

import { exec } from './command-utils.js';
import { log } from './core.js';

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

export { checkOpenPRs };