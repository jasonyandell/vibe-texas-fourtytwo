#!/bin/bash

# GitHub Projects Setup Script
# 
# This script uses GitHub CLI to create projects and issues
# 
# Prerequisites:
# - GitHub CLI installed (gh)
# - Authenticated with GitHub (gh auth login)
# - Run from project root directory
#
# Usage:
#   chmod +x scripts/setup-github-projects.sh
#   ./scripts/setup-github-projects.sh

set -e

echo "🚀 GitHub Projects Setup"
echo "========================"

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI is not installed. Please install it first:"
    echo "   https://cli.github.com/"
    exit 1
fi

if ! gh auth status &> /dev/null; then
    echo "❌ GitHub CLI is not authenticated. Please run:"
    echo "   gh auth login"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create main development project
echo ""
echo "📋 Creating main development project..."
MAIN_PROJECT_URL=$(gh project create \
    --title "Texas 42 Development Board" \
    --owner "@me")

echo "✅ Main project created: $MAIN_PROJECT_URL"

# Create E2E fixes project
echo ""
echo "🧪 Creating E2E fixes project..."
E2E_PROJECT_URL=$(gh project create \
    --title "E2E Test Fixes" \
    --owner "@me")

echo "✅ E2E project created: $E2E_PROJECT_URL"

# Create rules research project
echo ""
echo "📚 Creating rules research project..."
RULES_PROJECT_URL=$(gh project create \
    --title "Texas 42 Rules Research" \
    --owner "@me")

echo "✅ Rules project created: $RULES_PROJECT_URL"

# Create issues from story files
echo ""
echo "🎫 Creating issues from story files..."

