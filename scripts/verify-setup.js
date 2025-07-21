#!/usr/bin/env node

/**
 * Setup verification script for Texas 42 project
 * Verifies that the scaffold is complete and functional
 */

const { REQUIRED_FILES, REQUIRED_DIRECTORIES, REQUIRED_SCRIPTS } = require('./verify-setup-config');
const { checkFile, checkDirectory, checkPackageJson } = require('./verify-setup-utils');

function verifyFiles(issues) {
  let allGood = true;
  
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
  
  return allGood;
}

function verifyDirectories(issues) {
  let allGood = true;
  
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
  
  return allGood;
}

function verifyPackageJsonStructure(issues) {
  let allGood = true;
  
  console.log('\n📦 Checking package.json...');
  const pkgResult = checkPackageJson(REQUIRED_SCRIPTS);
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
  
  return allGood;
}

function displaySummary(allGood, issues) {
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

function main() {
  console.log('🔍 Verifying Texas 42 project setup...\n');
  
  const issues = [];
  
  // Run all verification checks
  const filesOk = verifyFiles(issues);
  const dirsOk = verifyDirectories(issues);
  const pkgOk = verifyPackageJsonStructure(issues);
  
  // Display summary
  const allGood = filesOk && dirsOk && pkgOk;
  displaySummary(allGood, issues);
}

if (require.main === module) {
  main();
}

// Export for testing purposes
module.exports = { verifyFiles, verifyDirectories, verifyPackageJsonStructure };