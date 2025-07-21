#!/bin/bash

# Check if the status file exists at the start and remove it
if [ -f "stories/test-fixes-status.md" ]; then
    echo "Removing existing status file..."
    rm "stories/test-fixes-status.md"
fi

while true; do
    echo "======================================"
    echo "Starting claude process..."
    echo "You can interact with claude normally"
    echo "It will be killed after 10 minutes"
    echo "======================================"
    
    # Run claude with updated prompt
    timeout --foreground 600 claude "Look at @stories/test-fixes.md. Find the first incomplete item and complete it. If all checklist items are complete, then fix any remaining breaking tests. **CRITICAL STATUS FILE RULES:** - The status file (stories/test-fixes-status.md) should ONLY be created when ALL of these conditions are met: 1. **ALL** checklist items in stories/test-fixes.md are marked complete with ✅ 2. **AND** all tests pass (npm run test:frontend, npm run test:backend, npm run test:shared-types, npm run test:e2e) 3. **AND** linting passes with zero errors (npm run lint) **If ANY condition is not met, the status file must NOT exist. Delete it if it was created prematurely.** Once ALL conditions are met: 1. Run all test suites to confirm everything is green 2. Write a summary of what was fixed to stories/test-fixes-status.md 3. The summary should only be created after confirming all tests are actually passing Work on one incomplete checklist item at a time until all are complete, then ensure all tests pass before creating any status file" --dangerously-skip-permissions
    
    echo ""
    echo "======================================"
    echo "Claude process ended (timeout or manual exit)"
    echo "======================================"
    
    # Check if the status file was created
    if [ -f "stories/test-fixes-status.md" ]; then
        echo "Status file detected - all tests are green!"
        echo "Committing final changes..."
        git add .
        git commit -m "fixing tests - all tests green"
        echo "Script complete. Exiting..."
        exit 0
    fi
    
    echo "Committing changes..."
    git add .
    git commit -m "fixing tests"
    
    echo ""
    echo "Cycle complete. Starting next iteration in 5 seconds..."
    echo "Press Ctrl+C twice to stop the loop"
    echo ""
    
    # Brief pause before next iteration
    sleep 5
done