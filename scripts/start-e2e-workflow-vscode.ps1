# E2E Workflow Automation with VSCode Integration
# Enhanced script that integrates with VSCode and attempts to trigger Augment Code

param(
    [switch]$ShowStatus = $false,
    [switch]$DryRun = $false,
    [switch]$OpenVSCode = $false,
    [switch]$CreateTask = $false,
    [switch]$Help = $false
)

# Color functions
function Write-ScriptHeader {
    param([string]$message)
    Write-Host "`n" + "="*60 -ForegroundColor Cyan
    Write-Host $message -ForegroundColor Cyan
    Write-Host "="*60 -ForegroundColor Cyan
}

function Write-ScriptInfo {
    param([string]$message)
    Write-Host "INFO: $message" -ForegroundColor Blue
}

function Write-ScriptSuccess {
    param([string]$message)
    Write-Host "SUCCESS: $message" -ForegroundColor Green
}

function Write-ScriptWarning {
    param([string]$message)
    Write-Host "WARNING: $message" -ForegroundColor Yellow
}

function Write-ScriptError {
    param([string]$message)
    Write-Host "ERROR: $message" -ForegroundColor Red
}

# Help function
function Show-ScriptHelp {
    Write-ScriptHeader "E2E Workflow Automation with VSCode Integration"
    Write-Host "Enhanced script that integrates with VSCode and attempts to trigger Augment Code extension." -ForegroundColor White
    Write-Host ""
    Write-Host "USAGE:" -ForegroundColor Yellow
    Write-Host "    .\scripts\start-e2e-workflow-vscode.ps1 [OPTIONS]" -ForegroundColor White
    Write-Host ""
    Write-Host "OPTIONS:" -ForegroundColor Yellow
    Write-Host "    -ShowStatus     Show current project status before launching" -ForegroundColor White
    Write-Host "    -DryRun         Show what would be done without executing" -ForegroundColor White
    Write-Host "    -OpenVSCode     Open VSCode with the prompt file" -ForegroundColor White
    Write-Host "    -CreateTask     Create VSCode task for automation" -ForegroundColor White
    Write-Host "    -Help           Show this help message" -ForegroundColor White
    Write-Host ""
    Write-Host "AUTOMATION APPROACHES:" -ForegroundColor Yellow
    Write-Host "    1. Clipboard and VSCode Opening" -ForegroundColor White
    Write-Host "    2. VSCode Task Creation" -ForegroundColor White
    Write-Host "    3. Direct file opening in VSCode" -ForegroundColor White
    Write-Host ""
    Write-Host "EXAMPLES:" -ForegroundColor Yellow
    Write-Host "    .\scripts\start-e2e-workflow-vscode.ps1                    # Standard workflow" -ForegroundColor White
    Write-Host "    .\scripts\start-e2e-workflow-vscode.ps1 -OpenVSCode        # Open in VSCode" -ForegroundColor White
    Write-Host "    .\scripts\start-e2e-workflow-vscode.ps1 -CreateTask        # Create VSCode task" -ForegroundColor White
    Write-Host "    .\scripts\start-e2e-workflow-vscode.ps1 -ShowStatus        # Show status first" -ForegroundColor White
}

