# E2E Workflow Prompt Testing Plan

## Overview
This document provides detailed test scripts for validating all PowerShell commands and workflows in the E2E prompt files.

## Test Environment Setup
```powershell
# Ensure required tools are available
gh --version
git --version
$PSVersionTable.PSVersion

# Set working directory
cd c:\code\augment\fourtytwo

# Verify GitHub authentication
gh auth status
```

## Test 1: GitHub Project Query Script

### Test Script
```powershell
# Test basic project query
Write-Host "Testing basic project query..." -ForegroundColor Yellow
$projectData = gh project item-list 2 --owner jasonyandell --format json | ConvertFrom-Json

# Verify data structure
Write-Host "Project data type: $($projectData.GetType().Name)" -ForegroundColor Green
Write-Host "Items count: $($projectData.items.Count)" -ForegroundColor Green

# Test E2E issue filtering
Write-Host "`nTesting E2E issue filtering..." -ForegroundColor Yellow
$e2eIssues = $projectData.items | Where-Object { $_.labels -contains "e2e-tests" }
Write-Host "E2E issues found: $($e2eIssues.Count)" -ForegroundColor Green

# Test complete filtering and sorting
Write-Host "`nTesting complete filtering and sorting..." -ForegroundColor Yellow
$workableIssues = $projectData.items | Where-Object { 
    $_.labels -contains "e2e-tests" -and 
    $_.status -in @("📋 Backlog", "🚧 In Progress") 
} | Select-Object @{Name='Number';Expression={$_.content.number}}, 
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
                  }} | Sort-Object Priority, Number

Write-Host "Workable issues found: $($workableIssues.Count)" -ForegroundColor Green
$workableIssues | Format-Table -AutoSize
```

### Expected Results
- Project data should be retrieved successfully
- E2E issues should be filtered correctly
- Issues should be sorted by priority then by number
- Only "📋 Backlog" or "🚧 In Progress" issues should appear

## Test 2: PR Management Commands

### Test Script
```powershell
Write-Host "Testing PR management commands..." -ForegroundColor Yellow

# Test PR listing with review status
Write-Host "`nTesting PR list with review status..." -ForegroundColor Cyan
try {
    $prs = gh pr list --state open --json number,title,reviewDecision,mergeable,author | ConvertFrom-Json
    Write-Host "Open PRs found: $($prs.Count)" -ForegroundColor Green
    $prs | Select-Object number, title, reviewDecision, mergeable | Format-Table -AutoSize
} catch {
    Write-Host "Error listing PRs: $($_.Exception.Message)" -ForegroundColor Red
}

