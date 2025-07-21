# Game Flow Overview

## Implementation Strategy
Build vertical slices using fake data to demonstrate complete user journeys without requiring complex Texas 42 rules validation. Rules-dependent features will be implemented in later phases.

## Lobby Flows

### 1. Empty Lobby
**Components:** `LobbySection`, `EmptyLobbyState`, `CreateGameButton`
- Display clean lobby interface with no active games
- Show prominent "Create Game" call-to-action
- Include helpful onboarding text for new users

### 2. Create Game
**Components:** `GameCreationModal`, `GameSettingsForm`, `PlayerLimitSelector`
- Modal form for game creation
- Basic game settings (name, player limit, privacy)
- Form validation and error handling
- Success state showing new game created

### 3. Lobby with Active Games
**Components:** `GameCard`, `PlayerList`, `GameStatusBadge`, `JoinButton`
- Display multiple game cards in grid layout
- Show game status (waiting, playing, finished)
- Display current player count and limits
- Quick join functionality for available games

### 4. Joining a Game
**Components:** `GameDetailsModal`, `PlayerSlot`, `ReadyToggle`, `LeaveGameButton`
- Detailed view of selected game
- Player management interface
- Ready/unready toggle system
- Real-time player list updates

## Game Flows (Fake Data)

### 5. Game Start Transition
**Components:** `GameTransition`, `LoadingSpinner`, `PlayerSeating`, `GameHeader`
- Smooth transition from lobby to game table
- Player seating arrangement display
- Game information header (round, scores)
- Loading states and animations

### 6. Bidding Interface
**Components:** `BiddingPanel`, `BidButton`, `BidHistory`, `TurnIndicator`
- Bid selection controls (30, 32, 34, 36, 42, Mark, Pass)
- Visual turn indicator showing whose turn
- Bid history display showing all previous bids
- Fake bid validation (no actual rules)

### 7. Game Playing Interface
**Components:** `HandDisplay`, `TrickArea`, `DominoCard`, `PlayButton`
- Player's hand of dominoes (7 fake dominoes)
- Central trick area showing played dominoes
- Domino selection and play interface
- Turn management with fake validation

### 8. Spectator Mode
**Components:** `SpectatorView`, `GameStateDisplay`, `ViewControls`, `SpectatorBanner`
- Read-only view of game in progress
- All game information visible but non-interactive
- Clear spectator mode indicators
- Option to leave spectator mode

### 9. Scoring Display
**Components:** `ScoreBoard`, `TeamScores`, `RoundHistory`, `PointsBreakdown`
- Current team scores display
- Round-by-round scoring history
- Points breakdown for transparency
- Fake scoring calculations

### 10. Finished Game
**Components:** `GameResults`, `WinnerAnnouncement`, `FinalScores`, `PlayAgainButton`
- Game completion announcement
- Final score display with winner highlight
- Game statistics and summary
- Options to play again or return to lobby

## Additional Display Components

### 11. Domino Hand Display
**Components:** `DominoHand`, `DominoCard`, `HandSorter`
- Display 7 random dominoes in player's hand
- Sorting options (by suit, by value)
- Selection highlighting for playable dominoes

### 12. Trick Area Display
**Components:** `TrickArea`, `PlayedDomino`, `TrickWinner`
- Central area showing 1-4 played dominoes
- Clear visual indication of domino ownership
- Trick winner highlighting (fake logic)

### 13. Turn Indicator System
**Components:** `TurnIndicator`, `PlayerAvatar`, `TimerDisplay`
- Clear visual indication of active player
- Optional turn timer display
- Player avatar highlighting

### 14. Bid History Display
**Components:** `BidTracker`, `BidEntry`, `PassIndicator`
- Chronological list of all bids placed
- Pass indicators for players who passed
- Winning bid highlighting

### 15. Score Tracking
**Components:** `LiveScoreBoard`, `TeamDisplay`, `PointsCounter`
- Real-time team score updates
- Points needed to win indicator
- Score change animations

## Rules-Dependent Features (Future Implementation)
- Trick catching logic
- Suit-following validation
- Trump playing rules
- Actual scoring calculations
- Win condition checking

## Testing Strategy
Each flow will have comprehensive Playwright tests covering:
- User interactions and state changes
- Visual feedback and animations
- Error handling and edge cases
- Accessibility and responsive design
- Cross-browser compatibility

## Component Architecture
All components follow the established patterns:
- TypeScript with strict typing
- CSS Modules for styling
- Data-testid attributes for testing
- Responsive design principles
- Accessibility best practices
