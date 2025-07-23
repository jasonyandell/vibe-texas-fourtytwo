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

## Next Phase: Phase 3 - Testing Integration

### Phase 3: Testing Integration (Start Small!)

#### Overview
Transform existing tests to use Storybook stories as fixtures, reducing duplication and ensuring stories stay accurate. Start with ONE component family to learn the pattern.

#### Step 1: Choose Your Starting Point
**Option A: DominoComponent** (Recommended)
- Already has comprehensive stories
- Tests have lots of fixture setup
- Visual component = easy to verify

**Option B: Lobby Components**
- Just created stories (fresh in mind)
- Simpler interactions
- Good for learning basics

#### Step 2: Integration Pattern Roadmap

##### 2.1 Simple Prop Reuse (Start Here!)
```typescript
// Find tests that just render with props
// Replace hardcoded props with story args
import { Default } from './Component.stories';
render(<Component {...Default.args} />);
```

##### 2.2 Override Story Props
```typescript
// Keep story defaults but customize for test
render(<Component {...Default.args} domino={myTestDomino} />);
```

##### 2.3 Complex Setup Reuse
```typescript
// Find tests with mock data/complex setup
// Replace with story that already has that setup
import { GameInProgress } from './GameCard.stories';
// Use the whole story setup
```

#### Step 3: Add Play Functions (Interactive Tests)

##### 3.1 Basic Click Test
```typescript
play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const domino = canvas.getByTestId('domino-3-3');
  
  // Test the interaction
  await userEvent.click(domino);
  await expect(domino).toHaveClass('selected');
}
```

##### 3.2 Multi-Step Interactions
Focus on these key flows:
1. **Domino Selection** - Click to select/deselect
2. **Join Game** - Empty slot → Join → Ready
3. **Bid Submission** - Enter bid → Validate → Submit
4. **Game State Changes** - Waiting → Playing → Complete

#### Step 4: Implementation Checklist

**Week 1: Learn the Pattern**
- [ ] Pick ONE component (DominoComponent recommended)
- [ ] Find 3-5 simple tests to convert
- [ ] Import stories, use args
- [ ] Verify tests still pass
- [ ] Add 1 play function

**Week 2: Expand & Evaluate**
- [ ] Convert 5 more tests
- [ ] Add 2-3 more play functions
- [ ] Document what worked/didn't work
- [ ] Decide: Continue or stop?

#### Common Patterns You'll Find

**Pattern 1: Fixture Arrays**
```typescript
// Before: Test has array of test data
const testDominoes = [/* lots of setup */];

// After: Import from story
import { allDominoes } from './fixtures';
```

**Pattern 2: State Testing**
```typescript
// Before: Multiple tests for each state
it('shows selected state', () => {/*...*/});
it('shows playable state', () => {/*...*/});

// After: One story with play function
export const InteractiveStates: Story = {
  play: async () => {
    // Test all states in sequence
  }
};
```

**Pattern 3: Mock Functions**
```typescript
// Keep mocks in tests, stories handle visual
const onClick = vi.fn();
render(<Component {...Story.args} onClick={onClick} />);
```

#### Success Metrics
- [ ] 5-10 tests use story imports
- [ ] 3-5 stories have play functions
- [ ] Tests are easier to understand
- [ ] No increase in test runtime
- [ ] Clear decision: worth continuing?

### Phase 4: Build & Deploy

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

**Next Action**: Phase 2 - Create Lobby & Game Management Component stories (GameCard, CreateGameModal, PlayerSlot, ScoreDisplay, GameStatus).

### [LATER] Deploy to GitHub Pages
- Add `build-storybook` script to package.json
- Create GitHub Action workflow for automatic deployment
- Configure GitHub Pages to serve from gh-pages branch
- Add deployment badge to README
