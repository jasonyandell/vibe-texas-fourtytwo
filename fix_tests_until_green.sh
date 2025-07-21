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
    timeout --foreground 600 claude "TODO: Complete ONE checklist item from @stories/test-fixes.md

STEPS:
1. Open @stories/test-fixes.md
2. Find the FIRST item that is NOT marked with ✅
3. Complete ONLY that one item
4. Mark it as complete with ✅ in the checklist
5. Save the file and STOP

DO NOT:
- Work on multiple items
- Move to other sections
- Continue after completing one item

EXCEPTION: If ALL checklist items already have ✅, then:
- Fix any remaining breaking tests
- Once ALL conditions are met (all ✅, all tests pass, lint passes), create stories/test-fixes-status.md
- The status file should ONLY exist when everything is complete and passing

Remember: Complete exactly ONE uncompleted checklist item, update its checkbox to ✅, then stop immediately." --dangerously-skip-permissions
    
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