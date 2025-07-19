# Dependency Migration Plan

## Overview
This document outlines the plan to modernize all project dependencies to their latest stable versions, eliminating warnings and improving performance, security, and developer experience.

## Current vs Target Versions

### Frontend Dependencies

#### Core React Ecosystem
| Package | Current | Latest | Risk Level | Notes |
|---------|---------|--------|------------|-------|
| `react` | 18.2.0 | 19.1.0 | **HIGH** | Major version jump, breaking changes |
| `react-dom` | 18.2.0 | 19.1.0 | **HIGH** | Must match React version |
| `@types/react` | 18.2.43 | 19.0.2 | **HIGH** | Type changes for React 19 |
| `@types/react-dom` | 18.2.17 | 19.0.2 | **HIGH** | Type changes for React 19 |

#### Testing Libraries
| Package | Current | Latest | Risk Level | Notes |
|---------|---------|--------|------------|-------|
| `@testing-library/react` | 13.4.0 | 16.3.0 | **MEDIUM** | Fixes act() warnings |
| `@testing-library/user-event` | 14.5.1 | 14.5.2 | **LOW** | Patch update |
| `@testing-library/jest-dom` | 6.1.5 | 6.6.3 | **LOW** | Minor updates |
| `vitest` | 1.0.4 | 3.2.4 | **MEDIUM** | Major version jump |
| `@vitest/ui` | 1.0.4 | 3.2.4 | **MEDIUM** | Must match vitest |

#### Build Tools
| Package | Current | Latest | Risk Level | Notes |
|---------|---------|--------|------------|-------|
| `vite` | 5.0.8 | 7.0.4 | **HIGH** | Major version jumps |
| `@vitejs/plugin-react` | 4.2.1 | 4.3.4 | **LOW** | Minor update |
| `typescript` | 5.3.3 | 5.8.3 | **MEDIUM** | New features, stricter checks |

#### Routing & State
| Package | Current | Latest | Risk Level | Notes |
|---------|---------|--------|------------|-------|
| `react-router-dom` | 6.20.1 | 7.1.1 | **MEDIUM** | Major version jump |
| `zustand` | 4.4.7 | 5.0.2 | **MEDIUM** | Major version jump |

#### UI & Utilities
| Package | Current | Latest | Risk Level | Notes |
|---------|---------|--------|------------|-------|
| `lucide-react` | 0.294.0 | 0.469.0 | **LOW** | Icon updates |
| `clsx` | 2.0.0 | 2.1.1 | **LOW** | Minor update |
| `lz-string` | 1.5.0 | 1.5.0 | **NONE** | Already latest |

### Backend Dependencies

#### Core Framework
| Package | Current | Latest | Risk Level | Notes |
|---------|---------|--------|------------|-------|
| `fastify` | 4.24.3 | 5.2.0 | **HIGH** | Major version jump |
| `@fastify/cors` | 8.4.0 | 10.0.1 | **MEDIUM** | Major version jump |
| `@fastify/websocket` | 8.3.1 | 11.0.1 | **MEDIUM** | Major version jump |

#### Database & Utilities
| Package | Current | Latest | Risk Level | Notes |
|---------|---------|--------|------------|-------|
| `pg` | 8.11.3 | 8.13.1 | **LOW** | Minor update |
| `zod` | 3.22.4 | 3.24.1 | **LOW** | Minor update |
| `nanoid` | 5.0.4 | 5.0.9 | **LOW** | Patch update |

## Critical Issues Discovered

### Security Vulnerabilities (IMMEDIATE ACTION REQUIRED)
- **fast-jwt vulnerability**: CVE affecting JWT validation
- **esbuild vulnerability**: Development server security issue
- **Node.js 22 compatibility**: Engine warnings for fast-jwt

### Required Security Updates
```bash
# Backend - fixes fast-jwt vulnerability and Node.js 22 compatibility
npm install @fastify/jwt@9.1.0

# Frontend - fixes esbuild vulnerability
npm install --save-dev vite@7.0.4 vitest@3.2.4 @vitest/ui@3.2.4
```

## Migration Status

### ✅ Phase 0: Security & Compatibility Fixes (COMPLETED)
**Completed**: 2025-01-16
**Results**:
- ✅ Fixed fast-jwt vulnerability (CVE)
- ✅ Fixed esbuild vulnerability
- ✅ Eliminated Node.js 22 engine warnings
- ✅ Updated to Vitest 3.2.4, @vitest/ui 3.2.4, @fastify/jwt 9.1.0
- ✅ All security vulnerabilities resolved

### ✅ Phase 1: Testing Library Modernization (COMPLETED)
**Completed**: 2025-01-16
**Results**:
- ✅ Updated @testing-library/react to 16.3.0
- ✅ Fixed router nesting issues in GameBoard tests
- ✅ All 399 tests passing with zero failures
- ✅ **ELIMINATED ReactDOMTestUtils.act warnings completely**
- ⚠️ React Router future flag warnings remain (non-critical)

