# Story: Fix Ready System E2E Tests

## Overview
Implement the ready system functionality to allow players to mark themselves as ready and automatically start games when all players are ready. This addresses the ready state management E2E tests.

## Acceptance Criteria

### Ready State Management
- [ ] Players can mark themselves as ready/not ready
- [ ] Ready status displays clearly for each player
- [ ] Ready button appears when player is in a game
- [ ] Ready count shows current ready players

### Game Start Logic
- [ ] Games auto-start when all 4 players are ready
- [ ] Game status changes from "waiting" to "playing"
- [ ] Players are redirected to game board when game starts
- [ ] Ready states reset appropriately

### UI Elements
- [ ] Ready button is visible and functional
- [ ] Ready status indicators show for each player
- [ ] Game start countdown or notification appears
- [ ] Loading states during game start process

### E2E Test Targets
Make these specific tests pass:
- `should show ready button when 4 players are seated`
- `should handle ready state changes`
- `should auto-start game when all players ready`

## Technical Requirements

### Component Updates
1. **ReadySystem Component** (`src/components/lobby/ReadySystem.tsx`)
   - Implement ready button functionality
   - Add ready state display
   - Handle ready/unready actions
   - Show game start logic

2. **GameCard Component** (`src/components/lobby/GameCard.tsx`)
   - Integrate ready system component
   - Show ready button for joined players
   - Display ready count and status
   - Handle game start transitions

3. **PlayerSlots Component** (`src/components/lobby/PlayerSlots.tsx`)
   - Add ready status indicators to player slots
   - Show ready badges or icons
   - Update player display with ready state

### State Management
- Add ready state to player objects
- Implement ready/unready actions in lobby state
- Handle game start logic and state transitions
- Manage game status updates

### Navigation
- Implement game start navigation to game board
- Handle route transitions when games start
- Ensure proper cleanup of lobby state

## Implementation Notes
- Focus on basic ready functionality first
- Use existing ready system components where possible
- Ensure proper state management and updates
- Handle edge cases (players leaving while ready)

## Definition of Done
- [ ] Ready system is fully functional
- [ ] Players can mark ready/unready
- [ ] Games start automatically with 4 ready players
- [ ] All ready system E2E tests pass
- [ ] Navigation to game board works
- [ ] No regressions in existing functionality

## Testing Strategy
1. Test ready button functionality
2. Verify ready state display
3. Test game auto-start with 4 ready players
4. Test ready state changes
5. Verify navigation to game board
6. Run full test suite for regressions

## Dependencies
- Builds on Story 4 (player management)
- Requires working player joining functionality
- Uses existing ready system components
- May need routing/navigation updates
