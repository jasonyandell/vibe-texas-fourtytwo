# Frontend Test & Linting Failure Task List

This document outlines the critical issues identified in the frontend workspace. The backend and shared-types packages are stable and passing all checks.

## High-Priority Structural Failures

These issues cause a cascading effect, leading to a large number of test failures.

- [x] **Test Setup: Component Rendering:** Fix the `Element type is invalid... got: undefined` error affecting most `GameStartManager` tests. This is likely due to an incorrect import/export of the component.
- [ ] **Test Setup: Missing Context:** Wrap all tests using `useGameState` or related hooks with the `GameStateProvider` to resolve the `useGameStateContext must be used within a GameStateProvider` error.
- [ ] **Test Setup: Module Resolution:** Resolve the `Cannot find module '../Lobby'` error in all `Lobby` component tests. This may be a pathing issue or a problem with the test setup file (`Lobby.testSetup.tsx`).
- [ ] **Test Setup: Syntax Errors:** Fix test files that cannot be parsed.
    - [ ] `LoadingSpinner` tests have an `export describe` syntax error.
    - [ ] Multiple `BiddingPanel` test files have parsing errors (`'>' expected`).
    - [ ] `useGameState.optimistic-setup.ts` has an unterminated regular expression.
- [ ] **Test Setup: Mocking:** Fix the `createMockGameState is not a function` error in `SpectatorView` tests.

## Linting & Type-Checking Issues

- [ ] **TypeScript: Missing Imports:** Add `import React from 'react'` to all files where it is missing (e.g., `useModalKeyboardHandling.ts`, `useGameStateActions.ts`).
- [ ] **TypeScript: Unsafe Operations:** Address the widespread use of `any` and unsafe assignments/calls (`@typescript-eslint/no-unsafe-assignment`, `@typescript-eslint/no-unsafe-call`).
- [ ] **TypeScript: Unbound Methods:** Fix `unbound-method` errors in `src/utils/statePersistence/index.ts` by properly binding `this` or using arrow functions.
- [ ] **ESLint: Unused Variables:** Remove the numerous unused variables and imports across the frontend test files to improve code clarity.
- [ ] **ESLint: Forbidden Syntax:** Replace the `require()` call in `Lobby.testSetup.tsx` with an ES6 import.

## Component & Hook Test Failures

These are specific logic or assertion errors that can be addressed once the structural issues are resolved.

- [ ] **`CreateGameModal`:**
    - [ ] The `maxLength` attribute for the game name input is `51` but should be `50`.
    - [ ] The validation logic for maximum length allows 51 characters instead of 50.
- [ ] **`BiddingSection` / `BiddingPanel`:**
    - [ ] The screen reader announcement for trump selection is incorrect. It announces the selected suit but not the count of highlighted dominoes.
- [ ] **`useBiddingState` Hook:**
    - [ ] `validateBidInput` returns incorrect error messages for bids below the minimum or above the maximum.
    - [ ] `placeBid` and `passBid` actions are failing their success assertions.
- [ ] **`SpectatorView`:**
    - [ ] The test for rendering player hands fails because it finds multiple elements with the same player name (`Alice`). The query needs to be more specific.
