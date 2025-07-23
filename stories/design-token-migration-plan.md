# Design Token Migration Plan

## Step 1: Create Master Token File
Create `frontend/src/styles/design-tokens.css` with all design values:
- Colors (from existing + extracted from components)
- Spacing (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px)
- Sizes (domino dimensions, board sizes, etc.)
- Typography (font sizes, weights, line heights)
- Shadows, borders, radii, transitions

## Step 2: Import Token File
Add to `frontend/src/index.css`:
```css
@import './styles/design-tokens.css';
```

## Step 3: Migration Order
1. Small components first: Pip, Button, Badge
2. Medium components: DominoComponent, PlayerInfo, ScoreDisplay
3. Large components: GameBoard, BiddingSection, Lobby
4. Layout components: App, GameBoardSection

## Step 4: Migration Process Per Component
1. Open `[Component].module.css`
2. Replace all hardcoded values with var(--token-name)
3. Test component visually
4. Commit

## Step 5: Cleanup
After all components migrated:
- Remove duplicate token definitions
- Organize tokens by category
- Document token naming conventions