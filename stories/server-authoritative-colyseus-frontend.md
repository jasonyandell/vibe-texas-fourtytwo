# Server-Authoritative Frontend with Colyseus Integration

## Overview

This document outlines the plan to migrate the Texas 42 frontend to work with a Colyseus backend. To minimize risk and maintain a working reference, we will create a fresh `frontend-v2/` directory and migrate components incrementally, starting with the simplest and building up to complex orchestrators.

## Core Principles

1. **Fresh Start**: New frontend directory to avoid breaking existing code
2. **Bottom-Up Migration**: Start with pure presentation components
3. **One Working Feature**: Get one component fully working before mass migration
4. **Continuous Validation**: Each component must work in isolation before moving on
5. **Schema-Driven State**: Colyseus handles all game logic and validation

## Migration Strategy

### Why Fresh Frontend Directory?

- **Zero risk to working code** - Old frontend remains runnable
- **Clear migration progress** - Easy to see what's done
- **Simpler testing** - Test only migrated components
- **Easy rollback** - Delete directory if needed

### Why Fresh Storybook?

- **Clean Colyseus patterns** - MockColyseusProvider built into all stories
- **No legacy confusion** - Clear which components are migrated
- **Proper mocking setup** - Designed for server state from the start
- **Side-by-side comparison** - Run old and new Storybooks on different ports

### Component Dependency Map

```
Pure Presentation (No dependencies)
├── DominoComponent
├── PlayerBadge  
├── ScoreDisplay
└── ConnectionStatus

Display Containers (Read state only)
├── BidHistory
├── TrickDisplay
├── GamePhaseIndicator
└── PlayerHandCounts

Interactive Components (Send messages)
├── BiddingInterface
├── DominoHand
└── ReadyButton

Orchestrators (Coordinate everything)
├── GameBoard
├── PlayArea
└── Lobby
```

## Colyseus Schema Structure

The backend will use Colyseus Schema for state synchronization. Key types needed:

- **Domino**: pips1, pips2, isPlayable flag
- **Player**: id, name, position, hand, connection status
- **Trick**: current dominoes played, lead suit
- **BidHistory**: record of all bids/passes
- **Texas42State**: complete game state including phase, scores, current player

## Realistic Task Sequence

### Week 1: Foundation Setup

**Day 1-2: Backend Infrastructure**
- Set up Colyseus server with basic echo test
- Create minimal Texas42Room class
- Define Schema types in shared-types package
- Verify WebSocket connection works

**Day 3-4: Frontend Infrastructure**
- Create fresh `frontend-v2/` directory
- Set up Vite, React, TypeScript, ESLint
- Install Colyseus client
- **Set up fresh Storybook instance**
- Create MockColyseusProvider for Storybook
- Configure Storybook preview with Colyseus decorator

**Day 5: Integration Checkpoint**
- Connect frontend to backend
- Send/receive one test message
- Verify development workflow
- **Verify Storybook with mock Colyseus state**
- Document any setup issues

### Week 2: Pure Presentation Components

**Day 1: DominoComponent**
- Copy/adapt visual design from old frontend
- Create stories for all domino combinations
- Zero dependencies on game state
- Visual regression tests

**Day 2-3: Basic Display Components**
- PlayerBadge (name, position, connection status)
- ScoreDisplay (team scores)
- ConnectionStatus (online/offline indicator)
- GamePhaseIndicator (waiting/bidding/playing)

**Day 4-5: First State Hook**
- Create `useTexas42State` hook (read-only)
- Build MockColyseusProvider for testing
- Connect one component to state
- Verify re-renders on state change

### Week 3: Display Containers

**Day 1-2: BidHistory Component**
- Display list of bids/passes
- No interaction, just presentation
- Test with various bid sequences
- Handle empty state

**Day 3-4: Basic Layout Structure**
- GameBoard container (layout only)
- Position player areas correctly
- CSS Grid for baseball diamond
- Placeholder divs for components

**Day 5: State Integration**
- Multiple components reading state
- Performance check with updates
- Mock state transitions
- Document any issues

### Week 4: First Interactive Feature

**Day 1-2: BiddingInterface**
- Display available bid buttons
- Send bid/pass messages
- Handle disabled state when not your turn
- Loading states during message send

**Day 3: Error Handling**
- Network failure scenarios
- Invalid action feedback
- Reconnection handling
- User-friendly error messages

**Day 4-5: Complete Bidding Flow**
- Integration test with backend
- All bidding components together
- Validate state transitions
- Record any backend needs

### Week 5: Core Game Components

**Day 1-2: DominoHand**
- Display player's dominoes
- Highlight playable dominoes
- Click to play functionality
- Animate domino removal

**Day 3-4: PlayArea**
- Show current trick
- Display last trick
- Winner indication
- Trump suit display

**Day 5: Full Game Test**
- All components integrated
- Complete game round
- Performance validation
- Bug documentation

### Week 6: Polish and Lobby

**Day 1-2: Lobby System**
- Room creation UI
- Join by room code
- Player ready states
- Start game flow

**Day 3-4: Polish Pass**
- Loading states
- Animations
- Sound effects (optional)
- Responsive design

**Day 5: Migration Completion**
- Remove old frontend
- Update all documentation
- Final test suite run
- Deployment preparation

## Component Migration Checklist

Each component must complete this checklist before moving to the next:

