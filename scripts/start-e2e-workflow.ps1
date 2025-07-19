# E2E Workflow Automation Launcher
# This script launches the E2E workflow prompt for iterative, single-task execution

param(
    [switch]$ShowStatus = $false,
    [switch]$DryRun = $false,
    [switch]$Help = $false
)

# Color functions for better output
function Write-Header {
    param([string]$message)
    Write-Host "`n" + "="*60 -ForegroundColor Cyan
    Write-Host $message -ForegroundColor Cyan
    Write-Host "="*60 -ForegroundColor Cyan
}

function Write-Info {
    param([string]$message)
    Write-Host "ℹ️  $message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$message)
    Write-Host "✅ $message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$message)
    Write-Host "⚠️  $message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$message)
    Write-Host "❌ $message" -ForegroundColor Red
}

# Help function
function Show-Help {
    Write-Header "E2E Workflow Automation Launcher"
    Write-Host @"
This script launches the E2E workflow prompt for systematic, single-task execution.

USAGE:
    .\scripts\start-e2e-workflow.ps1 [OPTIONS]

OPTIONS:
    -ShowStatus     Show current project status before launching
    -DryRun         Show what would be done without executing
    -Help           Show this help message

DESCRIPTION:
    The E2E workflow is designed for iterative execution:
    1. Each run executes EXACTLY ONE task
    2. Tasks are prioritized automatically by labels
    3. System respects GitHub Project board status
    4. Windows-compatible PowerShell commands used

WORKFLOW PRIORITY:
    1. Merge approved PRs
    2. Fix PRs with blocking comments
    3. Review unreviewed PRs
    4. Work on next priority issue

EXAMPLES:
    .\scripts\start-e2e-workflow.ps1                    # Start workflow
    .\scripts\start-e2e-workflow.ps1 -ShowStatus        # Show status first
    .\scripts\start-e2e-workflow.ps1 -DryRun            # Preview mode

"@ -ForegroundColor White
}

# Check prerequisites
function Test-Prerequisites {
    Write-Info "Checking prerequisites..."
    
    $allGood = $true
    
    # Check GitHub CLI
    try {
        $ghVersion = gh --version 2>$null
        Write-Success "GitHub CLI available: $($ghVersion[0])"
    } catch {
        Write-Error "GitHub CLI not found. Install from: https://cli.github.com/"
        $allGood = $false
    }
    
    # Check Git
    try {
        $gitVersion = git --version 2>$null
        Write-Success "Git available: $gitVersion"
    } catch {
        Write-Error "Git not found. Install from: https://git-scm.com/"
        $allGood = $false
    }
    
    # Check GitHub authentication
    try {
        gh auth status 2>$null
        Write-Success "GitHub authentication working"
    } catch {
        Write-Error "GitHub authentication failed. Run: gh auth login"
        $allGood = $false
    }
    
    # Check if we're in the right directory
    if (-not (Test-Path "READY_TO_USE_E2E_PROMPT.md")) {
        Write-Error "READY_TO_USE_E2E_PROMPT.md not found. Run from project root."
        $allGood = $false
    } else {
        Write-Success "E2E prompt file found"
    }
    
    return $allGood
}

