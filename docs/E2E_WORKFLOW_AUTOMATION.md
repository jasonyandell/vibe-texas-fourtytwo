# E2E Workflow Automation System

## Overview

This document describes the automated workflow system for managing E2E test fixes in a priority-driven, project-aware manner. The system dynamically reads from GitHub Project boards and executes tasks in the correct order.

## System Architecture

### Core Components

1. **Dynamic Project Integration**: Real-time GitHub Project board queries
2. **Priority-Based Sorting**: Automatic issue prioritization using labels
3. **Windows-Compatible Commands**: All scripts work on Windows PowerShell
4. **Single-Task Execution**: One task per context for controlled progress

### File Structure

```
docs/
├── prompts/
│   ├── e2e-workflow-prompt.md          # Detailed workflow guide
│   ├── e2e-single-task-prompt.md       # Concise task guide
│   └── READY_TO_USE_E2E_PROMPT.md      # Production-ready prompt
├── testing/
│   ├── e2e-workflow-test-plan.md       # Comprehensive test scripts
│   ├── e2e-workflow-test-results.md    # Validation results
│   └── run-e2e-workflow-tests.ps1      # Automated test runner
└── E2E_WORKFLOW_AUTOMATION.md          # This document
```

## Dynamic Project Board Integration

### GitHub Project Query

The system queries GitHub Project #2 (E2E Test Fixes) in real-time:

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

Issues are automatically sorted by priority labels:

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
fix-e2e-{issue-number}-{short-description}
```

Examples:
- `fix-e2e-3-basic-lobby-display`
- `fix-e2e-4-game-creation-modal`
- `fix-e2e-5-game-cards-display`

## Commit Message Format

```
fix(e2e): {brief description} - fixes #{issue-number}

{detailed description of changes}

- Specific change 1
- Specific change 2
- Addresses issue requirements
```

## PR Management

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

## Testing
- [ ] E2E tests pass
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

## Usage Instructions

### Starting a New Context

Copy and paste this prompt for each new context:

```
Continue E2E Test Project workflow. Execute the next single task:

1. Query GitHub Project #2 state: gh project item-list 2 --owner jasonyandell --format json
2. Check for approved PRs to merge
3. Check for PRs with blocking comments to fix  
4. Check for unreviewed PRs to review
5. Work on next priority issue from project board (only "Backlog" or "In Progress" status)

Execute ONLY ONE task and stop. Use Windows-compatible commands.
```

### Current Project State

As of last validation, the E2E Test Fixes project contains:

1. **#3** - Fix Basic Lobby Display E2E Tests (priority-1-critical)
2. **#4** - Fix Game Creation Modal E2E Tests (priority-2-high)
3. **#5** - Fix Game Cards Display E2E Tests (priority-2-high)
4. **#6** - Fix Player Management E2E Tests (priority-3-medium)
5. **#7** - Fix Ready System E2E Tests (priority-3-medium)
6. **#8** - Fix Spectator Mode E2E Tests (priority-4-low)
7. **#9** - Fix Error Handling E2E Tests (priority-4-low)

## Design Alignment

All work must align with `docs/design.md` requirements:
- Component structure follows established patterns
- State management follows documented approach
- Testing patterns match project standards
- UI/UX follows design system
- Accessibility requirements met

## Critical Workflow Requirements

### ⚠️ MANDATORY: Dev Server Must Be Running
**Before executing any E2E workflow task:**

1. **Check dev server status**: Verify `http://localhost:3000` is accessible
2. **Start if needed**: Run `npm run dev:frontend` from project root
3. **Validate startup**: Ensure server shows "Local: http://localhost:3000/" message
4. **Test connectivity**: Quick browser check or curl test

### 📋 Definition of Done - 100% Test Pass Requirement

**Every story task MUST meet these criteria before completion:**

1. **All story-specific E2E tests pass 100%**
   - Run: `npm run test:e2e -- --grep "Basic Display"` (example from PROJECT ROOT)
   - **Zero failures allowed** - any failing test blocks completion
   - Tests must pass consistently (not flaky)

2. **No regressions in existing tests**
   - Run full test suite to verify no breakage
   - All previously passing tests must still pass

3. **Performance requirements met**
   - Page loads under 2s (navigation timeout)
   - User interactions under 1s (action timeout)
   - Overall test completion under 3s (global timeout)

### 🚨 Workflow Blocker Protocol

**When encountering blockers (dev server down, test failures, etc.):**

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

## Success Metrics

