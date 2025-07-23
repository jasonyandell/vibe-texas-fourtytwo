# Storybook Implementation Plan for Texas 42

## Overview

This plan outlines the integration of Storybook into the Texas 42 project to enhance component development, testing, and documentation. Storybook complements the existing demo system by providing a dedicated development environment for component isolation and testing.

## Current Status ✅

### Completed (Phase 1)
- ✅ Storybook 9.0.18 installed with Vite builder
- ✅ TypeScript and React configuration working
- ✅ CSS modules and global styles configured
- ✅ Controls panel moved to right side for better layout
- ✅ Path aliases working (@/ imports)
- ✅ Two component stories created:
  - `DominoComponent.stories.tsx` - Complete with all variants
  - `DominoHand.stories.tsx` - Interactive hand management

### What's Working
- All domino pips render correctly
- CSS variables and styling load properly
- Interactive controls for all component props
- Count domino highlighting (orange borders)
- Point value badges (green for 5, red for 10)
- Component interactivity (click to select, etc.)

## Immediate Next Steps (This Week)

### 1. Complete Core Game Components
Create stories for the remaining critical game pieces:

#### GameBoard Component
```typescript
// GameBoard.stories.tsx
- Default (empty board)
- ActiveGame (with dominoes in play)
- TrickInProgress (showing current trick)
- GameComplete (final state)
```

#### PlayerPosition Component  
```typescript
// PlayerPosition.stories.tsx
- AllPositions (N, S, E, W display)
- ActivePlayer (highlighted)
- WithDominoCount (showing remaining dominoes)
- Disconnected (grayed out state)
```

#### Trick Component
```typescript
// Trick.stories.tsx
- EmptyTrick
- PartialTrick (1-3 dominoes played)
- CompleteTrick (all 4 dominoes)
- WinningDomino (highlighted)
```

### 2. Add Context Decorators
Set up global decorators in `.storybook/preview.tsx`:
```typescript
// Add game state context for components that need it
export const decorators = [
  (Story) => (
    <MemoryRouter>
      <GameStateProvider mockState={defaultGameState}>
        <Story />
      </GameStateProvider>
    </MemoryRouter>
  ),
];
```

### 3. Create Shared Fixtures
```
frontend/src/stories/fixtures/
├── dominoes.ts      # Standard domino sets
├── gameStates.ts    # Various game states  
├── players.ts       # Player configurations
└── tricks.ts        # Trick scenarios
```

### 4. Add Essential Addons
```bash
npm install --save-dev @storybook/addon-a11y @storybook/addon-viewport
```

Update `.storybook/main.ts`:
```typescript
addons: [
  '@storybook/addon-docs',
  '@storybook/addon-viewport',  // Mobile testing
  '@storybook/addon-a11y',      // Accessibility
]
```

## Next Phase (Next 2 Weeks)

### Phase 2: Game Flow Components

#### BiddingPanel
- Bid progression (30-42)
- Trump selection interface
- Pass/bid states
- Timer integration

#### ScoreBoard  
- Various score states
- Round winner highlights
- Game winner celebration
- Point breakdown display

#### GameCard (Lobby)
- Waiting for players
- Game in progress
- Completed game
- Join button states

### Phase 3: Testing Integration

1. **Import Stories in Tests**
```typescript
import { Default as DefaultDomino } from './DominoComponent.stories';
import { render } from '@testing-library/react';

test('renders default domino', () => {
  render(<DefaultDomino {...DefaultDomino.args} />);
});
```

2. **Play Functions**
```typescript
export const ClickToSelect: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const domino = canvas.getByTestId('domino-6-4');
    await userEvent.click(domino);
    await expect(domino).toHaveClass('selected');
  },
};
```

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
│   ├── main.ts          ✅ Configured
│   ├── preview.ts       ✅ CSS imports added
│   └── manager.ts       ✅ Right panel layout
├── src/
│   ├── components/
│   │   ├── DominoComponent.stories.tsx    ✅
│   │   ├── DominoHand.stories.tsx         ✅
│   │   ├── GameBoard.stories.tsx          📝 Next
│   │   ├── PlayerPosition.stories.tsx     📝 Next
│   │   └── Trick.stories.tsx              📝 Next
│   └── stories/
│       └── fixtures/    📝 Create shared test data
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

**Next Action**: Create `GameBoard.stories.tsx` following the pattern established in DominoComponent and DominoHand stories.