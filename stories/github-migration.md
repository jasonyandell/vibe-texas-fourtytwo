# Story: GitHub Repository Migration and Collaboration Setup

## Overview
Migrate the Texas 42 Web Game project from local git repository to GitHub with proper collaboration features, project management tools, and team workflow setup. This story focuses on preserving git history while establishing a professional development environment for team collaboration.

## User Story
**As a** development team  
**I want** to migrate our Texas 42 project to GitHub with proper collaboration features  
**So that** we can work together effectively, track progress, and maintain code quality through established workflows

## Acceptance Criteria

### ✅ Repository Creation and Setup
- [ ] GitHub repository created with appropriate name and description
- [ ] Repository configured with proper visibility (public/private decision made)
- [ ] Repository topics/tags added for discoverability
- [ ] Basic repository settings configured (Issues, Projects, Wiki enabled)

### ✅ Code Migration with History Preservation
- [ ] Local git repository successfully pushed to GitHub
- [ ] All commit history preserved (8+ commits from local development)
- [ ] All branches migrated (main branch and any feature branches)
- [ ] Remote origin configured correctly

### ✅ GitHub Features Configuration
- [ ] GitHub Issues enabled and configured
- [ ] GitHub Projects board created with appropriate columns
- [ ] Issue templates created for stories, bugs, and feature requests
- [ ] Branch protection rules configured for main branch
- [ ] Repository permissions set for team members

### ✅ Documentation Updates
- [ ] README.md updated with correct GitHub clone URL
- [ ] GitHub badges added to README.md
- [ ] CONTRIBUTING.md created with development workflow
- [ ] LICENSE file added to repository
- [ ] All documentation references updated for GitHub environment

### ✅ Team Collaboration Setup
- [ ] Team members invited to repository with appropriate permissions
- [ ] Initial GitHub Issues created from existing stories
- [ ] Project board populated with current development status
- [ ] Development workflow documented and shared with team

## Technical Requirements

### Repository Configuration
**MANUAL TASK:** COMPLETED. Create GitHub repository with these specifications:

**Repository Name:** `vibe-texas-fourtytwo`

**Repository Description:**
```
🎲 Authentic Texas 42 domino game for the web. Built with React, TypeScript, Fastify, and PostgreSQL. Features real-time multiplayer, traditional bidding, and responsive design.
```

**Repository Settings:**
- **Visibility:** `public`
  - **DECISION POINT:** Choose public (open source) or private (team only)
- **Features:** Enable Issues, Projects, Wiki
- **Topics:** `texas-42`, `domino-game`, `typescript`, `react`, `fastify`, `postgresql`, `websockets`, `multiplayer`, `game-development`, `tdd`

### Migration Commands
**MANUAL TASK:** Execute these commands in sequence:

```bash
# 1. Navigate to project root
cd c:\code\augment\fourtytwo

# 2. Verify current git status
git status
git log --oneline -5

# 3. Add GitHub remote
git remote add origin https://github.com/jasonyandell/vibe-texas-fourtytwo.git

# 4. Verify remote configuration
git remote -v

# 5. Push main branch with history
git push -u origin main

# 6. Push any additional branches
git branch -a
# If other branches exist, push them:
# git push origin [branch-name]
```

### Branch Protection Configuration
**MANUAL TASK:** Configure branch protection in GitHub Settings → Branches:

**Protection Rules for `main` branch:**
- [ ] ✅ Require a pull request before merging
- [ ] ✅ Require approvals: 1 minimum
- [ ] ✅ Dismiss stale PR approvals when new commits are pushed
- [ ] ✅ Require conversation resolution before merging
- [ ] ✅ Include administrators in restrictions
- [ ] ⏸️ Require status checks (defer to CI/CD story)

### GitHub Projects Setup
**AUTOMATED OPTION:** Use the provided automation scripts:

```bash
# Option A: Automated setup (recommended)
# Install GitHub CLI first: https://cli.github.com/
gh auth login
npm run setup:github-projects

# Option B: Manual script execution
# Windows PowerShell:
.\scripts\setup-github-projects.ps1

# macOS/Linux:
chmod +x scripts/setup-github-projects.sh
./scripts/setup-github-projects.sh

# Option C: Node.js script:
node scripts/setup-github-projects.js
```

**MANUAL TASK (if not using automation):** Create project boards with these specifications:

**Projects to Create:**
1. **"Texas 42 Development Board"** - Main development tracking
   - Columns: 📋 Backlog, 🚧 In Progress, 👀 Review, ✅ Done
2. **"E2E Test Fixes"** - E2E test improvements
   - Columns: 📋 To Fix, 🔧 Fixing, ✅ Fixed
3. **"Texas 42 Rules Research"** - Rules research and validation
   - Columns: 📚 Research, 📝 Documenting, ✅ Complete

