---
description: Implement complete story flow
allowed-tools: [Bash, Read, Write, Edit, MultiEdit, Grep, Glob, LS, Task]
---
# Story $ARGUMENTS Implementation

## 1. Branch Management
Check if branch exists:
```bash
git branch -a | grep story-$ARGUMENTS
```

If exists, switch to it:
```bash
git checkout story-$ARGUMENTS-*
```

If not, create it:
```bash
# Read story title from game-flows.md
git checkout -b story-$ARGUMENTS-[story-slug]
```

## 2. Read Current State
```bash
# Check story folder
ls -la stories/game/$ARGUMENTS-*/ 2>/dev/null || echo "New story"

# Read STATUS.md if exists
cat stories/game/$ARGUMENTS-*/STATUS.md 2>/dev/null || echo "Starting fresh"
```

## 3. Planning & Task Breakdown
Analyze the story and create tasks:
- Search for similar patterns in codebase
- Identify components to modify
- Break into ~1hr tasks
- Each task includes E2E assertions + implementation

## 4. Initialize Story Structure
Create story folder:
```bash
mkdir -p stories/game/$ARGUMENTS-[story-slug]
```

Create work-overview.md with task breakdown:
```markdown
# Story $ARGUMENTS: [Title]
## Tasks
1. [Task 1 description]
   - E2E: [What user sees/does]
   - Component: [File to modify]
   - Tests: E2E + unit tests
   
2. [Task 2 description]
   - E2E: [What user sees/does]
   - Component: [File to modify]
   - Tests: E2E + unit tests
```

Create STATUS.md:
```markdown
# Story $ARGUMENTS: [Title from game-flows.md]
Branch: story-$ARGUMENTS-[slug]
Status: Planning
Started: [timestamp]

## Tasks
- [ ] Task 1: [Description with E2E assertions]
- [ ] Task 2: [Description with E2E assertions]
- [ ] Task 3: [Description with E2E assertions]

## Reviews
- [ ] Dijkstra review
- [ ] Karen review
- [ ] Kid review
- [ ] Issues addressed

## Demo
- [ ] Demo page updated
- [ ] Demo video created
```

Create PROGRESS.md for tracking interruptions:
```markdown
# Progress Tracking

## Current Task: None
## Phase: Not started
## Last File Edited: N/A
## Next Action: Start Task 1
## Blockers: None

## Session Log
- [timestamp] Story initialized
```

## 5. Set Status to Ready
Update STATUS.md:
- Change Status from "Planning" to "Ready"
- Commit the planning artifacts

## 6. Suggest Next Step
Tell user:
```
Story $ARGUMENTS planned with [N] tasks.
Task 1: Write E2E test
Ready to implement with: /implement
```