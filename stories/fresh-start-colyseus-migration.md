# Fresh Start: Texas 42 with Colyseus

## Overview

This document outlines a fresh-start approach to building Texas 42 with Colyseus, treating the existing codebase as a reference implementation rather than something to migrate. We'll mine the gold from the existing code while building clean Colyseus patterns from day one.

## Why Fresh Start?

1. **No migration complexity** - Build the right patterns from the beginning
2. **Clean architecture** - Colyseus-first design throughout
3. **Faster development** - No compatibility layers or workarounds
4. **Better testing** - E2E tests designed for WebSockets from start
5. **Pre-release flexibility** - No need for pixel-perfect replication

## What We Keep vs. What We Build Fresh

### Keep (Mine from existing code):
- **Visual inspiration** - Component layouts, game board design
- **Domino rendering** - SVG paths and pip positioning
- **CSS patterns** - Colors, spacing, responsive approaches
- **UX decisions** - What works well in current implementation
- **Development setup** - What made development smooth

### Build Fresh:
- **All TypeScript code** - New architecture, Colyseus patterns
- **State management** - Schema-based from the start
- **E2E tests** - Designed for WebSocket communication
- **Component structure** - Optimized for server state
- **Build configuration** - Simplified, modern setup

### Use Directly:
- **Game rules** - Already documented in `/docs/rules/`
- **Test scenarios** - Comprehensive test plan exists

## Project Structure

```
texas42-colyseus/
├── apps/
│   ├── server/              # Colyseus server
│   │   ├── src/
│   │   │   ├── rooms/
│   │   │   │   └── Texas42Room.ts
│   │   │   ├── schemas/
│   │   │   │   └── Texas42State.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── client/              # React frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── App.tsx
│   │   ├── .storybook/
│   │   └── package.json
│   │
│   └── e2e/                 # Playwright tests
│       ├── tests/
│       └── package.json
│
├── packages/
│   └── game-logic/          # Pure game logic (no framework deps)
│       ├── src/
│       │   ├── engine.ts
│       │   ├── scoring.ts
│       │   └── validation.ts
│       └── package.json
│
├── docs/
│   └── mining-notes/        # What we learned from v1
│       ├── visual-patterns.md
│       ├── ux-decisions.md
│       └── development-tips.md
│
├── turbo.json               # Turborepo config
└── package.json

```

## Week-by-Week Plan

### Week 0: Mining & Setup (2-3 days)

**Day 1: Extract Visual Gold**
- Screenshot key UI states from existing app
- Extract domino SVG rendering code
- Document color schemes and spacing
- Note responsive design patterns

**Day 2: Setup Fresh Project**
- Initialize monorepo with Turborepo
- Create basic project structure
- Set up TypeScript, ESLint, Prettier
- Configure development scripts

**Day 3: Document Mining Results**
- Create visual pattern guide
- List UX decisions to preserve
- Note development workflow improvements
- Identify code patterns to avoid

### Week 1: Colyseus Foundation

**Day 1-2: Server Setup**
- Install Colyseus
- Create Texas42Room skeleton
- Define initial Schema types
- Implement echo test

**Day 3: Game Logic Package**
- Port game rules from docs to code
- Create pure validation functions
- Implement scoring logic
- Unit test everything

**Day 4: Basic Client**
- React app with Vite
- Colyseus client connection
- MockColyseusProvider for testing
- Simple connection UI

**Day 5: Integration Test**
- Server and client talking
- Basic message exchange
- Development workflow verified
- First E2E test passing

### Week 2: Core Components

**Day 1: Domino Component**
- Port SVG rendering (mined from v1)
- Stories for all variations
- Pure presentation component

**Day 2: Game Board Layout**
- Baseball diamond positioning
- Responsive grid setup
- Player position indicators

**Day 3: State Display**
- Score displays
- Phase indicators
- Player status badges

**Day 4-5: First Game Flow**
- Lobby → Waiting → Ready
- Basic room joining
- Player assignment
- State synchronization test

### Week 3: Bidding System

**Day 1-2: Bidding UI**
- Bid buttons and display
- Pass option
- Bid history view
- Trump selection (for 30+ bids)

**Day 3: Server Integration**
- Bid validation
- Turn management
- State updates
- Winner determination

**Day 4-5: Full Bidding Flow**
- Complete bidding phase
- All edge cases handled
- E2E tests for bidding
- Performance check

### Week 4: Playing Phase

**Day 1-2: Hand Display**
- Show player's dominoes
- Highlight playable ones
- Click to play interaction
- Animation on play

**Day 3: Trick Display**
- Current trick layout
- Last trick reference
- Winner indication
- Trump suit display

**Day 4-5: Game Rules**
- Valid play enforcement
- Trick winner calculation
- Score tracking
- Hand completion

### Week 5: Complete Game

**Day 1: Scoring & End Game**
- Round scoring
- Game scoring (to 250)
- Winner announcement
- New game option

**Day 2: Polish**
- Loading states
- Error handling
- Reconnection UI
- Sound effects (optional)

**Day 3: Lobby System**
- Create game
- Join by code
- Game list
- Spectator mode (stretch)

**Day 4-5: Testing & Optimization**
- Full E2E test suite
- Performance profiling
- State size optimization
- Deployment prep

### Week 6: Production Ready

**Day 1-2: Deployment**
- Docker setup
- Environment configuration
- Monitoring setup
- Load testing

**Day 3-4: Documentation**
- Player guide
- Developer docs
- API documentation
- Deployment guide

**Day 5: Launch Prep**
- Final testing
- Backup procedures
- Rollback plan
- Go live!

## Mining Strategy

### Visual Elements to Extract

1. **Domino Rendering**
   - SVG path calculations
   - Pip positioning logic
   - Size scaling approach
   - Selection states

2. **Layout Patterns**
   - Baseball diamond grid
   - Responsive breakpoints
   - Component spacing
   - Mobile adaptations

3. **Interaction Patterns**
   - Click targets
   - Hover states
   - Animation timings
   - Loading indicators

### Code Patterns to Reference

1. **Component Organization**
   - What worked well?
   - What was confusing?
   - Naming conventions that helped

2. **State Patterns**
   - What state shapes were effective?
   - What caused issues?
   - Performance bottlenecks

3. **Testing Approaches**
   - Useful test utilities
   - Mock patterns that worked
   - E2E test scenarios

## Implementation Principles

1. **Server Authoritative** - Client never validates game rules
2. **Schema First** - Design state shape before implementing
3. **Pure Game Logic** - Separate package, no framework dependencies
4. **Mock Everything** - Every component works in Storybook
5. **Test Continuously** - E2E tests for every feature

## Success Metrics

- Clean codebase with consistent patterns
- All game rules properly implemented
- Smooth multiplayer experience
- Easy local development
- Comprehensive test coverage
- Simple deployment process

## Risks & Mitigations

**Risk**: Missing some golden nugget from v1
- **Mitigation**: Dedicated mining phase, reference during development

**Risk**: Scope creep from "just one more feature"
- **Mitigation**: Strict MVP definition, post-launch roadmap

**Risk**: Performance issues with Colyseus
- **Mitigation**: Early testing, state optimization, profiling

**Risk**: Complex deployment
- **Mitigation**: Deploy early and often, automate everything

## Conclusion

By starting fresh with Colyseus while mining the gold from our existing implementation, we can build a cleaner, more maintainable Texas 42 game. The documented rules and existing UI patterns give us a huge head start, while the fresh codebase ensures we're not held back by legacy decisions.

Total timeline: 6 weeks from empty directory to production-ready game.