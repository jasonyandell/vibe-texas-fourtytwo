# React Architecture: Texas 42 Web Game

This document outlines the React component architecture for the Texas 42 web application, following the design principles established in `design.md`. The architecture emphasizes simplicity, testability, and developer experience while supporting serializable game state.

---

## Table of Contents

1. [Architecture Principles](#1-architecture-principles)
2. [State Management Strategy](#2-state-management-strategy)
3. [Component Hierarchy](#3-component-hierarchy)
4. [Testing Strategy](#4-testing-strategy)
5. [Performance Considerations](#5-performance-considerations)

---

## 1. Architecture Principles

### 1.1 Simplicity First
- **Standard React Patterns**: Use idiomatic React patterns (hooks, functional components, context)
- **No Over-Engineering**: Avoid complex state management libraries unless absolutely necessary
- **Clear Component Boundaries**: Each component has a single, well-defined responsibility
- **Minimal Props Drilling**: Use React Context for deeply nested shared state

### 1.2 Developer Experience
- **TypeScript Everywhere**: Full TypeScript coverage for better DX and error catching
- **Hot-Reloading Friendly**: Components designed to work seamlessly with Vite's HMR
- **Clear Error Boundaries**: Graceful error handling with informative error messages
- **Consistent Naming**: Follow established React naming conventions

### 1.3 Testability
- **Pure Components**: Prefer pure functional components for easier testing
- **Isolated Logic**: Extract business logic into custom hooks for unit testing
- **Mock-Friendly**: Design components to accept dependencies via props for easy mocking
- **Test-Driven Development**: Write tests first, following the red-green-refactor cycle

---

## 2. State Management Strategy

### 2.1 State Architecture
```typescript
// Global Application State
interface AppState {
  user: UserState | null;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

// Lobby-Specific State
interface LobbyState {
  games: GameLobby[];
  currentLobby: string | null;
  loading: boolean;
  error: string | null;
}

// Game-Specific State (Serializable)
interface GameState {
  gameId: string;
  players: Player[];
  currentTrick: PlayedDomino[];
  trickHistory: CompletedTrick[];
  scores: TeamScores;
  currentTurn: PlayerId;
  phase: GamePhase;
  // Must be serializable to URL string
}
```

### 2.2 State Management Tools
- **React Context**: For global app state (user, connection)
- **useState/useReducer**: For local component state
- **Custom Hooks**: For reusable stateful logic
- **URL State**: For game state serialization (using URLSearchParams)

### 2.3 State Persistence
- **Game State**: Serialized to URL for shareability and refresh resilience
- **User Preferences**: localStorage for non-critical settings
- **Session State**: sessionStorage for temporary data

---

## 3. Component Hierarchy

### 3.1 Application Root
```typescript
// App.tsx - Root component with routing and global providers
function App() {
  return (
    <UserProvider>
      <ConnectionProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LobbyPage />} />
            <Route path="/game/:gameId" element={<GamePage />} />
          </Routes>
        </Router>
      </ConnectionProvider>
    </UserProvider>
  );
}
```

### 3.2 Page-Level Components

#### 3.2.1 LobbyPage
```typescript
interface LobbyPageProps {
  // No props - gets data from context/hooks
}

function LobbyPage() {
  const { games, loading, error } = useLobbyData();
  const { user } = useUser();

  return (
    <div className="lobby-page">
      <LobbyHeader user={user} />
      <LobbyList games={games} loading={loading} error={error} />
      <CreateGameButton />
    </div>
  );
}
```

#### 3.2.2 GamePage
```typescript
interface GamePageProps {
  // No props - gets gameId from URL params
}

function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const { gameState, actions } = useGameState(gameId);
  const { user } = useUser();

  return (
    <div className="game-page">
      <GameBoard
        gameState={gameState}
        currentUser={user}
        onPlayDomino={actions.playDomino}
      />
    </div>
  );
}
```

### 3.3 Lobby Components

#### 3.3.1 LobbyList
```typescript
interface LobbyListProps {
  games: GameLobby[];
  loading: boolean;
  error: string | null;
}

function LobbyList({ games, loading, error }: LobbyListProps) {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (games.length === 0) return <EmptyState />;
  
  return (
    <div className="lobby-list">
      {games.map(game => (
        <GameLobbyCard key={game.id} game={game} />
      ))}
    </div>
  );
}
```

#### 3.3.2 GameLobbyCard
```typescript
interface GameLobbyCardProps {
  game: GameLobby;
}

function GameLobbyCard({ game }: GameLobbyCardProps) {
  const { user } = useUser();
  const { joinGame, leaveGame, markReady } = useLobbyActions();
  
  return (
    <Card className="game-lobby-card">
      <GameStatus status={game.status} />
      <ScoreDisplay scores={game.scores} />
      <PlayerSlots 
        slots={game.players}
        currentUser={user}
        onJoin={() => joinGame(game.id)}
        onLeave={() => leaveGame(game.id)}
        onReady={() => markReady(game.id)}
      />
      <SpectateButton gameId={game.id} />
    </Card>
  );
}
```

### 3.4 Game Components

#### 3.4.1 GameBoard
```typescript
interface GameBoardProps {
  gameState: GameState;
  currentUser: User;
  onPlayDomino: (domino: Domino) => void;
}

function GameBoard({ gameState, currentUser, onPlayDomino }: GameBoardProps) {
  const isSpectator = !gameState.players.some(p => p.id === currentUser.id);
  
  return (
    <div className="game-board baseball-diamond">
      <PlayerPosition position="north" player={gameState.players[0]} />
      <PlayerPosition position="east" player={gameState.players[1]} />
      <PlayerPosition position="south" player={gameState.players[2]} />
      <PlayerPosition position="west" player={gameState.players[3]} />
      
      <CurrentTrick trick={gameState.currentTrick} />
      
      <TrickStacks 
        teamA={gameState.trickHistory.filter(t => t.winner % 2 === 0)}
        teamB={gameState.trickHistory.filter(t => t.winner % 2 === 1)}
      />
      
      <PlayerHand 
        player={currentUser}
        gameState={gameState}
        isSpectator={isSpectator}
        onPlayDomino={onPlayDomino}
      />
    </div>
  );
}
```

#### 3.4.2 PlayerHand
```typescript
interface PlayerHandProps {
  player: User;
  gameState: GameState;
  isSpectator: boolean;
  onPlayDomino: (domino: Domino) => void;
}

function PlayerHand({ player, gameState, isSpectator, onPlayDomino }: PlayerHandProps) {
  const playerState = gameState.players.find(p => p.id === player.id);
  const isMyTurn = gameState.currentTurn === player.id;
  
  if (!playerState) return null;
  
  return (
    <div className="player-hand">
      <div className="dominoes-row-top">
        {playerState.dominoes.slice(0, 4).map((domino, index) => (
          <DominoCard
            key={`${domino.high}-${domino.low}-${index}`}
            domino={domino}
            isPlayable={isMyTurn && !isSpectator}
            onClick={() => onPlayDomino(domino)}
          />
        ))}
      </div>
      <div className="dominoes-row-bottom">
        {playerState.dominoes.slice(4, 7).map((domino, index) => (
          <DominoCard
            key={`${domino.high}-${domino.low}-${index + 4}`}
            domino={domino}
            isPlayable={isMyTurn && !isSpectator}
            onClick={() => onPlayDomino(domino)}
          />
        ))}
      </div>
    </div>
  );
}
```

### 3.5 Shared Components

#### 3.5.1 DominoCard
```typescript
interface DominoCardProps {
  domino: Domino | null; // null for empty slots
  isPlayable?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

function DominoCard({ domino, isPlayable = false, onClick, size = 'medium' }: DominoCardProps) {
  if (!domino) {
    return <div className={`domino-placeholder ${size}`} />;
  }
  
  return (
    <button
      className={`domino-card ${size} ${isPlayable ? 'playable' : ''}`}
      onClick={isPlayable ? onClick : undefined}
      disabled={!isPlayable}
    >
      <div className="domino-half top">{domino.high}</div>
      <div className="domino-divider" />
      <div className="domino-half bottom">{domino.low}</div>
    </button>
  );
}
```

---

## 4. Testing Strategy

### 4.1 Component Testing
```typescript
// Example: Testing React components
describe('LobbyPage', () => {
  it('renders lobby list when data is available', () => {
    render(
      <UserProvider>
        <LobbyPage />
      </UserProvider>
    );

    expect(screen.getByTestId('lobby-list')).toBeInTheDocument();
  });

  it('shows loading state when data is loading', () => {
    render(
      <UserProvider>
        <LobbyPage />
      </UserProvider>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

### 4.2 Custom Hook Testing
```typescript
// Example: Testing game state hook
describe('useGameState', () => {
  it('serializes game state to URL', () => {
    const { result } = renderHook(() => useGameState('game-123'));

    act(() => {
      result.current.actions.playDomino({ high: 6, low: 6 });
    });

    // Verify URL contains serialized state
    expect(window.location.search).toContain('state=');
  });
});
```

### 4.3 End-to-End Testing
```typescript
// Playwright test example
test('complete game flow', async ({ page }) => {
  await page.goto('/');

  // Join a game
  await page.click('[data-testid="empty-slot"]');
  await page.click('[data-testid="ready-button"]');

  // Play a domino
  await page.click('[data-testid="domino-6-6"]');

  // Verify game state
  await expect(page.locator('[data-testid="current-trick"]')).toContainText('6-6');
});
```

---

## 5. Performance Considerations

### 5.1 Optimization Strategies
- **React.memo**: Memoize expensive components (DominoCard, PlayerPosition)
- **useMemo/useCallback**: Memoize expensive calculations and stable callbacks
- **Code Splitting**: Lazy load game components only when needed
- **Virtual Scrolling**: For large lobby lists (future consideration)

### 5.2 State Update Optimization
```typescript
// Optimized game state updates
function useGameState(gameId: string) {
  const [state, setState] = useState<GameState>();

  const actions = useMemo(() => ({
    playDomino: (domino: Domino) => {
      setState(prev => {
        if (!prev) return prev;

        // Immutable update
        const newState = {
          ...prev,
          currentTrick: [...prev.currentTrick, { domino, player: prev.currentTurn }],
          currentTurn: getNextPlayer(prev.currentTurn, prev.players)
        };

        // Serialize to URL
        updateURLWithGameState(newState);

        return newState;
      });
    }
  }), []);

  return { gameState: state, actions };
}
```

### 5.3 Bundle Size Management
- **Tree Shaking**: Ensure unused code is eliminated
- **Dynamic Imports**: Load game logic only when entering a game
- **Asset Optimization**: Optimize domino images and animations

---

## 6. Implementation Guidelines

### 6.1 Development Workflow
1. **Write Tests First**: Follow TDD for all new components
2. **TypeScript Strict**: No `any` types, full type coverage
3. **Hot Reload Friendly**: Design for fast development iteration

### 6.2 Code Organization
```
src/
├── components/
│   ├── lobby/
│   ├── game/
│   └── shared/
├── hooks/
├── contexts/
├── types/
├── utils/
└── __tests__/
```

### 6.3 Naming Conventions
- **Components**: PascalCase (e.g., `GameLobbyCard`)
- **Hooks**: camelCase with `use` prefix (e.g., `useGameState`)
- **Types**: PascalCase with descriptive names (e.g., `GameState`)
- **Test Files**: `*.test.tsx` or `*.spec.tsx`

---

## Conclusion

This React architecture prioritizes the core design principles of simplicity, developer experience, and testability. By leveraging standard React patterns and comprehensive TypeScript coverage, we create a maintainable and scalable codebase that supports rapid development.

**Key Architectural Decisions**:
1. **Context over Redux**: Simpler state management for this application size
2. **URL State Serialization**: Enables game state sharing and refresh resilience
3. **Test-Driven Components**: Every component designed for easy testing
4. **TypeScript Everywhere**: Full type safety for better DX

This architecture supports the project's goals of fast development cycles and excellent developer experience while maintaining the flexibility to evolve as requirements change.