- ✅ Dynamic project board integration working
- ✅ Windows PowerShell compatibility validated
- ✅ Priority-based issue ordering functional
- ✅ Single-task execution model proven
- ✅ 100% test pass requirement enforced
- ✅ Dev server dependency documented

## Known Issues & Resolutions

### Issue: E2E Tests Fail with "Timeout 2000ms exceeded" on page.goto

**Symptoms:**
- Tests fail immediately with navigation timeout
- Error: `TimeoutError: page.goto: Timeout 2000ms exceeded`
- All tests fail at the `await page.goto('/')` step

**Root Cause:**
- Frontend dev server not running on `http://localhost:3000`
- Tests cannot navigate to application

**Resolution:**
```powershell
# 1. Start dev server from project root
npm run dev:frontend

# 2. Verify server is ready (should show "ready in XXXms")
# Look for: "Local: http://localhost:3000/"

# 3. Test connectivity (optional)
curl http://localhost:3000

# 4. Run tests from PROJECT ROOT
npm run test:e2e -- --grep "Basic Display"
```

**Prevention:**
- Always check dev server status before running E2E workflow
- Add dev server check to workflow automation scripts
- Consider adding health check endpoint for automated validation

**Last Updated:** 2025-07-15 (Issue #3 - Basic Lobby Display)

### Issue: Incorrect E2E Test Command Instructions

**Symptoms:**
- Previous instructions suggested running E2E tests from frontend directory
- Instructions used `npx playwright test` directly instead of npm scripts
- Confusion about correct working directory for test execution

**Root Cause:**
- Project uses workspace structure with root-level npm scripts
- Root-level `npm run test:e2e` properly delegates to frontend workspace
- Direct playwright commands may miss workspace configuration

**Resolution:**
```powershell
# CORRECT: Run E2E tests from PROJECT ROOT
npm run test:e2e

# CORRECT: Run specific tests from PROJECT ROOT
npm run test:e2e -- --grep "Game Creation"

# INCORRECT: Running from frontend directory (works but not preferred)
cd frontend && npm run test:e2e

# INCORRECT: Direct playwright command (may miss config)
npx playwright test
```

**Prevention:**
- Always use root-level npm scripts for consistency
- Update all documentation to reflect correct commands
- Test commands in clean environment to verify they work

**Last Updated:** 2025-07-15 (E2E Command Investigation)

### Issue: Application Takes >2s to Load Despite Dev Server Running

**Symptoms:**
- Dev server responds with 200 OK to curl requests
- Tests fail with "Timeout 2000ms exceeded" on page.goto
- Server logs show no errors
- HTML content is returned but page doesn't become interactive

**Root Cause:**
- Application initialization/hydration takes longer than 2s navigation timeout
- Possible causes: large bundle size, slow component mounting, API calls blocking render

**Immediate Resolution (Temporary):**
```typescript
// In playwright.config.ts - increase navigation timeout temporarily
use: {
  navigationTimeout: 5000,  // Increase from 2000ms to 5000ms
  // Keep other timeouts aggressive
  actionTimeout: 1000,
}
```

**Long-term Resolution (Required):**
1. **Optimize bundle size**: Check for unnecessary imports
2. **Lazy load components**: Split large components
3. **Remove blocking API calls**: Make initial render non-dependent on API
4. **Profile performance**: Use browser dev tools to identify bottlenecks

**Performance Target:**
- Initial page load should be <1s for simple domino game
- Current timeout of 2s is already generous - app should be faster

**Status:** BLOCKING - Tests cannot pass until resolved
**Priority:** HIGH - Affects all E2E testing

**Last Updated:** 2025-07-15 (Issue #3 - Performance Investigation)
- ✅ Complete workflow tested and validated

## Troubleshooting

### Common Issues

1. **Unicode Emoji Errors**: Replace emojis with plain text in PowerShell
2. **Function Parameter Errors**: Use proper PowerShell parameter syntax
3. **JSON Parsing Failures**: Break complex operations into steps
4. **API Rate Limits**: Implement caching and retry logic
5. **Branch Detection Issues**: Use specific pattern matching

### Getting Help

1. Check `docs/testing/e2e-workflow-test-results.md` for validation status
2. Run test suite to verify system functionality
3. Review `docs/DEBUGGING.md` for PowerShell-specific issues
4. Ensure GitHub CLI authentication is working: `gh auth status`

## Future Enhancements

Potential improvements to the system:
- Caching for reduced API calls
- Parallel PR review capabilities
- Integration with other project boards
- Automated conflict resolution
- Enhanced error recovery mechanisms

---

This automation system provides a robust, tested foundation for systematic E2E test issue management while maintaining full Windows compatibility and project board awareness.
