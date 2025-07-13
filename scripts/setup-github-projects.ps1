# GitHub Projects Setup Script (PowerShell)
# 
# This script uses GitHub CLI to create projects and issues
# 
# Prerequisites:
# - GitHub CLI installed (gh)
# - Authenticated with GitHub (gh auth login)
# - Run from project root directory
#
# Usage:
#   .\scripts\setup-github-projects.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 GitHub Projects Setup" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow

# Check if GitHub CLI is installed
try {
    gh --version | Out-Null
    Write-Host "✅ GitHub CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "   https://cli.github.com/" -ForegroundColor Red
    exit 1
}

# Check if authenticated
try {
    gh auth status 2>$null | Out-Null
    Write-Host "✅ GitHub CLI is authenticated" -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub CLI is not authenticated. Please run:" -ForegroundColor Red
    Write-Host "   gh auth login" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prerequisites check passed" -ForegroundColor Green

# Function to create issue from story file
function Create-IssueFromStory {
    param(
        [string]$StoryFile,
        [string]$Title,
        [string]$Labels
    )
    
    $storyPath = "stories\$StoryFile"
    
    if (Test-Path $storyPath) {
        # Extract overview from story file
        $content = Get-Content $storyPath -Raw
        $overviewMatch = [regex]::Match($content, '## Overview\s*\n(.*?)(?=\n##|\n$)', [System.Text.RegularExpressions.RegexOptions]::Singleline)
        $overview = if ($overviewMatch.Success) { $overviewMatch.Groups[1].Value.Trim() } else { "" }
        
        # Create issue body
        $body = @"
$overview

## Story File
This issue is based on the story file: ``stories/$StoryFile``

## Implementation
Please follow the detailed requirements in the story file for implementation.

---
*This issue was automatically created from the story file during GitHub migration.*
"@
        
        # Create the issue
        try {
            $issueUrl = gh issue create --title "$Title" --body "$body" --label "$Labels"
            Write-Host "✅ Created issue: $Title" -ForegroundColor Green
            Write-Host "   URL: $issueUrl" -ForegroundColor Gray
        } catch {
            Write-Host "❌ Failed to create issue: $Title" -ForegroundColor Red
            Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️  Story file not found: $storyPath" -ForegroundColor Yellow
    }
}

# Create main development project
Write-Host ""
Write-Host "📋 Creating main development project..." -ForegroundColor Yellow
try {
    $mainProjectUrl = gh project create --title "Texas 42 Development Board" --owner "@me"
    Write-Host "✅ Main project created: $mainProjectUrl" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create main project: $($_.Exception.Message)" -ForegroundColor Red
}

# Create E2E fixes project
Write-Host ""
Write-Host "🧪 Creating E2E fixes project..." -ForegroundColor Yellow
try {
    $e2eProjectUrl = gh project create --title "E2E Test Fixes" --owner "@me"
    Write-Host "✅ E2E project created: $e2eProjectUrl" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create E2E project: $($_.Exception.Message)" -ForegroundColor Red
}

# Create rules research project
Write-Host ""
Write-Host "📚 Creating rules research project..." -ForegroundColor Yellow
try {
    $rulesProjectUrl = gh project create --title "Texas 42 Rules Research" --owner "@me"
    Write-Host "✅ Rules project created: $rulesProjectUrl" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create rules project: $($_.Exception.Message)" -ForegroundColor Red
}

# Create issues from story files
Write-Host ""
Write-Host "🎫 Creating issues from story files..." -ForegroundColor Yellow

# Create issues for main stories
Write-Host ""
Write-Host "📝 Creating main development issues..." -ForegroundColor Cyan

Create-IssueFromStory "initial-features-1.md" "Story: Core Domino Components and Visual Foundation" "story,core-features"
Create-IssueFromStory "initial-features-2.md" "Story: Initial Features 2" "story,core-features"
Create-IssueFromStory "initial-features-3.md" "Story: Initial Features 3" "story,core-features"
Create-IssueFromStory "initial-features-4.md" "Story: Initial Features 4" "story,core-features"
Create-IssueFromStory "initial-features-5.md" "Story: Initial Features 5" "story,core-features"
Create-IssueFromStory "initial-features-6.md" "Story: Initial Features 6" "story,core-features"
Create-IssueFromStory "initial-features-7.md" "Story: Initial Features 7" "story,core-features"
Create-IssueFromStory "initial-features-8.md" "Story: Initial Features 8" "story,core-features"

# Create issues for E2E fixes
Write-Host ""
Write-Host "🧪 Creating E2E fix issues..." -ForegroundColor Cyan

Create-IssueFromStory "fix-e2e-1-basic-lobby-display.md" "Fix: Basic Lobby Display E2E Tests" "bug,e2e-tests"
Create-IssueFromStory "fix-e2e-2-game-creation-modal.md" "Fix: Game Creation Modal E2E Tests" "bug,e2e-tests"
Create-IssueFromStory "fix-e2e-3-game-cards-display.md" "Fix: Game Cards Display E2E Tests" "bug,e2e-tests"
Create-IssueFromStory "fix-e2e-4-player-management.md" "Fix: Player Management E2E Tests" "bug,e2e-tests"
Create-IssueFromStory "fix-e2e-5-ready-system.md" "Fix: Ready System E2E Tests" "bug,e2e-tests"
Create-IssueFromStory "fix-e2e-6-spectator-mode.md" "Fix: Spectator Mode E2E Tests" "bug,e2e-tests"
Create-IssueFromStory "fix-e2e-7-error-handling.md" "Fix: Error Handling E2E Tests" "bug,e2e-tests"
Create-IssueFromStory "fix-e2e-8-bidding-e2e.md" "Fix: Bidding E2E Tests" "bug,e2e-tests"

# Create issues for rules research
Write-Host ""
Write-Host "📚 Creating rules research issues..." -ForegroundColor Cyan

Create-IssueFromStory "rules-research-1-equipment-setup.md" "Research: Texas 42 Equipment and Setup" "story,rules"
Create-IssueFromStory "rules-research-2-domino-values.md" "Research: Domino Values and Counting" "story,rules"
Create-IssueFromStory "rules-research-3-bidding-mechanics.md" "Research: Bidding Mechanics" "story,rules"
Create-IssueFromStory "rules-research-4-trump-suits.md" "Research: Trump Suits System" "story,rules"
Create-IssueFromStory "rules-research-5-trick-taking.md" "Research: Trick Taking Rules" "story,rules"
Create-IssueFromStory "rules-research-6-scoring-calculation.md" "Research: Scoring Calculation" "story,rules"
Create-IssueFromStory "rules-research-7-edge-cases.md" "Research: Edge Cases and Variations" "story,rules"
Create-IssueFromStory "rules-research-8-implementation-validation.md" "Research: Implementation Validation" "story,rules"

# Summary
Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host "✅ Created 3 GitHub Projects:" -ForegroundColor Green
if ($mainProjectUrl) { Write-Host "   📋 Main Development: $mainProjectUrl" -ForegroundColor Gray }
if ($e2eProjectUrl) { Write-Host "   🧪 E2E Fixes: $e2eProjectUrl" -ForegroundColor Gray }
if ($rulesProjectUrl) { Write-Host "   📚 Rules Research: $rulesProjectUrl" -ForegroundColor Gray }
Write-Host ""
Write-Host "✅ Created GitHub Issues from story files" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Visit your GitHub repository to see the projects and issues" -ForegroundColor White
Write-Host "2. Set up project columns manually in the web interface:" -ForegroundColor White
Write-Host "   - Main Project: Backlog, In Progress, Review, Done" -ForegroundColor White
Write-Host "   - E2E Project: To Fix, Fixing, Fixed" -ForegroundColor White
Write-Host "   - Rules Project: Research, Documenting, Complete" -ForegroundColor White
Write-Host "3. Add issues to appropriate project boards" -ForegroundColor White
Write-Host "4. Configure project automation if desired" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Use 'gh project list' to see all your projects" -ForegroundColor Cyan
Write-Host "💡 Tip: Use 'gh issue list' to see all your issues" -ForegroundColor Cyan
