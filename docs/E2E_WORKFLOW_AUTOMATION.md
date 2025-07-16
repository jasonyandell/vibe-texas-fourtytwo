# E2E Workflow Automation System

## Overview

This how a developer works on issues in this project in a priority-driven, project-aware manner. actions include dynamically reading from GitHub Project boards and executing tasks in the correct order.

## Dynamic Project Board Integration

### GitHub Project Query

```powershell
# Get current project state
$projectData = gh project item-list 2 --owner jasonyandell --format json | ConvertFrom-Json

# Filter for E2E test issues
$e2eIssues = $projectData.items | Where-Object { $_.labels -contains "e2e-tests" }
```

### Status-Aware Filtering

Only works on issues with workable status:

```powershell
$workableStatuses = @("Backlog", "In Progress")
$workableIssues = $e2eIssues | Where-Object { $_.status -in $workableStatuses }
```

### Priority-Based Sorting

Issues automatically sorted by priority labels:

```powershell
$sortedIssues = $workableIssues | Select-Object @{
    Name='Priority';
    Expression={
        switch -Regex ($_.labels -join ' ') {
            'priority-1-critical' { 1 }
            'priority-2-high' { 2 }
            'priority-3-medium' { 3 }
            'priority-4-low' { 4 }
            'priority-5-later' { 5 }
            default { 6 }
        }
    }
} | Sort-Object Priority, Number
```

## Workflow Decision Tree

The system follows a strict priority order:

### 1. Check for Approved PRs
```powershell
$prs = gh pr list --state open --json reviewDecision,mergeable | ConvertFrom-Json
# If any PR is approved and mergeable → Merge it
```

### 2. Fix Blocking PR Comments
```powershell
# Check for PRs with blocking review comments
# If found → Switch to branch and fix issues
```

### 3. Review Unreviewed PRs
```powershell
# Check for PRs with no review decision
# If found → Review against requirements and docs/design.md
```

### 4. Work Next Priority Issue
```powershell
# From sorted workable issues, work on highest priority
# Create branch, implement, commit, push, create PR
```

## Windows PowerShell Compatibility

### Branch Detection Methods

**Method 1: git branch --list (Preferred)**
```powershell
$branchExists = git branch --list "*fix-e2e-$issueNumber*"
```

**Method 2: Select-String (Alternative to grep)**
```powershell
$branchExists = git branch -a | Select-String "fix-e2e-$issueNumber"
```

### JSON Processing
```powershell
# GitHub CLI with PowerShell JSON parsing
$data = gh command --format json | ConvertFrom-Json
```

### Error Handling
```powershell
# Proper error handling for PowerShell
try {
    $result = SomeCommand
    Write-Host "✓ Success" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
```

## Branch Naming Convention

```
issue-{issue-number}-{short-description}
```

## Commit Message Format

```
issue: {brief description} - fixes #{issue-number}

{detailed description of changes}

- Specific change 1
- Specific change 2
- Addresses issue requirements
```

## PR Management

### PR Title Format
```
{Issue Title} - #{issue-number}
```

### PR Description Template
```markdown
## Summary
Fixes #{issue-number} - {Issue Title}

## Changes Made
- [ ] Change 1
- [ ] Change 2

## Testing
- [ ] All tests pass
- [ ] No regressions

## Alignment Check
- [ ] Follows issue requirements
- [ ] Aligns with docs/design.md

Closes #{issue-number}
```

## Testing and Validation

### Automated Test Suite

Run the complete test suite:
```powershell
.\docs\testing\run-e2e-workflow-tests.ps1
```

Run specific tests:
```powershell
.\docs\testing\run-e2e-workflow-tests.ps1 -TestNumber 1 -Verbose
```

### Test Categories

1. **GitHub Project Query** - Validates project board integration
2. **PR Management** - Tests GitHub CLI PR operations
3. **Branch Detection** - Validates Windows-compatible git commands
4. **Priority Sorting** - Tests issue prioritization logic
5. **Status Filtering** - Validates workable issue selection
6. **Complete Integration** - End-to-end workflow validation

## Design Alignment

All work must align with `docs/design.md` requirements:
- Component structure follows established patterns
- State management follows documented approach
- Testing patterns match project standards
- UI/UX follows design system
- Accessibility requirements met

### 🚨 Workflow Blocker Protocol

**When encountering blockers:**

1. **Document the blocker** in this file under "Known Issues"
2. **Update workflow instructions** with resolution steps
3. **Add prevention measures** to avoid future occurrences
4. **Test the fix** before proceeding with story work

### 📝 Documentation Update Requirement

**Any time you encounter a workflow blocker:**
- Update this documentation with the issue and solution
- Add specific commands and steps for resolution
- Include prevention measures for future contexts
- Test the updated workflow before continuing