# Test PR details view
Write-Host "`nTesting PR details view..." -ForegroundColor Cyan
if ($prs.Count -gt 0) {
    $firstPR = $prs[0].number
    try {
        $prDetails = gh pr view $firstPR --json reviewDecision,mergeable,reviews | ConvertFrom-Json
        Write-Host "PR #$firstPR details retrieved successfully" -ForegroundColor Green
        $prDetails | ConvertTo-Json -Depth 3
    } catch {
        Write-Host "Error viewing PR #$firstPR : $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "No PRs available to test details view" -ForegroundColor Yellow
}

# Test PR comments view
Write-Host "`nTesting PR comments view..." -ForegroundColor Cyan
if ($prs.Count -gt 0) {
    $firstPR = $prs[0].number
    try {
        gh pr view $firstPR --comments
        Write-Host "PR #$firstPR comments retrieved successfully" -ForegroundColor Green
    } catch {
        Write-Host "Error viewing PR #$firstPR comments: $($_.Exception.Message)" -ForegroundColor Red
    }
}
```

### Expected Results
- PR list should return JSON data with required fields
- PR details should show review status and mergeable state
- PR comments should display if any exist

## Test 3: Branch Detection Commands

### Test Script
```powershell
Write-Host "Testing branch detection commands..." -ForegroundColor Yellow

# Test git branch --list method
Write-Host "`nTesting git branch --list method..." -ForegroundColor Cyan
$testIssueNumber = "3"
$branchPattern = "*fix-e2e-$testIssueNumber*"

try {
    $branchList = git branch --list $branchPattern
    Write-Host "Branch list result: '$branchList'" -ForegroundColor Green
    if ($branchList) {
        Write-Host "Branch exists for issue #$testIssueNumber" -ForegroundColor Green
    } else {
        Write-Host "No branch found for issue #$testIssueNumber" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error with git branch --list: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Select-String method
Write-Host "`nTesting Select-String method..." -ForegroundColor Cyan
try {
    $allBranches = git branch -a
    $matchingBranches = $allBranches | Select-String "fix-e2e-$testIssueNumber"
    Write-Host "Select-String result count: $($matchingBranches.Count)" -ForegroundColor Green
    if ($matchingBranches) {
        Write-Host "Matching branches:" -ForegroundColor Green
        $matchingBranches | ForEach-Object { Write-Host "  $_" -ForegroundColor Cyan }
    } else {
        Write-Host "No matching branches found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error with Select-String method: $($_.Exception.Message)" -ForegroundColor Red
}

# Test with different issue numbers
Write-Host "`nTesting with multiple issue numbers..." -ForegroundColor Cyan
@("3", "4", "5", "6", "7", "8", "9") | ForEach-Object {
    $issueNum = $_
    $branches = git branch --list "*fix-e2e-$issueNum*"
    if ($branches) {
        Write-Host "Issue #$issueNum has branch: $branches" -ForegroundColor Green
    } else {
        Write-Host "Issue #$issueNum has no branch" -ForegroundColor Yellow
    }
}
```

### Expected Results
- Both branch detection methods should work
- Should correctly identify existing and non-existing branches
- Should handle multiple issue numbers correctly

## Test 4: Branch Creation and Management

### Test Script
```powershell
Write-Host "Testing branch creation and management..." -ForegroundColor Yellow

# Test branch creation (using a test issue number)
$testIssue = "999"
$testBranch = "fix-e2e-$testIssue-test-branch"

Write-Host "`nTesting branch creation..." -ForegroundColor Cyan
try {
    # Ensure we're on main/master
    git checkout main 2>$null
    if ($LASTEXITCODE -ne 0) {
        git checkout master 2>$null
    }
    
    # Create test branch
    git checkout -b $testBranch
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully created branch: $testBranch" -ForegroundColor Green
        
        # Test branch switching
        Write-Host "Testing branch switching..." -ForegroundColor Cyan
        git checkout main 2>$null
        if ($LASTEXITCODE -ne 0) {
            git checkout master 2>$null
        }
        
        git checkout $testBranch
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Successfully switched to branch: $testBranch" -ForegroundColor Green
        } else {
            Write-Host "Failed to switch to branch: $testBranch" -ForegroundColor Red
        }
        
        # Clean up test branch
        git checkout main 2>$null
        if ($LASTEXITCODE -ne 0) {
            git checkout master 2>$null
        }
        git branch -D $testBranch
        Write-Host "Cleaned up test branch: $testBranch" -ForegroundColor Green
        
    } else {
        Write-Host "Failed to create branch: $testBranch" -ForegroundColor Red
    }
} catch {
    Write-Host "Error in branch management: $($_.Exception.Message)" -ForegroundColor Red
}
```

### Expected Results
- Should successfully create test branch
- Should successfully switch between branches
- Should clean up test branch without errors

## Test 5: Commit and Push Workflow

### Test Script
```powershell
Write-Host "Testing commit and push workflow..." -ForegroundColor Yellow

# Create a test branch for commit testing
$testIssue = "998"
$testBranch = "fix-e2e-$testIssue-commit-test"
$testFile = "test-commit-file.txt"

try {
    # Create test branch
    git checkout main 2>$null
    if ($LASTEXITCODE -ne 0) { git checkout master 2>$null }
    git checkout -b $testBranch

    # Create a test file
    Write-Host "`nCreating test file..." -ForegroundColor Cyan
    "Test content for commit workflow" | Out-File -FilePath $testFile -Encoding UTF8

    # Test git add
    Write-Host "Testing git add..." -ForegroundColor Cyan
    git add $testFile
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully added file to staging" -ForegroundColor Green
    } else {
        Write-Host "Failed to add file to staging" -ForegroundColor Red
    }

    # Test commit with proper message format
    Write-Host "Testing commit with proper message format..." -ForegroundColor Cyan
    $commitMessage = "fix(e2e): test commit workflow - fixes #$testIssue"
    git commit -m $commitMessage
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully committed with message: $commitMessage" -ForegroundColor Green
    } else {
        Write-Host "Failed to commit" -ForegroundColor Red
    }

    # Test push (dry-run to avoid actually pushing)
    Write-Host "Testing push command (dry-run)..." -ForegroundColor Cyan
    git push --dry-run -u origin $testBranch 2>&1
    Write-Host "Push dry-run completed (check output above for any errors)" -ForegroundColor Green

} catch {
    Write-Host "Error in commit workflow: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    # Clean up
    Write-Host "`nCleaning up test files..." -ForegroundColor Cyan
    git checkout main 2>$null
    if ($LASTEXITCODE -ne 0) { git checkout master 2>$null }
    git branch -D $testBranch 2>$null
    if (Test-Path $testFile) { Remove-Item $testFile -Force }
    Write-Host "Cleanup completed" -ForegroundColor Green
}