# Show current project status
function Show-ProjectStatus {
    Write-Header "Current E2E Project Status"
    
    try {
        Write-Info "Querying GitHub Project #2 (E2E Test Fixes)..."
        
        $projectData = gh project item-list 2 --owner jasonyandell --format json | ConvertFrom-Json
        $e2eIssues = $projectData.items | Where-Object { $_.labels -contains "e2e-tests" }
        
        if ($e2eIssues.Count -eq 0) {
            Write-Warning "No E2E test issues found in project board"
            return
        }
        
        # Sort by priority
        $sortedIssues = $e2eIssues | Select-Object @{
            Name='Number';Expression={$_.content.number}
        }, @{
            Name='Title';Expression={$_.title}
        }, @{
            Name='Status';Expression={$_.status}
        }, @{
            Name='Priority';Expression={
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
        
        Write-Success "Found $($e2eIssues.Count) E2E test issues"
        Write-Host "`nIssue Priority Order:" -ForegroundColor Yellow
        $sortedIssues | Format-Table -AutoSize
        
        # Check for workable issues
        $workableStatuses = @("Backlog", "In Progress")
        $workableIssues = $sortedIssues | Where-Object { $_.Status -in $workableStatuses }
        
        if ($workableIssues.Count -gt 0) {
            $nextIssue = $workableIssues[0]
            Write-Info "Next issue to work: #$($nextIssue.Number) - $($nextIssue.Title)"
        } else {
            Write-Warning "No workable issues found (all in Review or Done status)"
        }
        
        # Check for open PRs
        Write-Info "Checking for open PRs..."
        $prs = gh pr list --state open --json number,title,reviewDecision,mergeable | ConvertFrom-Json
        
        if ($prs.Count -gt 0) {
            Write-Warning "Found $($prs.Count) open PRs - these will be processed first"
            $prs | Select-Object number, title, reviewDecision, mergeable | Format-Table -AutoSize
        } else {
            Write-Success "No open PRs - ready to work on issues"
        }
        
    } catch {
        Write-Error "Failed to query project status: $($_.Exception.Message)"
    }
}

# Generate the workflow prompt
function Get-WorkflowPrompt {
    return @"
Continue E2E Test Project workflow. Execute the next single task:

1. Query GitHub Project #2 state: gh project item-list 2 --owner jasonyandell --format json
2. Check for approved PRs to merge
3. Check for PRs with blocking comments to fix  
4. Check for unreviewed PRs to review
5. Work on next priority issue from project board (only "Backlog" or "In Progress" status)

Execute ONLY ONE task and stop. Use Windows-compatible commands.

Follow the workflow in READY_TO_USE_E2E_PROMPT.md for detailed instructions.
"@
}

# Main execution
function Main {
    if ($Help) {
        Show-Help
        return
    }
    
    Write-Header "E2E Workflow Automation Launcher"
    
    # Check prerequisites
    if (-not (Test-Prerequisites)) {
        Write-Error "Prerequisites not met. Please fix the issues above."
        return
    }
    
    # Show status if requested
    if ($ShowStatus) {
        Show-ProjectStatus
        Write-Host "`nPress any key to continue with workflow launch..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    
    # Generate prompt
    $prompt = Get-WorkflowPrompt
    
    if ($DryRun) {
        Write-Header "DRY RUN - Workflow Prompt Preview"
        Write-Host $prompt -ForegroundColor White
        Write-Warning "This is a dry run. No actions will be executed."
        return
    }
    
    # Launch workflow
    Write-Header "Launching E2E Workflow"

    # Simple approach - just show the trigger phrase
    Write-Info "SIMPLE METHOD: Open Augment Code and type:"
    Write-Host "`n    work e2e queue`n" -ForegroundColor Yellow -BackgroundColor DarkBlue
    Write-Info "Augment will automatically execute the E2E workflow!"

    Write-Host "`n" + "-"*60 -ForegroundColor Gray
    Write-Info "ALTERNATIVE: Use the full prompt below:"
    Write-Host "`n$prompt`n" -ForegroundColor White

    # Copy to clipboard (Windows)
    try {
        $prompt | Set-Clipboard
        Write-Success "Full prompt copied to clipboard as backup!"
    } catch {
        Write-Warning "Could not copy to clipboard."
    }

    Write-Host "`n" + "-"*60 -ForegroundColor Gray
    Write-Info "WORKFLOW INSTRUCTIONS:"
    Write-Host "1. Open Augment Code chat" -ForegroundColor White
    Write-Host "2. Type: work e2e queue" -ForegroundColor Yellow
    Write-Host "3. Augment will execute EXACTLY ONE task" -ForegroundColor White
    Write-Host "4. After completion, run this script again for the next task" -ForegroundColor White
    Write-Host "-"*60 -ForegroundColor Gray
    
    Write-Success "E2E Workflow launcher ready!"
}

# Execute main function
Main
