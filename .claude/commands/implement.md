---
description: Implement all tasks using TDD
allowed-tools: [Read, Write, Edit, MultiEdit, Bash, Grep, Glob, Task]
thinking: enabled
---
# TDD Implementation for Current Story

## 1. Read Current Tasks
Find active story and read task list from STATUS.md or work-overview.md

## 2. Execute Each Task with TDD Cycle

For each task, follow strict TDD:

### RED Phase - Write Tests First
1. Update PROGRESS.md: "Task N - RED phase - Writing tests"
2. Add E2E test assertions for this task's behavior
3. Write unit tests for this task's functionality
4. Run all tests - they should fail
```bash
npm run test:e2e -- stories/game/*/e2e.spec.ts
npm run test:frontend
```
5. Commit tests: `git commit -m "test: Add tests for [task description]"`

### GREEN Phase - Implement
6. Update PROGRESS.md: "Task N - GREEN phase - Implementing"
7. Write minimal code to make tests pass
8. Focus only on passing the tests
9. Run tests repeatedly until passing
10. Note current file being edited in PROGRESS.md

### REFACTOR Phase - Clean & Validate
11. Update PROGRESS.md: "Task N - REFACTOR phase - Validating"
12. Refactor for clarity and maintainability
13. Run FULL validation suite:
```bash
npm run test:e2e          # All E2E tests must pass
npm run test:frontend     # All unit tests must pass
npm run lint             # ZERO warnings allowed
npm run type-check       # ZERO errors allowed
```

### Complete Task
14. Mark task complete in STATUS.md only if ALL checks pass
15. Update PROGRESS.md: "Task N - Complete"
16. Commit the working code: `git commit -m "feat: Implement [task description]"`
17. Move to next task

## 3. Zero Tolerance Policy
- No warnings from lint
- No errors from type-check
- All tests must pass
- Cannot proceed to next task until current task fully passes

## 4. Test Priority
E2E tests define the truth. If unit tests conflict with E2E behavior, fix the unit tests to match E2E expectations.