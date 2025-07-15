# E2E Test Project - Single Task Execution

## Your Mission
Execute EXACTLY ONE task from the E2E Test Fixes project board, then stop.

**First, query current project state:**
```powershell
gh project item-list 2 --owner jasonyandell --format json | ConvertFrom-Json |
ForEach-Object { $_.items | Where-Object { $_.labels -contains "e2e-tests" -and $_.status -in @("📋 Backlog", "🚧 In Progress") } |
Sort-Object @{Expression={
    switch -Regex ($_.labels -join ' ') {
        'priority-1-critical' { 1 }
        'priority-2-high' { 2 }
        'priority-3-medium' { 3 }
        'priority-4-low' { 4 }
        'priority-5-later' { 5 }
        default { 6 }
    }
}}, @{Expression={$_.content.number}} }
```

**Work only on issues with status**: "📋 Backlog" or "🚧 In Progress"

## Decision Tree (Execute First Applicable)

### 1. Merge Approved PRs
- Check: `gh pr list --state open --json reviewDecision,mergeable`
- **IF** any PR is approved and mergeable → Merge it and update issue status
- **THEN STOP** - Request new context

### 2. Fix Blocking PR Issues  
- Check open PRs for review comments indicating blocking issues
- **IF** found → Switch to that branch, fix the issues, commit/push
- **THEN STOP** - Request new context

### 3. Review Unreviewed PRs
- Check for PRs with no review decision
- **IF** found → Review against issue requirements and docs/design.md
- **IF** aligned → Approve and merge
- **IF** not aligned → Comment with specific issues
- **THEN STOP** - Request new context

### 4. Work Next Priority Issue
- From project query above, find highest priority issue with workable status
- Check if feature branch exists (Windows-compatible):
  ```powershell
  git branch --list "*fix-e2e-{issue-number}*"
  # OR
  git branch -a | Select-String "fix-e2e-{issue-number}"
  ```
- **IF** no branch → Create: `git checkout -b fix-e2e-{issue-number}-{description}`
- **IF** branch exists → Switch to it: `git checkout fix-e2e-{issue-number}-{description}`
- Implement changes per issue requirements
- Commit: `git commit -m "fix(e2e): {description} - fixes #{issue-number}"`
- Push: `git push -u origin {branch-name}`
- Create PR: `gh pr create --title "Fix E2E: {Issue Title} - #{issue-number}"`
- **THEN STOP** - Request new context

## Key Rules
- Execute ONLY ONE task per context
- Always query project board state first
- Work only on "📋 Backlog" or "🚧 In Progress" issues
- Always check PRs before working on new issues
- Use Windows-compatible commands (PowerShell/git)
- Follow branch naming: `fix-e2e-{issue-number}-{short-description}`
- Ensure changes align with docs/design.md
- Test changes before committing

## After Task Completion
Use this prompt for next context:

```
Continue E2E Test Project workflow. Execute the next single task:
1. Query GitHub Project #2 for current e2e-tests issues and status
2. Check for approved PRs to merge
3. Check for PRs with blocking comments to fix
4. Check for unreviewed PRs to review
5. Work on next priority issue from project board (only workable status)

Execute ONLY ONE task and stop. Use Windows-compatible commands.
```
