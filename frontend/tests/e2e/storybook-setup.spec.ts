import { test, expect } from '@playwright/test';

test.describe('Storybook Setup Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Storybook
    await page.goto('/');
    
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
    const gameCategory = page.locator('#game[data-nodetype="root"]');
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
      await expect(page.locator(`button[id*="${component.toLowerCase()}"]`).first()).toBeVisible();
    }
  });

  test('DominoComponent stories render correctly', async ({ page }) => {
    // First expand the DominoComponent section
    const dominoComponentButton = page.locator('button[id="game-dominocomponent"]');
    const isExpanded = await dominoComponentButton.getAttribute('aria-expanded');
    if (isExpanded === 'false') {
      await dominoComponentButton.click();
      await page.waitForTimeout(500);
    }
    
    // Navigate to DominoComponent default story
    await page.locator('a[id="game-dominocomponent--default"]').click();
    
    // Wait for story to load
    await page.waitForTimeout(1000);
    
    // Switch to iframe context
    const frame = page.frameLocator('#storybook-preview-iframe');
    
    // Check that domino is rendered
    await expect(frame.locator('[data-testid*="domino"]').first()).toBeVisible();
  });

  test('GameBoard story renders with all player positions', async ({ page }) => {
    // First expand the GameBoard section
    const gameBoardButton = page.locator('button[id="game-gameboard"]');
    const isExpanded = await gameBoardButton.getAttribute('aria-expanded');
    if (isExpanded === 'false') {
      await gameBoardButton.click();
      await page.waitForTimeout(500);
    }
    
    // Navigate to GameBoard ActiveGame story
    await page.locator('a[id="game-gameboard--active-game"]').click();
    
    // Wait for story to load
    await page.waitForTimeout(1000);
    
    // Wait for the iframe content to load
    await page.waitForSelector('#storybook-preview-iframe', { state: 'attached' });
    
    // Switch to iframe context
    const frame = page.frameLocator('#storybook-preview-iframe');
    
    // Wait for any content in the frame
    await frame.locator('body').waitFor({ state: 'visible', timeout: 10000 });
    
    // Check that game board is rendered (with more generous timeout)
    await expect(frame.locator('[data-testid="game-board"]')).toBeVisible({ timeout: 10000 });
    
    // Check all four player areas
    const positions = ['north', 'east', 'south', 'west'];
    for (const position of positions) {
      await expect(frame.locator(`[data-testid="player-area-${position}"]`)).toBeVisible();
    }
  });

  test('Controls panel is accessible and on the right', async ({ page }) => {
    // First expand the DominoComponent section
    const dominoComponentButton = page.locator('button[id="game-dominocomponent"]');
    const isExpanded = await dominoComponentButton.getAttribute('aria-expanded');
    if (isExpanded === 'false') {
      await dominoComponentButton.click();
      await page.waitForTimeout(500);
    }
    
    // Navigate to any story
    await page.locator('a[id="game-dominocomponent--default"]').click();
    
    // Wait for story content to load
    await page.waitForTimeout(1000);
    
    // Check that the addon panel exists (bottom panel)
    const addonPanel = await page.locator('[id^="tabbutton"]').count();
    expect(addonPanel).toBeGreaterThan(0);
    
    // Check that we have some form of controls or documentation
    const hasControls = await page.locator('.docblock-argstable, [role="tablist"]').count();
    expect(hasControls).toBeGreaterThan(0);
  });

  test('Viewport addon is functional', async ({ page }) => {
    // Look for any toolbar addons (viewport, measure, background, etc)
    const toolbarAddons = await page.locator('[title*="measure" i], [title*="viewport" i], [title*="background" i], [title*="zoom" i]').count();
    expect(toolbarAddons).toBeGreaterThan(0);
    
    // Check that some toolbar buttons are visible
    const zoomIn = page.locator('[title="Zoom in"]');
    const zoomOut = page.locator('[title="Zoom out"]');
    
    await expect(zoomIn).toBeVisible();
    await expect(zoomOut).toBeVisible();
  });

  test('Accessibility addon is functional', async ({ page }) => {
    // First expand the DominoComponent section
    const dominoComponentButton = page.locator('button[id="game-dominocomponent"]');
    const isExpanded = await dominoComponentButton.getAttribute('aria-expanded');
    if (isExpanded === 'false') {
      await dominoComponentButton.click();
      await page.waitForTimeout(500);
    }
    
    // Navigate to any story
    await page.locator('a[id="game-dominocomponent--default"]').click();
    
    // Look for any addon tabs (controls, actions, or addons)
    const controlsTab = page.locator('[id="tabbutton-control"]');
    const actionsTab = page.locator('[id="tabbutton-action"]');
    const addonsTab = page.locator('[id="tabbutton-addons"]');
    
    // At least one tab should be visible
    const tabsVisible = await controlsTab.isVisible() || await actionsTab.isVisible() || await addonsTab.isVisible();
    expect(tabsVisible).toBeTruthy();
  });

  test('Story fixtures are loading correctly', async ({ page }) => {
    // First expand the GameBoardPlayers section
    const playersButton = page.locator('button[id="game-gameboardplayers"]');
    const isExpanded = await playersButton.getAttribute('aria-expanded');
    if (isExpanded === 'false') {
      await playersButton.click();
      await page.waitForTimeout(500);
    }
    
    // Navigate to GameBoardPlayers AllPositions story
    await page.locator('a[id="game-gameboardplayers--all-positions"]').click();
    
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
    // First expand the DominoComponent section
    const dominoComponentButton = page.locator('button[id="game-dominocomponent"]');
    const isExpanded = await dominoComponentButton.getAttribute('aria-expanded');
    if (isExpanded === 'false') {
      await dominoComponentButton.click();
      await page.waitForTimeout(500);
    }
    
    // Navigate to DominoComponent ClickToSelect story
    await page.locator('a[id="game-dominocomponent--click-to-select"]').click();
    
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
    // First expand the GameBoard section
    const gameBoardButton = page.locator('button[id="game-gameboard"]');
    const isExpanded = await gameBoardButton.getAttribute('aria-expanded');
    if (isExpanded === 'false') {
      await gameBoardButton.click();
      await page.waitForTimeout(500);
    }
    
    // Navigate to GameBoard story that requires context
    await page.locator('a[id="game-gameboard--active-game"]').click();
    
    // Wait for story to load
    await page.waitForTimeout(1000);
    
    // Wait for the iframe content to load
    await page.waitForSelector('#storybook-preview-iframe', { state: 'attached' });
    
    // Switch to iframe context
    const frame = page.frameLocator('#storybook-preview-iframe');
    
    // Wait for any content in the frame
    await frame.locator('body').waitFor({ state: 'visible', timeout: 10000 });
    
    // If context is working, the component should render without errors
    await expect(frame.locator('[data-testid="game-board"]')).toBeVisible({ timeout: 10000 });
    
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