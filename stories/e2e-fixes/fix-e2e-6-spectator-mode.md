# Story: Fix Spectator Mode E2E Tests

## Overview
Implement spectator mode functionality to allow users to watch games without participating. This includes spectator count display, joining as spectator, and spectator list management.

## Acceptance Criteria

### Spectator Display
- [ ] Spectator count shows on game cards: "0 Spectators", "1 Spectator", "2 Spectators"
- [ ] Spectator list displays current spectators
- [ ] Spectator section has proper `data-testid="spectator-section"`
- [ ] Empty spectator state shows appropriately

### Spectator Actions
- [ ] Users can join games as spectators
- [ ] Spectators can leave spectator mode
- [ ] Spectator joining doesn't affect player count
- [ ] Spectator actions are clearly labeled

### Spectator UI Elements
- [ ] "Join as Spectator" button appears on game cards
- [ ] Spectator list shows spectator names
- [ ] Spectator count updates in real-time
- [ ] Spectator mode indicators are clear

### E2E Test Targets
Make these specific tests pass:
- `should display spectator count`
- `should allow joining as spectator`
- `should show spectator list`
- `should handle leaving spectator mode`

## Technical Requirements

### Component Updates
1. **GameCard Component** (`src/components/lobby/GameCard.tsx`)
   - Add spectator count display
   - Add "Join as Spectator" button
   - Show spectator section with proper test ID
   - Handle spectator actions

2. **SpectatorView Component** (`src/components/lobby/SpectatorView.tsx`)
   - Implement spectator list display
   - Add spectator joining/leaving logic
   - Show spectator count and names
   - Handle spectator state management

3. **Lobby State Management**
   - Add spectator arrays to game objects
   - Implement spectator join/leave actions
   - Track spectator counts per game
   - Handle spectator state updates

### Data Structure
- Add spectators array to LobbyGame type
- Include spectator information (id, name, joinedAt)
- Track current user spectator status
- Handle spectator count calculations

### User Experience
- Clear distinction between players and spectators
- Intuitive spectator joining/leaving flow
- Proper feedback for spectator actions
- Accessible spectator controls

## Implementation Notes
- Build on existing spectator components
- Ensure spectator actions don't interfere with player actions
- Use proper state management for spectator data
- Handle edge cases (spectators leaving, games starting)

## Definition of Done
- [ ] Spectator count displays correctly on game cards
- [ ] Users can join/leave as spectators
- [ ] Spectator list shows current spectators
- [ ] All spectator mode E2E tests pass
- [ ] Spectator functionality is accessible
- [ ] No regressions in existing functionality

## Testing Strategy
1. Test spectator count display
2. Test joining as spectator
3. Verify spectator list functionality
4. Test leaving spectator mode
5. Verify spectator state persistence
6. Run full test suite for regressions

## Dependencies
- Builds on previous stories (game cards, player management)
- Uses existing spectator components
- Requires proper game state management
- May need user identification system
