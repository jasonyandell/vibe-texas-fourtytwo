# E2E Test Project Workflow Prompt

## Context
You are working on the E2E Test Fixes project board (GitHub Project #2) for the Texas 42 Web Game. Your goal is to systematically work through issues in priority order, handling one task at a time before starting a new context.

## Dynamic Project Board Query

Before executing any task, query the current state of GitHub Project #2:

```powershell
# Get current project board state
$projectData = gh project item-list 2 --owner jasonyandell --format json | ConvertFrom-Json

# Filter and sort E2E test issues by priority
$e2eIssues = $projectData.items | Where-Object { $_.labels -contains "e2e-tests" } |
    Select-Object @{Name='Number';Expression={$_.content.number}},
                  @{Name='Title';Expression={$_.title}},
                  @{Name='Status';Expression={$_.status}},
                  @{Name='Labels';Expression={$_.labels -join ', '}},
                  @{Name='Priority';Expression={
                      switch -Regex ($_.labels -join ' ') {
                          'priority-1-critical' { 1 }
                          'priority-2-high' { 2 }
                          'priority-3-medium' { 3 }
                          'priority-4-low' { 4 }
                          'priority-5-later' { 5 }
                          default { 6 }
                      }
                  }} |
    Sort-Object Priority, Number

# Work only on issues with these statuses
$workableStatuses = @("📋 Backlog", "🚧 In Progress")
$workableIssues = $e2eIssues | Where-Object { $_.Status -in $workableStatuses }
```

## Workflow Decision Tree

Execute ONLY ONE of these tasks, then stop and request a new context:

### Step 1: Check for Approved PRs
```bash
gh pr list --state open --json number,title,reviewDecision,mergeable
```

**IF** any PR has `reviewDecision: "APPROVED"` and `mergeable: true`:
- Merge the approved PR
- Update the associated issue status to "Done"
- **STOP** - Request new context to start from Step 1

### Step 2: Check for PRs with Blocking Comments
**IF** any open PR has review comments indicating blocking issues:
- Switch to that PR's branch
- Address the blocking comments
- Commit and push fixes
- **STOP** - Request new context to start from Step 1

### Step 3: Review Unreviewed PRs
**IF** any open PR has `reviewDecision: null` (no review yet):
- Review the PR against:
  - The associated issue requirements
  - `docs/design.md` alignment
  - Code quality standards
- **IF** aligned: Approve and merge the PR
- **IF** not aligned: Add specific comments about misalignment
- **STOP** - Request new context to start from Step 1

### Step 4: Work Next Priority Issue
**IF** no open PRs need attention:
- From `$workableIssues` above, select the first issue (highest priority, lowest number)
- Check if a feature branch exists (Windows-compatible):
  ```powershell
  # Check for existing branch
  $branchExists = git branch --list "*fix-e2e-$($issue.Number)*"
  # OR alternative method
  $branchExists = git branch -a | Select-String "fix-e2e-$($issue.Number)"
  ```
- **IF** no branch exists: Create feature branch `fix-e2e-{issue-number}-{short-description}`
- **IF** branch exists: Switch to it
- Implement the changes according to the issue requirements
- Commit and push changes
- Create pull request if one doesn't exist
- Assign PR to the issue
- Request team review
- **STOP** - Request new context to start from Step 1

## Implementation Guidelines

### Branch Naming Convention
```
fix-e2e-{issue-number}-{short-description}
```
Examples:
- `fix-e2e-3-basic-lobby-display`
- `fix-e2e-4-game-creation-modal`

### Commit Message Format
```
fix(e2e): {brief description} - fixes #{issue-number}

{detailed description of changes}

- Specific change 1
- Specific change 2
- Addresses issue requirements
```

### PR Title Format
```
Fix E2E: {Issue Title} - #{issue-number}
```

### PR Description Template
```markdown
## Summary
Fixes #{issue-number} - {Issue Title}

## Changes Made
- [ ] Change 1
- [ ] Change 2
- [ ] Change 3

## Testing
- [ ] E2E tests pass
- [ ] No regressions in existing tests
- [ ] Manual testing completed

## Alignment Check
- [ ] Follows issue requirements
- [ ] Aligns with docs/design.md
- [ ] Follows project conventions

Closes #{issue-number}
```

## Commands Reference

### Check PRs
```bash
# List all open PRs with review status
gh pr list --state open --json number,title,reviewDecision,mergeable,author

# View specific PR details
gh pr view {pr-number} --json reviewDecision,mergeable,reviews

# Check PR comments
gh pr view {pr-number} --comments
```

### Merge Approved PR
```bash
# Merge approved PR
gh pr merge {pr-number} --squash --delete-branch

# Update issue status (if using GitHub CLI)
gh issue edit {issue-number} --add-label "status-done"
```

### Work on Issue
```powershell
# Check if branch exists (Windows-compatible)
$branchExists = git branch --list "*fix-e2e-$issueNumber*"
# OR alternative
$branchExists = git branch -a | Select-String "fix-e2e-$issueNumber"

# Create and switch to feature branch
git checkout -b fix-e2e-$issueNumber-$description

# After implementing changes
git add .
git commit -m "fix(e2e): $description - fixes #$issueNumber"
git push -u origin fix-e2e-$issueNumber-$description

# Create PR
gh pr create --title "Fix E2E: $issueTitle - #$issueNumber" --body-file .github/pr-template.md --assignee @me

# Link PR to issue
gh pr edit $prNumber --add-assignee @me
```

## Design Alignment Check

When reviewing PRs, ensure alignment with `docs/design.md`:
- Component structure follows established patterns
- State management follows documented approach
- Testing patterns match project standards
- UI/UX follows design system
- Accessibility requirements met

## Success Criteria

Each task completion should result in:
- One specific action taken (merge, fix, review, or implement)
- Clear progress toward issue resolution
- No breaking changes introduced
- Proper documentation and testing

## Next Context Prompt

After completing any task, use this prompt for the next context:

```
Continue E2E Test Project workflow. Execute the next single task:

1. Query GitHub Project #2 state: gh project item-list 2 --owner jasonyandell --format json
2. Filter for e2e-tests issues with "📋 Backlog" or "🚧 In Progress" status
3. Sort by priority labels (priority-1-critical → priority-5-later) then by issue number
4. Check for approved PRs ready to merge
5. Check for PRs with blocking comments that need fixes
6. Check for unreviewed PRs that need review
7. If no PRs need attention, work on the highest priority workable issue

Execute only ONE task and stop. Use Windows-compatible commands (PowerShell/git).
```
