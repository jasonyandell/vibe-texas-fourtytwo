---
description: Run all validation checks
allowed-tools: [Bash]
---
# Validate Code Quality

Run ALL validation checks:

## 1. E2E Tests
```bash
npm run test:e2e
```

## 2. Unit Tests
```bash
npm run test:frontend
```

## 3. Linting (ZERO warnings)
```bash
npm run lint
```

## 4. Type Checking (ZERO errors)
```bash
npm run type-check
```

## 5. Summary
Show results for each check.
ALL must pass with:
- All tests passing
- Zero lint warnings
- Zero type errors

Any failures block progress!