## Test 6: PR Creation and Linking

### Test Script
```powershell
Write-Host "Testing PR creation and linking..." -ForegroundColor Yellow

# Test PR creation command syntax (without actually creating)
Write-Host "`nTesting PR creation command syntax..." -ForegroundColor Cyan
$testIssue = "997"
$testTitle = "Fix E2E: Test Issue Title - #$testIssue"

# Test the command structure
$prCommand = "gh pr create --title `"$testTitle`" --body `"Test PR body`" --assignee @me"
Write-Host "PR creation command: $prCommand" -ForegroundColor Green

# Test PR editing command syntax
Write-Host "`nTesting PR editing command syntax..." -ForegroundColor Cyan
$testPRNumber = "123"
$editCommand = "gh pr edit $testPRNumber --add-assignee @me"
Write-Host "PR edit command: $editCommand" -ForegroundColor Green

# Test PR template check
Write-Host "`nChecking for PR template..." -ForegroundColor Cyan
$templatePaths = @(
    ".github/pull_request_template.md",
    ".github/PULL_REQUEST_TEMPLATE.md",
    ".github/pr-template.md"
)

$templateFound = $false
foreach ($path in $templatePaths) {
    if (Test-Path $path) {
        Write-Host "Found PR template: $path" -ForegroundColor Green
        $templateFound = $true
        break
    }
}

if (-not $templateFound) {
    Write-Host "No PR template found. Commands will use default body." -ForegroundColor Yellow
}

## Test 7: Priority Sorting Logic

### Test Script
```powershell
Write-Host "Testing priority sorting logic..." -ForegroundColor Yellow

# Create test data with different priorities
$testIssues = @(
    @{ labels = @("story", "e2e-tests", "priority-3-medium"); number = 6; title = "Medium Priority Issue 6" },
    @{ labels = @("story", "e2e-tests", "priority-1-critical"); number = 3; title = "Critical Priority Issue 3" },
    @{ labels = @("story", "e2e-tests", "priority-2-high"); number = 5; title = "High Priority Issue 5" },
    @{ labels = @("story", "e2e-tests", "priority-1-critical"); number = 1; title = "Critical Priority Issue 1" },
    @{ labels = @("story", "e2e-tests", "priority-4-low"); number = 8; title = "Low Priority Issue 8" },
    @{ labels = @("story", "e2e-tests"); number = 10; title = "No Priority Issue 10" }
)

Write-Host "`nTesting priority sorting..." -ForegroundColor Cyan
$sortedIssues = $testIssues | Select-Object @{Name='Number';Expression={$_.number}},
                                           @{Name='Title';Expression={$_.title}},
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
                                           }} | Sort-Object Priority, Number

