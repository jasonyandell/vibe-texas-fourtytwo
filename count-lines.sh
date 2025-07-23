#!/bin/bash

# Script to count all lines of text/code in the project, excluding .gitignore patterns

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Counting lines in Texas 42 project...${NC}"
echo

# Create a temporary file to store all files
TEMP_FILE=$(mktemp)

# Use git ls-files to get all tracked files and untracked files not in .gitignore
# This respects .gitignore patterns automatically
git ls-files > "$TEMP_FILE"
git ls-files --others --exclude-standard >> "$TEMP_FILE"

# Sort and deduplicate
sort -u "$TEMP_FILE" -o "$TEMP_FILE"

# Count lines by file type
echo -e "${YELLOW}Lines by file type:${NC}"
echo "===================="

# Function to count lines for a pattern
count_by_pattern() {
    local pattern=$1
    local name=$2
    local count=$(grep "$pattern" "$TEMP_FILE" | xargs -r wc -l 2>/dev/null | tail -n 1 | awk '{print $1}')
    if [ -n "$count" ] && [ "$count" -gt 0 ]; then
        printf "%-20s %8d lines\n" "$name:" "$count"
    fi
}

# Count by file extensions
count_by_pattern "\.ts$" "TypeScript"
count_by_pattern "\.tsx$" "TypeScript React"
count_by_pattern "\.js$" "JavaScript"
count_by_pattern "\.jsx$" "JavaScript React"
count_by_pattern "\.json$" "JSON"
count_by_pattern "\.md$" "Markdown"
count_by_pattern "\.yml$\|\.yaml$" "YAML"
count_by_pattern "\.css$" "CSS"
count_by_pattern "\.scss$\|\.sass$" "Sass/SCSS"
count_by_pattern "\.html$" "HTML"
count_by_pattern "\.sql$" "SQL"
count_by_pattern "\.sh$" "Shell Scripts"
count_by_pattern "Dockerfile" "Docker"
count_by_pattern "\.env" "Environment"

echo

# Count lines by directory
echo -e "${YELLOW}Lines by directory:${NC}"
echo "==================="

# Function to count lines in a directory
count_by_dir() {
    local dir=$1
    local count=$(grep "^$dir/" "$TEMP_FILE" | xargs -r wc -l 2>/dev/null | tail -n 1 | awk '{print $1}')
    if [ -n "$count" ] && [ "$count" -gt 0 ]; then
        printf "%-20s %8d lines\n" "$dir:" "$count"
    fi
}

# Count main directories
count_by_dir "frontend"
count_by_dir "backend"
count_by_dir "packages"
count_by_dir "scripts"
count_by_dir "docs"
count_by_dir "stories"
count_by_dir "e2e"

echo

# Total count
TOTAL=$(cat "$TEMP_FILE" | xargs -r wc -l 2>/dev/null | tail -n 1 | awk '{print $1}')
FILE_COUNT=$(wc -l < "$TEMP_FILE")

echo -e "${GREEN}===================${NC}"
echo -e "${GREEN}TOTAL: $TOTAL lines across $FILE_COUNT files${NC}"
echo -e "${GREEN}===================${NC}"

# Optional: Show top 10 largest files
echo
echo -e "${YELLOW}Top 10 largest files:${NC}"
echo "===================="
cat "$TEMP_FILE" | xargs -r wc -l 2>/dev/null | sort -nr | head -n 11 | tail -n 10 | while read count file; do
    printf "%8d lines  %s\n" "$count" "$file"
done

# Clean up
rm -f "$TEMP_FILE"