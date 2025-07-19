# Streamline Package Export Structure

## Goal
Simplify the shared-types package export structure by removing unnecessary re-exports and organizing exports more logically.

## Problem
Current index.ts has complex export structure:
- 235 lines of exports with many re-exports
- Convenience type groupings that may not be used
- Complex re-export patterns that add confusion
- Package metadata that could be simplified

## Success Criteria
- [ ] Simplified export structure with clear organization
- [ ] Remove unused convenience exports
- [ ] Eliminate redundant re-exports
- [ ] Maintain all necessary functionality
- [ ] Clear documentation of what's exported

## TDD Approach
1. **Red**: Write tests to verify only necessary exports are used
2. **Green**: Simplify export structure
3. **Refactor**: Organize exports logically and document

## Files to Read for Context
- `packages/shared-types/src/index.ts` - Current export structure
- `packages/shared-types/package.json` - Package configuration
- `frontend/src/**/*.ts` - Check which exports are actually imported
- `backend/src/**/*.ts` - Check backend import usage
- `packages/shared-types/dist/index.d.ts` - Generated type definitions

## Implementation Steps
1. Audit all imports across frontend and backend to see what's actually used
2. Identify unused convenience exports and type groupings
3. Remove redundant re-exports
4. Organize remaining exports by logical groups
5. Simplify package metadata
6. Update any imports that break due to reorganization
7. Ensure generated .d.ts file is clean

## Acceptance Test
```bash
npm run build
npm test
npm run lint
# Verify all necessary types are still accessible
```

## Estimated Time
20 minutes
