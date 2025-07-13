# Story: Fix Player Management E2E Tests

## Overview
Implement player joining, leaving, and management functionality to make player management E2E tests pass. This includes handling player slot interactions and updating game state appropriately.

## Acceptance Criteria

### Player Joining
- [ ] Clicking empty slots allows players to join
- [ ] Player names appear in slots after joining
- [ ] Player count updates when players join/leave
- [ ] Only empty slots are clickable for joining

### Player Display
- [ ] Joined players show proper names and positions
- [ ] Current user is highlighted appropriately
- [ ] Player avatars or initials display correctly
- [ ] Partnership teams are clearly indicated

### Game State Updates
- [ ] Game player count updates in real-time
- [ ] Lobby list reflects current player counts
- [ ] Game status updates based on player count
- [ ] Player changes persist in game state

### E2E Test Targets
Make these specific tests pass:
- `should handle player joining`
- Tests that interact with player slots
- Tests that verify player count changes

## Technical Requirements

### Component Updates
1. **PlayerSlots Component** (`src/components/lobby/PlayerSlots.tsx`)
   - Implement click handlers for empty slots
   - Add proper player joining logic
   - Ensure player information displays correctly
   - Handle current user highlighting

2. **GameCard Component** (`src/components/lobby/GameCard.tsx`)
   - Connect player joining functionality
   - Update player count display
   - Handle game state changes
   - Pass proper callbacks to PlayerSlots

3. **Lobby State Management**
   - Add player joining/leaving actions
   - Update game objects when players change
   - Ensure state consistency across components
   - Handle user identification

### User Management
- Implement basic user identification system
- Handle player names and IDs
- Manage current user state
- Ensure proper player slot assignment

## Implementation Notes
- Focus on basic player joining functionality
- Use mock user data for testing purposes
- Ensure state updates are reflected immediately
- Maintain existing component structure

## Definition of Done
- [ ] Players can join empty slots by clicking
- [ ] Player information displays correctly
- [ ] Game state updates when players join/leave
- [ ] All player management E2E tests pass
- [ ] No regressions in existing functionality
- [ ] Player interactions are accessible

## Testing Strategy
1. Test clicking empty slots to join
2. Verify player information display
3. Test player count updates
4. Verify game state persistence
5. Run full test suite for regressions

## Dependencies
- Builds on Story 3 (game cards display)
- Requires working game card rendering
- Uses existing player slot components
- May need basic user state management
