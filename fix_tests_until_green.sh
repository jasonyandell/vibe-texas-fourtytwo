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
2. Scan through ALL items from the beginning
3. For any items that are already completed but NOT marked with ✅:
   - Verify they are actually done
   - Mark them with ✅
   - This counts as your ONE task - STOP after marking it
4. If all previously completed items are marked, find the FIRST item that is NOT marked with ✅
5. Complete ONLY that one item
6. Mark it as complete with ✅ in the checklist
7. Save the file and STOP

DO NOT:
- Work on multiple items (marking OR implementing)
- Move to other sections
- Continue after completing one task (whether marking or implementing)

EXCEPTION: If ALL checklist items already have ✅, then:
- Fix any remaining breaking tests
- Once ALL conditions are met (all ✅, all tests pass, lint passes), create stories/test-fixes-status.md
- The status file should ONLY exist when everything is complete and passing

Remember: Do exactly ONE thing - either mark an already-completed item OR complete one new item, then stop immediately." --dangerously-skip-permissions
    
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