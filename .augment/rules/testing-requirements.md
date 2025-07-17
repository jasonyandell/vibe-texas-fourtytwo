---
type: "always_apply"
---

# Testing Requirements & TDD Practices

## Test-Driven Development (TDD) - MANDATORY
- **Strictly adhered to for ALL changes**
- **Red-Green-Refactor cycle**: 
  1. Write failing test first
  2. Write minimal code to make test pass
  3. Refactor while keeping tests green
- **Test-first approach**: All test code must be written before implementation code
- **Complete only when**: All tests are green AND all documentation is updated

## Refactor phase
1. Always run lint, fix linter errors
2. Always check for typescript errors and fix them
3. Always unsuppress any warnings and fix them
4. CRITICAL: ALL WARNINGS ARE BLOCKERS. 

## Testing Requirements
- **Complete Coverage**: The entire system must be testable by automated tests
- **Fast Execution**: Tests must be FAST - speed is critical for feedback loops
- **Watch Mode**: Tests run continuously in watch mode during development
- **Types of Tests**:
  - **Unit Tests**: Vitest for backend game logic
  - **End-to-End Tests**: Playwright for full game flow
  - **All changes must pass tests** before merge or deploy

## Testing Technology Stack
- **Backend Unit Tests**: Vitest
- **Frontend E2E Tests**: Playwright
- **Watch Mode**: Both test suites must support watch mode for development

## Testing Workflow Integration
- Tests are part of the `npm run develop` command
- Tests run in watch mode during development
- All tests must pass before any deployment
- Tests are part of the definition of done

## Continuous Deployment Mindset
- **Assume every commit goes to production**
- **Plan for continuous deployment** even if not always practiced
- Tests are the safety net that enables this approach

## AI Assistant Guidelines for Testing
- Always write tests BEFORE implementation code
- Ensure tests are fast and provide quick feedback
- Set up watch mode for continuous testing during development
- Use Vitest for backend unit tests, Playwright for E2E tests
- Never consider a task complete until all tests pass
- Always suggest running tests after making code changes
- Prioritize test speed and developer feedback loops