- [ ] Component renders with mock data
- [ ] **Storybook story in frontend-v2 covers all states**
- [ ] **Story uses MockColyseusProvider properly**
- [ ] Unit tests pass (presentation only)
- [ ] Connected to real Colyseus state
- [ ] Actions send correct messages
- [ ] Handles loading/error states
- [ ] TypeScript fully typed
- [ ] No console errors/warnings
- [ ] Works in isolation
- [ ] **Storybook controls allow state manipulation**

## Critical Success Factors

1. **Backend stays ahead** - Frontend can't test without working message handlers
2. **One working feature** - Complete vertical slice before horizontal expansion
3. **Mock everything first** - Every component needs mock data before real integration
4. **Daily validation** - Each day should produce something demoable
5. **Clear dependencies** - Never start a component that depends on unfinished work

## Risk Mitigation

### Common Blockers and Solutions

**Backend not ready:**
- Continue with mock room implementation
- Document exactly what messages/state needed
- Build component in isolation

**State synchronization issues:**
- Add extensive logging to state changes
- Use Colyseus DevTools for debugging
- Create minimal reproduction cases

**Component more complex than expected:**
- Skip to simpler component
- Break into smaller sub-components
- Return when patterns clearer

**Performance problems:**
- Profile specific state updates
- Implement selective re-rendering
- Consider state structure changes

## Testing Strategy

### Testing in Fresh Frontend

**Component Tests:**
- Test each component in complete isolation
- Mock all Colyseus state and interactions
- Focus on user interactions and display logic
- No game rule validation (server's job)

**Integration Tests:**
- Test component combinations
- Mock room behavior for predictable testing
- Verify message sending on user actions
- Test error and loading states

**E2E Tests:**
- Can run against old frontend until ready
- Gradually migrate E2E tests as components complete
- Test real server integration
- Multi-client synchronization tests

### Mock Infrastructure Needed

**MockColyseusProvider:**
- Simulates room connection
- Provides test state to components
- Captures sent messages for assertions
- Simulates state changes

**Mock State Fixtures:**
- Waiting for players state
- Active bidding with history
- Mid-game with partial trick
- Game over with final scores
- Error states

**Fresh Storybook Setup:**
```
frontend-v2/.storybook/
├── main.ts              # Vite-based config
├── preview.tsx          # Global decorators with MockColyseusProvider
├── mocks/
│   ├── roomStates.ts    # Pre-built game states
│   ├── handlers.ts      # Message capture utilities
│   └── stateTransitions.ts # Simulate state changes
└── components/
    └── ColyseusControls.tsx # Addon panel for state manipulation
```

**Storybook Features:**
- All stories automatically wrapped in MockColyseusProvider
- Control panel for triggering state changes
- Action logger for sent messages
- Network condition simulation
- State history playback

## Implementation Tasks

### Backend Tasks (Prerequisite)
1. Set up Colyseus server
2. Create Schema definitions
3. Implement basic Room lifecycle
4. Add message handlers for game actions
5. Integrate game engine logic

### Frontend Infrastructure Tasks
1. Create `frontend-v2` directory structure
2. Set up build tooling (Vite, TypeScript, ESLint)
3. **Set up fresh Storybook with Vite builder**
4. Install and configure Colyseus client
5. Build MockColyseusProvider for tests and Storybook
6. Create Storybook decorators and controls
7. Create test utilities and fixtures
8. Add npm scripts for parallel Storybook instances

### Component Migration Tasks (In Order)
1. **Pure Components** - DominoComponent, PlayerBadge, ScoreDisplay
2. **Display Containers** - BidHistory, TrickDisplay, GamePhaseIndicator  
3. **First Interactive** - BiddingInterface (complete vertical slice)
4. **Game Components** - DominoHand, PlayArea
5. **Orchestrators** - GameBoard, Lobby

### Testing Tasks
1. Set up component test framework
2. Create mock state fixtures
3. Build Storybook decorators
4. Write integration test utilities
5. Migrate E2E tests gradually

## Success Metrics

- Each component works in isolation
- No regressions in functionality
- Clear migration progress visible
- Old frontend remains functional
- New frontend fully testable throughout
- **Fresh Storybook shows only migrated components**
- **All stories work with Colyseus state patterns**

## Directory Structure

```
fourtytwo/
├── frontend/                 # Original frontend (unchanged)
│   ├── .storybook/          # Original Storybook
│   └── src/
├── frontend-v2/             # New Colyseus-based frontend
│   ├── .storybook/          # Fresh Storybook setup
│   │   ├── main.ts
│   │   ├── preview.tsx      # MockColyseusProvider decorator
│   │   └── mocks/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── test-utils/
│   └── package.json         # Separate dependencies
└── package.json             # Root with scripts for both
```

**Root package.json scripts:**
```json
{
  "scripts": {
    "storybook": "npm run storybook --workspace=frontend",
    "storybook:v2": "npm run storybook --workspace=frontend-v2",
    "dev:frontend": "npm run dev --workspace=frontend",
    "dev:frontend:v2": "npm run dev --workspace=frontend-v2"
  }
}
```

## Timeline Summary

- **Week 1**: Foundation (backend + frontend setup)
- **Week 2**: Pure presentation components  
- **Week 3**: Display containers
- **Week 4**: First interactive feature
- **Week 5**: Core game components
- **Week 6**: Polish and completion

This incremental approach ensures continuous progress with minimal risk.