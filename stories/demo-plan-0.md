# Demo Plan 0: Texas 42 Game Objects Showcase

## Overview

Create a minimal, simple demo page that showcases all the Texas 42 game objects in an elegant, clickable format. Each object should be beautifully rendered with titles and nice layout, but functionality is purely visual - they do nothing except look pretty.

## Objective

Build a single demo page that serves as a visual catalog of all game components, allowing users to see and interact with (click) each game object to appreciate the visual design and understand the game elements.

## Game Objects to Showcase

Based on the existing codebase analysis, we have these core game objects to display:

### 1. Dominoes Collection
- **Complete Double-6 Set**: All 28 dominoes (0-0 through 6-6)
- **Point Value Dominoes**: Highlight the 7 scoring dominoes (5-0, 4-1, 3-2, 6-4, 5-5)
- **Special Dominoes**: Show doubles separately (0-0, 1-1, 2-2, 3-3, 4-4, 5-5, 6-6)
- **Interactive Features**: Click to flip, rotate, highlight point values

### 2. Player Positions & Partnerships
- **Baseball Diamond Layout**: North, East, South, West positions
- **Partnership Visualization**: North-South vs East-West teams with color coding
- **Player Cards**: Show player info cards with names, positions, dealer status
- **Hand Layouts**: 7-domino hands in 2-row formation (4 top, 3 bottom)

### 3. Bidding System Components
- **Trump Suits Display**: Visual representation of all 7 trump suits (blanks through sixes)
- **Bid Range Selector**: Interactive 30-42 bid amount selector
- **Bidding History Panel**: Sample bidding sequence with pass/bid actions
- **Current Bid Display**: Highlighted current winning bid with trump suit

### 4. Game Board Elements
- **Center Play Area**: "Pitcher's mound" for current trick display
- **Trick Stacks**: North-South and East-West captured tricks visualization
- **Score Display**: Partnership scores and game scores
- **Game Phase Indicators**: Bidding, Playing, Scoring, Finished states

### 5. Game Flow States
- **Lobby View**: Game cards showing different statuses (waiting, playing, finished)
- **Game Creation**: Modal for creating new games
- **Player Management**: Join/leave/ready system visualization
- **Spectator Mode**: View-only game state display

## Demo Page Structure

### Layout Design
```
┌─────────────────────────────────────────────────────────────┐
│                    Texas 42 Demo Showcase                   │
├─────────────────────────────────────────────────────────────┤
│  Navigation: [Dominoes] [Players] [Bidding] [Board] [Flow]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Game Object   │  │   Game Object   │  │ Game Object │ │
│  │     Section     │  │     Section     │  │   Section   │ │
│  │                 │  │                 │  │             │ │
│  │  [Interactive]  │  │  [Interactive]  │  │[Interactive]│ │
│  │    Elements     │  │    Elements     │  │  Elements   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│              Object Details & Information Panel             │
└─────────────────────────────────────────────────────────────┘
```

### Section Breakdown

#### 1. Dominoes Showcase Section
- **Title**: "Double-6 Domino Set"
- **Complete Set Grid**: All 28 dominoes in organized layout
- **Point Value Highlights**: 7 scoring dominoes with point badges
- **Interactive Features**: 
  - Click to highlight point values
  - Hover to show domino details
  - Toggle between face-up/face-down
  - Rotate orientation (horizontal/vertical)

#### 2. Players & Partnerships Section  
- **Title**: "Player Positions & Partnerships"
- **Baseball Diamond**: Visual layout with 4 player positions
- **Partnership Colors**: North-South (blue) vs East-West (red)
- **Sample Players**: Mock player data with names and avatars
- **Interactive Features**:
  - Click positions to highlight partnerships
  - Show/hide player hands
  - Toggle dealer indicator
  - Demonstrate ready states

