# Test Fixes Task List

## Critical Syntax Errors (Blocking)

- [x] **Linting Critical Issue**: Syntax Errors: Multiple BiddingPanel test files have parsing errors (`'>' expected`) ✅
  - Files: `accessibility.test.ts`, `bid-amount.test.ts`, `rendering.test.ts`, `submission.test.ts`, `trump-selection.test.ts`, `validation.test.ts`
  - Location: `/home/jason/fourtytwo/frontend/src/components/__tests__/BiddingPanel/`

- [x] **TypeScript Critical Issue**: Same BiddingPanel parsing issues breaking compilation ✅
  - 60+ TypeScript errors from malformed test descriptions

- [x] **Regex Critical Issue**: Unterminated regex literal in `useGameState.optimistic-setup.ts:29` ✅
  - Location: `/home/jason/fourtytwo/frontend/src/hooks/__tests__/useGameState.optimistic-setup.ts:29`

- [x] **LoadingSpinner Test Syntax**: Malformed syntax in LoadingSpinner test files ✅
  - Files: `LoadingSpinner.*.test.tsx` - all have "Declaration or statement expected" errors
  - Location: `/home/jason/fourtytwo/frontend/src/components/lobby/__tests__/`

## Frontend Test Failures (102 failed, 869 passed)

### Context Provider Issues
- [x] **SpectatorView Context Error**: Missing GameStateProvider wrapper ✅
  - Files: `SpectatorView.basic.test.tsx`
  - Error: "useGameStateContext must be used within a GameStateProvider"

### React Testing Issues
- [x] **ReadySystem act() Wrapping**: State updates need `act()` wrapping ✅
  - Files: `ReadySystem.autoStart.test.tsx`, `ReadySystem.readyToggle.test.tsx`
  - Error: "An update to ReadySystem inside a test was not wrapped in act(...)"

### Empty Test Files
- [x] **BiddingPanel Incomplete Tests**: Many test files are empty placeholders ✅
  - File: `BiddingPanel.test.tsx` - unused imports: `it`, `expect`, `render`, `screen`, `BiddingPanel`

## Linting Issues (113 errors, 5 warnings)

### Missing React Imports
- [x] **React Hook Imports**: Multiple files missing React import for hooks ✅
  - Files: `useModalKeyboardHandling.ts`, `useGameStateActions.ts`, `useOptimisticUpdateActions.ts`, `usePlayerActions.ts`, `useBiddingSectionState.ts`

### Unused Variables/Imports
- [x] **GameBoard Layout Test**: Unused imports in `GameBoard.layout.test.tsx` ✅
  - Unused: `createDomino`, `DominoSuit`, `createCompatibleTrick`, `createCompatiblePlayedDomino`, `createCompatibleBid`, `createCompatibleBiddingState`

- [x] **Test Helper Cleanup**: Remove unused imports across test files ✅
  - Files: `GameBoardSection.scoring.test.tsx`, `PlayersSection.test.tsx`, various others

- [x] **Component Cleanup**: Remove unused imports in components ✅
  - Files: `PlayerSlots.tsx` (unused `Player`), `types/game.ts` (unused `TrickState`)

### Type Safety Issues
- [x] **Unsafe Any Usage**: Fix `any` types in persistence actions ✅
  - Files: `usePersistenceActions.ts`, `useSerializationActions.ts`

- [x] **Unbound Method References**: Fix method binding in state persistence ✅
  - File: `/home/jason/fourtytwo/frontend/src/utils/statePersistence/index.ts:21-30`

- [ ] **Promise Misuse**: Fix async/await issues
  - Files: `SpectatorManager.tsx` (Promise-returning functions), `create-game-helpers.ts` (missing await)

### Test Setup Issues
- [ ] **Require Import**: Fix unsafe require() in test setup
  - File: `Lobby.testSetup.tsx:22` - replace with ES6 import

## React Hooks Issues
- [ ] **Missing Dependencies**: Fix useCallback dependency arrays
  - Files: `LobbyActions.ts`, `useBiddingState.ts`

## Playwright E2E Tests (74 tests total - MASSIVE FAILURES)

### Current Status: **All 74 tests are failing**
- **Test Command**: `npm run test:e2e` (runs all tests in Chromium)
- **Test Directory**: `/home/jason/fourtytwo/frontend/tests/e2e/`
- **Configuration**: `frontend/playwright.config.ts` (properly configured)

