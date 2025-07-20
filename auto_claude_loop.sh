#!/bin/bash

while true; do
    echo "======================================"
    echo "Starting claude process..."
    echo "You can interact with claude normally"
    echo "It will be killed after 10 minutes"
    echo "======================================"
    
    # Run claude with a timeout in the foreground
    timeout --foreground 600 claude "run /next and do what it says" --dangerously-skip-permissions
    
    echo ""
    echo "======================================"
    echo "Claude process ended (timeout or manual exit)"
    echo "Committing changes..."
    echo "======================================"
    
    git add .
    git commit -m "interim"
    
    echo ""
    echo "Cycle complete. Starting next iteration in 5 seconds..."
    echo "Press Ctrl+C twice to stop the loop"
    echo ""
    
    # Brief pause before next iteration
    sleep 5
done