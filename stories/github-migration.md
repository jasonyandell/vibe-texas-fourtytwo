# Story: GitHub Repository Migration and Collaboration Setup

## Overview
✅ **MIGRATION COMPLETED** - Migrate the Texas 42 Web Game project from local git repository to GitHub with proper collaboration features, project management tools, and team workflow setup. This story focuses on preserving git history while establishing a professional development environment for team collaboration.

**STATUS:** Core migration complete. Team collaboration setup deferred pending team formation.

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

### Step 2: Local Repository Migration ✅ **COMPLETED**
Execute migration commands listed in Technical Requirements section.

**COMPLETED ACTIONS:**
- ✅ Remote origin already configured: https://github.com/jasonyandell/vibe-texas-fourtytwo.git
- ✅ All migration files committed (commit af592be)
- ✅ Changes pushed to GitHub successfully
- ✅ Git history preserved (6+ commits visible on GitHub)

### Step 3: Documentation Updates ✅ **COMPLETED**
**COMPLETED ACTIONS:**
- ✅ Updated README.md clone URL to correct repository
- ✅ Updated CI/CD badge to point to jasonyandell/vibe-texas-fourtytwo
- ✅ Updated directory name in quick start guide
- ✅ Committed and pushed documentation updates (commit 66df7a9)
- ✅ GitHub badges already present and working

### Step 4: GitHub Features Configuration ⚠️ **PARTIALLY COMPLETED**
**COMPLETED ACTIONS:**
- ✅ GitHub CLI authentication refreshed with project scopes
- ✅ Automation script fixed and executed successfully
- ✅ 39 GitHub Issues created from all story files
- ✅ Issues properly labeled and linked to story files
- ✅ Script fixes committed and pushed (commit 3ef7049)

**ISSUES IDENTIFIED:**
- ❌ GitHub Projects not visible in repository (creation may have failed)
- ❌ Issue content lacks detailed story context (only brief overview included)
- ❌ Project boards need to be created and configured

### Step 4a: Fix GitHub Projects Creation ✅ **COMPLETED**
**COMPLETED ACTIONS:**
- ✅ Investigated project creation issues - projects were created as user-level projects
- ✅ Created missing repository labels: `story`, `rules`, `e2e-tests`, `core-features`
- ✅ Created and executed fix script (`scripts/fix-github-projects.js`)
- ✅ Successfully added all 39 issues to appropriate project boards
- ✅ Applied correct labels to all issues based on story type
- ✅ Verified project organization:
  - **Texas 42 Development Board**: 30 items (main development stories)
  - **E2E Test Fixes**: 7 items (E2E test fix stories)
  - **Texas 42 Rules Research**: 2 items (rules research stories)

**RESOLUTION:**
- Projects exist as user-level projects (not repository-level) but are fully functional
- All issues properly categorized and added to appropriate projects
- Labels correctly applied for filtering and organization
- Project URLs accessible and working

### Step 4b: Make Projects Public and Add Repository Links ✅ **COMPLETED**
**COMPLETED ACTIONS:**
- ✅ Made all 3 user-level projects public using GitHub CLI
- ✅ Added prominent "Project Management" section to README.md
- ✅ Included direct links to all three project boards with descriptions
- ✅ Added detailed project descriptions for professional presentation
- ✅ Positioned section prominently after Quick Start for easy discovery
- ✅ Committed and pushed changes (commit 76f34e9)

**Project URLs (Now Public):**
- **Texas 42 Development Board**: https://github.com/users/jasonyandell/projects/1
- **E2E Test Fixes**: https://github.com/users/jasonyandell/projects/2
- **Texas 42 Rules Research**: https://github.com/users/jasonyandell/projects/3

**Benefits Achieved:**
- ✅ Modern GitHub project management features
- ✅ Public visibility for showcasing work
- ✅ Professional presentation in repository
- ✅ Future-proof (GitHub's recommended approach)
- ✅ Easy discovery from repository main page

### Step 4c: Enhance GitHub Issues Content ✅ **COMPLETED**
**COMPLETED ACTIONS:**
- ✅ Created `scripts/enhance-github-issues.js` for automated issue enhancement
- ✅ Enhanced all 39 GitHub issues with complete story content from markdown files
- ✅ Added story source links and proper GitHub formatting
- ✅ Included acceptance criteria, technical requirements, and testing strategies
- ✅ Preserved existing issue metadata (labels, assignees, project assignments)
- ✅ Committed and pushed enhancement script (commit 786ef73)

**Enhancement Results:**
- **Full Story Content**: All issues now contain complete story details instead of brief summaries
- **Source Links**: Each issue links back to original story file for reference
- **Professional Format**: Proper GitHub markdown formatting with clear sections
- **Comprehensive Information**: Acceptance criteria, technical specs, testing strategy, and dependencies
- **Automated Process**: Script can be rerun to update issues when stories change

**Issue Quality Improvements:**
- ✅ Expanded descriptions with full story content
- ✅ Added acceptance criteria from story files
- ✅ Included technical requirements and implementation notes
- ✅ Added estimated effort and dependencies
- ✅ Maintained proper categorization with existing labels
- ✅ Preserved project board assignments

### Step 5: Team Collaboration Setup ⏸️ **DEFERRED**
**DEFERRED TASK:** Team collaboration setup deferred to future when team members are identified.

**DEFERRED ACTIONS:**
1. **Invite Team Members:**
   - Go to Settings → Manage access → Invite a collaborator
   - **DEFERRED:** Add team member GitHub usernames when team is formed
     - `[PLACEHOLDER: TEAM_MEMBER_1_USERNAME]`
     - `[PLACEHOLDER: TEAM_MEMBER_2_USERNAME]`
     - `[PLACEHOLDER: TEAM_MEMBER_3_USERNAME]`

2. **Create Initial Issues:**
   - ✅ **COMPLETED:** All stories converted to GitHub Issues (39 issues created)
   - ✅ **COMPLETED:** Appropriate labels applied and assigned to project boards
   - ✅ **COMPLETED:** Related issues linked where applicable

**RATIONALE FOR DEFERRAL:**
- Core GitHub migration functionality is complete and operational
- Team member identification and invitation can be done when team is formed
- All technical infrastructure is ready for immediate team collaboration
- Project boards and issues are fully configured for team use

## Definition of Done
- [x] GitHub repository accessible at correct URL
- [x] All local git history preserved in GitHub repository
- [x] Team members can clone and contribute to repository (infrastructure ready)
- [x] Branch protection prevents direct pushes to main (configured via GitHub web interface)
- [x] Project board shows current development status
- [x] Documentation accurately reflects GitHub setup
- [ ] All team members understand new development workflow (DEFERRED - pending team formation)

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
