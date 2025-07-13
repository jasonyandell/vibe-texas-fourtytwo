# Story: Fix Game Cards Display E2E Tests

## Overview
Implement proper game card rendering and display functionality to make game card related E2E tests pass. This includes ensuring game cards appear when games exist and have the correct structure and content.

## Acceptance Criteria

### Game Card Structure
- [ ] Game cards have `data-testid="game-card"` attributes
- [ ] Cards display when games are created in lobby
- [ ] Cards show proper game information (name, player count, status)
- [ ] Cards are properly styled and accessible

### Player Slot Display
- [ ] Player slots show correct format: "North: Empty Slot", "East: Empty Slot", etc.
- [ ] Empty slots are clearly marked and clickable
- [ ] Partnership information displays: "North-South vs East-West"
- [ ] Player count shows correctly: "0/4 players"

### Game Information
- [ ] Game name displays prominently
- [ ] Creation time shows in readable format
- [ ] Game status badge appears correctly
- [ ] Player count updates dynamically

### E2E Test Targets
Make these specific tests pass:
- `should display empty player slots`
- `should show partnership arrangement`
- Tests that expect game cards to be visible

## Technical Requirements

### Component Updates
1. **GameCard Component** (`src/components/lobby/GameCard.tsx`)
   - Add `data-testid="game-card"` attribute
   - Ensure proper rendering of all game information
   - Fix player slot text format to match test expectations

2. **PlayerSlots Component** (`src/components/lobby/PlayerSlots.tsx`)
   - Update slot text format: "Position: Empty Slot"
   - Ensure partnership display shows "North-South vs East-West"
   - Add proper click handlers for empty slots

3. **LobbyList Component** (`src/components/lobby/LobbyList.tsx`)
   - Ensure game cards render when games exist
   - Verify proper grid layout and styling
   - Handle empty state correctly

### Data Structure
- Ensure game objects have all required properties
- Verify player slot data structure matches component expectations
- Handle null/empty player slots correctly

## Implementation Notes
- Focus on making game cards visible and properly structured
- Ensure text format exactly matches E2E test expectations
- Maintain existing functionality and styling
- Use mock data appropriately for testing

## Definition of Done
- [ ] Game cards appear when games are created
- [ ] All game card E2E tests pass
- [ ] Player slot format matches test expectations
- [ ] Partnership arrangement displays correctly
- [ ] No regressions in existing functionality
- [ ] Cards are accessible and properly styled

## Testing Strategy
1. Create test games and verify cards appear
2. Test player slot text format
3. Verify partnership display
4. Test card interactions
5. Run full test suite for regressions

## Dependencies
- Builds on Story 2 (game creation modal)
- Requires working game creation functionality
- Uses existing card and slot components
