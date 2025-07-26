# Server-Authoritative Frontend Refactoring Plan

## Overview

This document outlines the plan to refactor the Texas 42 frontend to be completely server-authoritative. The frontend will have no game logic, validation, or state management beyond UI concerns. All game state, validation, and business logic will be handled by the backend.

## Core Principles

1. **Single Source of Truth**: Backend owns all game state
2. **No Client Validation**: Frontend only displays what backend allows
3. **Real-time Synchronization**: WebSocket for instant updates
4. **Optimistic UI**: Keep existing optimistic update system for responsiveness
5. **Dumb Components**: Frontend components only render server state

## Component-by-Component Refactoring Plan

### 1. GameBoard Component

**Current Responsibilities:**
- Renders game layout
- Manages bidding through custom hook
- Handles game phase transitions

**After Refactoring:**
- Purely presentational
- Renders exactly what server provides
- No phase logic, just render server's phase

**Required Backend Data:**
```typescript
interface GameBoardData {
  phase: 'bidding' | 'playing' | 'scoring' | 'ended';
  players: {
    [position: string]: {
      name: string;
      isConnected: boolean;
      score: number;
      isCurrentTurn: boolean;
      handSize: number; // Don't send actual hand unless it's the player's
    };
  };
  currentPlayerHand?: Domino[]; // Only for the requesting player
  currentTrick?: PlayedDomino[];
  lastTrick?: PlayedDomino[];
  trump?: Suit;
  currentBid?: number;
  bidWinner?: Position;
}
```

### 2. BiddingInterface Component

**Current Responsibilities:**
- Displays bidding UI
- Local bid validation
- Bid submission

**After Refactoring:**
- Display available bids from server
- No validation, just send bid attempts
- Show bid history from server

**Required Backend Data:**
```typescript
interface BiddingData {
  availableBids: number[]; // Server calculates based on current highest
  canPass: boolean;
  canPlunge: boolean;
  currentHighBid?: {
    amount: number;
    player: string;
    trump?: Suit;
  };
  bidHistory: Array<{
    player: string;
    action: 'bid' | 'pass';
    amount?: number;
  }>;
  timeRemaining?: number; // For bid timer
}
```

### 3. DominoHand Component

**Current Responsibilities:**
- Renders player's dominoes
- Handles selection
- Visual states (playable, selected)

**After Refactoring:**
- Only render what server says
- Send click events to server
- Server determines playability

**Required Backend Data:**
```typescript
interface HandData {
  dominoes: Array<{
    pips: [number, number];
    isPlayable: boolean; // Server determines based on game rules
    isSelected?: boolean; // For multi-select scenarios
  }>;
  canPlay: boolean; // Is it this player's turn?
}
```

### 4. Lobby Component

**Current Responsibilities:**
- Lists available games
- Handles game creation
- Manages join/leave

**After Refactoring:**
- Display server's game list
- Forward all actions to server
- No local filtering/sorting (or keep as UI-only)

**Required Backend Data:**
```typescript
interface LobbyData {
  games: Array<{
    id: string;
    name: string;
    status: 'waiting' | 'in_progress' | 'finished';
    players: Array<{
      name: string;
      position: Position;
      isReady: boolean;
    }>;
    createdAt: string;
    canJoin: boolean; // Server determines based on game state
  }>;
  currentPlayer?: {
    id: string;
    name: string;
    currentGameId?: string;
  };
}
```

## API Endpoints Required

### REST Endpoints

```
POST   /api/games                 # Create game
GET    /api/games                 # List games
GET    /api/games/:id             # Get game state
POST   /api/games/:id/join        # Join game
POST   /api/games/:id/leave       # Leave game
POST   /api/games/:id/ready       # Toggle ready status
POST   /api/games/:id/bid         # Submit bid
POST   /api/games/:id/play        # Play domino
GET    /api/games/:id/valid-moves # Get valid moves for current player
```

### WebSocket Events

**From Server:**
```
game:updated        # Full game state update
game:player-joined  # Player joined notification
game:player-left    # Player left notification
game:started        # Game started
game:ended          # Game ended with final scores
turn:changed        # It's now a different player's turn
bid:placed          # A bid was placed
domino:played       # A domino was played
trick:completed     # Trick finished, show winner
hand:won            # Hand completed with scores
```

**To Server:**
```
game:join           # Join a game
game:leave          # Leave current game
game:ready          # Toggle ready status
bid:submit          # Submit a bid
bid:pass            # Pass on bidding
domino:play         # Play a domino
game:request-state  # Request full state refresh
```

## State Management Changes

### GameStateContext Refactoring

**Remove:**
- Local game logic
- Validation functions
- State calculations

**Keep:**
- Optimistic update system
- WebSocket connection management
- State synchronization
- Error handling

**New Structure:**
```typescript
interface GameStateContext {
  // Server state
  serverState: GameState | null;
  
  // Connection
  isConnected: boolean;
  connectionError: Error | null;
  
  // Optimistic updates (keep for UX)
  pendingActions: Map<string, PendingAction>;
  
  // Actions (all async, server-bound)
  actions: {
    playDomino: (domino: Domino) => Promise<void>;
    placeBid: (amount: number, trump?: Suit) => Promise<void>;
    passBid: () => Promise<void>;
    refreshState: () => Promise<void>;
  };
}
```

### LobbyStateContext Refactoring

**Remove:**
- Local game creation logic
- Client-side filtering (or make it UI-only)

**Keep:**
- WebSocket subscription
- Real-time updates
- Error handling

## Migration Strategy

### Phase 1: Backend API Implementation
1. Implement all REST endpoints
2. Add WebSocket server
3. Move all game logic to backend
4. Implement state broadcasting

### Phase 2: Frontend WebSocket Integration
1. Add WebSocket client
2. Update contexts for server communication
3. Keep optimistic updates for UX
4. Add connection status UI

### Phase 3: Component Refactoring
1. Remove all validation from components
2. Update components to use server data
3. Convert all actions to server calls
4. Remove local state calculations

### Phase 4: Testing & Validation
1. Ensure all game rules work server-side
2. Test latency with optimistic updates
3. Handle disconnection/reconnection
4. Security audit

## Benefits of Server-Authoritative Architecture

1. **Security**: No client-side cheating possible
2. **Consistency**: All players see same state
3. **Spectator Mode**: Easy to add read-only viewers
4. **Replay System**: Server can store all moves
5. **Analytics**: Track all game events server-side
6. **Cross-Platform**: Same backend for web, mobile, etc.

## Challenges & Solutions

### Challenge: Latency
**Solution**: Keep optimistic update system with rollback on server rejection

### Challenge: Connection Issues
**Solution**: Implement reconnection with state recovery

### Challenge: Real-time Performance
**Solution**: Use efficient WebSocket protocol with minimal data transfer

### Challenge: Development Complexity
**Solution**: Implement in phases, maintain backwards compatibility during migration

## Success Metrics

1. Zero client-side game logic
2. All validation server-side
3. Consistent state across all clients
4. Sub-100ms optimistic updates
5. Graceful handling of disconnections
6. No gameplay bugs from client-side state

## Timeline Estimate

- Phase 1 (Backend): 2-3 weeks
- Phase 2 (WebSocket): 1 week
- Phase 3 (Components): 2 weeks
- Phase 4 (Testing): 1 week

Total: 6-7 weeks for complete migration

## Next Steps

1. Review and approve this plan
2. Create detailed backend API specification
3. Set up WebSocket infrastructure
4. Begin Phase 1 implementation