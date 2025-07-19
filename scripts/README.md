# Scripts Directory

This directory contains automation scripts for the Texas 42 Web Game project.

## 🚀 E2E Workflow Automation

**SIMPLE APPROACH**: Just type a trigger phrase in Augment Code!

### ⚡ Quick Start (Recommended)
```bash
# Windows - Run this script
scripts\e2e-quick.bat

# Then in Augment Code, type:
work e2e queue
```

### 🎯 How It Works
1. **Run:** `scripts\e2e-quick.bat` (shows trigger phrase)
2. **Open:** Augment Code chat window
3. **Type:** `work e2e queue`
4. **Done:** Augment automatically executes the E2E workflow!

### 🔄 Trigger Phrases
Augment recognizes these commands:
- `work e2e queue`
- `e2e workflow`
- `next e2e task`
- `e2e queue`
- `work e2e`

### ✨ Features
- **Single-Task Execution**: One task per run for controlled progress
- **Dynamic Project Integration**: Reads GitHub Project #2 in real-time
- **Priority-Based Ordering**: Automatic issue prioritization
- **Simple Trigger Commands**: No complex prompts needed
- **Augment Rules Integration**: Built into Augment's rule system

### 📋 Alternative Methods
For advanced users who want full control:

```bash
# Full workflow scripts (traditional approach)
.\scripts\start-e2e-workflow.ps1        # Windows PowerShell
scripts\start-e2e-workflow.bat          # Windows Command Prompt
./scripts/start-e2e-workflow.sh         # Unix/Linux/macOS
```

**See [E2E Workflow Documentation](../docs/E2E_WORKFLOW_AUTOMATION.md) for complete details.**

## GitHub Projects Setup

Automate the creation of GitHub Projects and Issues from your story files.

### Prerequisites

1. **GitHub CLI**: Install from https://cli.github.com/
2. **Authentication**: Run `gh auth login` to authenticate
3. **Repository**: Must be run from a repository with GitHub remote configured

### Usage Options

#### Option 1: npm script (Recommended)
```bash
npm run setup:github-projects
```

#### Option 2: Direct script execution

**Windows (PowerShell):**
```powershell
.\scripts\setup-github-projects.ps1
```

**macOS/Linux (Bash):**
```bash
chmod +x scripts/setup-github-projects.sh
./scripts/setup-github-projects.sh
```

**Node.js:**
```bash
node scripts/setup-github-projects.js
```

### What Gets Created

#### 🏗️ GitHub Projects
1. **"Texas 42 Development Board"** - Main development tracking
2. **"E2E Test Fixes"** - E2E test improvements  
3. **"Texas 42 Rules Research"** - Rules research and validation

#### 🎫 GitHub Issues
- Automatically converts all `stories/*.md` files to GitHub Issues
- Applies appropriate labels based on story type:
  - `story` - Development stories
  - `bug` - E2E test fixes
  - `rules` - Rules research
  - `core-features` - Initial features
  - `e2e-tests` - E2E related issues
- Links each issue back to its original story file
- Includes story overview in issue description

### Manual Steps After Automation

1. **Set up project columns** in GitHub web interface:
   - Main Project: Backlog → In Progress → Review → Done
   - E2E Project: To Fix → Fixing → Fixed
   - Rules Project: Research → Documenting → Complete

2. **Add issues to project boards** by dragging them to appropriate columns

3. **Configure project automation** (optional) for automatic issue movement

### Troubleshooting

#### "gh: command not found"
- Install GitHub CLI from https://cli.github.com/
- Restart your terminal after installation

#### "gh auth status failed"
- Run `gh auth login` and follow the prompts
- Choose "GitHub.com" and "HTTPS" when prompted

#### "No remote origin configured"
- Ensure you're in a git repository with GitHub remote:
  ```bash
  git remote -v
  ```
- If no remote, add one:
  ```bash
  git remote add origin https://github.com/USERNAME/REPO.git
  ```

#### Script execution policy (Windows)
- If PowerShell blocks script execution:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

### Manual Alternative

If automation doesn't work, you can manually:

1. **Create Projects** in GitHub web interface:
   - Go to your repository → Projects tab → New project
   - Use the project names and descriptions from the scripts

2. **Create Issues** from story files:
   - Go to Issues tab → New issue
   - Copy story title and overview
   - Add appropriate labels
   - Reference the story file in the issue body

3. **Add Issues to Projects**:
   - Open each project board
   - Add relevant issues to appropriate columns

## Other Scripts

### Development Scripts
- `check-prereqs.js` - Verify system requirements
- `setup-env.js` - Create environment files  
- `cleanup.js` - Clean build artifacts
- `verify-setup.js` - Verify project setup

### Usage
All scripts can be run via npm:
```bash
npm run check-prereqs
npm run setup-env
npm run cleanup
npm run verify-setup
```

## Contributing

When adding new scripts:
1. Follow existing naming conventions
2. Add appropriate error handling
3. Include usage documentation
4. Add npm script entry if applicable
5. Update this README
