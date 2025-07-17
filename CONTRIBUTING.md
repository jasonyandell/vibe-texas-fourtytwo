# Contributing to Texas 42 Web Game

Thank you for your interest in contributing to the Texas 42 Web Game! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Docker Desktop
- Git

### Setup
1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/texas-42-web-game.git
   cd texas-42-web-game
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Verify setup:
   ```bash
   npm run check-prereqs
   npm run verify-setup
   ```

## 🔄 Development Workflow

### GitHub Project Board Workflow
We follow a GitHub Project Board-driven development approach using **Texas 42 Development Board (Project #1)**:

1. **Check Open PRs**: Execute ONE action then stop:
   - Merge one ready PR if approved → STOP
   - Fix one PR with blocking comments → checkout, fix, push → STOP
   - Review one PR for alignment with design.md → STOP

2. **Work Issues**: If no PRs need attention, work one issue from Project Board 1 → STOP
3. **Create Branch**: `git checkout -b issue-{number}-{title-slug}`
4. **Follow Enhanced TDD**: Red → Green → Refactor (with zero-warnings requirement)
5. **Test**: Ensure all tests pass and zero warnings before next TDD cycle
6. **Create PR**: Submit pull request when issue is complete

### Branch Naming
- **Issues**: `issue-{number}-{title-slug}` (e.g., `issue-16-core-domino-components`)
- **Bug Fixes**: `fix-{number}-{description}` (e.g., `fix-23-domino-rendering-mobile`)
- **Documentation**: `docs-{description}` (e.g., `docs-add-api-docs`)

### Commit Messages
Follow conventional commits with issue references:
```
issue: add domino selection animation - fixes #16
fix: resolve mobile touch events - fixes #23
docs: update deployment guide
test: add E2E tests for bidding system - fixes #45
```

### Enhanced TDD Process
All development must follow the enhanced Red-Green-Refactor cycle:

1. **Red**: Write failing test
2. **Green**: Make test pass with minimal code
3. **Refactor**: Clean up code AND eliminate all warnings
   - Run `npm run lint` - zero warnings required
   - Run `npm run type-check` - zero TypeScript errors/warnings
   - **All warnings are blockers** - must be fixed before next cycle

### One Action Per Workflow Step
The workflow executes exactly **ONE** action per step, then stops:
- Work one issue OR merge one PR OR fix one PR - never multiple actions
- Complete the action fully, then stop for next workflow execution

## 🧪 Testing Requirements

All contributions must include appropriate tests and pass zero-warnings validation:

### Frontend Tests
- **Unit Tests**: React component tests using Vitest
- **Integration Tests**: Multi-component interaction tests
- **E2E Tests**: Playwright tests for user workflows

### Backend Tests
- **Unit Tests**: Individual function/class tests
- **Integration Tests**: API endpoint tests
- **Database Tests**: Repository and migration tests

### Zero-Warnings Policy
During the **Refactor** phase of TDD, all warnings must be eliminated:
```bash
# Required checks during refactor phase
npm run lint          # Must pass with zero warnings
npm run type-check    # Must pass with zero TypeScript warnings
npm run test:frontend # All tests must pass
npm run test:backend  # All tests must pass
```

### Running Tests
```bash
# All tests
npm run test:frontend
npm run test:backend
npm run test:e2e

# Watch mode for TDD
npm run tdd
```

## 📋 Pull Request Process

1. **Create Feature Branch**: From `main` using `issue-{number}-{title-slug}` format
2. **Implement Changes**: Follow enhanced TDD with zero-warnings policy
3. **Add Tests**: Ensure good test coverage
4. **Eliminate All Warnings**: Run lint and type-check during refactor phase
5. **Run Full Test Suite**: All tests must pass
6. **Create Pull Request**: Use the PR template with issue reference
7. **Code Review**: Address feedback (one PR fix per workflow step)
8. **Merge**: Squash and merge when approved (one merge per workflow step)

### PR Requirements
- ✅ All CI checks pass
- ✅ Zero linting warnings
- ✅ Zero TypeScript warnings
- ✅ At least 1 approval required
- ✅ Branch is up to date with main
- ✅ All conversations resolved
- ✅ Issue reference in PR title/description

## 🎯 Coding Standards

### TypeScript
- Strict mode enabled
- Explicit return types for functions
- No `any` types (use proper typing)
- Use interfaces for object shapes

### React
- Functional components with hooks
- Props interfaces defined
- Proper error boundaries
- Accessibility considerations (ARIA labels)

### Backend
- RESTful API design
- Proper error handling
- Input validation with Zod
- Database transactions where appropriate

### General
- ESLint configuration must pass
- Prettier formatting applied
- No console.log in production code
- Meaningful variable and function names

## 📁 Project Structure

```
texas-42-web-game/
├── frontend/          # React + Vite + TypeScript
├── backend/           # Fastify + TypeScript + PostgreSQL
├── docs/              # Documentation
├── scripts/           # Automation scripts
└── .github/           # GitHub workflows and templates
```

## 🎯 GitHub Project Board Workflow

### Texas 42 Development Board (Project #1)
All development work is managed through **GitHub Project Board 1** only:

- **Issues**: Created and tracked in the project board
- **Priority Labels**: `priority-1-critical`, `priority-2-high`, `priority-3-medium`, `priority-4-low`
- **Category Labels**: `core-features`, `story`, `bug`, `enhancement`
- **Workflow**: One action per step - work one issue OR handle one PR, then stop

### Simple Command Integration
Use simple commands to work specific items:
- `work item 16` - Find and work issue/PR #16 in Texas 42 Development Board
- Focus only on this project's items, no cross-project references

## 🎲 Texas 42 Rules

When implementing game features, refer to:
- `docs/design.md` - Authoritative design decisions
- `docs/rules/` - Texas 42 rules documentation

## 🐛 Bug Reports

Use the GitHub issue template for bug reports. Include:
- Steps to reproduce
- Expected vs actual behavior
- Environment details (browser, OS, etc.)
- Screenshots/videos if applicable

## 💡 Feature Requests

For new features:
- Check existing issues in Texas 42 Development Board
- Provide clear use case and rationale
- Consider implementation complexity
- Align with project goals and design.md

## 📞 Getting Help

- **Documentation**: Check `docs/` directory
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions for questions
- **Code Review**: Ask for help in PR comments

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Texas 42 Web Game! 🎲
