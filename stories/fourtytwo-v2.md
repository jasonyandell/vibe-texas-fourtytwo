# Texas 42 V2: Server-Authoritative Colyseus Implementation

## Project Overview

A fresh implementation of Texas 42 as a server-authoritative multiplayer game using Colyseus backend and React frontend. The server handles all game logic, validation, and state management while the client provides a responsive UI that reflects server state.

## Architecture Principles

1. **Server Authoritative** - All game rules validated server-side only
2. **Schema-Driven State** - Colyseus Schema for automatic synchronization
3. **WebSocket Communication** - Real-time bidirectional messaging
4. **Room-Based Games** - Each game is a Colyseus room with 4 players
5. **Pure Game Logic** - Separate package for rules, testable in isolation

## Project Structure

```
texas42-v2/
├── apps/
│   ├── server/              # Colyseus backend
│   ├── client/              # React frontend  
│   └── e2e/                 # Playwright tests
├── packages/
│   └── game-logic/          # Pure game rules
├── docs/
│   ├── rules/               # Copy from existing project
│   └── mining/              # Notes from v1 analysis
└── tools/
    └── scripts/             # Development utilities
```

## Implementation Phases

### Phase 0: Mining & Setup (3 days)

**Day 1: Automated Asset Extraction**
- Write extraction script for DominoComponent SVG paths
- Auto-generate color palette from CSS/styled-components
- Export spacing units to design-tokens.json
- Screenshot UI states programmatically
- Store assets in `/docs/mining/assets/`

**Day 2: Initialize Project & CI/CD**
- Create texas42-v2 directory
- Run `npx create-turbo@latest`
- Delete example apps
- Create apps/server, apps/client, packages/game-logic folders
- Set up GitHub Actions for CI/CD
- Configure automated testing on PRs

**Day 3: Basic Configuration & Infrastructure**
- Copy `/docs/rules` folder
- Set up shared TypeScript config
- Create README with architecture notes
- Initialize staging deployment (Railway/Render)
- Verify `turbo dev` runs
- Deploy "hello world" to staging

### Phase 1: Foundation (Week 1)

**Day 1: Minimal Colyseus Server + Deploy**
- Write test: "server starts on port 2567"
- `npm install colyseus` in apps/server
- Create index.ts that starts server
- Add Texas42Room class (empty)
- Set up error handling middleware
- Deploy to staging environment
- Verify: Test passes, staging endpoint responds

**Day 2: First Schema & Join**
- Write tests for: join, duplicate joins, player data, error cases
- Create Player schema (id, name, isReady)
- Add players MapSchema to room state
- Handle onJoin - add player to map
- Add comprehensive error handling
- API documentation for join endpoint
- Must work: Monitor shows joins, tests pass, errors logged

**Day 3: First Message + Performance Baseline**
- Write tests for: ready, unready, invalid messages
- Add "ready" message handler
- Toggle player.isReady on message
- Log state changes
- Add performance monitoring (response times)
- Establish baseline: < 50ms message processing
- Must work: All message scenarios tested, perf logged

**Day 4: Domino Types**
- Create game-logic package
- Write test: "createDeck returns 28 unique dominoes"
- Write test: "no domino has pips > 6"
- Write test: "dominoes are in consistent order"
- Define Domino interface (pips1, pips2)
- Implement createDeck() function
- Document game-logic API
- Refactor: Extract constants, ensure < 150 lines

**Day 5: Basic Frontend + Error Handling**
- Write tests for: connection states, reconnection, timeouts
- Create React app in apps/client
- Install colyseus.js
- Show "Connecting..." → "Connected" → "Error" states
- Implement exponential backoff for reconnection
- Add error boundary component
- Must work: All connection states tested, errors graceful

### Phase 2: Core Components (Week 2)

**Day 1: First Component - ConnectionStatus + Deploy**
- Write tests for: connected, disconnected, reconnecting, error states
- Create ConnectionStatus component
- Shows "Connected" or "Disconnected" or "Error: [message]"
- Add to App.tsx
- Deploy updated frontend to staging
- Load test: 100 concurrent connections
- Must work: Component tests + integration test + load test

**Day 2: DominoComponent + Accessibility**
- Write tests for: all 28 dominoes, sizes, invalid inputs, a11y
- Create component with hardcoded 3-2 domino
- Use mined SVG paths
- Make size prop work
- Add ARIA labels and keyboard navigation
- Run accessibility audit
- Must work: Renders correctly, passes a11y tests

