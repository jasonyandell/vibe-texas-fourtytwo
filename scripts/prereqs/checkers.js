/**
 * Tool checking functions
 */

const { execSync } = require('child_process');
const { parseVersion, compareVersions } = require('./version-utils');

function checkTool(tool) {
  try {
    const output = execSync(tool.command, { encoding: 'utf8', stdio: 'pipe' });
    const version = parseVersion(output);
    
    if (!version) {
      return {
        success: false,
        message: `Could not parse version from: ${output.trim()}`
      };
    }
    
    const versionString = `${version.major}.${version.minor}.${version.patch}`;
    const isVersionOk = compareVersions(versionString, tool.minVersion) >= 0;
    
    return {
      success: isVersionOk,
      version: versionString,
      message: isVersionOk 
        ? `✓ ${tool.name} ${versionString} (>= ${tool.minVersion})`
        : `✗ ${tool.name} ${versionString} is below minimum ${tool.minVersion}`
    };
  } catch (error) {
    return {
      success: false,
      message: `✗ ${tool.name} not found or not working`
    };
  }
}

function checkDockerRunning() {
  try {
    execSync('docker info', { stdio: 'pipe' });
    return { success: true, message: '✓ Docker daemon is running' };
  } catch (error) {
    return { 
      success: false, 
      message: '✗ Docker daemon is not running. Please start Docker Desktop.' 
    };
  }
}

module.exports = { checkTool, checkDockerRunning };