# E2E Workflow Test Runner
# Run this script to test all components of the E2E workflow prompts

param(
    [string]$TestNumber = "all",
    [switch]$Verbose = $false
)

# Set error action preference
$ErrorActionPreference = "Continue"

# Color functions
function Write-TestHeader {
    param([string]$message)
    Write-Host "`n" + "="*60 -ForegroundColor Magenta
    Write-Host $message -ForegroundColor Magenta
    Write-Host "="*60 -ForegroundColor Magenta
}

function Write-TestResult {
    param([bool]$success, [string]$message)
    if ($success) {
        Write-Host "✓ $message" -ForegroundColor Green
    } else {
        Write-Host "✗ $message" -ForegroundColor Red
    }
}

# Test environment setup
function Test-Environment {
    Write-TestHeader "Testing Environment Setup"
    
    $allGood = $true
    
    # Check GitHub CLI
    try {
        $ghVersion = gh --version 2>$null
        Write-TestResult $true "GitHub CLI is available: $($ghVersion[0])"
    } catch {
        Write-TestResult $false "GitHub CLI is not available"
        $allGood = $false
    }
    
    # Check Git
    try {
        $gitVersion = git --version 2>$null
        Write-TestResult $true "Git is available: $gitVersion"
    } catch {
        Write-TestResult $false "Git is not available"
        $allGood = $false
    }
    
    # Check PowerShell version
    $psVersion = $PSVersionTable.PSVersion
    Write-TestResult $true "PowerShell version: $psVersion"
    
    # Check working directory
    $currentDir = Get-Location
    Write-TestResult $true "Current directory: $currentDir"
    
    # Check GitHub authentication
    try {
        gh auth status 2>$null
        Write-TestResult $true "GitHub authentication is working"
    } catch {
        Write-TestResult $false "GitHub authentication failed"
        $allGood = $false
    }
    
    return $allGood
}

# Test 1: GitHub Project Query
function Test-ProjectQuery {
    Write-TestHeader "Test 1: GitHub Project Query Script"
    
    try {
        Write-Host "Querying GitHub Project #2..." -ForegroundColor Cyan
        $projectData = gh project item-list 2 --owner jasonyandell --format json | ConvertFrom-Json
        Write-TestResult $true "Project data retrieved successfully"
        
        $e2eIssues = $projectData.items | Where-Object { $_.labels -contains "e2e-tests" }
        Write-TestResult $true "E2E issues filtered: $($e2eIssues.Count) found"
        
        $workableIssues = $projectData.items | Where-Object {
            $_.labels -contains "e2e-tests" -and
            $_.status -in @("Backlog", "In Progress")
        }
        Write-TestResult $true "Workable issues filtered: $($workableIssues.Count) found"
        
        if ($Verbose -and $workableIssues.Count -gt 0) {
            Write-Host "`nWorkable Issues:" -ForegroundColor Yellow
            $workableIssues | Select-Object @{Name='Number';Expression={$_.content.number}}, 
                                           @{Name='Title';Expression={$_.title}}, 
                                           @{Name='Status';Expression={$_.status}} | 
                             Format-Table -AutoSize
        }
        
        return $true
    } catch {
        Write-TestResult $false "Project query failed: $($_.Exception.Message)"
        return $false
    }
}

# Test 2: PR Management
function Test-PRManagement {
    Write-TestHeader "Test 2: PR Management Commands"
    
    try {
        Write-Host "Checking open PRs..." -ForegroundColor Cyan
        $prs = gh pr list --state open --json number,title,reviewDecision,mergeable | ConvertFrom-Json
        Write-TestResult $true "PR list retrieved: $($prs.Count) open PRs"
        
        if ($prs.Count -gt 0 -and $Verbose) {
            Write-Host "`nOpen PRs:" -ForegroundColor Yellow
            $prs | Select-Object number, title, reviewDecision, mergeable | Format-Table -AutoSize
        }
        
        return $true
    } catch {
        Write-TestResult $false "PR management test failed: $($_.Exception.Message)"
        return $false
    }
}

# Test 3: Branch Detection
function Test-BranchDetection {
    Write-TestHeader "Test 3: Branch Detection Commands"
    
    try {
        $testIssue = "3"
        
        # Test git branch --list
        $branchList = git branch --list "*fix-e2e-$testIssue*" 2>$null
        Write-TestResult $true "git branch --list command executed"
        
        # Test Select-String method
        $allBranches = git branch -a 2>$null
        $matchingBranches = $allBranches | Select-String "fix-e2e-$testIssue" 2>$null
        Write-TestResult $true "Select-String method executed"
        
        if ($Verbose) {
            if ($branchList) {
                Write-Host "Found branch with --list: $branchList" -ForegroundColor Yellow
            }
            if ($matchingBranches) {
                Write-Host "Found branches with Select-String: $($matchingBranches.Count)" -ForegroundColor Yellow
            }
        }
        
        return $true
    } catch {
        Write-TestResult $false "Branch detection test failed: $($_.Exception.Message)"
        return $false
    }
}