Write-Host "Sorted issues:" -ForegroundColor Green
$sortedIssues | Format-Table -AutoSize

# Verify sorting is correct
$expectedOrder = @(1, 3, 5, 6, 8, 10)
$actualOrder = $sortedIssues.Number
$sortingCorrect = ($expectedOrder -join ',') -eq ($actualOrder -join ',')

if ($sortingCorrect) {
    Write-Host "Priority sorting is CORRECT" -ForegroundColor Green
} else {
    Write-Host "Priority sorting is INCORRECT" -ForegroundColor Red
    Write-Host "Expected: $($expectedOrder -join ', ')" -ForegroundColor Yellow
    Write-Host "Actual: $($actualOrder -join ', ')" -ForegroundColor Yellow
}

## Test 8: Status Filtering Logic

### Test Script
```powershell
Write-Host "Testing status filtering logic..." -ForegroundColor Yellow

# Create test data with different statuses
$testIssues = @(
    @{ status = "📋 Backlog"; number = 3; title = "Backlog Issue" },
    @{ status = "🚧 In Progress"; number = 4; title = "In Progress Issue" },
    @{ status = "👀 Review"; number = 5; title = "Review Issue" },
    @{ status = "✅ Done"; number = 6; title = "Done Issue" },
    @{ status = "📋 Backlog"; number = 7; title = "Another Backlog Issue" }
)

Write-Host "`nTesting status filtering..." -ForegroundColor Cyan
$workableStatuses = @("📋 Backlog", "🚧 In Progress")
$workableIssues = $testIssues | Where-Object { $_.status -in $workableStatuses }

Write-Host "All test issues:" -ForegroundColor Yellow
$testIssues | Select-Object number, title, status | Format-Table -AutoSize

Write-Host "Workable issues (should only show Backlog and In Progress):" -ForegroundColor Green
$workableIssues | Select-Object number, title, status | Format-Table -AutoSize

# Verify filtering is correct
$expectedWorkable = @(3, 4, 7)
$actualWorkable = $workableIssues.number | Sort-Object
$filteringCorrect = ($expectedWorkable -join ',') -eq ($actualWorkable -join ',')

if ($filteringCorrect) {
    Write-Host "Status filtering is CORRECT" -ForegroundColor Green
} else {
    Write-Host "Status filtering is INCORRECT" -ForegroundColor Red
    Write-Host "Expected: $($expectedWorkable -join ', ')" -ForegroundColor Yellow
    Write-Host "Actual: $($actualWorkable -join ', ')" -ForegroundColor Yellow
}

## Test 9: Error Handling

### Test Script
```powershell
Write-Host "Testing error handling scenarios..." -ForegroundColor Yellow

# Test invalid project number
Write-Host "`nTesting invalid project number..." -ForegroundColor Cyan
try {
    $invalidProject = gh project item-list 999 --owner jasonyandell --format json 2>&1
    Write-Host "Invalid project test completed (check for error message above)" -ForegroundColor Yellow
} catch {
    Write-Host "Caught error for invalid project: $($_.Exception.Message)" -ForegroundColor Green
}

# Test invalid owner
Write-Host "`nTesting invalid owner..." -ForegroundColor Cyan
try {
    $invalidOwner = gh project item-list 2 --owner nonexistentuser --format json 2>&1
    Write-Host "Invalid owner test completed (check for error message above)" -ForegroundColor Yellow
} catch {
    Write-Host "Caught error for invalid owner: $($_.Exception.Message)" -ForegroundColor Green
}