#### 3. Bidding System Section
- **Title**: "Bidding & Trump System"
- **Trump Suits Display**: Visual cards for each trump suit
- **Bid Controls**: Interactive bid amount and trump selection
- **Sample Bidding History**: Example bidding sequence
- **Interactive Features**:
  - Click trump suits to see domino highlighting
  - Adjust bid amounts with slider/input
  - Show bid validation states
  - Demonstrate pass vs bid actions

#### 4. Game Board Section
- **Title**: "Game Board & Trick Play"
- **Center Play Area**: Current trick display with 4 dominoes
- **Trick Stacks**: Sample captured tricks for both teams
- **Score Displays**: Partnership and game scores
- **Interactive Features**:
  - Click to cycle through different trick examples
  - Show/hide trick details
  - Toggle score displays
  - Demonstrate game phase transitions

#### 5. Game Flow Section
- **Title**: "Lobby & Game Management"
- **Lobby Cards**: Sample games in different states
- **Player Management**: Join/leave/ready system
- **Game Creation**: Modal and form elements
- **Interactive Features**:
  - Click game cards to show details
  - Demonstrate player slot management
  - Show spectator mode toggle
  - Game status transitions

## Technical Implementation

### Route Structure
- **Main Route**: `/demo` - Demo showcase page
- **Sub-routes**: `/demo/:section` - Focus on specific section
- **Modal Routes**: `/demo/details/:objectType/:objectId` - Object detail views

### Component Architecture
```typescript
DemoShowcase
├── DemoNavigation
├── DemoSection (reusable)
│   ├── SectionHeader
│   ├── ObjectGrid
│   │   └── InteractiveObject (clickable game objects)
│   └── SectionControls
└── ObjectDetailPanel (modal/sidebar)
```

### State Management
- **Demo State**: Current section, selected objects, interaction modes
- **Object State**: Individual object states (selected, highlighted, etc.)
- **UI State**: Panel visibility, modal states, animation states

### Styling Approach
- **Clean & Minimal**: Focus on object beauty, not complex interactions
- **Consistent Layout**: Grid-based responsive design
- **Visual Hierarchy**: Clear titles, organized sections, intuitive navigation
- **Interactive Feedback**: Hover states, click animations, selection highlights

## Success Criteria

### Visual Excellence
- [ ] All game objects render beautifully with authentic Texas 42 styling
- [ ] Clean, organized layout that's easy to navigate
- [ ] Consistent visual design language across all sections
- [ ] Responsive design that works on desktop and mobile

### Interactive Experience
- [ ] Every game object is clickable with visual feedback
- [ ] Smooth transitions and animations enhance the experience
- [ ] Clear titles and descriptions for each object type
- [ ] Intuitive navigation between different object categories

### Educational Value
- [ ] Users can understand Texas 42 game components by exploring
- [ ] Object relationships are visually clear (partnerships, trump suits, etc.)
- [ ] Game flow and states are demonstrated effectively
- [ ] Authentic game rules and mechanics are represented accurately

### Technical Quality
- [ ] Fast loading and smooth performance
- [ ] Clean, maintainable code following project standards
- [ ] Proper accessibility features (ARIA labels, keyboard navigation)
- [ ] Mobile-friendly responsive design

## Implementation Notes

### Existing Assets to Leverage
- **DominoComponent**: Already has beautiful visual rendering
- **GameBoard**: Baseball diamond layout is implemented
- **BiddingPanel**: Trump suit selection and bid controls exist
- **Lobby**: Game card layouts and player management UI
- **Types**: Complete TypeScript definitions for all game objects

### New Components Needed
- **DemoShowcase**: Main container component
- **DemoNavigation**: Section navigation tabs/menu
- **ObjectGrid**: Responsive grid layout for game objects
- **InteractiveObject**: Wrapper for clickable game objects
- **ObjectDetailPanel**: Modal/sidebar for object details

### Data Requirements
- **Sample Game Data**: Mock games, players, and game states
- **Demo Configurations**: Settings for each showcase section
- **Object Metadata**: Titles, descriptions, and interaction hints

This demo will serve as both a beautiful showcase of the Texas 42 game implementation and a useful reference for understanding the game components and their relationships.

