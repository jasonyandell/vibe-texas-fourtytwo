@echo off
REM E2E Workflow Automation Launcher (Batch Version)
REM Simple launcher for the E2E workflow prompt

echo.
echo ================================================================
echo                E2E Workflow Automation Launcher
echo ================================================================
echo.

REM Check if PowerShell script exists
if not exist "scripts\start-e2e-workflow.ps1" (
    echo ERROR: PowerShell script not found!
    echo Please run from the project root directory.
    pause
    exit /b 1
)

REM Check command line arguments
if "%1"=="--help" goto :help
if "%1"=="-h" goto :help
if "%1"=="--status" goto :status
if "%1"=="-s" goto :status
if "%1"=="--dry-run" goto :dryrun
if "%1"=="-d" goto :dryrun

REM Default execution
echo Starting E2E workflow launcher...
powershell -ExecutionPolicy Bypass -File "scripts\start-e2e-workflow.ps1"
goto :end

:help
echo USAGE: start-e2e-workflow.bat [OPTIONS]
echo.
echo OPTIONS:
echo   --help, -h      Show this help message
echo   --status, -s    Show current project status before launching
echo   --dry-run, -d   Preview mode - show what would be done
echo.
echo EXAMPLES:
echo   start-e2e-workflow.bat              Start workflow
echo   start-e2e-workflow.bat --status     Show status first
echo   start-e2e-workflow.bat --dry-run    Preview mode
echo.
goto :end

:status
echo Starting E2E workflow launcher with status display...
powershell -ExecutionPolicy Bypass -File "scripts\start-e2e-workflow.ps1" -ShowStatus
goto :end

:dryrun
echo Starting E2E workflow launcher in dry-run mode...
powershell -ExecutionPolicy Bypass -File "scripts\start-e2e-workflow.ps1" -DryRun
goto :end

:end
echo.
pause
