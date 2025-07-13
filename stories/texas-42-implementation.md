# Texas 42 Implementation Story

## Overview
As a developer, I need to implement the Texas 42 game rules with frontend move validation for immediate feedback and backend computation for authoritative game logic, following strict TDD practices throughout the implementation.

## User Story
**As a** player  
**I want** immediate feedback when I attempt invalid moves  
**And** I want the game logic to be computed authoritatively on the backend  
**So that** I have a responsive UI experience with trustworthy game state

## Architecture Principles

### Frontend Responsibilities
- **Move Validation**: Immediate validation of player moves for UI feedback
- **Visual Feedback**: Show valid/invalid moves before submission
- **Game State Display**: Render current game state from backend data
- **User Interaction**: Handle domino selection and placement

### Backend Responsibilities  
- **Authoritative Game Logic**: All game computations happen on backend
- **State Management**: Maintain and validate complete game state
- **Rule Enforcement**: Final authority on all game rules
- **Score Calculation**: Compute all scoring and game outcomes

## Implementation Strategy (TDD)

### Phase 1: Core Game Types (Red-Green-Refactor)

#### Red: Write Failing Tests
```typescript
// Backend tests
describe('Texas 42 Core Types', () => {
  it('should create valid domino with correct dots', () => {
    const domino = createDomino(6, 4);
    expect(domino.high).toBe(6);
    expect(domino.low).toBe(4);
    expect(domino.points).toBe(10); // If 6-4 has points
  });

  it('should create 4-player partnerships correctly', () => {
    const game = createNewGame(['p1', 'p2', 'p3', 'p4']);
    expect(game.partnerships).toEqual([
      { players: ['p1', 'p3'] },
      { players: ['p2', 'p4'] }
    ]);
  });
});

// Frontend tests
describe('Domino Component', () => {
  it('should render domino with correct dots', () => {
    render(<Domino high={6} low={4} />);
    expect(screen.getByTestId('domino-6-4')).toBeInTheDocument();
  });
});
```

#### Green: Implement Basic Types
```typescript
// Shared types (backend/frontend)
interface Domino {
  high: number;
  low: number;
  points: number;
  id: string;
}

interface Partnership {
  players: [PlayerId, PlayerId];
  score: number;
}

interface GameState {
  phase: 'bidding' | 'playing' | 'complete';
  players: Player[];
  partnerships: Partnership[];
  currentPlayer: PlayerId;
  // ... other state
}
```

### Phase 2: Bidding System (Red-Green-Refactor)

#### Red: Write Failing Tests
```typescript
describe('Bidding System', () => {
  it('should require minimum bid of 30', () => {
    const game = createNewGame();
    expect(() => placeBid(game, 'player1', 25)).toThrow('Minimum bid is 30');
  });

  it('should advance to next player after valid bid', () => {
    const game = createNewGame();
    const newGame = placeBid(game, 'player1', 30);
    expect(newGame.currentPlayer).toBe('player2');
  });
});
```

#### Green: Implement Bidding Logic
```typescript
// Backend implementation
function placeBid(game: GameState, playerId: PlayerId, amount: number): GameState {
  if (amount < 30) throw new Error('Minimum bid is 30');
  // Implementation...
}

// Frontend validation
function isValidBid(currentBid: number, proposedBid: number): boolean {
  return proposedBid >= Math.max(30, currentBid + 1);
}
```

### Phase 3: Trick-Taking Mechanics (Red-Green-Refactor)

#### Red: Write Failing Tests
```typescript
describe('Trick Taking', () => {
  it('should require following suit when possible', () => {
    const game = createGameWithTrick();
    const invalidMove = { domino: createDomino(6, 6), player: 'player2' };
    expect(isValidPlay(game, invalidMove)).toBe(false);
  });

  it('should determine trick winner correctly', () => {
    const trick = createTrickWithPlays();
    const winner = determineTrickWinner(trick, 'doubles');
    expect(winner).toBe('player3');
  });
});
```

### Phase 4: Frontend Move Validation (Red-Green-Refactor)