## Playwright Test Strategy

Following the project's TDD approach, comprehensive end-to-end tests will ensure the demo showcase works perfectly across all browsers and devices.

### Test Structure

```
frontend/tests/demo/
├── demo-showcase.spec.ts           # Main demo page tests
├── demo-dominoes.spec.ts          # Dominoes section tests
├── demo-players.spec.ts           # Players & partnerships tests
├── demo-bidding.spec.ts           # Bidding system tests
├── demo-board.spec.ts             # Game board tests
├── demo-flow.spec.ts              # Game flow tests
├── demo-navigation.spec.ts        # Navigation & routing tests
├── demo-accessibility.spec.ts     # A11y compliance tests
└── demo-mobile.spec.ts            # Mobile responsiveness tests
```

### Core Test Categories

#### 1. Demo Showcase Main Page Tests (`demo-showcase.spec.ts`)

```typescript
test.describe('Demo Showcase Page', () => {
  test('loads demo page successfully', async ({ page }) => {
    await page.goto('/demo');
    await expect(page.locator('[data-testid="demo-showcase"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Texas 42 Demo Showcase');
  });

  test('displays all main sections', async ({ page }) => {
    await page.goto('/demo');

    // Verify all 5 main sections are present
    await expect(page.locator('[data-testid="dominoes-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="players-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="bidding-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="board-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="flow-section"]')).toBeVisible();
  });

  test('navigation between sections works', async ({ page }) => {
    await page.goto('/demo');

    // Test section navigation
    await page.click('[data-testid="nav-dominoes"]');
    await expect(page.locator('[data-testid="dominoes-section"]')).toBeInViewport();

    await page.click('[data-testid="nav-players"]');
    await expect(page.locator('[data-testid="players-section"]')).toBeInViewport();
  });
});
```

#### 2. Dominoes Section Tests (`demo-dominoes.spec.ts`)

```typescript
test.describe('Dominoes Showcase Section', () => {
  test('displays complete double-6 domino set', async ({ page }) => {
    await page.goto('/demo');

    // Should show all 28 dominoes
    const dominoes = page.locator('[data-testid^="domino-"]');
    await expect(dominoes).toHaveCount(28);

    // Verify specific dominoes exist
    await expect(page.locator('[data-testid="domino-0-0"]')).toBeVisible();
    await expect(page.locator('[data-testid="domino-6-6"]')).toBeVisible();
    await expect(page.locator('[data-testid="domino-5-0"]')).toBeVisible(); // 5-point domino
  });

  test('highlights point value dominoes', async ({ page }) => {
    await page.goto('/demo');

    // Click point value toggle
    await page.click('[data-testid="show-point-values"]');

    // Verify 7 scoring dominoes are highlighted
    const pointDominoes = page.locator('.domino.count-domino');
    await expect(pointDominoes).toHaveCount(7);

    // Check specific point values
    await expect(page.locator('[data-testid="domino-5-0"] .point-value')).toContainText('5');
    await expect(page.locator('[data-testid="domino-5-5"] .point-value')).toContainText('10');
  });

  test('domino click interactions work', async ({ page }) => {
    await page.goto('/demo');

    // Click a domino to select it
    await page.click('[data-testid="domino-3-2"]');
    await expect(page.locator('[data-testid="domino-3-2"]')).toHaveClass(/selected/);

    // Click again to deselect
    await page.click('[data-testid="domino-3-2"]');
    await expect(page.locator('[data-testid="domino-3-2"]')).not.toHaveClass(/selected/);
  });

  test('domino orientation toggle works', async ({ page }) => {
    await page.goto('/demo');

    // Toggle orientation
    await page.click('[data-testid="toggle-orientation"]');

    // Verify dominoes changed orientation
    const dominoes = page.locator('[data-testid^="domino-"]');
    await expect(dominoes.first()).toHaveClass(/vertical/);
  });
});
```

#### 3. Players & Partnerships Tests (`demo-players.spec.ts`)

