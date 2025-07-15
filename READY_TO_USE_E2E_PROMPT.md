# E2E Test Project - Execute One Task Only

You are working on the E2E Test Fixes project board for Texas 42 Web Game. Execute EXACTLY ONE task from this dynamic, priority-ordered workflow, then stop.

## ⚠️ PREREQUISITES: Setup Before Any Task

### 1. Ensure Clean Main Branch State
**BEFORE starting any task:**
```powershell
# Switch to main and get latest changes
git checkout main
git pull

# Verify clean state
git status
```

### 2. Dev Server Must Be Running
**Verify dev server is running:**
```powershell
# Check if frontend server is running (should respond)
curl http://localhost:3000

# If not running, start the frontend dev server:
npm run dev:frontend
# Wait for "Local: http://localhost:3000/" message

# Alternative: Start full development environment (includes backend + database):
npm run develop
```

**IMPORTANT: Use correct test commands:**
```powershell
# Run E2E tests from PROJECT ROOT (not frontend directory):
npm run test:e2e

# For specific tests, use from PROJECT ROOT:
npm run test:e2e -- --grep "Game Creation"

# NOT: cd frontend && npm run test:e2e (this works but use root level)
# NOT: npx playwright test (this fails with config issues)
```
**If dev server issues occur:**
- Document the problem in `docs/E2E_WORKFLOW_AUTOMATION.md` under "Known Issues"
- Update workflow instructions with resolution steps
- Test the fix before proceeding

## Step 0: Discover Current Project State

First, get the current state of GitHub Project #2 (E2E Test Fixes):
```powershell
gh project item-list 2 --owner jasonyandell --format json | ConvertFrom-Json | ForEach-Object {
    $_.items | Where-Object { $_.labels -contains "e2e-tests" } |
    Select-Object @{Name='Number';Expression={$_.content.number}},
                  @{Name='Title';Expression={$_.title}},
                  @{Name='Status';Expression={$_.status}},
                  @{Name='Labels';Expression={$_.labels -join ', '}} |
    Sort-Object @{Expression={
        switch -Regex ($_.Labels) {
            'priority-1-critical' { 1 }
            'priority-2-high' { 2 }
            'priority-3-medium' { 3 }
            'priority-4-low' { 4 }
            'priority-5-later' { 5 }
            default { 6 }
        }
    }}, Number
}
```

**Work only on issues with status**: "📋 Backlog" or "🚧 In Progress"
**Skip issues with status**: "✅ Done" or "👀 Review"

## Execute First Applicable Task

### Task A: Merge Approved PRs
Check for approved PRs: `gh pr list --state open --json reviewDecision,mergeable`
**IF** any PR is approved and mergeable:
- Merge the PR: `gh pr merge {pr-number} --squash --delete-branch`
- Update issue status to Done
- **STOP IMMEDIATELY** - Task complete, do not proceed to next task

### Task B: Fix Blocking PR Comments
Check open PRs for blocking review comments
**IF** any PR has blocking issues:
- Switch to that branch: `git checkout {branch-name}`
- Pull latest main and resolve conflicts: `git pull origin main`
- Fix the blocking issues
- Commit and push fixes
- **STOP IMMEDIATELY** - Task complete, do not proceed to next task

### Task C: Review Unreviewed PRs
Check for PRs with no review decision
**IF** any unreviewed PR exists:
- Review against issue requirements and docs/design.md
- **IF** aligned: Approve and merge (or merge directly if self-approval blocked)
- **IF** not aligned: Add specific comments about issues
- **STOP IMMEDIATELY** - Task complete, do not proceed to next task

### Task D: Work Next Priority Issue
**IF** no PRs need attention:
- From the project board query above, find the highest priority issue with status "📋 Backlog" or "🚧 In Progress"
- Check if branch exists (Windows-compatible):
  ```powershell
  git branch --list "*fix-e2e-{issue-number}*"
  # OR
  git branch -a | Select-String "fix-e2e-{issue-number}"
  ```
- **IF** no branch exists → Create from main: `git checkout -b fix-e2e-{issue-number}-{description}`
- **IF** branch exists → Switch and update:
  ```powershell
  git checkout fix-e2e-{issue-number}-{description}
  git pull origin main  # Merge latest main changes
  # Resolve any conflicts if they occur
  ```
- Implement changes according to issue requirements
- Commit: `git commit -m "fix(e2e): {description} - fixes #{issue-number}"`
- Push: `git push -u origin {branch-name}`
- Create PR if needed: `gh pr create --title "Fix E2E: {Issue Title} - #{issue-number}"`
- **STOP IMMEDIATELY** - Task complete, do not proceed to next task

## Rules
- **EXECUTE ONLY ONE TASK PER CONTEXT - THEN STOP IMMEDIATELY**
- **ALWAYS start from clean main branch** (`git checkout main && git pull`)
- Always query project board state first
- Work only on "📋 Backlog" or "🚧 In Progress" issues
- Always check PRs before working on new issues
- **Pull latest main into feature branches** before working (`git pull origin main`)
- **Resolve any merge conflicts** before proceeding with work
- Ensure alignment with docs/design.md
- Use branch naming: `fix-e2e-{issue-number}-{description}`
- **ALWAYS commit and push ALL changes before task completion**
- **NEVER proceed to next task - each task requires a new context/prompt**

## 📋 Definition of Done - MANDATORY
**Task is NOT complete until:**
1. **All story-specific E2E tests pass 100%** (zero failures allowed)
2. **No regressions in existing tests** (run full suite to verify)
3. **Performance requirements met** (under timeout limits)
4. **Dev server running and accessible** throughout testing
5. **ALL changes committed and pushed to branch** (including config, docs, etc.)

**Test Command Example:**
```powershell
# For story #3 (Basic Lobby Display) - run from PROJECT ROOT:
npm run test:e2e -- --grep "Basic Display"
# Must show: "3 passed" with zero failures
```

## ⚠️ CRITICAL: STOP AFTER ONE TASK

**After completing ANY task above:**
1. **STOP IMMEDIATELY** - Do not proceed to next task
2. **Do not query project board again**
3. **Do not check for more PRs**
4. **Do not start working on next issue**

**Each task requires a fresh context/prompt to ensure proper isolation and control.**

## Next Context Prompt
After completing your task, use this for the next context:

```
Continue E2E Test Project workflow. Execute the next single task:

1. Query GitHub Project #2 state: gh project item-list 2 --owner jasonyandell --format json
2. Check for approved PRs to merge
3. Check for PRs with blocking comments to fix
4. Check for unreviewed PRs to review
5. Work on next priority issue from project board (only "📋 Backlog" or "🚧 In Progress" status)

Execute ONLY ONE task and stop. Use Windows-compatible commands.
```