**Day 3: Storybook Setup + Documentation**
- Install Storybook in client
- Create stories for ConnectionStatus
- Create stories for all 28 dominoes
- Add interaction tests to stories
- Generate component documentation
- Set up Chromatic for visual regression
- Must work: Stories have play functions, docs auto-generated

**Day 4: Player List + Real-time Updates**
- Write tests name="Edit" for: 0-4 players, updates, disconnections, race conditions
- Create useTexas42Room hook with error handling
- Read players from room state
- Display player names in a list
- Handle optimistic updates
- Performance: < 16ms render time
- Must work: Hook tests + component tests + perf tests pass

**Day 5: Ready Button + Load Testing**
- Write tests for: click, disabled states, sync, spam-clicking
- Add ready button to player list
- Send "ready" message on click
- Show ready status per player
- Load test: 100 rooms with 4 players each
- Must work: Unit + integration + load tests pass

### Phase 3: Game Flow - Lobby to Ready (Week 3)

**Day 1: Room Codes + Security**
- Write tests for: generation, uniqueness, format, collision handling
- Generate 4-letter room codes (excluding profanity)
- Show room code in UI
- Allow joining by code
- Add rate limiting for join attempts
- Security audit: SQL injection, XSS tests
- Must work: Invalid codes rejected, duplicates handled, secure

**Day 2: Player Positions + State Recovery**
- Write tests for: assignment, full room, reconnection, crashes
- Assign positions (N,S,E,W) on join
- Show position in player list
- Prevent duplicate positions
- Implement state recovery after server restart
- Performance benchmark: < 100ms reconnection
- Must work: Positions persist, no conflicts, recovery works

**Day 3: Start Game Logic + Performance**
- Write tests for: all ready, player leaves, phase transitions, race conditions
- Add "phase" to room state
- Start when all ready
- Transition: waiting → shuffling
- Monitor state size (target < 5KB)
- Performance: < 50ms phase transitions
- Must work: Edge cases handled, performance targets met

**Day 4: Deal Dominoes + Fairness Testing**
- Write tests for: fair distribution, randomness, state sync, determinism
- Shuffle deck in game-logic
- Deal 7 to each player
- Add hand ArraySchema to Player
- Statistical analysis of shuffle fairness
- Memory profiling for state size
- Must work: Deterministic tests + random tests + fairness verified

**Day 5: Show My Hand + Mobile Testing**
- Write tests for: rendering, empty hand, interactions, touch events
- Create DominoHand component
- Display current player's dominoes
- Simple horizontal layout
- Test on mobile devices (iOS/Android)
- Performance: 60fps scrolling
- Must work: Responsive, accessible, mobile-friendly

### Phase 4: Bidding System (Week 4)

**Day 1: Bidding UI - Buttons**
- Write tests for: all buttons, disabled states, turn logic
- Create bid buttons (30-42)
- Disable when not your turn
- Send "bid" message with amount
- Must work: Only valid actions enabled

**Day 2: Bid Validation**
- Write tests for: all bid rules, edge cases, errors
- Server: Check bid > currentHighBid
- Server: Enforce minimum 30
- Update currentBidder on valid bid
- Must work: Every invalid bid rejected with reason

**Day 3: Pass Logic**
- Write tests for: pass sequences, forced bid, dealer stuck
- Add pass button
- Track passes in state
- End bidding after 3 passes
- Must work: All pass scenarios from rules

**Day 4: Bid History**
- Write tests for: display, order, updates
- Store bids in ArraySchema
- Show who bid what
- Display passes
- Must work: History accurate and complete

**Day 5: Trump Selection**
- Write tests for: all trumps, validation, state change
- Show trump options for 30+ bids
- Add trump to bid message
- Start playing phase after trump
- Must work: Phase transition tested

### Phase 5: Playing Phase (Week 5)

**Day 1: Play a Domino**
- Write tests for: valid plays, turn enforcement, state updates
- Click domino to play it
- Send "play" message with index
- Remove from hand on server
- Must work: Only legal plays allowed

**Day 2: Current Trick Display**
- Write tests for: positioning, clearing, animations
- Show played dominoes in center
- Position by player (N,S,E,W)
- Clear after 4 dominoes
- Must work: Visual tests + state tests