```typescript
test.describe('Players & Partnerships Section', () => {
  test('displays baseball diamond layout', async ({ page }) => {
    await page.goto('/demo');

    // Verify all 4 player positions
    await expect(page.locator('[data-testid="player-area-north"]')).toBeVisible();
    await expect(page.locator('[data-testid="player-area-east"]')).toBeVisible();
    await expect(page.locator('[data-testid="player-area-south"]')).toBeVisible();
    await expect(page.locator('[data-testid="player-area-west"]')).toBeVisible();
  });

  test('partnership highlighting works', async ({ page }) => {
    await page.goto('/demo');

    // Click North player to highlight North-South partnership
    await page.click('[data-testid="player-area-north"]');

    await expect(page.locator('[data-testid="player-area-north"]')).toHaveClass(/partnership-highlighted/);
    await expect(page.locator('[data-testid="player-area-south"]')).toHaveClass(/partnership-highlighted/);
    await expect(page.locator('[data-testid="player-area-east"]')).not.toHaveClass(/partnership-highlighted/);
  });

  test('player hand visibility toggle works', async ({ page }) => {
    await page.goto('/demo');

    // Toggle hand visibility
    await page.click('[data-testid="toggle-hands"]');

    // Verify hands are visible
    await expect(page.locator('[data-testid="player-north"] .domino-hand')).toBeVisible();

    // Toggle again to hide
    await page.click('[data-testid="toggle-hands"]');
    await expect(page.locator('[data-testid="player-north"] .domino-hand .domino')).toHaveClass(/face-down/);
  });

  test('dealer indicator displays correctly', async ({ page }) => {
    await page.goto('/demo');

    // Verify dealer badge is visible
    await expect(page.locator('[data-testid="dealer-badge"]')).toBeVisible();
    await expect(page.locator('[data-testid="dealer-badge"]')).toContainText('Dealer');
  });
});
```

#### 4. Bidding System Tests (`demo-bidding.spec.ts`)

```typescript
test.describe('Bidding System Section', () => {
  test('displays all trump suits', async ({ page }) => {
    await page.goto('/demo');

    // Verify all 7 trump suits are shown
    const trumpSuits = ['blanks', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];

    for (const suit of trumpSuits) {
      await expect(page.locator(`[data-testid="trump-suit-${suit}"]`)).toBeVisible();
    }
  });

  test('trump suit selection highlights dominoes', async ({ page }) => {
    await page.goto('/demo');

    // Click on "ones" trump suit
    await page.click('[data-testid="trump-suit-ones"]');

    // Verify dominoes with 1s are highlighted as trump
    await expect(page.locator('[data-testid="domino-1-1"]')).toHaveClass(/trump-domino/);
    await expect(page.locator('[data-testid="domino-1-0"]')).toHaveClass(/trump-domino/);
    await expect(page.locator('[data-testid="domino-6-1"]')).toHaveClass(/trump-domino/);
  });

  test('bid amount controls work', async ({ page }) => {
    await page.goto('/demo');

    // Test bid slider
    await page.fill('[data-testid="bid-amount-input"]', '35');
    await expect(page.locator('[data-testid="bid-display"]')).toContainText('35');

    // Test bid validation
    await page.fill('[data-testid="bid-amount-input"]', '25'); // Invalid (too low)
    await expect(page.locator('[data-testid="bid-error"]')).toContainText('Minimum bid is 30');
  });

  test('bidding history displays correctly', async ({ page }) => {
    await page.goto('/demo');

    // Verify sample bidding history
    await expect(page.locator('[data-testid="bid-history"]')).toBeVisible();
    await expect(page.locator('[data-testid="bid-history"] .bid-entry')).toHaveCount(4); // Sample bids

    // Check bid entry details
    await expect(page.locator('[data-testid="bid-entry-0"]')).toContainText('30 - Blanks');
    await expect(page.locator('[data-testid="bid-entry-1"]')).toContainText('Pass');
  });
});
```

