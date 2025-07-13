# Story: Fix Game Creation Modal E2E Tests

## Overview
Fix the game creation modal E2E tests by implementing proper modal functionality, form validation, and ensuring created games appear in the lobby. This addresses modal interaction issues and game creation workflow.

## Acceptance Criteria

### Modal Functionality
- [ ] Fix "Create New Game" button/heading selector conflicts
- [ ] Ensure modal opens and closes properly
- [ ] Implement proper form validation for game names
- [ ] Handle empty game name validation correctly
- [ ] Ensure modal can be cancelled without creating a game

### Game Creation Workflow
- [ ] Created games should appear in the lobby as game cards
- [ ] Game cards should have proper `data-testid="game-card"` attributes
- [ ] Form submission should create actual game objects
- [ ] Successful creation should close modal and show new game

### Form Validation
- [ ] Empty game name should prevent submission
- [ ] Submit button should be disabled when form is invalid
- [ ] Validation messages should be displayed appropriately
- [ ] Form should reset after successful submission

### E2E Test Targets
Make these specific tests pass:
- `should create a new game successfully`
- `should validate game name requirements`
- `should close modal when cancelled`

## Technical Requirements

### Component Updates
1. **CreateGameModal Component** (`src/components/lobby/CreateGameModal.tsx`)
   - Implement proper form validation
   - Add loading states during submission
   - Ensure proper modal close behavior
   - Add appropriate ARIA labels and test IDs

2. **Lobby Component** (`src/components/Lobby.tsx`)
   - Ensure created games appear immediately in lobby
   - Fix game creation handler to properly update state
   - Verify modal state management

3. **GameCard Component** (`src/components/lobby/GameCard.tsx`)
   - Add `data-testid="game-card"` attribute
   - Ensure proper rendering when games exist
   - Verify all required props are handled

### State Management
- Ensure lobby state updates immediately when games are created
- Verify game objects have all required properties
- Handle loading and error states appropriately

## Implementation Notes
- Focus on making modal interactions work correctly
- Ensure form validation follows accessibility best practices
- Maintain existing styling and user experience
- Use existing UI components where possible

## Definition of Done
- [ ] All 3 game creation E2E tests pass
- [ ] Created games appear as cards in lobby
- [ ] Form validation works correctly
- [ ] Modal can be opened, used, and closed properly
- [ ] No regressions in existing tests
- [ ] Accessibility requirements maintained

## Testing Strategy
1. Test modal opening/closing behavior
2. Test form validation edge cases
3. Verify game creation creates visible cards
4. Test cancellation behavior
5. Run full test suite for regressions

## Dependencies
- Builds on Story 1 (basic lobby display)
- Uses existing modal and form components
- Requires proper game card rendering
