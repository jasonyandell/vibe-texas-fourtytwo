# Optimize URL Serialization

## Goal
Analyze and simplify the URL serialization system to only include essential game state data, reducing URL complexity and size.

## Problem
Current URL serialization may be over-engineered:
- Serializing entire GameState objects that may be too large for URLs
- Including fields that aren't necessary for sharing game state
- Complex serialization logic that could be simplified
- Potential for very long URLs that break browser limits

## Success Criteria
- [ ] Identify minimal set of data needed for URL sharing
- [ ] Simplify serialization to only essential fields
- [ ] Reduce URL length significantly
- [ ] Maintain ability to restore meaningful game state
- [ ] All URL serialization tests pass

## TDD Approach
1. **Red**: Write tests for minimal URL serialization requirements
2. **Green**: Implement simplified serialization
3. **Refactor**: Optimize for URL length and readability

## Files to Read for Context
- `frontend/src/utils/urlSerialization.ts` - Current serialization logic
- `frontend/src/utils/__tests__/urlSerialization.test.ts` - Test requirements
- `frontend/src/contexts/GameStateContext.tsx` - How serialization is used
- `packages/shared-types/src/game-state.ts` - Full GameState structure
- Browser URL length limits documentation

## Implementation Steps
1. Analyze what game state data is actually needed for URL sharing
2. Identify the minimum viable set of fields for reconstruction
3. Determine if full GameState restoration is necessary or if partial state is sufficient
4. Implement simplified serialization format
5. Update deserialization to handle simplified format
6. Test URL length limits with realistic game data
7. Update tests to reflect new requirements

## Acceptance Test
```bash
npm run build
npm test
npm run lint
# Test URL sharing functionality with simplified format
# Verify URLs stay under reasonable length limits
```

## Estimated Time
25 minutes
