# Eliminate Frontend Compatibility Layer

## Goal
Remove the entire frontend compatibility layer (`frontend-compat.ts`) since both frontend and backend now use unified GameState types.

## Problem
The compatibility layer was created for migration but is now unnecessary complexity:
- Adds 336 lines of conversion code that's no longer needed
- Creates duplicate validation functions
- Maintains legacy types that should be eliminated
- Increases bundle size and maintenance burden

## Success Criteria
- [ ] `frontend-compat.ts` file deleted
- [ ] All compatibility exports removed from index.ts
- [ ] Frontend uses unified GameState directly
- [ ] All tests pass
- [ ] No TypeScript errors

## TDD Approach
1. **Red**: Write tests to verify frontend works with unified types only
2. **Green**: Remove compatibility layer and update imports
3. **Refactor**: Clean up any remaining legacy references

## Files to Read for Context
- `packages/shared-types/src/frontend-compat.ts` - Compatibility layer to remove
- `packages/shared-types/src/index.ts` - Remove compatibility exports
- `frontend/src/contexts/GameStateContext.tsx` - Verify unified type usage
- `frontend/src/utils/urlSerialization.ts` - Check for legacy type usage
- `frontend/src/test/mock-data.ts` - Update test data if needed
- `frontend/src/types/texas42.ts` - Check if this can be eliminated too

## Implementation Steps
1. Audit all frontend files for compatibility layer usage
2. Update any remaining legacy type imports to use unified types
3. Remove compatibility exports from shared-types index.ts
4. Delete frontend-compat.ts file
5. Update package.json if needed
6. Run tests to ensure no regressions

## Acceptance Test
```bash
npm run build
npm test
npm run lint
```

## Estimated Time
15 minutes
