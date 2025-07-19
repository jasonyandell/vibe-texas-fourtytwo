# Simplify GameState Structure

## Goal
Analyze and streamline the GameState interface by removing unused fields and simplifying complex nested structures.

## Problem
Current GameState may have over-engineered complexity:
- Many fields that might not be actively used
- Complex partnership structure that could be simplified
- Validation fields (`isValid`, `validationErrors`) that may be unnecessary
- Potential for simpler scoring representation

## Success Criteria
- [ ] Identify unused or rarely used GameState fields
- [ ] Simplify partnership/scoring structure if possible
- [ ] Remove unnecessary validation metadata
- [ ] Maintain all existing functionality
- [ ] All tests pass

## TDD Approach
1. **Red**: Write tests for essential GameState functionality only
2. **Green**: Simplify structure while maintaining functionality
3. **Refactor**: Update all dependent code to use simplified structure

## Files to Read for Context
- `packages/shared-types/src/game-state.ts` - Main GameState definition
- `backend/src/game/engine.ts` - Check which fields are actually used
- `frontend/src/contexts/GameStateContext.tsx` - Frontend usage patterns
- `frontend/src/utils/urlSerialization.ts` - Serialization requirements
- `backend/src/utils/gameValidation.ts` - Validation usage
- All test files that create mock GameState objects

## Implementation Steps
1. Audit all GameState field usage across frontend and backend
2. Identify fields that are never read or only set but never used
3. Analyze partnership structure complexity vs. actual needs
4. Determine if validation metadata is necessary
5. Create simplified GameState interface
6. Update all dependent code
7. Ensure URL serialization still works
8. Update all tests and mock data

## Acceptance Test
```bash
npm run build
npm test
npm run lint
# Verify game functionality works with simplified state
```

## Estimated Time
30 minutes
