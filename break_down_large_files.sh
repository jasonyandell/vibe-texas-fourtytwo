#!/bin/bash

# Create a file to track processed files
PROCESSED_FILE=".processed_files"
touch "$PROCESSED_FILE"

while true; do
    echo "=== Finding largest unprocessed file ==="
    
    # Get all files from find-largest-files script, excluding already processed ones
    AVAILABLE_FILES=$(./find-largest-files.sh | while read line; do
        FILE=$(echo "$line" | sed 's/, [0-9]*$//')  # Remove the ", 123" part to get just filename
        if ! grep -Fxq "$FILE" "$PROCESSED_FILE"; then
            echo "$line"
        fi
    done)
    
    if [ -z "$AVAILABLE_FILES" ]; then
        echo "No unprocessed files found. Clearing processed list and starting over..."
        rm "$PROCESSED_FILE"
        touch "$PROCESSED_FILE"
        sleep 5
        continue
    fi
    
    # Get the largest unprocessed file
    LARGEST_LINE=$(echo "$AVAILABLE_FILES" | head -1)
    LARGEST_FILE=$(echo "$LARGEST_LINE" | sed 's/, [0-9]*$//')  # Extract filename
    LINE_COUNT=$(echo "$LARGEST_LINE" | sed 's/.*, //')        # Extract line count
    BASENAME=$(basename "$LARGEST_FILE")
    
    echo "Working on $LARGEST_FILE ($LINE_COUNT lines)"
    
    # Call Claude with the file breakdown request and capture output
    echo "=== Calling Claude to break down file ==="
 #   CLAUDE_OUTPUT=$(claude "Analyze and BREAK DOWN $LARGEST_FILE if it's over 100 lines AND can be logically broken into coherent modules (separate classes/functions, config from implementation, data models from logic, distinct features, or utilities from main logic, test describe sections into their own files). DON'T break down data/config files, tightly coupled code, well-organized single-purpose modules, or anything that would create non-functional fragments. If you break it down, print the original filename/line count, new files with sizes and summaries. If you decide NOT to break it down, output exactly: 'SKIP: $BASENAME - reason why it's better as-is'. ultrathink" --dangerously-skip-permissions 2>&1)
    CLAUDE_OUTPUT=$(claude "Analyze and BREAK DOWN $LARGEST_FILE if it's over 100 lines AND can be logically broken into coherent modules (separate classes/functions, config from implementation, data models from logic, distinct features, or utilities from main logic, test describe sections into their own files). DON'T break down data/config files, tightly coupled code, well-organized single-purpose modules, or anything that would create non-functional fragments. If you break it down, print the original filename/line count, new files with sizes and summaries. If you decide NOT to break it down, output exactly: 'SKIP: $BASENAME - reason why it's better as-is'. ultrathink" --dangerously-skip-permissions 2>&1)
    # Display the output to screen
    echo "$CLAUDE_OUTPUT"
    
    # Add the file to processed list regardless of whether it was skipped or broken down
    echo "$LARGEST_FILE" >> "$PROCESSED_FILE"
    
    # Check if Claude skipped the file (more robust detection)
    if echo "$CLAUDE_OUTPUT" | grep -qi "skip\|not breaking\|better as-is\|won't break"; then
        echo ""
        echo "=== File was skipped, no commit needed ==="
    else
        # Add all changes to git
        echo ""
        echo "=== Adding changes to git ==="
        git add .
        
        # Create a safe but complete commit message
        # Use a temp file to handle multiline and special characters safely
        TEMP_MSG=$(mktemp)
        echo "Automated breakdown of $BASENAME" > "$TEMP_MSG"
        echo "" >> "$TEMP_MSG"
        echo "$CLAUDE_OUTPUT" | sed 's/[`$\\]/\\&/g' >> "$TEMP_MSG"
        
        # Commit using the temp file
        echo "=== Committing changes ==="
        if git commit -F "$TEMP_MSG"; then
            echo "Successfully committed changes"
        else
            echo "No changes to commit or commit failed"
        fi
        
        # Clean up temp file
        rm "$TEMP_MSG"
    fi
    
    echo ""
    echo "=== Waiting 10 seconds before next iteration ==="
    sleep 10
    echo ""
done