# Texas 42 Development Workflow

This document defines the **one action per step** workflow for the Texas 42 Web Game project using GitHub Project Board 1.

## 🎯 Core Principle: One Action Per Step

The workflow executes exactly **ONE** action per step, then **STOPS**. This ensures focused, manageable work units and prevents overwhelming context switches.

## 📋 GitHub Project Board 1: Texas 42 Development Board

All development work is managed through **GitHub Project Board 1** exclusively:

- **Issues**: Created and tracked in the project board
- **Priority Labels**: `priority-1-critical`, `priority-2-high`, `priority-3-medium`, `priority-4-low`
- **Category Labels**: `core-features`, `story`, `bug`, `enhancement`, `rules`
- **Single Source of Truth**: GitHub issues (not stories/ directory)

## 🔄 Workflow Steps

### Step 1: Check Open PRs (Do ONE, then STOP)

1. **Merge One Ready PR**
   - If a PR is approved and all checks pass → merge it → STOP
   - Use squash and merge
   - Ensure branch is up to date with main

2. **Fix One PR with Blocking Comments**
   - If a PR has blocking comments → checkout the branch → STOP
   - Pull latest changes
   - Fix the specific issues mentioned
   - Push changes
   - Do NOT continue to other PRs

3. **Review One PR**
   - If a PR needs review → review for alignment with design.md → STOP
   - Check code quality, test coverage, zero warnings
   - Leave constructive feedback
   - Do NOT merge or fix in same step

### Step 2: Work Issues (If No PRs Need Attention)

1. **Work One Issue from Project Board 1**
   - Query project board for highest priority issue
   - Create feature branch: `issue-{number}-{title-slug}`
   - Work on the issue using Enhanced TDD → STOP when complete
   - Create PR when issue is fully implemented

## 🧪 Enhanced TDD Process

All development follows **Red-Green-Refactor** with zero-warnings enforcement:

### Red Phase
- Write failing test that captures the requirement
- Ensure test fails for the right reason
- Keep test minimal and focused

### Green Phase  
- Write minimal code to make test pass
- Don't worry about code quality yet
- Focus only on making the test green

### Refactor Phase (Zero-Warnings Required)
- Clean up code for readability and maintainability
- **Eliminate ALL warnings** - this is a blocker:
  - Run `npm run lint` - must pass with zero warnings
  - Run `npm run type-check` - must pass with zero TypeScript warnings
  - Fix any deprecation warnings
  - Address any console warnings
- **All warnings are blockers** - cannot proceed to next TDD cycle until resolved
- Ensure all tests still pass after refactoring

## 🎯 Simple Command Integration

Use simple commands to work specific items:

```bash
# Work specific item by number
work item 16    # Finds and works issue/PR #16 in Texas 42 Development Board
work item 23    # Finds and works issue/PR #23 in Texas 42 Development Board
```

**Behavior:**
- Searches only within this project's items
- Works issues, PRs, or any numbered item
- Focuses exclusively on Texas 42 Development Board
- Executes one action then stops

## 🌿 Branch Naming Conventions

### Issues
```bash
issue-{number}-{title-slug}
# Examples:
issue-16-core-domino-components-visual-foundation
issue-23-implement-bidding-system
issue-45-add-score-tracking
```

### Bug Fixes
```bash
fix-{number}-{description}
# Examples:
fix-23-domino-rendering-mobile
fix-45-score-calculation-error
```

### Documentation
```bash
docs-{description}
# Examples:
docs-update-workflow
docs-add-api-documentation
```

## 💬 Commit Message Format

```bash
issue: {title} - fixes #{number}

{detailed description of changes}

- Specific change 1
- Specific change 2  
- Addresses issue requirements

Closes #{number}
```

**Example:**
```bash
issue: Core Domino Components and Visual Foundation - fixes #16

Implement authentic Texas 42 domino components with point values

- Add Domino interface with point value calculation
- Create visual components for all 28 double-6 dominoes
- Implement count domino identification (5-0, 4-1, 3-2, 6-4, 5-5)
- Add responsive baseball diamond layout structure
- Include accessibility features and ARIA labels

Closes #16
```

## 🚫 What NOT to Do

### Don't Chain Actions
❌ **Wrong**: Merge PR → Fix another PR → Work on issue
✅ **Right**: Merge one PR → STOP

### Don't Ignore Warnings
❌ **Wrong**: Leave linting warnings for later
✅ **Right**: Fix all warnings during refactor phase

### Don't Work Multiple Issues
❌ **Wrong**: Start multiple issues in parallel
✅ **Right**: Complete one issue fully before starting next

### Don't Skip Project Board
❌ **Wrong**: Work on random issues or create ad-hoc tasks
✅ **Right**: Only work items from Texas 42 Development Board

## 📊 Success Metrics

- **One Action Per Context**: Each workflow execution completes exactly one meaningful action
- **Zero Warnings**: All code passes linting and type checking without warnings
- **Complete Issues**: Issues are fully implemented before moving to next item
- **Clean PRs**: All PRs pass CI, have zero warnings, and align with design.md
- **Focused Work**: No context switching between multiple issues or PRs

## 🔧 Tools and Scripts

- **Project Board Query**: `gh project item-list 1 --owner jasonyandell`
- **Work Item Command**: `work item {number}` (planned)
- **Lint Check**: `npm run lint`
- **Type Check**: `npm run type-check`
- **Test Suite**: `npm run test:frontend && npm run test:backend`

---

This workflow ensures focused, high-quality development with clear boundaries and zero technical debt accumulation through the zero-warnings policy.
