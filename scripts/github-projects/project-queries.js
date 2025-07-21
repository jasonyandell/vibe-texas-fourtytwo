/**
 * GitHub Project Board query operations
 */

import { exec } from './command-utils.js';
import { CONFIG, log } from './core.js';

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

export { queryProjectBoard };