### 🔄 Remaining Issues (Low Priority)
1. **React Router future flag warnings** - Can be addressed in future update

## Migration Strategy

### Phase 1: Testing Library Modernization (CURRENT)
**Estimated Time**: 1-2 hours
**Risk**: Medium

```bash
# Frontend
npm install --save-dev \
  @testing-library/user-event@14.5.2 \
  @testing-library/jest-dom@6.6.3 \
  @vitejs/plugin-react@4.3.4 \
  lucide-react@0.469.0 \
  clsx@2.1.1

# Backend  
npm install \
  pg@8.13.1 \
  zod@3.24.1 \
  nanoid@5.0.9
```

### Phase 2: Medium-Risk Updates (Next Sprint)
**Estimated Time**: 4-6 hours
**Risk**: Medium

1. **Testing Library Modernization**
   ```bash
   npm install --save-dev @testing-library/react@16.3.0
   ```
   - **Breaking Changes**: Better React 18+ support, stricter act() enforcement
   - **Benefits**: Eliminates ReactDOMTestUtils.act warnings
   - **Testing Required**: Full test suite run

2. **TypeScript Update**
   ```bash
   npm install --save-dev typescript@5.8.3
   ```
   - **Breaking Changes**: Stricter type checking, new compiler options
   - **Benefits**: Better performance, new language features
   - **Testing Required**: Type checking across all files

3. **Vitest Major Update**
   ```bash
   npm install --save-dev vitest@3.2.4 @vitest/ui@3.2.4
   ```
   - **Breaking Changes**: API changes, configuration updates
   - **Benefits**: Better performance, new features
   - **Testing Required**: All unit tests

### Phase 3: High-Risk Updates (Separate Epic)
**Estimated Time**: 1-2 weeks
**Risk**: High

1. **React 19 Migration**
   - **Preparation Required**: Review React 19 upgrade guide
   - **Breaking Changes**: New JSX transform, stricter rules
   - **Benefits**: Better performance, new features
   - **Dependencies**: Must update all React ecosystem packages together

2. **Vite 7 Migration**
   - **Breaking Changes**: Node.js requirements, plugin API changes
   - **Benefits**: Better performance, new features
   - **Testing Required**: Build process, dev server, HMR

3. **Fastify 5 Migration**
   - **Breaking Changes**: Plugin API changes, TypeScript improvements
   - **Benefits**: Better performance, security updates
   - **Testing Required**: All API endpoints, WebSocket connections

## Pre-Migration Checklist

- [ ] Create feature branch: `feat/dependency-modernization`
- [ ] Backup current package-lock.json files
- [ ] Document current test results baseline
- [ ] Ensure all tests pass before starting
- [ ] Review breaking change documentation for each package
- [ ] Plan rollback strategy

## Testing Strategy

### After Each Phase
1. **Unit Tests**: `npm run test:frontend && npm run test:backend`
2. **Type Checking**: `npm run type-check` (both workspaces)
3. **Linting**: `npm run lint` (both workspaces)
4. **E2E Tests**: `npm run test:e2e`
5. **Build Verification**: `npm run build`
6. **Dev Server**: Verify `npm run develop` works

### Specific Test Areas
- **React Testing Library**: Focus on act() warnings elimination
- **TypeScript**: Check for new type errors
- **Vitest**: Verify test runner behavior
- **Build Process**: Ensure no build failures
- **WebSocket**: Test real-time features

## Rollback Plan

If issues arise:
1. **Immediate**: `git checkout package*.json && npm install`
2. **Selective**: Downgrade specific packages causing issues
3. **Documentation**: Record issues for future attempts

## Expected Benefits

### Immediate (Phase 1)
- Patch-level security updates
- Minor bug fixes
- No breaking changes

### Medium-term (Phase 2)
- **Eliminated Warnings**: No more ReactDOMTestUtils.act deprecation warnings
- **Better Performance**: Improved test runner and build speeds
- **Enhanced DX**: Better error messages and debugging

### Long-term (Phase 3)
- **React 19 Features**: Better concurrent rendering, new hooks
- **Modern Build Tools**: Faster builds, better tree-shaking
- **Security**: Latest security patches across the stack

## Risk Mitigation

1. **Incremental Approach**: Phase-based migration reduces blast radius
2. **Comprehensive Testing**: Multiple test layers catch regressions
3. **Documentation**: Clear rollback procedures
4. **Team Communication**: Coordinate with all developers
5. **Staging Environment**: Test in production-like environment

## Next Steps

1. **Immediate**: Execute Phase 1 (low-risk updates)
2. **This Sprint**: Plan Phase 2 execution
3. **Next Sprint**: Execute Phase 2 with thorough testing
4. **Future Epic**: Plan Phase 3 as separate major initiative

---

**Created**: 2025-01-16
**Status**: Draft - Ready for Review
**Owner**: Development Team
