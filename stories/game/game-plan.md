# Texas 42 Game Implementation Plan
## Using Claude Code Custom Slash Commands

## How Custom Commands Work

Custom slash commands in Claude Code are markdown files in `.claude/commands/` that:
- Define reusable prompts with frontmatter configuration
- Support dynamic arguments via `$ARGUMENTS`
- Can restrict which tools Claude can use
- Execute in a fresh context when called

## Our Command System

### Primary Commands
- `/story [number]` - Analyzes story, creates tasks, sets up tracking
- `/implement` - Executes tasks using TDD cycle with progress tracking
- `/resume` - Reads progress files and continues from exact point
- `/review` - Launches persona reviews in parallel

### Support Commands  
- `/game_status` - Shows current branch, task status, test results
- `/validate` - Runs full test suite with zero-tolerance
- `/demo [number]` - Creates demo page and video
- `/next` - Suggests what to do next

## Realistic Workflow

### 1. Starting a Story
```
You: /story 001

Claude: [Executes story command which:]
- Creates branch story-001-empty-lobby
- Reads story from game-flows.md
- Analyzes codebase for patterns
- Creates task breakdown in TASKS.md
- Initializes STATUS.md and PROGRESS.md
- Returns: "Story 001 planned with 3 tasks. Run /implement to start."
```

### 2. Implementation with Interruption Handling
```
You: /implement

Claude: [Executes implement command which:]
- Reads TASKS.md for task list
- Checks PROGRESS.md for current state
- For each task:
  - RED: Writes E2E + unit tests
  - Updates PROGRESS.md with phase
  - Commits tests
  - GREEN: Implements code
  - Updates PROGRESS.md with file/line
  - REFACTOR: Validates all tests/lint/types
  - Marks task complete in STATUS.md
  - Commits implementation
```

#### If Interrupted Mid-Task:
PROGRESS.md will contain:
```markdown
## Current Task: 2 - Add Create Game button
## Phase: GREEN - Implementing
## Last File Edited: frontend/src/components/Lobby.tsx line 45
## Next Action: Add onClick handler
## Blockers: Need ButtonProps type from ui/Button.tsx
```

### 3. Resuming Work
```
You: /resume

Claude: [Executes resume command which:]
- Checks git branch and status
- Reads PROGRESS.md
- Runs tests to see current state
- Returns: "Resuming Task 2 in GREEN phase. 
          Need to add onClick handler in Lobby.tsx.
          Last edit at line 45. ButtonProps type issue noted."
- Continues implementation from that exact point
```

### 4. Reviews
```
You: /review

Claude: [Executes review command which:]
- Launches three parallel reviews using Task tool
- Each persona reviews independently
- Creates review-dijkstra.md, review-karen.md, review-kid.md
- Summarizes key issues found
```

### 5. Validation
```
You: /validate

Claude: [Executes validate command which:]
- Runs all E2E tests
- Runs all unit tests  
- Runs lint (zero warnings)
- Runs type-check (zero errors)
- Reports results
- Blocks progress if any failures
```

## Key Features That Make This Work

### 1. Progress Tracking
The `/implement` command automatically updates PROGRESS.md at each phase:
- Before writing tests: "Task N - RED phase"
- Before implementing: "Task N - GREEN phase - editing [file]"
- Before validating: "Task N - REFACTOR phase"
- After completion: "Task N - Complete"

### 2. Git Integration
Strategic commits create recovery points:
```bash
# After RED phase
git commit -m "test: Add tests for empty lobby message"

# After GREEN phase  
git commit -m "feat: Implement empty lobby message"

# WIP commits if needed
git commit -m "wip: Partial button implementation"
```

### 3. Command Context Isolation
Each command runs in a fresh context but can:
- Read tracking files to understand state
- Check git for uncommitted changes
- Run tests to verify current status
- Continue exactly where previous command left off

### 4. Parallel Work
The `/review` command uses the Task tool to run reviews simultaneously:
```
allowed-tools: [Task]

Launch three parallel review tasks:
1. Dijkstra Review
2. Karen Review  
3. Kid Review
```

## Example Full Session

### Day 1: Start and Partial Implementation
```
You: /story 001
Claude: Story 001 planned with 3 tasks. Run /implement to start.

You: /implement
Claude: Task 1: Show empty lobby message
        RED: Writing E2E and unit tests...
        ✓ Tests written and failing
        GREEN: Implementing empty state...
        ✓ Implementation complete
        REFACTOR: Running validation...
        ✓ All checks pass
        Task 1 complete!
        
        Task 2: Add Create Game button
        RED: Writing tests for button...
        ✓ Tests failing
        GREEN: Adding button to Lobby.tsx...
        [INTERRUPTED]
```

### Day 2: Resume and Complete
```
You: /resume
Claude: Found story 001 in progress
        Task 2 - GREEN phase
        Last edit: Lobby.tsx line 45
        Need to add onClick handler
        Continuing implementation...
        
You: /game_status
Claude: Branch: story-001-empty-lobby
        Story: 001 - Empty Lobby
        Tasks: 1/3 complete, Task 2 in progress
        Uncommitted changes in Lobby.tsx
        
[After completion]
You: /review
Claude: Running 3 persona reviews...
        Dijkstra: "Missing error boundaries"
        Karen: "Button text confusing"  
        Kid: "Looks good!"
        
You: /demo 001
Claude: Created demo page
        Recorded video with E2E test
        Demo complete!
```

## Why This Works

1. **Real Claude Code Features**: Uses actual slash commands, not fictional ones
2. **Automatic Tracking**: Commands update progress files during execution
3. **Git Safety Net**: Commits provide fallback if tracking fails
4. **Context Awareness**: Commands read state and continue appropriately
5. **Parallel Execution**: Review command uses Task tool effectively
6. **Zero Setup**: Just create .claude/commands/ and start using

## Quick Start

1. Commands are already in `.claude/commands/`
2. Start with: `/story 001`
3. Implement with: `/implement`
4. Resume with: `/resume`
5. Check status anytime: `/game_status`

The system handles interruptions gracefully and maintains quality through enforced TDD and validation cycles.