---
description: Resume work after interruption
allowed-tools: [Read, Bash, Write]
---
# Resume Work

## 1. Check Current Branch
```bash
git branch --show-current
```

## 2. Find Active Story
```bash
# Find non-complete stories
find stories/game -name "STATUS.md" -exec grep -l "Status: [^C]" {} \; | head -1
```

## 3. Read Current State
Read STATUS.md to understand:
- Current status (Planning/Ready/Implementing/Reviewing)
- Task checklist - which are checked/unchecked
- Which task was in progress

## 4. Check Working State
```bash
# Check for uncommitted changes
git status --short

# Check last commit message for context
git log -1 --oneline

# Run tests to see current state
npm run test:e2e -- stories/game/*/e2e.spec.ts --reporter=list || true
```

## 5. Read Progress Notes
Check for PROGRESS.md or implementation.md in story folder for:
- Last file being edited
- Current TDD phase (Red/Green/Refactor)
- Any blockers noted

## 6. Resume from Exact Point
Based on findings, continue work:

### If in RED phase (tests written, failing):
- Continue with implementation to make tests pass

### If in GREEN phase (implementing):
- Run tests to see what's still failing
- Continue implementation

### If in REFACTOR phase:
- Run validation suite
- Fix any warnings/errors
- Complete task

### If between tasks:
- Find next unchecked task
- Start RED phase for that task

## 7. Update Progress Tracking
Create/update PROGRESS.md with current state:
```markdown
## Current Task: [Task N]
Phase: [Red/Green/Refactor]
Last file edited: [filename]
Next action: [what to do next]
Blockers: [any issues]
```