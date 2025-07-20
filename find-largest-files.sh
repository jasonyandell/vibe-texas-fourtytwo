#!/bin/bash

# Find all source code and test files, count lines, and sort by size
find . -type f \( \
    -name "*.ts" -o \
    -name "*.tsx" -o \
    -name "*.js" -o \
    -name "*.jsx" -o \
    -name "*.test.*" -o \
    -name "*.spec.*" \
\) \
! -path "*/node_modules/*" \
! -path "*/.next/*" \
! -path "*/dist/*" \
! -path "*/build/*" \
! -path "*/.git/*" \
-exec wc -l {} + | \
grep -v "total$" | \
sort -rn | \
awk '{printf "%s, %d\n", $2, $1}' | \
sed 's|^\./||'