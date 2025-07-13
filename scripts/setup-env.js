#!/usr/bin/env node

/**
 * Automatic environment file setup for Texas 42 project
 * Creates .env files from .env.example templates if they don't exist
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ENV_FILES = [
  { example: '.env.example', target: '.env' },
  { example: 'frontend/.env.example', target: 'frontend/.env' },
  { example: 'backend/.env.example', target: 'backend/.env' }
];

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function processEnvContent(content) {
  // Replace placeholder secrets with generated ones
  content = content.replace(/your-jwt-secret-here/g, generateSecret(32));
  content = content.replace(/your-session-secret-here/g, generateSecret(32));
  
  return content;
}

function createEnvFile(examplePath, targetPath) {
  const fullExamplePath = path.resolve(examplePath);
  const fullTargetPath = path.resolve(targetPath);
  
  // Check if example file exists
  if (!fs.existsSync(fullExamplePath)) {
    console.log(`⚠️  Example file not found: ${examplePath}`);
    return false;
  }
  
  // Check if target already exists
  if (fs.existsSync(fullTargetPath)) {
    console.log(`✓ Environment file already exists: ${targetPath}`);
    return true;
  }
  
  try {
    // Read example file
    const exampleContent = fs.readFileSync(fullExamplePath, 'utf8');
    
    // Process content (generate secrets, etc.)
    const processedContent = processEnvContent(exampleContent);
    
    // Ensure target directory exists
    const targetDir = path.dirname(fullTargetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Write target file
    fs.writeFileSync(fullTargetPath, processedContent);
    console.log(`✓ Created environment file: ${targetPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to create ${targetPath}: ${error.message}`);
    return false;
  }
}

function main() {
  console.log('🔧 Setting up environment files...\n');
  
  let allGood = true;
  
  for (const { example, target } of ENV_FILES) {
    const success = createEnvFile(example, target);
    if (!success) {
      allGood = false;
    }
  }
  
  console.log();
  
  if (allGood) {
    console.log('🎉 Environment setup complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Review and customize your .env files as needed');
    console.log('   2. Run `npm start` for full stack development');
    console.log('   3. Or run `npm run develop` for local development with hot-reloading');
  } else {
    console.log('❌ Environment setup encountered issues. Please check the errors above.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { createEnvFile, processEnvContent, generateSecret };
