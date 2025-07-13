# Story: Domino Playing and Trick-Taking

## Overview
Implement the core domino playing mechanics including domino selection, play validation, trick-taking logic, and turn management. This story brings the heart of Texas 42 gameplay to life.

## User Story
**As a player**, I want to play dominoes from my hand following Texas 42 rules, see tricks being taken, and have the game properly manage turns and scoring.

## Acceptance Criteria

### ✅ Domino Selection and Playing
- [ ] Enable clicking dominoes in hand to select them
- [ ] Implement drag-and-drop domino playing to center area
- [ ] Add visual feedback for selected dominoes
- [ ] Show valid/invalid play indicators
- [ ] Animate domino movement from hand to trick area
- [ ] Handle domino deselection and reselection

### ✅ Play Validation (Frontend)
- [ ] Validate follow-suit requirements
- [ ] Check trump suit play rules
- [ ] Ensure player can only play on their turn
- [ ] Validate domino is in player's hand
- [ ] Provide immediate feedback for invalid plays
- [ ] Show helpful error messages for rule violations

### ✅ Trick-Taking Logic
- [ ] Determine trick winner based on Texas 42 rules
- [ ] Handle trump suit dominance
- [ ] Implement follow-suit requirements
- [ ] Calculate trick points (count dominoes)
- [ ] Award tricks to winning team
- [ ] Clear trick area after completion

### ✅ Turn Management
- [ ] Track whose turn it is to play
- [ ] Advance turn after valid domino play
- [ ] Handle turn order around the diamond
- [ ] Manage lead player for each trick
- [ ] Update UI to show current player clearly
- [ ] Handle turn timeouts (if implemented)

### ✅ Trick Collection and Display
- [ ] Move completed tricks to appropriate team stack
- [ ] Update trick count displays
- [ ] Show trick points accumulated
- [ ] Implement trick stack visualization
- [ ] Allow viewing individual tricks in stacks
- [ ] Update team scores in real-time

### ✅ Hand Management
- [ ] Remove played dominoes from player hands
- [ ] Update hand display with gaps
- [ ] Handle empty hands (end of hand)
- [ ] Maintain hand layout and spacing
- [ ] Support hand reorganization if needed
- [ ] Show remaining domino count

### ✅ Game Flow Integration
- [ ] Integrate with bidding results (trump suit)
- [ ] Handle first lead after bidding
- [ ] Manage hand completion detection
- [ ] Transition to scoring phase when hand ends
- [ ] Update game state throughout play
- [ ] Support spectator view of all plays

## Technical Requirements

### Game Logic Compliance
- Authentic Texas 42 trick-taking rules
- Proper trump suit handling
- Accurate follow-suit requirements
- Correct point calculations
- Valid turn progression

### State Management
- Integration with game state system
- Real-time state updates
- URL serialization of play state
- Optimistic updates for responsiveness
- Error recovery and rollback

### Performance Requirements
- Smooth domino animations (60fps)
- Fast play validation (under 50ms)
- Responsive turn transitions
- Efficient rendering updates
- Minimal state recalculations

## Definition of Done
- [ ] Players can select and play dominoes from their hands
- [ ] All Texas 42 playing rules properly enforced
- [ ] Tricks are correctly determined and awarded
- [ ] Turn management works smoothly around diamond
- [ ] Trick stacks display team progress accurately
- [ ] Hand completion triggers proper game flow
- [ ] Real-time updates for all players
- [ ] Spectator mode shows all plays
- [ ] Error handling for invalid plays
- [ ] Comprehensive tests for playing logic

## Dependencies
- Core domino components (Story 1)
- Game state management (Story 2)
- Baseball diamond layout (Story 4)
- Bidding system (Story 5)
- Texas 42 rules implementation
- Backend API for play validation

## Estimated Effort
**8-10 hours** - Complex game logic with many interactions

## Testing Strategy
- Unit tests for trick-taking logic
- Integration tests for complete play flows
- E2E tests for multi-player scenarios
- Edge case testing (trump plays, follow-suit violations)
- Performance testing for animations
- State consistency testing

## Notes
- This is the core gameplay experience
- Frontend validation for UX, backend authority for rules
- Must handle all Texas 42 playing scenarios
- Consider future features like play suggestions
- Ensure smooth experience for all players
- Performance is critical for responsive gameplay
