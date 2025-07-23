import { test, expect } from '@playwright/test';

const STORYBOOK_URL = 'http://localhost:6006';

test.describe('Storybook Setup Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Storybook
    await page.goto(STORYBOOK_URL);
    
    // Wait for Storybook to load
    await page.waitForSelector('.sidebar-container', { timeout: 10000 });
  });

  test('Storybook loads successfully', async ({ page }) => {
    // Check that Storybook UI is visible
    await expect(page.locator('.sidebar-header')).toBeVisible();
    await expect(page.locator('#storybook-preview-iframe')).toBeVisible();
  });

  test('All component stories are available', async ({ page }) => {
    // Check for our main component categories
    const gameCategory = page.locator('[id*="game"]');
    await expect(gameCategory).toBeVisible();
    
    // Expand the Game category if needed
    const isExpanded = await gameCategory.getAttribute('aria-expanded');
    if (isExpanded === 'false') {
      await gameCategory.click();
    }
    
    // Verify our key components are listed
    const expectedComponents = [
      'DominoComponent',
      'DominoHand',
      'GameBoard',
      'GameBoardPlayers',
      'GameBoardCenter'
    ];
    
    for (const component of expectedComponents) {
      await expect(page.locator(`[id*="${component.toLowerCase()}"]`)).toBeVisible();
    }
  });

  test('DominoComponent stories render correctly', async ({ page }) => {
    // Navigate to DominoComponent stories
    await page.locator('[id*="dominocomponent--default"]').click();
    
    // Wait for story to load
    await page.waitForTimeout(1000);
    
    // Switch to iframe context
    const frame = page.frameLocator('#storybook-preview-iframe');
    
    // Check that domino is rendered
    await expect(frame.locator('[data-testid*="domino"]').first()).toBeVisible();
  });

  test('GameBoard story renders with all player positions', async ({ page }) => {
    // Navigate to GameBoard ActiveGame story
    await page.locator('[id*="gameboard--activegame"]').click();
    
    // Wait for story to load
    await page.waitForTimeout(1000);
    
    // Switch to iframe context
    const frame = page.frameLocator('#storybook-preview-iframe');
    
    // Check that game board is rendered
    await expect(frame.locator('[data-testid="game-board"]')).toBeVisible();
    
    // Check all four player areas
    const positions = ['north', 'east', 'south', 'west'];
    for (const position of positions) {
      await expect(frame.locator(`[data-testid="player-area-${position}"]`)).toBeVisible();
    }
  });

  test('Controls panel is accessible and on the right', async ({ page }) => {
    // Navigate to any story
    await page.locator('[id*="dominocomponent--default"]').click();
    
    // Check that controls panel exists
    const controlsPanel = page.locator('[id="tabbutton-control"]');
    await expect(controlsPanel).toBeVisible();
    
    // Click on controls tab
    await controlsPanel.click();
    
    // Verify controls are shown
    await expect(page.locator('.docblock-argstable')).toBeVisible();
  });

  test('Viewport addon is functional', async ({ page }) => {
    // Look for viewport selector in toolbar
    const viewportButton = page.locator('[title*="viewport"]');
    await expect(viewportButton).toBeVisible();
    
    // Click viewport button
    await viewportButton.click();
    
    // Check that viewport options appear
    await expect(page.locator('text=Mobile')).toBeVisible();
    await expect(page.locator('text=Tablet')).toBeVisible();
  });

  test('Accessibility addon is functional', async ({ page }) => {
    // Navigate to any story
    await page.locator('[id*="dominocomponent--default"]').click();
    
    // Look for accessibility tab
    const a11yTab = page.locator('[id="tabbutton-accessibility"]');
    await expect(a11yTab).toBeVisible();
    
    // Click accessibility tab
    await a11yTab.click();
    
    // Verify accessibility panel is shown
    await expect(page.locator('[role="region"][aria-label*="accessibility"]')).toBeVisible();
  });

  test('Story fixtures are loading correctly', async ({ page }) => {
    // Navigate to GameBoardPlayers AllPositions story
    await page.locator('[id*="gameboardplayers--allpositions"]').click();
    
    // Wait for story to load
    await page.waitForTimeout(1000);
    
    // Switch to iframe context
    const frame = page.frameLocator('#storybook-preview-iframe');
    
    // Check that all four positions are rendered with player names
    const playerNames = ['Alice', 'Bob', 'Charlie', 'Diana'];
    for (const name of playerNames) {
      await expect(frame.locator(`text=${name}`)).toBeVisible();
    }
  });

  test('Interactive stories work correctly', async ({ page }) => {
    // Navigate to DominoComponent ClickToSelect story
    await page.locator('[id*="dominocomponent--clicktoselect"]').click();
    
    // Wait for story to load
    await page.waitForTimeout(1000);
    
    // Switch to iframe context
    const frame = page.frameLocator('#storybook-preview-iframe');
    
    // Check initial state
    await expect(frame.locator('text=Click the domino to select it')).toBeVisible();
    
    // Click the domino
    const domino = frame.locator('[data-testid*="domino"]').first();
    await domino.click();
    
    // Check that state changed
    await expect(frame.locator('text=Selected!')).toBeVisible();
  });

  test('Context decorators are working', async ({ page }) => {
    // Navigate to GameBoard story that requires context
    await page.locator('[id*="gameboard--activegame"]').click();
    
    // Wait for story to load
    await page.waitForTimeout(1000);
    
    // Switch to iframe context
    const frame = page.frameLocator('#storybook-preview-iframe');
    
    // If context is working, the component should render without errors
    await expect(frame.locator('[data-testid="game-board"]')).toBeVisible();
    
    // Should not show error messages about missing context
    await expect(frame.locator('text=useContext must be used within')).not.toBeVisible();
  });
});

// Test to ensure Storybook build works
test.describe('Storybook Build', () => {
  test.skip('Storybook builds without errors', async () => {
    // This test would be run in CI to verify build works
    // npm run build-storybook should complete without errors
  });
});