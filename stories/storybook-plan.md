# Storybook Implementation Plan for Texas 42

## Overview

This plan outlines the integration of Storybook into the Texas 42 project to enhance component development, testing, and documentation. Storybook complements the existing demo system by providing a dedicated development environment for component isolation and testing.

## Current Status ✅

### Completed ✅
- ✅ Storybook setup with Vite
- ✅ Core game components: DominoComponent, DominoHand, GameBoard, GameBoardPlayers, GameBoardCenter
- ✅ Bidding components: BiddingPanel, BiddingHistory  
- ✅ Info components: GameBoardHeader, TrumpSuitCard
- ✅ Shared fixtures and test data
- ✅ Context decorators (Router + GameState)
- ✅ Playwright tests
- ✅ Root-level storybook command
- ✅ GameBoardTrickStacks stories (all 4 states)
- ✅ Header stories (all 3 states)

## Recently Completed ✅

### Phase 2: Lobby & Game Management Components ✅

#### Lobby Components ✅
```typescript
// GameCard.stories.tsx ✅
- WaitingForPlayers ✅
- GameInProgress ✅
- GameComplete ✅
- SpectatorMode ✅

// CreateGameModal.stories.tsx ✅
- Default ✅
- FormValidation ✅
- Creating ✅
- Error ✅

// PlayerSlot.stories.tsx ✅
- Empty ✅
- Occupied ✅
- Ready/NotReady ✅
- Disconnected ✅
```

#### Score & Status Components ✅
```typescript
// ScoreDisplay.stories.tsx ✅
- ZeroScore ✅
- MidGame ✅
- NearWinning ✅
- GameWon ✅

// GameStatus.stories.tsx ✅
- Waiting ✅
- Bidding (N/A - component only supports waiting/playing/finished)
- Playing ✅
- Complete ✅
```

## Phase 3: Testing Integration - ABANDONED ❌

**Learning**: Storybook v9 testing ecosystem not mature enough. @storybook/test only supports v8. Stories as test fixtures provide minimal benefit over existing test patterns. Focus on stories for documentation and visual testing instead.

## Next Phase: Build & Deploy

1. **Add to CI Pipeline**
```yaml
- name: Build Storybook
  run: npm run build-storybook
- name: Deploy to Vercel/Netlify
  run: npx vercel --prod ./storybook-static
```

2. **Visual Regression Testing**
- Set up Chromatic account
- Add to PR checks
- Establish baseline snapshots

## Later Phases (Month 2+)

### Advanced Features
- **Interactions addon** for complex user flows
- **MSW addon** for API mocking
- **Performance addon** for render metrics
- **Figma plugin** if designs exist

### Full Documentation
- Component API documentation
- Usage guidelines
- Accessibility notes
- Integration examples

### Team Scaling
- Workshop for team members
- Story templates
- Contribution guidelines
- Review process

## File Structure

```
frontend/
├── .storybook/
│   ├── main.ts          ✅ Configured with addons
│   ├── preview.tsx      ✅ Context decorators added
│   └── manager.ts       ✅ Right panel layout
├── src/
│   ├── components/
│   │   ├── DominoComponent.stories.tsx    ✅
│   │   ├── DominoHand.stories.tsx         ✅
│   │   ├── GameBoard.stories.tsx          ✅
│   │   ├── GameBoardPlayers.stories.tsx   ✅
│   │   ├── GameBoardCenter.stories.tsx    ✅
│   │   ├── BiddingPanel.stories.tsx       ✅
│   │   ├── BiddingHistory.stories.tsx     ✅
│   │   ├── GameBoardHeader.stories.tsx    ✅
│   │   ├── TrumpSuitCard.stories.tsx      ✅
│   │   ├── GameBoardTrickStacks.stories.tsx ✅
│   │   ├── Header.stories.tsx             ✅
│   │   └── lobby/
│   │       ├── GameCard.stories.tsx       ✅
│   │       ├── CreateGameModal.stories.tsx ✅
│   │       ├── PlayerSlot.stories.tsx     ✅
│   │       ├── ScoreDisplay.stories.tsx   ✅
│   │       └── GameStatus.stories.tsx     ✅
│   └── stories/
│       └── fixtures/    ✅
```

## Best Practices Going Forward

### Story Writing
1. **One story per significant state** (not every prop combination)
2. **Use realistic data** from fixtures
3. **Include error/edge cases**
4. **Add play functions** for interactions

### Component Organization
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx
├── ComponentName.stories.tsx    # Keep stories with components
└── ComponentName.module.css
```

### Performance
- Lazy load heavy stories
- Use static data where possible
- Minimize re-renders in stories

## Success Metrics

✅ **Already Achieved:**
- Fast component development cycle
- Visual documentation of components
- Interactive prop exploration

📊 **To Measure:**
- Story coverage (target: 80% of components)
- Time to develop new components
- Bug reduction in UI components
- Developer satisfaction

## Quick Commands

```bash
# Development
npm run storybook              # Start dev server on :6006

# Testing  
npm run test-storybook         # Run interaction tests

# Building
npm run build-storybook        # Build static site

# Type checking (includes stories)
npm run type-check
```

## Resources

- [Component Story Format 3.0](https://storybook.js.org/docs/api/csf)
- [Vite Builder Docs](https://storybook.js.org/docs/builders/vite)
- [Testing with Stories](https://storybook.js.org/docs/writing-tests)
- [Our Stories](./../frontend/src/components/) - See existing examples

---

**Next Action**: Build & Deploy - Add Storybook to CI pipeline and set up visual regression testing.

### [LATER] Deploy to GitHub Pages
- Add `build-storybook` script to package.json
- Create GitHub Action workflow for automatic deployment
- Configure GitHub Pages to serve from gh-pages branch
- Add deployment badge to README