**Automation Benefits:**
- ✅ Creates 3 organized project boards automatically
- ✅ Converts all `stories/*.md` files to GitHub Issues
- ✅ Applies appropriate labels (story, bug, rules, e2e-tests)
- ✅ Links issues back to original story files
- ✅ Saves 2-3 hours of manual setup time

## Implementation Steps

### Step 1: Repository Creation
**MANUAL TASK:** 
1. Go to GitHub.com and sign in
2. Click "New repository" or go to https://github.com/new
3. Fill in repository details using specifications above
4. **DO NOT** initialize with README, .gitignore, or license (we have these)
5. Click "Create repository"

### Step 2: Local Repository Migration ⬅️ **CURRENT STEP**
Execute migration commands listed in Technical Requirements section.

### Step 3: Documentation Updates
**MANUAL TASK:** Update documentation files:

1. **Update README.md clone URL:**
   - Find line: `git clone <repository-url>`
   - Replace with: `git clone https://github.com/jasonyandell/vibe-texas-fourtytwo.git`
   - Update directory name: `cd vibe-texas-fourtytwo`

2. **Add GitHub badges to README.md** (insert after title):
   ```markdown
   [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
   [![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
   [![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue)](https://www.typescriptlang.org/)
   ```

3. **Commit and push documentation updates:**
   ```bash
   git add README.md CONTRIBUTING.md LICENSE
   git commit -m "docs: update documentation for GitHub migration"
   git push origin main
   ```

### Step 4: GitHub Features Configuration
**MANUAL TASK:** Configure GitHub features:

1. **Enable Repository Features:**
   - Go to Settings → General → Features
   - Enable: Issues, Projects, Wiki
   - Disable: Packages, Environments (for now)

2. **Create Issue Templates:**
   - Go to Settings → General → Features → Issues → Set up templates
   - Create templates for: Story, Bug Report, Feature Request

3. **Set up Project Board:**
   - Go to Projects tab → New project → Board
   - Configure columns as specified above

### Step 5: Team Collaboration Setup
**MANUAL TASK:** Set up team collaboration:

1. **Invite Team Members:**
   - Go to Settings → Manage access → Invite a collaborator
   - **ACTION REQUIRED:** Add team member GitHub usernames:
     - `[PLACEHOLDER: TEAM_MEMBER_1_USERNAME]`
     - `[PLACEHOLDER: TEAM_MEMBER_2_USERNAME]`
     - `[PLACEHOLDER: TEAM_MEMBER_3_USERNAME]`

2. **Create Initial Issues:**
   - Convert stories from `stories/` directory to GitHub Issues
   - Use appropriate labels and assign to project board
   - Link related issues where applicable

## Definition of Done
- [ ] GitHub repository accessible at correct URL
- [ ] All local git history preserved in GitHub repository
- [ ] Team members can clone and contribute to repository
- [ ] Branch protection prevents direct pushes to main
- [ ] Project board shows current development status
- [ ] Documentation accurately reflects GitHub setup
- [ ] All team members understand new development workflow

## Dependencies
- GitHub account with repository creation permissions
- Team member GitHub accounts for collaboration
- Local git repository with commit history
- Decision on repository visibility (public vs private)

## Estimated Effort
**2-3 hours** - Including manual GitHub configuration and team setup

## Testing Strategy
1. **Repository Access Test:**
   - Clone repository from GitHub URL
   - Verify all files and history present
   - Test push/pull operations

2. **Collaboration Test:**
   - Team member creates test branch
   - Creates pull request
   - Verifies branch protection works
   - Tests project board functionality

3. **Documentation Verification:**
   - Follow README.md setup instructions
   - Verify all links work correctly
   - Test development workflow from CONTRIBUTING.md

## Notes
- **IMPORTANT:** This story excludes CI/CD pipeline setup (deferred to `github-migration-later-actions.md`)
- **IMPORTANT:** This story excludes deployment automation (deferred to `github-migration-later-deployment.md`)
- Focus on basic collaboration features and team workflow
- Preserve all existing local development capabilities
- Ensure smooth transition for team members
- Document any GitHub-specific workflow changes

## Related Stories
- **Prerequisite:** Initial project scaffold must be complete
- **Follow-up:** `github-migration-later-actions.md` - CI/CD Pipeline Setup
- **Follow-up:** `github-migration-later-deployment.md` - Deployment Automation
- **Follow-up:** Convert remaining stories to GitHub Issues workflow

## Placeholders to Fill
Before executing this story, replace these placeholders:
- `[PLACEHOLDER: REPOSITORY_NAME]` - Choose repository name
- `[PLACEHOLDER: GITHUB_USERNAME]` - Your GitHub username/organization
- `[PLACEHOLDER: PUBLIC_OR_PRIVATE]` - Repository visibility decision
- `[PLACEHOLDER: TEAM_MEMBER_X_USERNAME]` - Team member GitHub usernames