#### Red: Write Failing Tests
```typescript
describe('Frontend Move Validation', () => {
  it('should highlight valid dominoes for current player', () => {
    const game = createTestGameState();
    render(<GameBoard game={game} currentPlayer="player1" />);
    
    const validDominoes = screen.getAllByTestId(/valid-domino/);
    expect(validDominoes).toHaveLength(3); // Expected valid moves
  });

  it('should prevent invalid domino selection', () => {
    const game = createTestGameState();
    render(<GameBoard game={game} />);
    
    const invalidDomino = screen.getByTestId('domino-invalid');
    fireEvent.click(invalidDomino);
    expect(screen.getByText('Invalid move')).toBeInTheDocument();
  });
});
```

#### Green: Implement Frontend Validation
```typescript
// Frontend validation logic
function getValidMoves(game: GameState, playerId: PlayerId): Domino[] {
  const player = game.players.find(p => p.id === playerId);
  const currentTrick = game.currentTrick;
  
  if (!currentTrick || currentTrick.plays.length === 0) {
    return player.dominoes; // Can play any domino to lead
  }
  
  const leadSuit = determineSuit(currentTrick.plays[0].domino);
  const followSuitDominoes = player.dominoes.filter(d => 
    hasSuit(d, leadSuit)
  );
  
  return followSuitDominoes.length > 0 ? followSuitDominoes : player.dominoes;
}
```

## API Design

### Backend Endpoints
```typescript
// Game management
POST /api/games                    // Create new game
GET  /api/games/:id               // Get game state
POST /api/games/:id/join          // Join game
POST /api/games/:id/leave         // Leave game

// Game actions
POST /api/games/:id/bid           // Place bid
POST /api/games/:id/play          // Play domino
GET  /api/games/:id/valid-moves   // Get valid moves for player
```

### Frontend State Management
```typescript
// React context for game state
interface GameContextType {
  gameState: GameState | null;
  validMoves: Domino[];
  isMyTurn: boolean;
  placeBid: (amount: number) => Promise<void>;
  playDomino: (domino: Domino) => Promise<void>;
  getValidMoves: () => Domino[];
}
```

## Component Architecture

### Frontend Components
```typescript
// Main game components
<GameBoard />                     // Baseball diamond layout
  <PlayerArea />                  // Individual player display
    <DominoHand />               // Player's dominoes
      <Domino />                 // Individual domino component
  <TrickArea />                  // Center area for current trick
  <ScoreBoard />                 // Partnership scores
  <BiddingPanel />               // Bidding interface
```

### Backend Services
```typescript
// Game engine services
class GameEngine {
  validateMove(game: GameState, move: GameMove): boolean;
  applyMove(game: GameState, move: GameMove): GameState;
  calculateScore(game: GameState): GameScores;
  isGameComplete(game: GameState): boolean;
}

class BiddingService {
  placeBid(game: GameState, playerId: PlayerId, amount: number): GameState;
  determineBidWinner(game: GameState): PlayerId;
}

class TrickService {
  playDomino(game: GameState, playerId: PlayerId, domino: Domino): GameState;
  determineTrickWinner(trick: Trick, trumpSuit: Suit): PlayerId;
}
```

## Testing Strategy

### Unit Tests (Backend)
- [ ] Game rule validation
- [ ] Scoring calculations
- [ ] State transitions
- [ ] Edge case handling

### Integration Tests (Backend)
- [ ] Complete game flow
- [ ] API endpoint functionality
- [ ] Database persistence
- [ ] Error handling

### Component Tests (Frontend)
- [ ] Domino rendering
- [ ] Move validation UI
- [ ] Game board layout
- [ ] User interactions

### End-to-End Tests (Frontend)
- [ ] Complete game playthrough
- [ ] Bidding flow
- [ ] Trick-taking mechanics
- [ ] Score calculation display

## Definition of Done
- [ ] All tests pass (unit, integration, E2E)
- [ ] Frontend validates moves before submission
- [ ] Backend authoritatively computes all game logic
- [ ] Game state serialization works correctly
- [ ] UI provides immediate feedback for invalid moves
- [ ] Complete Texas 42 rules implemented
- [ ] Documentation updated
- [ ] Performance requirements met

## Success Metrics
- Move validation response time < 50ms (frontend)
- Game action processing time < 200ms (backend)
- Zero rule violations in testing
- 100% test coverage for game logic
- UI feedback for all user actions

## Dependencies
- Texas 42 rules research completion
- Game state management implementation
- Frontend component library
- Backend API framework setup
