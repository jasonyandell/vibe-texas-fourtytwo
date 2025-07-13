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

### Story-Based Development
We follow a story-driven development approach:

1. **Pick a Story**: Choose from the `stories/` directory or GitHub Issues
2. **Create Branch**: `git checkout -b story/story-name`
3. **Follow TDD**: Use `npm run tdd` for test-driven development
4. **Implement**: Follow the story requirements and design.md
5. **Test**: Ensure all tests pass (`npm run test:frontend`, `npm run test:backend`, `npm run test:e2e`)
6. **Create PR**: Submit pull request with clear description

### Branch Naming
- **Stories**: `story/story-name` (e.g., `story/initial-features-9`)
- **Bug Fixes**: `fix/issue-description` (e.g., `fix/domino-rendering-mobile`)
- **Documentation**: `docs/update-description` (e.g., `docs/add-api-docs`)

### Commit Messages
Follow conventional commits:
```
feat: add domino selection animation
fix: resolve mobile touch events
docs: update deployment guide
test: add E2E tests for bidding system
```

## 🧪 Testing Requirements

All contributions must include appropriate tests:

### Frontend Tests
- **Unit Tests**: React component tests using Vitest
- **Integration Tests**: Multi-component interaction tests
- **E2E Tests**: Playwright tests for user workflows

### Backend Tests
- **Unit Tests**: Individual function/class tests
- **Integration Tests**: API endpoint tests
- **Database Tests**: Repository and migration tests

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

1. **Create Feature Branch**: From `main` branch
2. **Implement Changes**: Follow coding standards
3. **Add Tests**: Ensure good test coverage
4. **Update Documentation**: If needed
5. **Run Full Test Suite**: All tests must pass
6. **Create Pull Request**: Use the PR template
7. **Code Review**: Address feedback
8. **Merge**: Squash and merge when approved

### PR Requirements
- ✅ All CI checks pass
- ✅ At least 1 approval required
- ✅ Branch is up to date with main
- ✅ All conversations resolved

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
├── stories/           # Development stories
├── scripts/           # Automation scripts
└── .github/           # GitHub workflows and templates
```

## 🎲 Texas 42 Rules

When implementing game features, refer to:
- `docs/design.md` - Authoritative design decisions
- `stories/rules-research-*.md` - Detailed rule analysis
- Traditional Texas 42 rules and scoring

## 🐛 Bug Reports

Use the GitHub issue template for bug reports. Include:
- Steps to reproduce
- Expected vs actual behavior
- Environment details (browser, OS, etc.)
- Screenshots/videos if applicable

## 💡 Feature Requests

For new features:
- Check existing issues and stories
- Provide clear use case and rationale
- Consider implementation complexity
- Align with project goals

## 📞 Getting Help

- **Documentation**: Check `docs/` directory
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions for questions
- **Code Review**: Ask for help in PR comments

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Texas 42 Web Game! 🎲
