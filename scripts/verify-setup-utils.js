/**
 * Utility functions for setup verification
 * File system checks and validation helpers
 */

const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
  const fullPath = path.resolve(filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    const stats = fs.statSync(fullPath);
    const isEmpty = stats.size === 0;
    return { exists: true, isEmpty };
  }
  
  return { exists: false, isEmpty: false };
}

function checkDirectory(dirPath) {
  const fullPath = path.resolve(dirPath);
  return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
}

function checkPackageJson(requiredScripts) {
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const missingScripts = requiredScripts.filter(script => !pkg.scripts[script]);
    return { valid: true, missingScripts };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

module.exports = {
  checkFile,
  checkDirectory,
  checkPackageJson
};