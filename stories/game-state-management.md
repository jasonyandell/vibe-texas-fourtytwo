# Game State Management Story

## Overview
As a developer working on the Texas 42 web game, I need a robust game state management system that can serialize the complete game state into a URL-compatible format while maintaining clear separation between game state and lobby state.

## User Story
**As a** player  
**I want** the game state to be preserved in the URL  
**So that** I can bookmark, share, or reload the game at any point without losing progress

## Acceptance Criteria

### 1. Complete Serialization
- [ ] All game state must be serializable to a single compact string
- [ ] Serialized state must be small enough for GET parameters (< 2000 characters)
- [ ] State must deserialize back to identical game object
- [ ] No game information should be lost in serialization/deserialization

### 2. URL Compatibility
- [ ] Serialized state uses URL-safe characters only
- [ ] State can be passed as query parameter: `?game=<serialized_state>`
- [ ] Browser URL updates automatically when game state changes
- [ ] Players can share game URLs to resume games

### 3. Separation of Concerns
- [ ] Game state contains ONLY current game information
- [ ] Lobby state is separate and handles player joining/leaving
- [ ] Game state knows nothing about lobby management
- [ ] Clear boundaries between game and lobby responsibilities

### 4. Game State Components
The game state must include:
- [ ] **Player Information**: Who has which dominoes, who bid what
- [ ] **Partnerships**: Partners always sit across from each other
- [ ] **Trick History**: For each partnership, what tricks caught and who played what
- [ ] **Turn Management**: Whose turn it is currently
- [ ] **Scoring**: Current game score and trick score (points earned by tricks)
- [ ] **Game Flow**: Who shuffled last, current phase (bidding/playing)

## Technical Requirements

### Frontend Implementation
```typescript
// Game state interface
interface GameState {
  players: Player[];
  partnerships: Partnership[];
  currentTrick: Trick | null;
  trickHistory: Trick[];
  currentPlayer: PlayerId;
  gamePhase: 'bidding' | 'playing' | 'scoring';
  scores: GameScores;
  dominoes: DominoDistribution;
  bidHistory: Bid[];
  trumpSuit: Suit | null;
}

// Serialization functions
function serializeGameState(state: GameState): string;
function deserializeGameState(serialized: string): GameState;
function isValidGameState(state: any): state is GameState;
```

### Backend Implementation
```typescript
// Game state validation and processing
class GameStateManager {
  validateState(state: GameState): boolean;
  applyMove(state: GameState, move: GameMove): GameState;
  calculateScore(state: GameState): GameScores;
  isGameComplete(state: GameState): boolean;
}
```

## Implementation Strategy (TDD)

### Phase 1: Basic Serialization (Red-Green-Refactor)
1. **Red**: Write failing test for basic game state serialization
2. **Green**: Implement minimal serialization that passes test
3. **Refactor**: Optimize for URL length and readability

### Phase 2: URL Integration (Red-Green-Refactor)
1. **Red**: Write failing test for URL parameter integration
2. **Green**: Implement URL state management
3. **Refactor**: Ensure browser history works correctly

### Phase 3: State Validation (Red-Green-Refactor)
1. **Red**: Write failing tests for state validation
2. **Green**: Implement validation logic
3. **Refactor**: Add comprehensive error handling

### Phase 4: Performance Optimization (Red-Green-Refactor)
1. **Red**: Write failing tests for serialization size limits
2. **Green**: Implement compression and optimization
3. **Refactor**: Ensure readability and maintainability

## Definition of Done
- [ ] All tests pass (unit and integration)
- [ ] Game state serializes to < 2000 characters
- [ ] URL updates automatically with game state changes
- [ ] Players can share and resume games via URL
- [ ] Clear separation between game and lobby state
- [ ] Documentation updated with state management guide
- [ ] Performance meets requirements (< 100ms serialization)

## Dependencies
- Texas 42 rules implementation (for state validation)
- Frontend routing system (for URL management)
- Backend game engine (for state processing)

## Risks and Mitigations
- **Risk**: Serialized state too large for URLs
  - **Mitigation**: Use compression and efficient encoding
- **Risk**: State corruption during serialization
  - **Mitigation**: Comprehensive validation and error handling
- **Risk**: Performance issues with large game histories
  - **Mitigation**: Optimize data structures and consider state pruning

## Success Metrics
- Serialization time < 100ms for typical game state
- Deserialization accuracy: 100% (no data loss)
- URL length < 2000 characters for complete game state
- Zero state corruption incidents in testing
