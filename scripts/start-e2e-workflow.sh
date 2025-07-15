#!/bin/bash
# E2E Workflow Automation Launcher (Unix/Linux/macOS Version)
# Cross-platform launcher for the E2E workflow prompt

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${CYAN}================================================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}================================================================${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Help function
show_help() {
    print_header "E2E Workflow Automation Launcher"
    cat << EOF

This script launches the E2E workflow prompt for systematic, single-task execution.

USAGE:
    ./scripts/start-e2e-workflow.sh [OPTIONS]

OPTIONS:
    -s, --status        Show current project status before launching
    -d, --dry-run       Show what would be done without executing
    -h, --help          Show this help message

DESCRIPTION:
    The E2E workflow is designed for iterative execution:
    1. Each run executes EXACTLY ONE task
    2. Tasks are prioritized automatically by labels
    3. System respects GitHub Project board status
    4. Cross-platform compatible commands used

WORKFLOW PRIORITY:
    1. Merge approved PRs
    2. Fix PRs with blocking comments
    3. Review unreviewed PRs
    4. Work on next priority issue

EXAMPLES:
    ./scripts/start-e2e-workflow.sh                    # Start workflow
    ./scripts/start-e2e-workflow.sh --status           # Show status first
    ./scripts/start-e2e-workflow.sh --dry-run          # Preview mode

EOF
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    local all_good=true
    
    # Check GitHub CLI
    if command -v gh >/dev/null 2>&1; then
        local gh_version=$(gh --version | head -n1)
        print_success "GitHub CLI available: $gh_version"
    else
        print_error "GitHub CLI not found. Install from: https://cli.github.com/"
        all_good=false
    fi
    
    # Check Git
    if command -v git >/dev/null 2>&1; then
        local git_version=$(git --version)
        print_success "Git available: $git_version"
    else
        print_error "Git not found. Install from: https://git-scm.com/"
        all_good=false
    fi
    
    # Check GitHub authentication
    if gh auth status >/dev/null 2>&1; then
        print_success "GitHub authentication working"
    else
        print_error "GitHub authentication failed. Run: gh auth login"
        all_good=false
    fi
    
    # Check if we're in the right directory
    if [[ ! -f "READY_TO_USE_E2E_PROMPT.md" ]]; then
        print_error "READY_TO_USE_E2E_PROMPT.md not found. Run from project root."
        all_good=false
    else
        print_success "E2E prompt file found"
    fi
    
    if [[ "$all_good" == "false" ]]; then
        return 1
    fi
    return 0
}

# Show current project status
show_project_status() {
    print_header "Current E2E Project Status"
    
    print_info "Querying GitHub Project #2 (E2E Test Fixes)..."
    
    # Get project data
    local project_data=$(gh project item-list 2 --owner jasonyandell --format json 2>/dev/null)
    
    if [[ $? -ne 0 ]]; then
        print_error "Failed to query project board"
        return 1
    fi
    
    # Count E2E issues (simplified for shell)
    local e2e_count=$(echo "$project_data" | jq '[.items[] | select(.labels[]? == "e2e-tests")] | length' 2>/dev/null || echo "0")
    
    if [[ "$e2e_count" -eq 0 ]]; then
        print_warning "No E2E test issues found in project board"
        return 0
    fi
    
    print_success "Found $e2e_count E2E test issues"
    
    # Check for open PRs
    print_info "Checking for open PRs..."
    local pr_count=$(gh pr list --state open --json number | jq '. | length' 2>/dev/null || echo "0")
    
    if [[ "$pr_count" -gt 0 ]]; then
        print_warning "Found $pr_count open PRs - these will be processed first"
    else
        print_success "No open PRs - ready to work on issues"
    fi
}

# Generate the workflow prompt
get_workflow_prompt() {
    cat << 'EOF'
Continue E2E Test Project workflow. Execute the next single task:

1. Query GitHub Project #2 state: gh project item-list 2 --owner jasonyandell --format json
2. Check for approved PRs to merge
3. Check for PRs with blocking comments to fix  
4. Check for unreviewed PRs to review
5. Work on next priority issue from project board (only "Backlog" or "In Progress" status)

Execute ONLY ONE task and stop. Use cross-platform compatible commands.

Follow the workflow in READY_TO_USE_E2E_PROMPT.md for detailed instructions.
EOF
}

# Copy to clipboard (cross-platform)
copy_to_clipboard() {
    local text="$1"
    
    if command -v pbcopy >/dev/null 2>&1; then
        # macOS
        echo "$text" | pbcopy
        return 0
    elif command -v xclip >/dev/null 2>&1; then
        # Linux with xclip
        echo "$text" | xclip -selection clipboard
        return 0
    elif command -v xsel >/dev/null 2>&1; then
        # Linux with xsel
        echo "$text" | xsel --clipboard --input
        return 0
    elif command -v clip.exe >/dev/null 2>&1; then
        # WSL
        echo "$text" | clip.exe
        return 0
    else
        return 1
    fi
}

# Main execution
main() {
    local show_status=false
    local dry_run=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -s|--status)
                show_status=true
                shift
                ;;
            -d|--dry-run)
                dry_run=true
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                echo "Use --help for usage information."
                exit 1
                ;;
        esac
    done
    
    print_header "E2E Workflow Automation Launcher"
    
    # Check prerequisites
    if ! check_prerequisites; then
        print_error "Prerequisites not met. Please fix the issues above."
        exit 1
    fi
    
    # Show status if requested
    if [[ "$show_status" == "true" ]]; then
        show_project_status
        echo
        print_warning "Press Enter to continue with workflow launch..."
        read -r
    fi
    
    # Generate prompt
    local prompt=$(get_workflow_prompt)
    
    if [[ "$dry_run" == "true" ]]; then
        print_header "DRY RUN - Workflow Prompt Preview"
        echo "$prompt"
        print_warning "This is a dry run. No actions will be executed."
        exit 0
    fi
    
    # Launch workflow
    print_header "Launching E2E Workflow"
    print_info "The following prompt will be copied to your clipboard:"
    echo
    echo "$prompt"
    echo
    
    # Copy to clipboard
    if copy_to_clipboard "$prompt"; then
        print_success "Prompt copied to clipboard!"
        print_info "Paste this into your AI assistant to execute the next E2E workflow task."
    else
        print_warning "Could not copy to clipboard. Please copy the prompt above manually."
    fi
    
    echo
    echo "----------------------------------------------------------------"
    print_info "WORKFLOW INSTRUCTIONS:"
    echo "1. Paste the prompt into your AI assistant"
    echo "2. The AI will execute EXACTLY ONE task"
    echo "3. After completion, run this script again for the next task"
    echo "4. Repeat until all E2E issues are resolved"
    echo "----------------------------------------------------------------"
    
    print_success "E2E Workflow launcher ready!"
}

# Make script executable and run
chmod +x "$0" 2>/dev/null || true
main "$@"
