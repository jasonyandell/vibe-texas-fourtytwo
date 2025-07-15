# E2E Test Project - Execute One Task Only

You are working on the E2E Test Fixes project board for Texas 42 Web Game. Execute EXACTLY ONE task from this dynamic, priority-ordered workflow, then stop.

## ⚠️ PREREQUISITE: Dev Server Must Be Running

**BEFORE starting any task, verify dev server is running:**
```powershell
# Check if server is running (should respond)
curl http://localhost:3000

# If not running, start it:
cd frontend
npm run dev
# Wait for "ready in XXXms" message
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
- **STOP** - Task complete

### Task B: Fix Blocking PR Comments
Check open PRs for blocking review comments
**IF** any PR has blocking issues:
- Switch to that branch
- Fix the blocking issues
- Commit and push fixes
- **STOP** - Task complete

### Task C: Review Unreviewed PRs  
Check for PRs with no review decision
**IF** any unreviewed PR exists:
- Review against issue requirements and docs/design.md
- **IF** aligned: Approve and merge
- **IF** not aligned: Add specific comments about issues
- **STOP** - Task complete

### Task D: Work Next Priority Issue
**IF** no PRs need attention:
- From the project board query above, find the highest priority issue with status "📋 Backlog" or "🚧 In Progress"
- Check if branch exists (Windows-compatible):
  ```powershell
  git branch --list "*fix-e2e-{issue-number}*"
  # OR
  git branch -a | Select-String "fix-e2e-{issue-number}"
  ```
- **IF** no branch exists → Create: `git checkout -b fix-e2e-{issue-number}-{description}`
- **IF** branch exists → Switch to it: `git checkout fix-e2e-{issue-number}-{description}`
- Implement changes according to issue requirements
- Commit: `git commit -m "fix(e2e): {description} - fixes #{issue-number}"`
- Push: `git push -u origin {branch-name}`
- Create PR if needed: `gh pr create --title "Fix E2E: {Issue Title} - #{issue-number}"`
- **STOP** - Task complete

## Rules
- Execute ONLY ONE task per context
- Always query project board state first
- Work only on "📋 Backlog" or "🚧 In Progress" issues
- Always check PRs before working on new issues
- Ensure alignment with docs/design.md
- Use branch naming: `fix-e2e-{issue-number}-{description}`

## 📋 Definition of Done - MANDATORY
**Task is NOT complete until:**
1. **All story-specific E2E tests pass 100%** (zero failures allowed)
2. **No regressions in existing tests** (run full suite to verify)
3. **Performance requirements met** (under timeout limits)
4. **Dev server running and accessible** throughout testing

**Test Command Example:**
```powershell
# For story #3 (Basic Lobby Display)
npx playwright test lobby.spec.ts --grep "Basic Display"
# Must show: "3 passed" with zero failures
```

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
