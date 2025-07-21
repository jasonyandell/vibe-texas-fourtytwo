# Test Fixes Task List

## Critical Syntax Errors (Blocking)

- [ ] **Linting Critical Issue**: Syntax Errors: Multiple BiddingPanel test files have parsing errors (`'>' expected`)
  - Files: `accessibility.test.ts`, `bid-amount.test.ts`, `rendering.test.ts`, `submission.test.ts`, `trump-selection.test.ts`, `validation.test.ts`
  - Location: `/home/jason/fourtytwo/frontend/src/components/__tests__/BiddingPanel/`

- [ ] **TypeScript Critical Issue**: Same BiddingPanel parsing issues breaking compilation
  - 60+ TypeScript errors from malformed test descriptions

- [ ] **Regex Critical Issue**: Unterminated regex literal in `useGameState.optimistic-setup.ts:29`
  - Location: `/home/jason/fourtytwo/frontend/src/hooks/__tests__/useGameState.optimistic-setup.ts:29`

- [ ] **LoadingSpinner Test Syntax**: Malformed syntax in LoadingSpinner test files
  - Files: `LoadingSpinner.*.test.tsx` - all have "Declaration or statement expected" errors
  - Location: `/home/jason/fourtytwo/frontend/src/components/lobby/__tests__/`

## Frontend Test Failures (102 failed, 869 passed)

### Context Provider Issues
- [ ] **SpectatorView Context Error**: Missing GameStateProvider wrapper
  - Files: `SpectatorView.basic.test.tsx`
  - Error: "useGameStateContext must be used within a GameStateProvider"

### React Testing Issues
- [ ] **ReadySystem act() Wrapping**: State updates need `act()` wrapping
  - Files: `ReadySystem.autoStart.test.tsx`, `ReadySystem.readyToggle.test.tsx`
  - Error: "An update to ReadySystem inside a test was not wrapped in act(...)"

### Empty Test Files
- [ ] **BiddingPanel Incomplete Tests**: Many test files are empty placeholders
  - File: `BiddingPanel.test.tsx` - unused imports: `it`, `expect`, `render`, `screen`, `BiddingPanel`

## Linting Issues (113 errors, 5 warnings)

### Missing React Imports
- [ ] **React Hook Imports**: Multiple files missing React import for hooks
  - Files: `useModalKeyboardHandling.ts`, `useGameStateActions.ts`, `useOptimisticUpdateActions.ts`, `usePlayerActions.ts`, `useBiddingSectionState.ts`

### Unused Variables/Imports
- [ ] **GameBoard Layout Test**: Unused imports in `GameBoard.layout.test.tsx`
  - Unused: `createDomino`, `DominoSuit`, `createCompatibleTrick`, `createCompatiblePlayedDomino`, `createCompatibleBid`, `createCompatibleBiddingState`

- [ ] **Test Helper Cleanup**: Remove unused imports across test files
  - Files: `GameBoardSection.scoring.test.tsx`, `PlayersSection.test.tsx`, various others

- [ ] **Component Cleanup**: Remove unused imports in components
  - Files: `PlayerSlots.tsx` (unused `Player`), `types/game.ts` (unused `TrickState`)

### Type Safety Issues
- [ ] **Unsafe Any Usage**: Fix `any` types in persistence actions
  - Files: `usePersistenceActions.ts`, `useSerializationActions.ts`

- [ ] **Unbound Method References**: Fix method binding in state persistence
  - File: `/home/jason/fourtytwo/frontend/src/utils/statePersistence/index.ts:21-30`

- [ ] **Promise Misuse**: Fix async/await issues
  - Files: `SpectatorManager.tsx` (Promise-returning functions), `create-game-helpers.ts` (missing await)

### Test Setup Issues
- [ ] **Require Import**: Fix unsafe require() in test setup
  - File: `Lobby.testSetup.tsx:22` - replace with ES6 import

## React Hooks Issues
- [ ] **Missing Dependencies**: Fix useCallback dependency arrays
  - Files: `LobbyActions.ts`, `useBiddingState.ts`

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