# Story: Initial Layout Implementation

## Overview
Implement the complete Texas 42 game interface including lobby view, in-game layout with baseball diamond arrangement, domino visuals, and all core UI components as specified in the initial layout documentation.

## User Story
**As a player**, I want a complete and intuitive Texas 42 game interface with authentic domino visuals and proper game layout so that I can join games, see all players, and play dominoes in a familiar baseball diamond arrangement.

## Acceptance Criteria

### ✅ Lobby View Implementation
- [ ] Create sidebar showing all active lobbies
- [ ] Implement game cards displaying:
  - Current score for both teams
  - Game status (waiting for players / in progress / completed)
  - 4 fixed player slots with names or "Empty Slot"
  - Visual indicators for ready status
- [ ] Enable click-to-join functionality for empty slots
- [ ] Implement "stand up" (leave game) functionality
- [ ] Add spectate mode for any game
- [ ] Create "Ready" button that appears when 4 players are seated
- [ ] Auto-start game when all 4 players click "Ready"

### ✅ Baseball Diamond Layout
- [ ] Implement 4-player seating arrangement (North, East, South, West)
- [ ] Create player cards with:
  - Player name display
  - Unique color coding for each position
  - Partnership indicators (N-S vs E-W teams)
  - Current turn indicator
- [ ] Position player cards around diamond perimeter
- [ ] Ensure responsive layout that maintains diamond shape

### ✅ Domino Hand Display
- [ ] Create authentic double-6 domino visual components
- [ ] Implement 7-domino hand layout:
  - 4 dominoes in top row
  - 3 dominoes in bottom row (centered)
- [ ] Show player's own hand face-up
- [ ] Show other players' hands face-down (unless spectating)
- [ ] Create gaps where dominoes have been played
- [ ] Implement domino selection and hover states

### ✅ Current Trick Display
- [ ] Create center "pitcher's mound" area for current trick
- [ ] Display up to 4 dominoes played left-to-right
- [ ] Implement dynamic centering and emphasis
- [ ] Show play order and which player played each domino
- [ ] Highlight the winning domino of completed tricks
- [ ] Clear trick area when trick is complete

### ✅ Caught Trick Stacks
- [ ] Create top-left area for player + partner tricks
- [ ] Create top-right area for opponent team tricks
- [ ] Display each trick as 4 vertical dominoes
- [ ] Stack completed tricks top-down
- [ ] Show trick count for each team
- [ ] Implement hover to see individual trick details

### ✅ Game State Display
- [ ] Show current bid and trump suit
- [ ] Display current score for both teams
- [ ] Show whose turn it is clearly
- [ ] Indicate game phase (bidding, playing, scoring)
- [ ] Display marks (games won) for each team
- [ ] Show hand number and total hands in game

### ✅ Interactive Elements
- [ ] Implement domino click-to-play functionality
- [ ] Add drag-and-drop domino playing
- [ ] Create bidding interface with suit selection
- [ ] Implement pass/bid buttons during bidding
- [ ] Add game controls (new game, leave game, etc.)
- [ ] Create responsive touch controls for mobile

### ✅ Visual Polish
- [ ] Implement smooth animations for domino movement
- [ ] Add visual feedback for valid/invalid moves
- [ ] Create loading states for game actions
- [ ] Implement error message display
- [ ] Add sound effects for domino placement (optional)
- [ ] Ensure accessibility with proper ARIA labels

## Technical Requirements

### Frontend Architecture
- React components with TypeScript
- CSS Modules for styling
- Responsive design (desktop and tablet)
- State management with React Context
- Real domino visual assets or CSS-drawn dominoes

### Game State Integration
- URL-serializable game state
- Frontend move validation before backend submission
- Real-time updates (prepare for WebSocket integration)
- Separation of lobby state and game state
- Error handling and recovery

### Performance Requirements
- Smooth 60fps animations
- Fast domino selection and placement
- Minimal re-renders during game play
- Efficient state updates
- Quick lobby refresh

## User Experience Requirements

### Intuitive Gameplay
- Clear visual hierarchy
- Obvious interaction points
- Immediate feedback for all actions
- Familiar Texas 42 conventions
- Easy spectator mode

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Scalable text and UI elements
- Clear focus indicators

### Responsive Design
- Works on desktop (primary)
- Functional on tablets
- Graceful degradation on mobile
- Maintains game playability across screen sizes

## Definition of Done
- [ ] Complete lobby view with all specified features
- [ ] Full in-game layout with baseball diamond arrangement
- [ ] Authentic domino visuals and interactions
- [ ] All game state properly displayed
- [ ] Responsive design working across devices
- [ ] Accessibility requirements met
- [ ] Smooth animations and transitions
- [ ] Error handling and edge cases covered
- [ ] Integration with backend game state
- [ ] Comprehensive E2E tests covering all user flows

## Dependencies
- Initial scaffold must be complete
- Basic game state types defined
- Backend API endpoints available
- Domino visual assets or CSS implementation

## Estimated Effort
**8-12 hours** - Complex UI with many interactive elements

## Testing Strategy
- Playwright E2E tests for complete user flows
- Component tests for individual UI elements
- Visual regression tests for layout consistency
- Accessibility testing with automated tools
- Cross-browser compatibility testing

## Notes
- This implements the visual layer only - game logic handled by backend
- Must support future WebSocket integration for real-time updates
- Layout should be extensible for future features (chat, replays, etc.)
- Authentic Texas 42 experience is paramount
- Performance is critical for smooth gameplay experience