# Function to create issue from story file
create_issue_from_story() {
    local story_file="$1"
    local title="$2"
    local labels="$3"
    
    # Extract overview from story file
    local overview=$(sed -n '/## Overview/,/## /p' "stories/$story_file" | head -n -1 | tail -n +2)
    
    # Create issue body
    local body="$overview

## Story File
This issue is based on the story file: \`stories/$story_file\`

## Implementation
Please follow the detailed requirements in the story file for implementation.

---
*This issue was automatically created from the story file during GitHub migration.*"

    # Create the issue
    local issue_url=$(gh issue create \
        --title "$title" \
        --body "$body" \
        --label "$labels")
    
    echo "✅ Created issue: $title"
    echo "   URL: $issue_url"
}

# Create issues for main stories
echo ""
echo "📝 Creating main development issues..."

if [ -f "stories/initial-features-1.md" ]; then
    create_issue_from_story "initial-features-1.md" "Story: Core Domino Components and Visual Foundation" "story,core-features"
fi

if [ -f "stories/initial-features-2.md" ]; then
    create_issue_from_story "initial-features-2.md" "Story: Initial Features 2" "story,core-features"
fi

if [ -f "stories/initial-features-3.md" ]; then
    create_issue_from_story "initial-features-3.md" "Story: Initial Features 3" "story,core-features"
fi

if [ -f "stories/initial-features-4.md" ]; then
    create_issue_from_story "initial-features-4.md" "Story: Initial Features 4" "story,core-features"
fi

if [ -f "stories/initial-features-5.md" ]; then
    create_issue_from_story "initial-features-5.md" "Story: Initial Features 5" "story,core-features"
fi

if [ -f "stories/initial-features-6.md" ]; then
    create_issue_from_story "initial-features-6.md" "Story: Initial Features 6" "story,core-features"
fi

if [ -f "stories/initial-features-7.md" ]; then
    create_issue_from_story "initial-features-7.md" "Story: Initial Features 7" "story,core-features"
fi

if [ -f "stories/initial-features-8.md" ]; then
    create_issue_from_story "initial-features-8.md" "Story: Initial Features 8" "story,core-features"
fi

# Create issues for E2E fixes
echo ""
echo "🧪 Creating E2E fix issues..."

if [ -f "stories/fix-e2e-1-basic-lobby-display.md" ]; then
    create_issue_from_story "fix-e2e-1-basic-lobby-display.md" "Fix: Basic Lobby Display E2E Tests" "bug,e2e-tests"
fi

if [ -f "stories/fix-e2e-2-game-creation-modal.md" ]; then
    create_issue_from_story "fix-e2e-2-game-creation-modal.md" "Fix: Game Creation Modal E2E Tests" "bug,e2e-tests"
fi

if [ -f "stories/fix-e2e-3-game-cards-display.md" ]; then
    create_issue_from_story "fix-e2e-3-game-cards-display.md" "Fix: Game Cards Display E2E Tests" "bug,e2e-tests"
fi

if [ -f "stories/fix-e2e-4-player-management.md" ]; then
    create_issue_from_story "fix-e2e-4-player-management.md" "Fix: Player Management E2E Tests" "bug,e2e-tests"
fi

if [ -f "stories/fix-e2e-5-ready-system.md" ]; then
    create_issue_from_story "fix-e2e-5-ready-system.md" "Fix: Ready System E2E Tests" "bug,e2e-tests"
fi

if [ -f "stories/fix-e2e-6-spectator-mode.md" ]; then
    create_issue_from_story "fix-e2e-6-spectator-mode.md" "Fix: Spectator Mode E2E Tests" "bug,e2e-tests"
fi

if [ -f "stories/fix-e2e-7-error-handling.md" ]; then
    create_issue_from_story "fix-e2e-7-error-handling.md" "Fix: Error Handling E2E Tests" "bug,e2e-tests"
fi

if [ -f "stories/fix-e2e-8-bidding-e2e.md" ]; then
    create_issue_from_story "fix-e2e-8-bidding-e2e.md" "Fix: Bidding E2E Tests" "bug,e2e-tests"
fi

# Create issues for rules research
echo ""
echo "📚 Creating rules research issues..."

if [ -f "stories/rules-research-1-equipment-setup.md" ]; then
    create_issue_from_story "rules-research-1-equipment-setup.md" "Research: Texas 42 Equipment and Setup" "story,rules"
fi

if [ -f "stories/rules-research-2-domino-values.md" ]; then
    create_issue_from_story "rules-research-2-domino-values.md" "Research: Domino Values and Counting" "story,rules"
fi

if [ -f "stories/rules-research-3-bidding-mechanics.md" ]; then
    create_issue_from_story "rules-research-3-bidding-mechanics.md" "Research: Bidding Mechanics" "story,rules"
fi

if [ -f "stories/rules-research-4-trump-suits.md" ]; then
    create_issue_from_story "rules-research-4-trump-suits.md" "Research: Trump Suits System" "story,rules"
fi

if [ -f "stories/rules-research-5-trick-taking.md" ]; then
    create_issue_from_story "rules-research-5-trick-taking.md" "Research: Trick Taking Rules" "story,rules"
fi

if [ -f "stories/rules-research-6-scoring-calculation.md" ]; then
    create_issue_from_story "rules-research-6-scoring-calculation.md" "Research: Scoring Calculation" "story,rules"
fi

if [ -f "stories/rules-research-7-edge-cases.md" ]; then
    create_issue_from_story "rules-research-7-edge-cases.md" "Research: Edge Cases and Variations" "story,rules"
fi

if [ -f "stories/rules-research-8-implementation-validation.md" ]; then
    create_issue_from_story "rules-research-8-implementation-validation.md" "Research: Implementation Validation" "story,rules"
fi

# Summary
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo "✅ Created 3 GitHub Projects:"
echo "   📋 Main Development: $MAIN_PROJECT_URL"
echo "   🧪 E2E Fixes: $E2E_PROJECT_URL"
echo "   📚 Rules Research: $RULES_PROJECT_URL"
echo ""
echo "✅ Created GitHub Issues from story files"
echo ""
echo "📋 Next Steps:"
echo "1. Visit your GitHub repository to see the projects and issues"
echo "2. Set up project columns manually in the web interface:"
echo "   - Main Project: Backlog, In Progress, Review, Done"
echo "   - E2E Project: To Fix, Fixing, Fixed"
echo "   - Rules Project: Research, Documenting, Complete"
echo "3. Add issues to appropriate project boards"
echo "4. Configure project automation if desired"
echo ""
echo "💡 Tip: Use 'gh project list' to see all your projects"
echo "💡 Tip: Use 'gh issue list' to see all your issues"
