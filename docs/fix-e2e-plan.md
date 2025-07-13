Fix E2E tests by implementing exactly one development story from the plan checklist below. Follow this specific workflow:

**Implementation Steps:**
0. Read and understand fix-e2e-tracker.md to understand the implementation workflow so far
1. Read and understand the next unchecked story file from the stories/ directory
2. Use task management tools to break down the story into specific implementation tasks
3. Implement the story following TDD approach (write tests first, then implementation)
4. Run all existing tests to ensure no regressions
5. Update the fix-e2e-tracker.md file with a detailed summary of what was implemented along with any implementation notes, design decisions, or plan modifications
6. Check the box for the completed story in docs/fix-e2e-plan.md

**Story Implementation Checklist:**
[ ] implement stories/fix-e2e-1-basic-lobby-display.md
[ ] implement stories/fix-e2e-2-game-creation-modal.md
[ ] implement stories/fix-e2e-3-game-cards-display.md
[ ] implement stories/fix-e2e-4-player-management.md
[ ] implement stories/fix-e2e-5-ready-system.md
[ ] implement stories/fix-e2e-6-spectator-mode.md
[ ] implement stories/fix-e2e-7-error-handling.md
[ ] implement stories/fix-e2e-8-bidding-e2e.md

**Important Requirements:**
- Implement only ONE story per request - do not proceed to the next story automatically
- Focus on making E2E tests pass while maintaining existing functionality
- Ensure all unit tests continue to pass
- Follow the consolidated design.md file as the authoritative source for all design decisions
- Create comprehensive tests for each implemented feature
- Ask for permission before installing any new dependencies

**Current E2E Test Status:**
- Basic bidding tests: 3/3 passing ✅
- Lobby tests: 5/19 passing ❌ (14 failing)
- Main issues: Missing game cards, text mismatches, incomplete modal functionality, missing player management features

**Next Task:**
Implement stories/fix-e2e-1-basic-lobby-display.md to fix basic lobby display issues and text mismatches.