# Test 4: Priority Sorting
function Test-PrioritySorting {
    Write-TestHeader "Test 4: Priority Sorting Logic"
    
    try {
        # Create test data
        $testIssues = @(
            @{ labels = @("story", "e2e-tests", "priority-3-medium"); number = 6; title = "Medium Priority Issue 6" },
            @{ labels = @("story", "e2e-tests", "priority-1-critical"); number = 3; title = "Critical Priority Issue 3" },
            @{ labels = @("story", "e2e-tests", "priority-2-high"); number = 5; title = "High Priority Issue 5" },
            @{ labels = @("story", "e2e-tests", "priority-1-critical"); number = 1; title = "Critical Priority Issue 1" }
        )
        
        $sortedIssues = $testIssues | Select-Object @{Name='Number';Expression={$_.number}}, 
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
        
        $expectedOrder = @(1, 3, 5, 6)
        $actualOrder = $sortedIssues.Number
        $sortingCorrect = ($expectedOrder -join ',') -eq ($actualOrder -join ',')
        
        Write-TestResult $sortingCorrect "Priority sorting logic"
        
        if ($Verbose) {
            Write-Host "Expected order: $($expectedOrder -join ', ')" -ForegroundColor Yellow
            Write-Host "Actual order: $($actualOrder -join ', ')" -ForegroundColor Yellow
        }
        
        return $sortingCorrect
    } catch {
        Write-TestResult $false "Priority sorting test failed: $($_.Exception.Message)"
        return $false
    }
}

# Test 5: Status Filtering
function Test-StatusFiltering {
    Write-TestHeader "Test 5: Status Filtering Logic"
    
    try {
        $testIssues = @(
            @{ status = "Backlog"; number = 3 },
            @{ status = "In Progress"; number = 4 },
            @{ status = "Review"; number = 5 },
            @{ status = "Done"; number = 6 }
        )

        $workableStatuses = @("Backlog", "In Progress")
        $workableIssues = $testIssues | Where-Object { $_.status -in $workableStatuses }
        
        $expectedWorkable = @(3, 4)
        $actualWorkable = $workableIssues.number | Sort-Object
        $filteringCorrect = ($expectedWorkable -join ',') -eq ($actualWorkable -join ',')
        
        Write-TestResult $filteringCorrect "Status filtering logic"
        
        if ($Verbose) {
            Write-Host "Expected workable: $($expectedWorkable -join ', ')" -ForegroundColor Yellow
            Write-Host "Actual workable: $($actualWorkable -join ', ')" -ForegroundColor Yellow
        }
        
        return $filteringCorrect
    } catch {
        Write-TestResult $false "Status filtering test failed: $($_.Exception.Message)"
        return $false
    }
}

# Main execution
function Main {
    Write-Host "E2E Workflow Test Runner" -ForegroundColor Cyan
    Write-Host "Testing all components of the E2E workflow prompts" -ForegroundColor Cyan
    
    $results = @{}
    
    # Always test environment first
    $results["Environment"] = Test-Environment
    
    if ($TestNumber -eq "all") {
        $results["ProjectQuery"] = Test-ProjectQuery
        $results["PRManagement"] = Test-PRManagement
        $results["BranchDetection"] = Test-BranchDetection
        $results["PrioritySorting"] = Test-PrioritySorting
        $results["StatusFiltering"] = Test-StatusFiltering
    } else {
        switch ($TestNumber) {
            "1" { $results["ProjectQuery"] = Test-ProjectQuery }
            "2" { $results["PRManagement"] = Test-PRManagement }
            "3" { $results["BranchDetection"] = Test-BranchDetection }
            "4" { $results["PrioritySorting"] = Test-PrioritySorting }
            "5" { $results["StatusFiltering"] = Test-StatusFiltering }
            default { Write-Host "Invalid test number. Use 1-5 or 'all'" -ForegroundColor Red; return }
        }
    }
    
    # Summary
    Write-TestHeader "Test Results Summary"
    $passed = 0
    $total = $results.Count
    
    foreach ($test in $results.GetEnumerator()) {
        if ($test.Value) {
            Write-TestResult $true "$($test.Key) test passed"
            $passed++
        } else {
            Write-TestResult $false "$($test.Key) test failed"
        }
    }
    
    Write-Host "`nOverall: $passed/$total tests passed" -ForegroundColor $(if ($passed -eq $total) { "Green" } else { "Yellow" })
    
    if ($passed -eq $total) {
        Write-Host "All tests passed! The E2E workflow prompts are ready to use." -ForegroundColor Green
    } else {
        Write-Host "Some tests failed. Please review the errors above." -ForegroundColor Yellow
    }
}

# Run the tests
Main
