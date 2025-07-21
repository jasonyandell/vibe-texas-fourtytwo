# Story: Fix Basic Lobby Display E2E Tests

## Overview
Fix the basic lobby display E2E tests by addressing text mismatches and missing UI elements. This story focuses on making the fundamental lobby display tests pass without breaking existing functionality.

## Acceptance Criteria

### Text Content Fixes
- [ ] Fix "Game Lobby" vs "Texas 42 Lobby" text mismatch
- [ ] Add missing "Welcome to Texas 42!" text to lobby
- [ ] Ensure proper page title contains "Texas 42"
- [ ] Fix "Create New Game" element conflicts (button vs modal heading)

### UI Element Verification
- [ ] Verify "Available Games" section displays correctly
- [ ] Ensure "No games available. Create one to get started!" message shows when lobby is empty
- [ ] Confirm "Create New Game" and "Join Random Game" buttons are present and functional
- [ ] Validate proper lobby header with player count display

### E2E Test Targets
Make these specific tests pass:
- `should display the lobby page`
- `should have proper page title`
- `should display available games section`

## Technical Requirements

### Component Updates
1. **Lobby Component** (`src/components/Lobby.tsx`)
   - Add "Welcome to Texas 42!" text
   - Ensure consistent text content matches test expectations
   - Verify button accessibility and labeling

2. **Page Title** (`src/main.tsx` or `index.html`)
   - Ensure page title includes "Texas 42"
   - Verify title is set correctly for E2E tests

3. **Test Selectors**
   - Use more specific selectors to avoid conflicts
   - Ensure unique identification of UI elements
   - Fix strict mode violations in Playwright tests

### Implementation Notes
- Maintain existing functionality while fixing text mismatches
- Ensure all existing unit tests continue to pass
- Focus on minimal changes to achieve test compliance
- Preserve current styling and layout

## Definition of Done
- [ ] All 3 basic lobby display E2E tests pass
- [ ] No regressions in existing unit tests
- [ ] No regressions in existing E2E tests (bidding tests still pass)
- [ ] Lobby functionality remains intact
- [ ] Code follows existing patterns and conventions

## Testing Strategy
1. Run specific E2E tests to verify fixes
2. Run full unit test suite to ensure no regressions
3. Manual verification of lobby functionality
4. Verify bidding E2E tests still pass

## Dependencies
- No new dependencies required
- Uses existing UI components and patterns
- Builds on current lobby implementation
