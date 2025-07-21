# Eliminate Remaining Frontend Type Duplicates

## Goal
Remove `frontend/src/types/texas42.ts` and any other duplicate type definitions in the frontend, ensuring all types come from shared-types package.

## Problem
Frontend still has its own type definitions that duplicate shared types:
- `frontend/src/types/texas42.ts` may contain duplicate interfaces
- Potential for type drift between frontend and shared definitions
- Unnecessary maintenance burden
- Confusion about which types to use

## Success Criteria
- [ ] `frontend/src/types/texas42.ts` eliminated or reduced to frontend-specific types only
- [ ] All frontend imports use `@texas42/shared-types`
- [ ] No duplicate type definitions
- [ ] All tests pass
- [ ] No TypeScript errors

## TDD Approach
1. **Red**: Write tests to verify all types come from shared package
2. **Green**: Remove duplicate types and update imports
3. **Refactor**: Organize remaining frontend-specific types if any

## Files to Read for Context
- `frontend/src/types/texas42.ts` - Check for duplicates to eliminate
- `frontend/src/types/__tests__/texas42.test.ts` - Update tests
- `frontend/src/components/GameBoard.tsx` - Check type imports
- `frontend/src/hooks/useGameState.ts` - Verify shared type usage
- `frontend/src/game/gameStore.ts` - Check for type imports
- Search all frontend files for local type imports

## Implementation Steps
1. Audit `frontend/src/types/texas42.ts` for duplicate definitions
2. Identify truly frontend-specific types (UI state, component props, etc.)
3. Remove duplicate types that exist in shared-types
4. Update all imports to use shared-types
5. Keep only frontend-specific types in local files
6. Update tests to reflect changes

## Acceptance Test
```bash
npm run build
npm test
npm run lint
# Verify no duplicate type definitions exist
```

## Estimated Time
20 minutes
