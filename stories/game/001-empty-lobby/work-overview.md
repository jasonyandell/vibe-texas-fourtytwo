# Story 001: Empty Lobby
## Tasks

1. **Fix EmptyState component and tests**
   - E2E: User sees "No games available" message with helpful text
   - Component: `frontend/src/components/lobby/EmptyState.tsx`
   - Tests: Fix failing unit tests, ensure component matches test expectations
   
2. **Add missing gamesSection CSS class**
   - E2E: Games section has proper styling and layout
   - Component: `frontend/src/components/Lobby.module.css`
   - Tests: Visual validation of lobby layout

3. **Create E2E tests for empty lobby**
   - E2E: Navigate to lobby, verify empty state is shown with correct message
   - Component: New file `frontend/tests/e2e/lobby.spec.ts`
   - Tests: Full user journey for empty lobby state

4. **Create dedicated LobbySection wrapper component**
   - E2E: Lobby sections have consistent styling and structure
   - Component: New file `frontend/src/components/lobby/LobbySection.tsx`
   - Tests: Unit tests for section wrapper

5. **Create dedicated CreateGameButton component**
   - E2E: Prominent call-to-action button for creating games
   - Component: New file `frontend/src/components/lobby/CreateGameButton.tsx`
   - Tests: Unit tests for button behavior and styling