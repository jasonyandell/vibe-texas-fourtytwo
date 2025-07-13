#!/usr/bin/env node

/**
 * Setup verification script for Texas 42 project
 * Verifies that the scaffold is complete and functional
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  // Root files
  'package.json',
  'tsconfig.json',
  '.env.example',
  '.gitignore',
  'README.md',
  'docker-compose.yml',
  'docker-compose.db.yml',
  
  // Frontend files
  'frontend/package.json',
  'frontend/tsconfig.json',
  'frontend/tsconfig.node.json',
  'frontend/vite.config.ts',
  'frontend/playwright.config.ts',
  'frontend/.env.example',
  'frontend/index.html',
  'frontend/src/main.tsx',
  'frontend/src/App.tsx',
  'frontend/src/App.css',
  'frontend/src/index.css',
  'frontend/Dockerfile',
  'frontend/nginx.conf',
  
  // Backend files
  'backend/package.json',
  'backend/tsconfig.json',
  'backend/vitest.config.ts',
  'backend/.env.example',
  'backend/src/index.ts',
  'backend/Dockerfile',
  
  // Scripts
  'scripts/check-prereqs.js',
  'scripts/setup-env.js',
  'scripts/cleanup.js',
  
  // Documentation
  'docs/DEVELOPER.md',
  'docs/DEBUGGING.md',
  
  // Database
  'backend/sql/init/01-create-tables.sql',
];

const REQUIRED_DIRECTORIES = [
  'frontend/src/components',
  'frontend/src/game',
  'frontend/src/types',
  'frontend/src/utils',
  'frontend/src/test',
  'frontend/tests/e2e',
  'backend/src/api',
  'backend/src/game',
  'backend/src/types',
  'backend/src/utils',
  'backend/src/test',
  'backend/sql/init',
  'backend/sql/dev-data',
  'scripts',
  'docs',
  'nginx',
];

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

function checkPackageJson() {
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredScripts = [
      'start', 'develop', 'tdd', 'check-prereqs', 'setup-env'
    ];
    
    const missingScripts = requiredScripts.filter(script => !pkg.scripts[script]);
    return { valid: true, missingScripts };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

function main() {
  console.log('🔍 Verifying Texas 42 project setup...\n');
  
  let allGood = true;
  const issues = [];
  
  // Check required files
  console.log('📁 Checking required files...');
  for (const file of REQUIRED_FILES) {
    const result = checkFile(file);
    if (!result.exists) {
      console.log(`❌ Missing: ${file}`);
      issues.push(`Missing file: ${file}`);
      allGood = false;
    } else if (result.isEmpty) {
      console.log(`⚠️  Empty: ${file}`);
      issues.push(`Empty file: ${file}`);
    } else {
      console.log(`✅ Found: ${file}`);
    }
  }
  
  // Check required directories
  console.log('\n📂 Checking required directories...');
  for (const dir of REQUIRED_DIRECTORIES) {
    if (!checkDirectory(dir)) {
      console.log(`❌ Missing directory: ${dir}`);
      issues.push(`Missing directory: ${dir}`);
      allGood = false;
    } else {
      console.log(`✅ Found: ${dir}`);
    }
  }
  
  // Check package.json structure
  console.log('\n📦 Checking package.json...');
  const pkgResult = checkPackageJson();
  if (!pkgResult.valid) {
    console.log(`❌ Invalid package.json: ${pkgResult.error}`);
    issues.push(`Invalid package.json: ${pkgResult.error}`);
    allGood = false;
  } else if (pkgResult.missingScripts.length > 0) {
    console.log(`❌ Missing scripts: ${pkgResult.missingScripts.join(', ')}`);
    issues.push(`Missing scripts: ${pkgResult.missingScripts.join(', ')}`);
    allGood = false;
  } else {
    console.log('✅ Package.json structure is valid');
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  
  if (allGood) {
    console.log('🎉 Setup verification PASSED!');
    console.log('\n✅ All required files and directories are present');
    console.log('✅ Package.json structure is correct');
    console.log('\n🚀 Next steps:');
    console.log('   1. Run `npm install` to install dependencies');
    console.log('   2. Run `npm run check-prereqs` to verify system requirements');
    console.log('   3. Run `npm run setup-env` to create environment files');
    console.log('   4. Run `npm run develop` to start development');
    process.exit(0);
  } else {
    console.log('❌ Setup verification FAILED!');
    console.log(`\n${issues.length} issues found:`);
    issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
    console.log('\n🔧 Please fix these issues and run verification again.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkFile, checkDirectory, checkPackageJson };