#### 5. Game Board Tests (`demo-board.spec.ts`)

```typescript
test.describe('Game Board Section', () => {
  test('displays center play area', async ({ page }) => {
    await page.goto('/demo');

    await expect(page.locator('[data-testid="center-play-area"]')).toBeVisible();
    await expect(page.locator('[data-testid="current-trick"]')).toBeVisible();
  });

  test('trick cycling works', async ({ page }) => {
    await page.goto('/demo');

    // Click to cycle through different trick examples
    await page.click('[data-testid="cycle-tricks"]');

    // Verify trick changed
    const trickDominoes = page.locator('[data-testid="current-trick"] .domino');
    await expect(trickDominoes).toHaveCount(4);
  });

  test('trick stacks display correctly', async ({ page }) => {
    await page.goto('/demo');

    // Verify both team trick stacks
    await expect(page.locator('[data-testid="trick-stacks-north-south"]')).toBeVisible();
    await expect(page.locator('[data-testid="trick-stacks-east-west"]')).toBeVisible();

    // Check trick counts
    await expect(page.locator('[data-testid="trick-count-ns"]')).toContainText('3');
    await expect(page.locator('[data-testid="trick-count-ew"]')).toContainText('2');
  });

  test('score displays work', async ({ page }) => {
    await page.goto('/demo');

    // Verify score displays
    await expect(page.locator('[data-testid="score-north-south"]')).toBeVisible();
    await expect(page.locator('[data-testid="score-east-west"]')).toBeVisible();

    // Check score values
    await expect(page.locator('[data-testid="score-ns-current"]')).toContainText('15');
    await expect(page.locator('[data-testid="score-ew-current"]')).toContainText('20');
  });
});
```

#### 6. Navigation & Routing Tests (`demo-navigation.spec.ts`)

```typescript
test.describe('Demo Navigation', () => {
  test('section navigation tabs work', async ({ page }) => {
    await page.goto('/demo');

    // Test all navigation tabs
    const sections = ['dominoes', 'players', 'bidding', 'board', 'flow'];

    for (const section of sections) {
      await page.click(`[data-testid="nav-${section}"]`);
      await expect(page.locator(`[data-testid="${section}-section"]`)).toBeInViewport();
      await expect(page.locator(`[data-testid="nav-${section}"]`)).toHaveClass(/active/);
    }
  });

  test('deep linking to sections works', async ({ page }) => {
    await page.goto('/demo/dominoes');
    await expect(page.locator('[data-testid="dominoes-section"]')).toBeInViewport();
    await expect(page.locator('[data-testid="nav-dominoes"]')).toHaveClass(/active/);
  });

  test('object detail modals work', async ({ page }) => {
    await page.goto('/demo');

    // Click domino to open detail modal
    await page.click('[data-testid="domino-5-0"]');
    await expect(page.locator('[data-testid="object-detail-modal"]')).toBeVisible();
    await expect(page.locator('[data-testid="modal-title"]')).toContainText('5-0 Domino');

    // Close modal
    await page.click('[data-testid="close-modal"]');
    await expect(page.locator('[data-testid="object-detail-modal"]')).not.toBeVisible();
  });
});
```

#### 7. Accessibility Tests (`demo-accessibility.spec.ts`)

```typescript
test.describe('Demo Accessibility', () => {
  test('has proper ARIA labels', async ({ page }) => {
    await page.goto('/demo');

    // Check main landmarks
    await expect(page.locator('main')).toHaveAttribute('aria-label', 'Texas 42 Demo Showcase');
    await expect(page.locator('[data-testid="dominoes-section"]')).toHaveAttribute('aria-label', 'Dominoes Collection');

    // Check interactive elements
    await expect(page.locator('[data-testid="domino-0-0"]')).toHaveAttribute('aria-label', 'Domino blank-blank');
    await expect(page.locator('[data-testid="domino-5-0"]')).toHaveAttribute('aria-label', 'Domino 5-blank, 5 points');
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/demo');

    // Tab through navigation
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="nav-dominoes"]')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="nav-players"]')).toBeFocused();

    // Enter to activate
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-testid="players-section"]')).toBeInViewport();
  });

  test('screen reader announcements work', async ({ page }) => {
    await page.goto('/demo');

    // Check live regions for dynamic content
    await expect(page.locator('[aria-live="polite"]')).toBeAttached();

    // Click domino and verify announcement
    await page.click('[data-testid="domino-3-2"]');
    await expect(page.locator('[aria-live="polite"]')).toContainText('Selected 3-2 domino, 5 points');
  });
});
```