# Test git commands in non-git directory
Write-Host "`nTesting git commands in non-git directory..." -ForegroundColor Cyan
$originalLocation = Get-Location
try {
    Set-Location $env:TEMP
    $gitResult = git status 2>&1
    Write-Host "Git status in non-git directory: $gitResult" -ForegroundColor Yellow
} catch {
    Write-Host "Caught error for git in non-git directory: $($_.Exception.Message)" -ForegroundColor Green
} finally {
    Set-Location $originalLocation
}

# Test malformed JSON handling
Write-Host "`nTesting malformed JSON handling..." -ForegroundColor Cyan
try {
    $malformedJson = '{"incomplete": json'
    $parsed = $malformedJson | ConvertFrom-Json
} catch {
    Write-Host "Successfully caught JSON parsing error: $($_.Exception.Message)" -ForegroundColor Green
}

## Test 10: Complete Workflow Integration

### Test Script
```powershell
Write-Host "Testing complete workflow integration..." -ForegroundColor Yellow

Write-Host "`nStep 1: Query project board..." -ForegroundColor Cyan
try {
    $projectData = gh project item-list 2 --owner jasonyandell --format json | ConvertFrom-Json
    Write-Host "✓ Project data retrieved successfully" -ForegroundColor Green

    $workableIssues = $projectData.items | Where-Object {
        $_.labels -contains "e2e-tests" -and
        $_.status -in @("📋 Backlog", "🚧 In Progress")
    } | Select-Object @{Name='Number';Expression={$_.content.number}},
                      @{Name='Title';Expression={$_.title}},
                      @{Name='Status';Expression={$_.status}},
                      @{Name='Priority';Expression={
                          switch -Regex ($_.labels -join ' ') {
                              'priority-1-critical' { 1 }
                              'priority-2-high' { 2 }
                              'priority-3-medium' { 3 }
                              'priority-4-low' { 4 }
                              'priority-5-later' { 5 }
                              default { 6 }
                          }
                      }} | Sort-Object Priority, Number

    Write-Host "✓ Issues filtered and sorted successfully" -ForegroundColor Green
    Write-Host "Found $($workableIssues.Count) workable E2E issues" -ForegroundColor Cyan

} catch {
    Write-Host "✗ Failed to query project board: $($_.Exception.Message)" -ForegroundColor Red
    return
}

Write-Host "`nStep 2: Check for PRs..." -ForegroundColor Cyan
try {
    $prs = gh pr list --state open --json number,title,reviewDecision,mergeable | ConvertFrom-Json
    Write-Host "✓ PR list retrieved successfully" -ForegroundColor Green
    Write-Host "Found $($prs.Count) open PRs" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Failed to check PRs: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nStep 3: Check branch detection for highest priority issue..." -ForegroundColor Cyan
if ($workableIssues.Count -gt 0) {
    $topIssue = $workableIssues[0]
    $branchExists = git branch --list "*fix-e2e-$($topIssue.Number)*"
    if ($branchExists) {
        Write-Host "✓ Branch exists for issue #$($topIssue.Number): $branchExists" -ForegroundColor Green
    } else {
        Write-Host "✓ No branch found for issue #$($topIssue.Number) (ready for new work)" -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ No workable issues found (all done or in review)" -ForegroundColor Yellow
}

Write-Host "`nWorkflow integration test completed successfully!" -ForegroundColor Green
```

### Expected Results for All Tests
- All PowerShell scripts should execute without syntax errors
- GitHub CLI commands should authenticate and return valid data
- Git commands should work correctly in the repository
- Priority sorting should order issues correctly (1-critical → 5-later, then by number)
- Status filtering should only return "📋 Backlog" or "🚧 In Progress" issues
- Error scenarios should be handled gracefully
- Complete workflow should demonstrate end-to-end functionality
```
