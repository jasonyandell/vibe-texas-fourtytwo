/**
 * GitHub Project creation and management
 */

import { exec } from './utils.js';

/**
 * Create a GitHub project with specified configuration
 */
export function createProject(config) {
  console.log(`\n📋 Creating project: ${config.title}`);
  
  // Create the project
  const createCmd = `gh project create --title "${config.title}" --owner "@me"`;
  const projectUrl = exec(createCmd, { silent: true });
  console.log(`✅ Project created: ${projectUrl}`);
  console.log(`📝 Description: ${config.description}`);
  
  // Extract project number from URL
  const projectNumber = projectUrl.match(/projects\/(\d+)/)?.[1];
  if (!projectNumber) {
    console.error('❌ Could not extract project number from URL');
    return null;
  }

  // Add custom columns (GitHub creates default columns, we'll modify them)
  console.log('📝 Setting up project columns...');
  
  // Note: GitHub CLI doesn't have direct column management yet
  // This would need to be done via the web interface or GraphQL API
  console.log('⚠️  Column setup needs to be done manually in the GitHub web interface');
  console.log(`   Project URL: ${projectUrl}`);
  console.log('   Recommended columns:');
  config.columns.forEach(col => {
    console.log(`   - ${col.name}: ${col.description}`);
  });

  return { projectNumber, projectUrl };
}

/**
 * Add issues to appropriate projects
 */
export function addIssuesToProjects(issues, projectMapping) {
  console.log('\n📌 Adding issues to projects...');

  for (const issue of issues) {
    if (!issue.issueNumber) continue;

    const issueUrl = `https://github.com/jasonyandell/vibe-texas-fourtytwo/issues/${issue.issueNumber}`;

    // Add to appropriate projects based on labels
    for (const label of issue.labels) {
      const projectNumber = projectMapping[label];
      if (projectNumber) {
        try {
          const addCmd = `gh project item-add ${projectNumber} --owner jasonyandell --url "${issueUrl}"`;
          exec(addCmd, { silent: true });
          console.log(`✅ Added issue #${issue.issueNumber} to project ${projectNumber}`);
        } catch (error) {
          console.log(`⚠️  Could not add issue #${issue.issueNumber} to project ${projectNumber}`);
        }
      }
    }
  }
}