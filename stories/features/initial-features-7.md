# Story: Scoring System and Game Completion

## Overview
Implement the complete Texas 42 scoring system including hand scoring, mark tracking, game completion detection, and final game results. This story completes the core game loop.

## User Story
**As a player**, I want the game to accurately track scores, award marks for winning hands, and properly end games when a team reaches the winning condition.

## Acceptance Criteria

### ✅ Hand Scoring Implementation
- [ ] Calculate points from count dominoes (5-0, 4-1, 3-2, 6-4, 5-5)
- [ ] Award points for tricks taken
- [ ] Compare team score to winning bid
- [ ] Determine if bidding team made their bid
- [ ] Calculate marks awarded (1 or 2 marks per hand)
- [ ] Handle special scoring scenarios (set, etc.)

### ✅ Score Display and Tracking
- [ ] Show current hand score for both teams
- [ ] Display running game score (marks)
- [ ] Update scores in real-time during play
- [ ] Show bid target vs actual score
- [ ] Highlight scoring dominoes in tricks
- [ ] Display score history for completed hands

### ✅ Mark System
- [ ] Award 1 mark for making bid exactly
- [ ] Award 2 marks for making bid + 1 or more
- [ ] Award 2 marks to opponents when bid is set
- [ ] Track total marks for each team
- [ ] Display marks prominently in UI
- [ ] Handle mark progression toward game end

### ✅ Game Completion Logic
- [ ] Detect when team reaches 7 marks (wins game)
- [ ] Handle simultaneous mark achievement
- [ ] Determine final game winner
- [ ] Display game completion screen
- [ ] Show final scores and statistics
- [ ] Offer new game or return to lobby options

### ✅ Hand Transition Management
- [ ] Complete hand when all dominoes played
- [ ] Calculate and display hand results
- [ ] Update marks and prepare for next hand
- [ ] Handle dealer rotation for next hand
- [ ] Reset game state for new hand
- [ ] Maintain game continuity

### ✅ Scoring Validation and Display
- [ ] Validate all scoring calculations
- [ ] Show detailed scoring breakdown
- [ ] Highlight which dominoes contributed points
- [ ] Display bid success/failure clearly
- [ ] Show mark awards with explanations
- [ ] Handle scoring disputes (future consideration)

### ✅ Game Statistics
- [ ] Track hands played in current game
- [ ] Show individual player statistics
- [ ] Display partnership performance
- [ ] Calculate and show game duration
- [ ] Track bidding success rates
- [ ] Show domino play patterns (optional)

## Technical Requirements

### Scoring Accuracy
- Implement authentic Texas 42 scoring rules
- Accurate count domino point values
- Proper mark award calculations
- Correct game completion detection
- Handle all scoring edge cases

### State Management Integration
- Update game state with scores
- Maintain scoring history
- Handle score serialization in URLs
- Real-time score updates for all players
- Consistent scoring across sessions

### Performance Requirements
- Fast scoring calculations
- Smooth score display updates
- Efficient mark tracking
- Quick game completion detection
- Responsive UI updates

## Definition of Done
- [ ] Complete Texas 42 scoring system implemented
- [ ] Accurate mark tracking and awards
- [ ] Game completion properly detected and handled
- [ ] Score displays update in real-time
- [ ] Hand transitions work smoothly
- [ ] Game statistics tracked and displayed
- [ ] Final game results screen functional
- [ ] All scoring edge cases handled
- [ ] Comprehensive tests for scoring logic
- [ ] Integration with complete game flow

## Dependencies
- Domino playing and trick-taking (Story 6)
- Game state management (Story 2)
- Baseball diamond layout (Story 4)
- Texas 42 rules and scoring research
- Backend API for score validation

## Estimated Effort
**5-7 hours** - Complex scoring logic with edge cases

## Testing Strategy
- Unit tests for all scoring calculations
- Integration tests for complete hand scoring
- Edge case testing for mark awards
- Game completion scenario testing
- Score accuracy validation
- Multi-game session testing

## Notes
- Scoring accuracy is critical for authentic experience
- Must handle all Texas 42 scoring scenarios
- Consider future features like detailed statistics
- Ensure scoring works correctly for spectators
- Plan for potential scoring rule variations
- Performance important for real-time updates
