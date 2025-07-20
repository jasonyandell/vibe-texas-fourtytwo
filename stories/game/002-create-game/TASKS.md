# Story 002: Create Game - Task Breakdown

## Overview
Implement the game creation flow allowing users to create new games with custom names, validation, and automatic joining.

## Tasks

### Task 1: Create GameCreationModal component with form
- Create `frontend/src/components/GameCreationModal.tsx`
- Add modal structure with dialog role
- Create form with game name input field (id="game-name")
- Add Submit and Cancel buttons
- Use CSS modules for styling
- Ensure modal visibility can be controlled

### Task 2: Implement game name validation
- Add client-side validation to GameCreationModal
- Required field validation
- Minimum length (3 characters)
- Maximum length (50 characters)
- Display error messages with role="alert"
- Prevent form submission when invalid

### Task 3: Add API endpoint for game creation
- Create POST /api/games endpoint in backend
- Accept game name in request body
- Generate unique game code (6 characters, A-Z0-9)
- Store game in database/memory
- Return created game with code
- Add creator as first player automatically

### Task 4: Create GameCard component for lobby display
- Create `frontend/src/components/GameCard.tsx`
- Add data-testid="game-card"
- Display game name
- Show player count (e.g., "1/4 players")
- Show game status ("Waiting for players")
- Add Join/Leave button based on player status

### Task 5: Implement auto-join functionality for creator
- When game is created, add creator as first player
- Show Leave button instead of Join for creator
- Update player count to show 1/4 players
- Store player association with game

### Task 6: Add game code generation and display
- Generate random 6-character code (A-Z0-9) on backend
- Include game code in API response
- Display game code in GameCard with data-testid="game-code"
- Ensure code is unique across active games

### Task 7: Handle error states and server errors
- Add error handling in GameCreationModal
- Display server errors with role="alert"
- Show "Failed to create game" for 500 errors
- Keep modal open on error for retry
- Add proper error states and loading states

### Task 8: Implement duplicate game name prevention
- Check for existing game names on backend
- Return 409 Conflict for duplicate names
- Display "A game with this name already exists" error
- Allow user to change name and retry

## Notes
- Follow existing patterns from Story 001 components
- Use TypeScript with strict typing
- Add proper data-testid attributes for E2E tests
- Ensure all E2E tests pass after implementation