#### 8. Mobile Responsiveness Tests (`demo-mobile.spec.ts`)

```typescript
test.describe('Demo Mobile Experience', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('mobile layout works correctly', async ({ page }) => {
    await page.goto('/demo');

    // Verify mobile navigation
    await expect(page.locator('[data-testid="mobile-nav-toggle"]')).toBeVisible();

    // Check responsive grid
    const dominoGrid = page.locator('[data-testid="domino-grid"]');
    await expect(dominoGrid).toHaveCSS('grid-template-columns', /repeat\(4,/); // 4 columns on mobile
  });

  test('touch interactions work', async ({ page }) => {
    await page.goto('/demo');

    // Test touch tap on domino
    await page.tap('[data-testid="domino-1-1"]');
    await expect(page.locator('[data-testid="domino-1-1"]')).toHaveClass(/selected/);

    // Test swipe navigation (if implemented)
    await page.touchscreen.tap(200, 300);
    await page.touchscreen.tap(100, 300);
    // Verify swipe effect
  });
});
```

### Test Data & Fixtures

```typescript
// frontend/tests/demo/fixtures/demo-data.ts
export const mockDemoData = {
  samplePlayers: [
    { id: 'p1', name: 'Alice', position: 'north', isDealer: true },
    { id: 'p2', name: 'Bob', position: 'east', isDealer: false },
    { id: 'p3', name: 'Carol', position: 'south', isDealer: false },
    { id: 'p4', name: 'Dave', position: 'west', isDealer: false }
  ],

  sampleBiddingHistory: [
    { playerId: 'p1', amount: 30, trump: 'blanks' },
    { playerId: 'p2', amount: 0 }, // pass
    { playerId: 'p3', amount: 32, trump: 'ones' },
    { playerId: 'p4', amount: 0 }  // pass
  ],

  sampleTricks: [
    {
      id: 'trick1',
      dominoes: [
        { domino: { high: 6, low: 4 }, playerId: 'p1', position: 'north' },
        { domino: { high: 5, low: 3 }, playerId: 'p2', position: 'east' },
        { domino: { high: 4, low: 2 }, playerId: 'p3', position: 'south' },
        { domino: { high: 3, low: 1 }, playerId: 'p4', position: 'west' }
      ],
      winner: 'p1'
    }
  ]
};
```

### Test Configuration

```typescript
// playwright.config.ts additions for demo tests
export default defineConfig({
  projects: [
    {
      name: 'demo-tests',
      testDir: './tests/demo',
      use: {
        baseURL: 'http://localhost:4200',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
      }
    }
  ]
});
```

### Test Execution Strategy

#### TDD Implementation Flow
1. **Write failing tests first** for each demo section
2. **Implement minimal demo components** to make tests pass
3. **Refactor and enhance** while keeping tests green
4. **Add visual polish** with continued test coverage

#### Continuous Testing
- **Watch mode**: `npm run test:demo:watch` during development
- **Full suite**: `npm run test:demo` before commits
- **Cross-browser**: Automated testing on Chrome, Firefox, Safari
- **Mobile testing**: Automated responsive design validation

#### Performance Testing
- **Load time tests**: Ensure demo loads quickly
- **Animation performance**: Verify smooth interactions
- **Memory usage**: Check for memory leaks during interactions

These comprehensive Playwright tests ensure the demo showcase works flawlessly across all browsers and devices, providing confidence in the user experience while following the project's TDD methodology.