# Check if VSCode is available
function Test-VSCodeAvailable {
    try {
        $null = Get-Command "code" -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Create VSCode task for automation
function New-VSCodeTask {
    Write-ScriptInfo "Creating VSCode task for E2E workflow automation..."
    
    $vscodePath = ".vscode"
    $tasksPath = "$vscodePath/tasks.json"
    
    # Create .vscode directory if it doesn't exist
    if (-not (Test-Path $vscodePath)) {
        New-Item -ItemType Directory -Path $vscodePath -Force | Out-Null
        Write-ScriptSuccess "Created .vscode directory"
    }
    
    # Create tasks.json content
    $tasksContent = @{
        version = "2.0.0"
        tasks = @(
            @{
                label = "E2E Workflow: Submit Prompt"
                type = "shell"
                command = "powershell"
                args = @(
                    "-Command",
                    "Write-Host 'E2E Workflow Prompt:' -ForegroundColor Cyan; Write-Host 'Prompt copied to clipboard!' -ForegroundColor Green"
                )
                group = "build"
                presentation = @{
                    echo = $true
                    reveal = "always"
                    focus = $false
                    panel = "shared"
                    showReuseMessage = $true
                    clear = $false
                }
                problemMatcher = @()
            },
            @{
                label = "E2E Workflow: Open Augment Chat"
                type = "shell"
                command = "code"
                args = @("--command", "workbench.action.showCommands")
                group = "build"
                presentation = @{
                    echo = $true
                    reveal = "silent"
                    focus = $false
                    panel = "shared"
                }
                problemMatcher = @()
                dependsOn = "E2E Workflow: Submit Prompt"
            }
        )
    }
    
    # Write tasks.json
    $tasksContent | ConvertTo-Json -Depth 10 | Out-File -FilePath $tasksPath -Encoding UTF8
    Write-ScriptSuccess "Created VSCode task: $tasksPath"

    Write-ScriptInfo "You can now run the task with:"
    Write-Host "  code --command workbench.action.tasks.runTask 'E2E Workflow: Submit Prompt'" -ForegroundColor Yellow
    Write-Host "  Or use Ctrl+Shift+P -> 'Tasks: Run Task' -> 'E2E Workflow: Submit Prompt'" -ForegroundColor Yellow
}

# Generate the workflow prompt
function Get-WorkflowPrompt {
    $prompt = "Continue E2E Test Project workflow. Execute the next single task:`n`n"
    $prompt += "1. Query GitHub Project #2 state: gh project item-list 2 --owner jasonyandell --format json`n"
    $prompt += "2. Check for approved PRs to merge`n"
    $prompt += "3. Check for PRs with blocking comments to fix`n"
    $prompt += "4. Check for unreviewed PRs to review`n"
    $prompt += "5. Work on next priority issue from project board (only 'Backlog' or 'In Progress' status)`n`n"
    $prompt += "Execute ONLY ONE task and stop. Use Windows-compatible commands.`n`n"
    $prompt += "Follow the workflow in READY_TO_USE_E2E_PROMPT.md for detailed instructions."
    return $prompt
}

# Open VSCode with prompt
function Open-VSCodeWithPrompt {
    Write-ScriptInfo "Opening VSCode with E2E workflow prompt..."
    
    $prompt = Get-WorkflowPrompt
    $tempFile = "temp-e2e-prompt.md"
    
    # Create temporary prompt file
    $fileContent = "# E2E Workflow Prompt`n`n$prompt`n`n## Instructions`n"
    $fileContent += "1. Copy the prompt above`n"
    $fileContent += "2. Open Augment Code extension (Ctrl+Shift+P -> 'Augment')`n"
    $fileContent += "3. Paste the prompt and execute`n"
    $fileContent += "4. After completion, delete this file and run the script again`n"

    $fileContent | Out-File -FilePath $tempFile -Encoding UTF8
    
    # Copy to clipboard
    $prompt | Set-Clipboard
    Write-ScriptSuccess "Prompt copied to clipboard"

    # Open in VSCode
    if (Test-VSCodeAvailable) {
        Start-Process "code" -ArgumentList $tempFile
        Write-ScriptSuccess "Opened VSCode with prompt file: $tempFile"
        Write-ScriptWarning "Remember to delete $tempFile after use"
    } else {
        Write-ScriptError "VSCode 'code' command not found in PATH"
    }
}

# Show current project status (simplified version)
function Show-ProjectStatus {
    Write-ScriptHeader "Current E2E Project Status"

    try {
        Write-ScriptInfo "Querying GitHub Project #2 (E2E Test Fixes)..."
        $projectData = gh project item-list 2 --owner jasonyandell --format json | ConvertFrom-Json
        $e2eIssues = $projectData.items | Where-Object { $_.labels -contains "e2e-tests" }
        
        if ($e2eIssues.Count -eq 0) {
            Write-ScriptWarning "No E2E test issues found in project board"
            return
        }

        Write-ScriptSuccess "Found $($e2eIssues.Count) E2E test issues"

        # Check for open PRs
        $prs = gh pr list --state open --json number,title | ConvertFrom-Json
        if ($prs.Count -gt 0) {
            Write-ScriptWarning "Found $($prs.Count) open PRs - these will be processed first"
        } else {
            Write-ScriptSuccess "No open PRs - ready to work on issues"
        }

    } catch {
        Write-ScriptError "Failed to query project status: $($_.Exception.Message)"
    }
}

# Main execution
function Main {
    if ($Help) {
        Show-ScriptHelp
        return
    }

    Write-ScriptHeader "E2E Workflow Automation with VSCode Integration"
    
    # Show status if requested
    if ($ShowStatus) {
        Show-ProjectStatus
        Write-Host "`nPress any key to continue..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    
    # Handle different modes
    if ($CreateTask) {
        if ($DryRun) {
            Write-ScriptWarning "DRY RUN: Would create VSCode task for E2E workflow"
        } else {
            New-VSCodeTask
        }
        return
    }

    if ($OpenVSCode) {
        if ($DryRun) {
            Write-ScriptWarning "DRY RUN: Would open VSCode with E2E workflow prompt"
        } else {
            Open-VSCodeWithPrompt
        }
        return
    }
    
    # Default behavior - generate prompt and copy to clipboard
    $prompt = Get-WorkflowPrompt
    
    if ($DryRun) {
        Write-ScriptHeader "DRY RUN - Workflow Prompt Preview"
        Write-Host $prompt -ForegroundColor White
        Write-ScriptWarning "This is a dry run. No actions will be executed."
        return
    }

    # Standard workflow
    Write-ScriptHeader "E2E Workflow Prompt Generated"
    Write-Host $prompt -ForegroundColor White
    
    # Copy to clipboard
    try {
        $prompt | Set-Clipboard
        Write-ScriptSuccess "Prompt copied to clipboard!"
    } catch {
        Write-ScriptWarning "Could not copy to clipboard"
    }

    Write-Host "`n" + "-"*60 -ForegroundColor Gray
    Write-ScriptInfo "NEXT STEPS:"
    Write-Host "1. Open VSCode (if not already open)" -ForegroundColor White
    Write-Host "2. Open Augment Code extension (Ctrl+Shift+P -> 'Augment')" -ForegroundColor White
    Write-Host "3. Paste the prompt (already in clipboard)" -ForegroundColor White
    Write-Host "4. Execute and wait for completion" -ForegroundColor White
    Write-Host "5. Run this script again for the next task" -ForegroundColor White
    Write-Host "-"*60 -ForegroundColor Gray
    
    if (Test-VSCodeAvailable) {
        Write-ScriptInfo "VSCode detected. You can also use:"
        Write-Host "  .\scripts\start-e2e-workflow-vscode.ps1 -OpenVSCode" -ForegroundColor Yellow
        Write-Host "  .\scripts\start-e2e-workflow-vscode.ps1 -CreateTask" -ForegroundColor Yellow
    }

    Write-ScriptSuccess "E2E Workflow ready for execution!"
}

# Execute main function
Main
