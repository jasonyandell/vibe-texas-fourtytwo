/**
 * Configuration for Texas 42 project setup verification
 * Defines required files and directories
 */

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

const REQUIRED_SCRIPTS = [
  'start', 
  'develop', 
  'tdd', 
  'check-prereqs', 
  'setup-env'
];

module.exports = {
  REQUIRED_FILES,
  REQUIRED_DIRECTORIES,
  REQUIRED_SCRIPTS
};