### Primary Issue: Missing Test Data IDs and Elements
Most tests are failing because they cannot find expected DOM elements with specific `data-testid` attributes.

### Failing Test Categories:

#### 1. **Demo Board Showcase Tests** (16 tests - ALL FAILING)
- **Files**: `demo-board-showcase-*.spec.ts`
- **Primary Error**: `data-testid="game-board-section-container"` not found
- **Missing Elements**:
  - `[data-testid="demo-center-play-area"]`
  - `[data-testid="demo-trick-stack-north-south"]` 
  - `[data-testid="demo-scores-display"]`
  - `[data-testid="game-board-section-container"]`

#### 2. **Demo Dominoes Showcase Tests** (18 tests - ALL FAILING)
- **Files**: `demo-dominoes-showcase-*.spec.ts`
- **Primary Error**: Cannot find domino showcase elements
- **Missing Elements**: Domino display components and interactive controls

#### 3. **Demo Players Showcase Tests** (12 tests - ALL FAILING)
- **Files**: `demo-players-showcase-*.spec.ts`
- **Primary Error**: Player layout elements not found
- **Missing Elements**: Baseball diamond player positioning elements

#### 4. **Demo Foundation Tests** (5 tests - ALL FAILING)
- **File**: `demo-foundation.spec.ts`
- **Primary Error**: Basic demo page structure missing
- **Expected Route**: `/demo/board` not rendering correctly

#### 5. **Story Tests** (23 tests - ALL FAILING)
- **Files**: `story-001-empty-lobby.spec.ts`, `story-002-create-game.spec.ts`
- **Primary Error**: Basic lobby and game creation elements missing
- **Missing Elements**: Lobby components, game creation modals

### Root Cause Analysis:

#### **Missing Demo Routes/Pages**
The tests expect demo showcase pages at routes like:
- `/demo/board` - Board showcase demos
- `/demo/dominoes` - Domino showcase demos  
- `/demo/players` - Player showcase demos
- Basic lobby functionality at root

#### **Missing Test Infrastructure**
- Components don't have required `data-testid` attributes
- Demo pages may not exist or may be incomplete
- Test selectors don't match actual component structure

#### **Test Environment Issues**
- Frontend server starts correctly (port 3000)
- Tests run but pages don't load expected content
- Timeout errors (5000ms) suggest elements never appear

### Critical Tasks Needed:

#### **Immediate Blockers** (Must fix first):
- [ ] **Verify Demo Routes Exist**: Check if `/demo/*` routes are implemented
- [ ] **Add Missing Test IDs**: Add `data-testid` attributes to components
- [ ] **Fix Component Structure**: Ensure components match test expectations
- [ ] **Create Demo Pages**: Build missing showcase pages if they don't exist

#### **Component-Specific Fixes**:
- [ ] **GameBoard Components**: Add required test IDs to game board elements
- [ ] **Domino Components**: Add test IDs to domino display and interaction elements  
- [ ] **Player Components**: Add test IDs to player layout and partnership elements
- [ ] **Lobby Components**: Add test IDs to lobby and game creation elements

#### **Test Infrastructure**:
- [ ] **Helper Functions**: Review and fix `create-game-helpers.ts` and other utilities
- [ ] **Test Data**: Ensure tests have proper mock data and setup
- [ ] **Route Configuration**: Verify frontend routing includes demo paths

### Priority Level: **CRITICAL**
- **Impact**: 100% test failure rate for E2E suite
- **Blocking**: Prevents any confidence in UI functionality
- **Effort**: Significant - requires component updates and possibly new demo pages

## Backend Tests: ✅ All 31 passed
- No issues - game engine, domino logic working correctly

## Shared Types Tests: ✅ All 14 passed  
- No issues - type validation working correctly
- Note: Initially running in watch mode

## Priority Order

1. **Critical Syntax Fixes** (blocks all linting/typing)
   - BiddingPanel test file syntax
   - Regex literal fix
   - LoadingSpinner test syntax

2. **React Testing Fixes** (blocks test suite)
   - Add context providers
   - Wrap state updates in act()

3. **Import/Export Cleanup** (reduces noise)
   - Add missing React imports
   - Remove unused imports

4. **Type Safety Improvements** (code quality)
   - Fix any types
   - Fix method binding
   - Add proper async/await

## Notes
- Backend and shared types are in good shape
- Frontend has significant test infrastructure issues
- Most issues are related to incomplete test setup and missing imports
- Once syntax errors are fixed, many other issues should be easier to address