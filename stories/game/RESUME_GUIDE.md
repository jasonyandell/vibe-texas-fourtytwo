# Resume Guide - How to Continue Interrupted Work

## Quick Resume Command
```
/resume
```

This command will:
1. Find your active story
2. Check git status
3. Read progress tracking
4. Tell you exactly where to continue

## What Gets Tracked

### 1. STATUS.md (Task Checklist)
- Which tasks are complete (checked)
- Which task is in progress
- Overall story status

### 2. PROGRESS.md (Detailed State)
- Current task number
- Current TDD phase (RED/GREEN/REFACTOR)
- Last file being edited
- Next action to take
- Any blockers

### 3. Git Commits (Checkpoints)
- Tests committed after RED phase
- Implementation committed after task complete
- Clear commit messages show progress

### 4. /memory Updates
After interruption, update CLAUDE.md with:
```
/memory

## Current Work
Story: 001 - Empty Lobby
Task: 2 - Add Create Game button
Phase: GREEN - Making tests pass
File: frontend/src/components/Lobby.tsx
Issue: Button onClick type error
Next: Fix type error, then run tests
```

## Example Interruption & Resume

### Before Interruption (Task 2, GREEN phase):
```
Working on Task 2: Add Create Game button
✓ E2E test written (expects button)
✓ Unit test written
✗ Tests failing
→ Implementing button in Lobby.tsx...
[INTERRUPTED]
```

### Resume Session:
```
/resume

Found active story: 001-empty-lobby
Current branch: story-001-empty-lobby
Uncommitted changes in: frontend/src/components/Lobby.tsx

From PROGRESS.md:
- Task 2: Add Create Game button
- Phase: GREEN - Making tests pass
- Last edit: Lobby.tsx line 45
- Next: Add onClick handler

Tests status:
- E2E: 1 failing (button not clickable)
- Unit: 2 failing

Continue by:
1. Open frontend/src/components/Lobby.tsx
2. Add onClick handler to button
3. Run tests to check progress
```

## Best Practices for Resumability

### 1. Commit at Natural Breakpoints
- After writing tests (RED phase)
- After task complete
- Before switching context

### 2. Update PROGRESS.md Frequently
- When starting a new phase
- When encountering blockers
- Before taking breaks

### 3. Use Descriptive Commits
```bash
git commit -m "test: Add E2E test for Create Game button"
git commit -m "wip: Partial button implementation"
git commit -m "feat: Complete Create Game button with tests passing"
```

### 4. Leave Notes for Future You
In PROGRESS.md:
```markdown
## Blockers: 
- ButtonProps type needs 'variant' property
- Look at Button.tsx for example
```

## Emergency Recovery

If `/resume` can't find enough context:

1. Check git branch and status
2. Look for most recent story folder
3. Read STATUS.md for task list
4. Check test output to see what's failing
5. Continue from there

The system is designed to be interrupted and resumed at any point!