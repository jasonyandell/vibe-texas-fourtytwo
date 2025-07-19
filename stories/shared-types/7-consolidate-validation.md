# Consolidate Validation System

## Goal
Simplify the validation system by removing unnecessary complexity and consolidating validation logic into essential functions only.

## Problem
Current validation system may be over-engineered:
- Complex validation framework with multiple abstraction layers
- Many validation functions that may not be used
- Validation metadata stored in GameState that adds complexity
- Potential for simpler, more direct validation approach

## Success Criteria
- [ ] Identify which validation functions are actually used
- [ ] Simplify validation to essential checks only
- [ ] Remove unused validation infrastructure
- [ ] Maintain data integrity and error handling
- [ ] All tests pass

## TDD Approach
1. **Red**: Write tests for essential validation requirements only
2. **Green**: Implement simplified validation system
3. **Refactor**: Remove unused validation complexity

## Files to Read for Context
- `packages/shared-types/src/validation.ts` - Current validation framework
- `packages/shared-types/src/type-guards.ts` - Runtime type checking
- `backend/src/utils/gameValidation.ts` - Backend validation usage
- `frontend/src/contexts/GameStateContext.tsx` - Frontend validation usage
- All test files that use validation functions

## Implementation Steps
1. Audit all validation function usage across frontend and backend
2. Identify which validation checks are actually necessary
3. Determine if complex validation framework is needed or if simple checks suffice
4. Remove unused validation functions and types
5. Simplify remaining validation to direct, clear checks
6. Update all code that uses validation
7. Remove validation metadata from GameState if not needed

## Acceptance Test
```bash
npm run build
npm test
npm run lint
# Verify data integrity is maintained with simplified validation
```

## Estimated Time
25 minutes
