#!/usr/bin/env node

/**
 * Cross-platform prerequisite checker for Texas 42 project
 * Verifies that all required tools are installed and properly configured
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REQUIRED_TOOLS = [
  {
    name: 'Node.js',
    command: 'node --version',
    minVersion: '18.0.0',
    installUrl: 'https://nodejs.org/'
  },
  {
    name: 'npm',
    command: 'npm --version',
    minVersion: '9.0.0',
    installUrl: 'https://nodejs.org/'
  },
  {
    name: 'Docker',
    command: 'docker --version',
    minVersion: '20.0.0',
    installUrl: 'https://www.docker.com/products/docker-desktop'
  },
  {
    name: 'Docker Compose',
    command: 'docker compose version',
    minVersion: '2.0.0',
    installUrl: 'https://docs.docker.com/compose/install/'
  },
  {
    name: 'Git',
    command: 'git --version',
    minVersion: '2.0.0',
    installUrl: 'https://git-scm.com/'
  }
];

function parseVersion(versionString) {
  const match = versionString.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    patch: parseInt(match[3])
  };
}

function compareVersions(version1, version2) {
  const v1 = parseVersion(version1);
  const v2 = parseVersion(version2);
  
  if (!v1 || !v2) return 0;
  
  if (v1.major !== v2.major) return v1.major - v2.major;
  if (v1.minor !== v2.minor) return v1.minor - v2.minor;
  return v1.patch - v2.patch;
}

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

function main() {
  console.log('🔍 Checking prerequisites for Texas 42 development...\n');
  
  let allGood = true;
  const results = [];
  
  // Check required tools
  for (const tool of REQUIRED_TOOLS) {
    const result = checkTool(tool);
    results.push({ tool, result });
    console.log(result.message);
    
    if (!result.success) {
      allGood = false;
      console.log(`   Install from: ${tool.installUrl}`);
    }
  }
  
  // Check if Docker is running
  const dockerResult = checkDockerRunning();
  console.log(dockerResult.message);
  if (!dockerResult.success) {
    allGood = false;
  }
  
  console.log();
  
  if (allGood) {
    console.log('🎉 All prerequisites are satisfied! You\'re ready to develop.');
    process.exit(0);
  } else {
    console.log('❌ Some prerequisites are missing. Please install the required tools and try again.');
    console.log('\nFor detailed setup instructions, see: docs/DEVELOPER.md');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkTool, parseVersion, compareVersions };
