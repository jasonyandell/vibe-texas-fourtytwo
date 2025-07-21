#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('Checking for Act warnings in frontend tests...\n');

try {
  // Run tests and capture output
  const output = execSync('npm test 2>&1', {
    encoding: 'utf8',
    cwd: __dirname,
    maxBuffer: 10 * 1024 * 1024 // 10MB buffer
  });

  // Look for Act warnings
  const actWarningPatterns = [
    /Warning.*act\(/gi,
    /An update to .* inside a test was not wrapped in act/gi,
    /wrapped in act\(/gi,
    /console\.error.*act/gi,
    /console\.warn.*act/gi
  ];

  const lines = output.split('\n');
  const warnings = [];

  lines.forEach((line, index) => {
    actWarningPatterns.forEach(pattern => {
      if (pattern.test(line)) {
        // Get context (5 lines before and after)
        const start = Math.max(0, index - 5);
        const end = Math.min(lines.length - 1, index + 5);
        const context = lines.slice(start, end + 1).join('\n');
        warnings.push({
          line: index + 1,
          warning: line,
          context
        });
      }
    });
  });

  if (warnings.length > 0) {
    console.log(`Found ${warnings.length} Act warning(s):\n`);
    warnings.forEach((w, i) => {
      console.log(`Warning ${i + 1} (line ${w.line}):`);
      console.log('---');
      console.log(w.context);
      console.log('---\n');
    });
  } else {
    console.log('No Act warnings found!');
  }

} catch (error) {
  console.error('Error running tests:', error.message);
  process.exit(1);
}