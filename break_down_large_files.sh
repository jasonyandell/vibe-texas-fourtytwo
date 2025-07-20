while true; do
    echo "=== Finding largest file ==="
    
    # Run the find-largest-files script and get the largest file
    LARGEST_FILE=$(./find-largest-files.sh | head -1 | awk '{print $NF}')
    
    if [ -z "$LARGEST_FILE" ]; then
        echo "No files found or script failed"
        sleep 5
        continue
    fi
    
    echo "Working on $LARGEST_FILE"
    
    # Call Claude with the file breakdown request
    claude "run ./find-largest-files.sh and break down the largest file there if it is over 100 lines and can be cleanly broken up. print the name of the file you broke down and the new files and their sizes and a headline summary of what they do" --dangerously-skip-permission
    
    echo ""
    echo "=== Waiting 10 seconds before next iteration ==="
    sleep 10
    echo ""
done