# Story: GitHub Actions CI/CD Pipeline Setup

## Overview
Implement comprehensive GitHub Actions CI/CD pipeline for automated testing, building, and quality assurance. This story establishes automated workflows that run on every pull request and push to main branch, ensuring code quality and preventing regressions.

## User Story
**As a** development team  
**I want** automated CI/CD pipelines that test and validate our code  
**So that** we can catch issues early, maintain code quality, and deploy with confidence

## Acceptance Criteria

### ✅ Frontend Testing Pipeline
- [ ] Frontend unit tests run automatically on PR and main branch pushes
- [ ] ESLint and TypeScript type checking enforced
- [ ] Frontend build process validated
- [ ] Test coverage reporting integrated
- [ ] Frontend artifacts properly cached for performance

### ✅ Backend Testing Pipeline
- [ ] Backend unit tests run with PostgreSQL test database
- [ ] Backend linting and type checking enforced
- [ ] Database migrations tested in CI environment
- [ ] API endpoint tests validated
- [ ] Backend build process verified

### ✅ End-to-End Testing Pipeline
- [ ] E2E tests run against full application stack
- [ ] Playwright tests execute with video recording
- [ ] Test artifacts (videos, screenshots) uploaded on failure
- [ ] E2E tests run only after unit tests pass
- [ ] Browser compatibility testing across multiple browsers

### ✅ Quality Gates and Branch Protection
- [ ] All CI checks must pass before PR merge
- [ ] Branch protection rules updated to require status checks
- [ ] Failed tests prevent merging to main branch
- [ ] Clear feedback provided on test failures

### ✅ Performance and Optimization
- [ ] Dependency caching implemented for faster builds
- [ ] Parallel job execution where possible
- [ ] Build artifacts cached and reused
- [ ] CI pipeline completes in reasonable time (< 15 minutes)

## Technical Requirements

### GitHub Actions Workflow Structure
Create `.github/workflows/ci.yml` with these jobs:

1. **test-frontend** - Frontend testing and validation
2. **test-backend** - Backend testing with database
3. **e2e-tests** - End-to-end testing (depends on frontend/backend)
4. **build-docker** - Docker image building (main branch only)

### Frontend Pipeline Specifications
```yaml
# Job: test-frontend
- Node.js 18+ environment
- npm ci for dependency installation
- ESLint validation
- TypeScript type checking
- Vitest unit tests execution
- Build verification
- Artifact caching for node_modules
```

### Backend Pipeline Specifications
```yaml
# Job: test-backend
- Node.js 18+ environment
- PostgreSQL 15 service container
- Database environment variables
- npm ci for dependency installation
- ESLint validation
- TypeScript type checking
- Vitest unit tests with database
- Build verification
```

### E2E Pipeline Specifications
```yaml
# Job: e2e-tests
- Full application stack startup
- Docker Compose orchestration
- Playwright browser installation
- E2E test execution with video recording
- Artifact upload for test results
- Cleanup of Docker containers
```

### Environment Configuration
**Test Environment Variables:**
```bash
# Backend Testing
DATABASE_URL=postgresql://testuser:testpass@localhost:5432/texas42_test
NODE_ENV=test

# Frontend Testing
VITE_API_URL=http://localhost:4201
VITE_WS_URL=ws://localhost:4201

# E2E Testing
FRONTEND_PORT=4200
BACKEND_PORT=4201
DATABASE_PORT=5432
```

## Implementation Steps

### Step 1: Create CI Workflow File
**MANUAL TASK:** Create `.github/workflows/ci.yml` with complete pipeline configuration

### Step 2: Configure Test Databases
**MANUAL TASK:** Ensure backend tests work with PostgreSQL service container:
1. Update backend test configuration for CI environment
2. Verify database migrations run correctly in CI
3. Test database seeding and cleanup procedures

### Step 3: Update Package Scripts
**MANUAL TASK:** Ensure these npm scripts exist and work correctly:
```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "build": "vite build"
  }
}
```

