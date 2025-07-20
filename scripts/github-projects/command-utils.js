/**
 * Command execution utilities
 */

import { execSync } from 'child_process';
import { projectRoot } from './core.js';

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

export { exec };