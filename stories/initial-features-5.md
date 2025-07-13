# Story: Texas 42 Bidding System

## Overview
Implement the complete Texas 42 bidding phase including bid validation, trump suit selection, and the transition from bidding to playing. This story brings authentic Texas 42 bidding mechanics to the web game.

## User Story
**As a player**, I want to participate in the Texas 42 bidding phase with proper rules and validation so that I can compete for the right to name trump and set the game's target score.

## Acceptance Criteria

### ✅ Bidding Interface
- [ ] Create bidding panel with number input (30-42)
- [ ] Implement trump suit selection (Blanks, Ones, Twos, Threes, Fours, Fives, Sixes)
- [ ] Add "Pass" button for declining to bid
- [ ] Show current high bid and bidder
- [ ] Display bidding turn indicator
- [ ] Implement bid validation and error messages

### ✅ Bidding Rules Implementation
- [ ] Enforce minimum bid of 30 points
- [ ] Require bids to be higher than current high bid
- [ ] Implement proper bidding turn order
- [ ] Handle all players passing (re-deal scenario)
- [ ] Validate trump suit selection with bid
- [ ] Support bid increments and maximum bid (42)

### ✅ Bidding Flow Management
- [ ] Start bidding phase after all players ready
- [ ] Track bidding turn progression
- [ ] Handle bid acceptance and rejection
- [ ] Transition to playing phase when bidding complete
- [ ] Store winning bid and trump suit in game state
- [ ] Update UI to reflect bidding results

### ✅ Visual Bidding Display
- [ ] Show bidding history for current hand
- [ ] Highlight current bidder clearly
- [ ] Display trump suit options with visual indicators
- [ ] Show bid validation feedback immediately
- [ ] Animate bidding transitions smoothly
- [ ] Update game state display with winning bid

### ✅ Bidding State Management
- [ ] Integrate with game state system from Story 2
- [ ] Handle bidding state in URL serialization
- [ ] Implement bidding action reducers
- [ ] Add bidding state validation
- [ ] Support undo/redo for accidental bids (if allowed)
- [ ] Handle network interruptions during bidding

### ✅ Trump Suit Integration
- [ ] Store selected trump suit in game state
- [ ] Display trump suit prominently during play
- [ ] Prepare trump suit for domino validation logic
- [ ] Integrate trump with scoring calculations
- [ ] Handle trump suit in trick-taking logic
- [ ] Support trump suit display in UI

## Technical Requirements

### Game Logic Integration
- Frontend validation with backend authority
- State management integration
- URL serialization support
- Error handling and recovery
- Real-time updates for all players

### UI/UX Requirements
- Intuitive bidding interface
- Clear feedback for valid/invalid bids
- Responsive design for different devices
- Accessibility support for bidding actions
- Smooth transitions between phases

### Performance Requirements
- Fast bid validation (under 50ms)
- Responsive UI updates
- Efficient state management
- Minimal re-renders during bidding
- Quick phase transitions

## Definition of Done
- [ ] Complete bidding interface with all controls
- [ ] All Texas 42 bidding rules implemented
- [ ] Bidding state properly managed and serialized
- [ ] Smooth transition from bidding to playing
- [ ] Trump suit selection and display working
- [ ] Error handling for invalid bids
- [ ] Real-time updates for all players
- [ ] Accessibility requirements met
- [ ] Comprehensive tests for bidding logic
- [ ] Integration with overall game flow

## Dependencies
- Game state management system (Story 2)
- Baseball diamond layout (Story 4)
- Texas 42 rules research completion
- Backend API for bid validation
- Game phase management

## Estimated Effort
**4-6 hours** - Focused on bidding mechanics

## Testing Strategy
- Unit tests for bidding validation logic
- Integration tests for bidding flow
- E2E tests for complete bidding scenarios
- Error condition testing
- Multi-player bidding simulation
- State serialization testing

## Notes
- Bidding is critical to authentic Texas 42 experience
- Must handle edge cases like all players passing
- Consider future features like bid suggestions
- Ensure bidding works well for spectators
- Plan for potential bid timing limits
- Frontend validation for UX, backend for authority