**Day 3: Basic Follow Rules**
- Write tests for: ALL follow scenarios from rules
- Test: "must follow lead suit if able"
- Test: "can play any domino if no lead suit"
- Test: "trump allowed only if no lead suit"
- Test: "rejects invalid plays with clear message"
- Implement canPlayDomino() function
- Must work: 100% rule compliance

**Day 4: Trick Winner**
- Write tests for: all winner scenarios, trump logic
- Calculate trick winner
- Consider trump suit
- Award trick to winner
- Must work: Complex trump scenarios tested

**Day 5: Count Points**
- Write tests for: all count dominoes, team scoring
- Identify count dominoes (0-5, 1-4, 2-3, 4-6, 5-5)
- Track points per team
- Update score after each trick
- Must work: Scoring 100% accurate

### Phase 6: Polish & Production (Week 6)

**Day 1: End of Hand**
- Write tests for: hand completion, point calculation
- Detect when all dominoes played
- Calculate hand winner
- Award remaining points
- Must work: All end scenarios tested

**Day 2: New Hand Flow**
- Write tests for: dealer rotation, state reset, continuation
- Reset for next hand
- Rotate dealer
- New bidding phase
- Must work: Seamless hand transitions

**Day 3: Game to 7 Points**
- Write tests for: winning conditions, tie scenarios
- Track game score
- Detect 7-point winner
- Show winner screen
- Must work: Game completion tested

**Day 4: Basic Polish**
- Write tests for: error states, reconnection, timeouts
- Add loading spinners
- Show error messages
- Handle disconnections
- Must work: All edge cases graceful

**Day 5: Deploy to Cloud**
- Write E2E tests for: full game, multiple clients
- Create Dockerfile
- Deploy to Railway/Render
- Test with friends
- Must work: Production environment tested

## Key Colyseus Schemas

**Core Types Needed:**
- Domino (pips1, pips2, isPlayable)
- Player (id, name, position, hand, connected, lastSeen)
- Trick (dominoes, leadSuit, winner, timestamp)
- BidEntry (player, action, amount, trump, timestamp)
- GameState (phase, scores, currentPlayer, turnTimer)
- ErrorInfo (code, message, details, timestamp)

## Test Coverage Requirements

**Game Logic Package: 100% Required**
- Every rule from `/docs/rules/` must have tests
- Edge cases documented and tested
- Invalid moves must be rejected with clear errors

**Critical Test Scenarios**
1. **Bidding**: All bid amounts, pass sequences, trump selection
2. **Following Suit**: Every combination of lead/follow
3. **Trump Play**: When allowed, when not allowed
4. **Scoring**: Count dominoes, trick points, game end
5. **Turn Order**: Proper rotation, bid winner leads

**Integration Tests Required**
- 4 players join and ready up
- Complete bidding phase with various outcomes
- Full hand played with proper scoring
- Disconnection and reconnection
- Invalid actions rejected

## Message Types

**Client → Server:**
- ready
- bid(amount, trump?)
- pass
- play(dominoIndex)

**Server → Client:**
- State synchronization (automatic)
- Error messages
- Game events

## Testing Strategy

**Unit Tests:**
- Game logic package (100% coverage)
- Component presentation
- Hook behavior

**Integration Tests:**
- Component + MockColyseusProvider
- Message sending verification
- State update handling

**E2E Tests:**
- Full game flows
- Multi-client scenarios
- Reconnection handling

**Storybook:**
- All components in isolation
- State manipulation controls
- Mock message responses

## Development Workflow

**Daily Goals:**
- One complete feature
- Tests passing (unit + integration)
- Storybook story with interactions
- Performance benchmarks met
- Git commit with conventional commit message
- Update project board

**Sprint Structure:**
- 2-3 day sprints
- Clear deliverable
- Demo ready
- Performance verified
- Next steps defined
- Retrospective notes

**Continuous Monitoring:**
- APM dashboard for performance
- Error tracking (Sentry/similar)
- Real user monitoring
- State size tracking
- Memory leak detection

## Critical Testing Directive

**MANDATORY: Red/Green/Refactor - No Exceptions**

1. **Red Phase** - Write Failing Tests First
   - Write comprehensive test suite BEFORE implementation
   - Tests must cover happy path, edge cases, and errors
   - Verify tests actually fail for the right reasons
   - If Claude says "test written", verify it exists and fails

