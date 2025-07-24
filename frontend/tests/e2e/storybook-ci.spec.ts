import { test, expect } from '@playwright/test';

test.describe('Storybook CI Tests', () => {

  test('Storybook server is accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check that Storybook loaded
    await expect(page).toHaveTitle(/Storybook/);
    await expect(page.locator('.sidebar-container')).toBeVisible();
  });

  test('All new stories are accessible', async ({ page }) => {
    await page.goto('/');
    
    // Wait for sidebar to load
    await page.waitForSelector('.sidebar-container');
    
    // Test newly created stories
    const newStories = [
      { component: 'GameBoard', story: 'Default' },
      { component: 'GameBoard', story: 'Active Game' },
      { component: 'GameBoard', story: 'Trick In Progress' },
      { component: 'GameBoardPlayers', story: 'All Positions' },
      { component: 'GameBoardPlayers', story: 'Active Player' },
      { component: 'GameBoardCenter', story: 'Empty Trick' },
      { component: 'GameBoardCenter', story: 'Partial Trick' },
      { component: 'GameBoardCenter', story: 'Complete Trick' },
    ];
    
    for (const { component, story } of newStories) {
      // First expand the component section
      const componentId = `game-${component.toLowerCase()}`;
      const componentButton = page.locator(`button[id="${componentId}"]`);
      const isExpanded = await componentButton.getAttribute('aria-expanded');
      if (isExpanded === 'false') {
        await componentButton.click();
        await page.waitForTimeout(300);
      }
      
      // Then click the story link
      const storyId = `game-${component.toLowerCase()}--${story.toLowerCase().replace(/\s+/g, '-')}`;
      const storyLink = page.locator(`a[id="${storyId}"]`);
      
      // Navigate to story
      await storyLink.click();
      await page.waitForTimeout(500);
      
      // Verify story loaded in iframe
      const frame = page.frameLocator('#storybook-preview-iframe');
      
      // Each story should render without errors
      const errorElement = frame.locator('text=Error');
      const hasError = await errorElement.count() > 0;
      
      expect(hasError).toBe(false);
    }
  });

  test('Context decorators prevent errors', async ({ page }) => {
    await page.goto('/');
    
    // First expand the GameBoard section
    const gameBoardButton = page.locator('button[id="game-gameboard"]');
    const isExpanded = await gameBoardButton.getAttribute('aria-expanded');
    if (isExpanded === 'false') {
      await gameBoardButton.click();
      await page.waitForTimeout(500);
    }
    
    // Navigate to a story that uses GameStateContext
    await page.locator('a[id="game-gameboard--active-game"]').click();
    await page.waitForTimeout(1000);
    
    // Check iframe for context errors
    const frame = page.frameLocator('#storybook-preview-iframe');
    
    // Should not have context errors
    const contextError = frame.locator('text=Cannot read properties of undefined');
    const useContextError = frame.locator('text=useContext must be used within');
    
    await expect(contextError).not.toBeVisible();
    await expect(useContextError).not.toBeVisible();
  });

  test('Addons are properly configured', async ({ page }) => {
    await page.goto('/');
    
    // Check for toolbar addons - viewport or measure
    const hasToolbarAddons = await page.locator('[title*="measure" i], [title*="viewport" i], [title*="background" i]').count();
    expect(hasToolbarAddons).toBeGreaterThan(0);
    
    // First expand the DominoComponent section
    const dominoComponentButton = page.locator('button[id="game-dominocomponent"]');
    const isExpandedDomino = await dominoComponentButton.getAttribute('aria-expanded');
    if (isExpandedDomino === 'false') {
      await dominoComponentButton.click();
      await page.waitForTimeout(500);
    }
    
    // Check a11y addon tab
    await page.locator('a[id="game-dominocomponent--default"]').click();
    await page.waitForTimeout(500);
    
    const a11yTab = page.locator('[id="tabbutton-accessibility"]');
    await expect(a11yTab).toBeVisible();
  });

  test('Fixtures are properly imported', async ({ page }) => {
    await page.goto('/');
    
    // First expand the GameBoardPlayers section
    const playersButton = page.locator('button[id="game-gameboardplayers"]');
    const isExpanded = await playersButton.getAttribute('aria-expanded');
    if (isExpanded === 'false') {
      await playersButton.click();
      await page.waitForTimeout(500);
    }
    
    // Navigate to a story that uses fixtures
    await page.locator('a[id="game-gameboardplayers--all-positions"]').click();
    await page.waitForTimeout(1000);
    
    const frame = page.frameLocator('#storybook-preview-iframe');
    
    // Check that fixture data is rendered (player names from fixtures)
    await expect(frame.locator('text=Alice')).toBeVisible();
    await expect(frame.locator('text=Bob')).toBeVisible();
    await expect(frame.locator('text=Charlie')).toBeVisible();
    await expect(frame.locator('text=Diana')).toBeVisible();
  });
});