### Step 4: Configure Branch Protection
**MANUAL TASK:** Update branch protection rules in GitHub Settings:
- Go to Settings → Branches → Edit main branch rule
- Add required status checks:
  - `test-frontend`
  - `test-backend`
  - `e2e-tests`
- Enable "Require branches to be up to date before merging"

### Step 5: Test Pipeline Execution
**MANUAL TASK:** Verify CI pipeline works:
1. Create test branch with small change
2. Push branch and create pull request
3. Verify all CI jobs execute successfully
4. Test failure scenarios (intentionally break a test)
5. Verify artifacts are uploaded on E2E test failures

## Definition of Done
- [ ] All CI jobs execute successfully on pull requests
- [ ] Failed tests prevent PR merging
- [ ] E2E test artifacts (videos/screenshots) available on failures
- [ ] CI pipeline completes in under 15 minutes
- [ ] Branch protection enforces all required checks
- [ ] Team understands CI feedback and debugging process
- [ ] CI pipeline handles both success and failure scenarios correctly

## Dependencies
- **Prerequisite:** `github-migration.md` story completed
- **Prerequisite:** Repository with branch protection configured
- **Prerequisite:** Team members familiar with GitHub Actions
- **Prerequisite:** All tests currently passing locally

## Estimated Effort
**4-6 hours** - Including pipeline configuration, testing, and debugging

## Testing Strategy
1. **Pipeline Validation:**
   - Test successful CI run with all checks passing
   - Test failure scenarios for each job type
   - Verify artifact upload and download functionality

2. **Performance Testing:**
   - Measure CI pipeline execution time
   - Verify caching improves subsequent runs
   - Test parallel job execution

3. **Integration Testing:**
   - Test full workflow from PR creation to merge
   - Verify branch protection integration
   - Test CI feedback in PR interface

## Configuration Files to Create

### 1. `.github/workflows/ci.yml`
Complete GitHub Actions workflow with all specified jobs

### 2. Update `.gitignore` (if needed)
Add any CI-specific ignore patterns:
```
# CI artifacts
.github/workflows/test-results/
playwright-report/
test-results/
```

## Troubleshooting Guide

### Common CI Issues
1. **Database Connection Failures:**
   - Verify PostgreSQL service configuration
   - Check environment variable setup
   - Ensure proper wait conditions

2. **E2E Test Timeouts:**
   - Increase service startup wait times
   - Verify Docker Compose configuration
   - Check port conflicts

3. **Caching Issues:**
   - Clear GitHub Actions cache if needed
   - Verify cache key configurations
   - Check dependency lock file changes

## Security Considerations
- No secrets required for basic CI pipeline
- Database credentials are test-only and non-sensitive
- Artifacts contain only test results, no sensitive data
- Branch protection prevents bypassing CI checks

## Performance Optimizations
- **Dependency Caching:** Cache node_modules between runs
- **Parallel Execution:** Run frontend/backend tests simultaneously
- **Conditional Jobs:** Skip unnecessary jobs based on file changes
- **Artifact Management:** Automatic cleanup of old artifacts

## Notes
- **IMPORTANT:** This story requires `github-migration.md` to be completed first
- Focus on reliability and clear feedback over speed initially
- Start with basic pipeline, optimize performance in iterations
- Ensure CI provides actionable feedback for developers
- Document common CI issues and solutions for team

## Related Stories
- **Prerequisite:** `github-migration.md` - Basic GitHub setup
- **Follow-up:** `github-migration-later-deployment.md` - Deployment automation
- **Follow-up:** Advanced CI features (code coverage, security scanning)
- **Follow-up:** Performance monitoring and optimization

## Success Metrics
- CI pipeline success rate > 95%
- Average pipeline execution time < 15 minutes
- Zero false positives in test failures
- Team adoption of CI-driven development workflow
- Reduced manual testing effort for basic functionality