2. **Green Phase** - Minimal Code to Pass
   - Write ONLY enough code to make tests pass
   - Don't add features not required by current tests
   - Run full test suite after changes
   - Verify: `npm test` shows all green

3. **Refactor Phase** - Zero Tolerance for Issues
   - Break down any file over 150 lines
   - Extract functions/components when complexity grows
   - ALL of these must pass with ZERO warnings:
     ```bash
     npm test         # All tests green
     npm run lint     # Zero warnings, zero errors
     npm run type-check  # Zero TypeScript errors
     ```
   - **WARNINGS ARE BLOCKERS** - Fix them immediately

4. **Test Depth Requirements**
   - Every public function needs tests
   - Every user interaction needs tests
   - Every error condition needs tests
   - Every edge case from `/docs/rules/` needs tests
   - Test the "impossible" cases too

5. **Don't Trust Claude's "Tests Pass"**
   - Always run tests yourself
   - Check test output manually
   - Verify coverage reports
   - Run lint and type-check separately

6. **File Size Limits**
   - Source files: Max 150 lines
   - Test files: Max 300 lines (split by describe blocks)
   - If bigger, refactor immediately
   - Each file should have single responsibility

7. **Daily Verification Checklist**
   ```bash
   npm test          # ✓ All pass
   npm run lint      # ✓ Zero warnings
   npm run type-check # ✓ Zero errors
   npm run build     # ✓ Builds successfully
   ```

**Remember:** A warning today is a bug tomorrow. Fix it now.

## Performance Benchmarks

- Connection time: < 500ms
- State sync: < 100ms  
- Move validation: < 50ms
- Memory usage per room: < 50MB
- 60fps UI rendering
- Network payload: < 5KB per state update

## Error Recovery Matrix

| Scenario | Client Behavior | Server Behavior | Recovery Time |
|----------|----------------|-----------------|---------------|
| Network drop | Auto-reconnect with exponential backoff | Preserve state for 30s | < 2s |
| Invalid move | Show error toast | Log & reject with reason | Immediate |
| Room full | Redirect to new room | Suggest alternatives | < 500ms |
| Server crash | Reconnect to new instance | Restore from Redis | < 5s |
| Malformed message | Display generic error | Log details, reject | Immediate |
| Rate limit hit | Show cooldown timer | 429 response | Per config |

## Development Checkpoints

**Weekly Deliverables:**
- Week 1: Deploy "hello world" Colyseus server to staging
- Week 2: Load test with 100 concurrent connections
- Week 3: Security audit checklist completed
- Week 4: Performance benchmarks achieved
- Week 5: Accessibility review (WCAG 2.1 AA)
- Week 6: Production deployment with monitoring

**Demo Schedule:**
- Every Friday: 30-minute stakeholder demo
- Show working features from the week
- Gather feedback for next sprint
- Update roadmap if needed

## Success Metrics

- Clean, consistent codebase
- All rules correctly implemented  
- Smooth multiplayer experience
- Performance targets achieved
- Zero client-side game validation
- Simple, automated deployment
- Comprehensive error handling
- Full test coverage (logic: 100%, UI: 80%+)

## MVP Definition

**Must Have:**
- 4-player games
- Complete rule set
- Bidding with trump selection
- Full scoring
- Game to 7 points

**Nice to Have:**
- Animations
- Sound effects
- Spectator mode
- Game history
- Statistics

**Not in MVP:**
- Tournaments
- AI players
- Mobile app
- Social features

## Risk Mitigations

**Colyseus Performance:**
- Early load testing
- State size monitoring
- Optimize update frequency

**Complex Rules:**
- Incremental implementation
- Extensive testing
- Clear documentation

**Deployment Complexity:**
- Deploy from day one
- Automate everything
- Simple rollback process

## Timeline Summary

- **Week 0**: Mining & Setup (3 days)
- **Week 1**: Foundation
- **Week 2**: Core Components  
- **Week 3**: Lobby System
- **Week 4**: Bidding Phase
- **Week 5**: Playing Phase
- **Week 6**: Polish & Deploy

Total: ~6.5 weeks to production-ready game

## Next Steps

1. Create new repository/directory
2. Run mining phase on existing code
3. Set up monorepo structure
4. Begin Phase 1 implementation

This plan provides a clear path from empty directory to deployed game, leveraging the best of the existing implementation while building on modern, maintainable architecture.