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
    timeout --foreground 600 claude "look at @stories/test-fixes.md. find the first incomplete item and complete it. if all checklist items are complete, then fix any remaining breaking tests. once all tests are green, write a summary of what was fixed to stories/test-fixes-status.md. until all tests are green, the status file should not exist." --dangerously-skip-permissions
    
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