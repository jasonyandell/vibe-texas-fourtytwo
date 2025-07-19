---
description: Show game implementation status
allowed-tools: [Read, Bash]
---
# Current Game Implementation Status

## 1. Git Status
```bash
git branch --show-current
git status --short
```

## 2. Story Status
```bash
# Find active story
find stories/game -name "STATUS.md" -exec grep -l "Status: [^C]" {} \; | head -1 | xargs cat
```

## 3. Test Status
```bash
# Run E2E for active story
active_story=$(find stories/game -name "STATUS.md" -exec grep -l "Status: [^C]" {} \; | head -1 | xargs dirname)
if [ -f "$active_story/e2e.spec.ts" ]; then
  npm run test:e2e -- "$active_story/e2e.spec.ts" --reporter=list
fi
```

## 4. Validation Status
```bash
npm run lint --silent && echo "✓ Lint" || echo "✗ Lint"
npm run type-check --silent && echo "✓ Types" || echo "✗ Types"
```