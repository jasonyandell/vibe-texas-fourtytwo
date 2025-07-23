import { test, expect } from '@playwright/test';
import { spawn } from 'child_process';

const STORYBOOK_PORT = 6006;
const STORYBOOK_URL = `http://localhost:${STORYBOOK_PORT}`;

// Helper to start Storybook server
async function startStorybook(): Promise<ReturnType<typeof spawn>> {
  return new Promise((resolve, reject) => {
    const storybookProcess = spawn('npm', ['run', 'storybook'], {
      cwd: process.cwd(),
      stdio: 'pipe',
    });

    let output = '';
    
    storybookProcess.stdout.on('data', (data) => {
      output += String(data);
      console.log(`Storybook: ${data}`);
      
      // Look for the server started message
      if (output.includes(`started on => http://localhost:${STORYBOOK_PORT}`)) {
        resolve(storybookProcess);
      }
    });

    storybookProcess.stderr.on('data', (data) => {
      console.error(`Storybook Error: ${data}`);
    });

    storybookProcess.on('error', (error) => {
      reject(error);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      reject(new Error('Storybook failed to start within 30 seconds'));
    }, 30000);
  });
}

test.describe('Storybook CI Tests', () => {
  let storybookProcess: ReturnType<typeof spawn> | undefined;

  test.beforeAll(async () => {
    // Start Storybook server
    console.log('Starting Storybook server...');
    storybookProcess = await startStorybook();
    console.log('Storybook server started');
    
    // Give it a moment to fully initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  test.afterAll(() => {
    // Kill Storybook process
    if (storybookProcess) {
      console.log('Stopping Storybook server...');
      storybookProcess.kill();
    }
  });

  test('Storybook server is accessible', async ({ page }) => {
    await page.goto(STORYBOOK_URL);
    
    // Check that Storybook loaded
    await expect(page).toHaveTitle(/Storybook/);
    await expect(page.locator('.sidebar-container')).toBeVisible();
  });

  test('All new stories are accessible', async ({ page }) => {
    await page.goto(STORYBOOK_URL);
    
    // Wait for sidebar to load
    await page.waitForSelector('.sidebar-container');
    
    // Test newly created stories
    const newStories = [
      { component: 'GameBoard', story: 'Default' },
      { component: 'GameBoard', story: 'ActiveGame' },
      { component: 'GameBoard', story: 'TrickInProgress' },
      { component: 'GameBoardPlayers', story: 'AllPositions' },
      { component: 'GameBoardPlayers', story: 'ActivePlayer' },
      { component: 'GameBoardCenter', story: 'EmptyTrick' },
      { component: 'GameBoardCenter', story: 'PartialTrick' },
      { component: 'GameBoardCenter', story: 'CompleteTrick' },
    ];
    
    for (const { component, story } of newStories) {
      const storyId = `game-${component.toLowerCase()}--${story.toLowerCase().replace(/\s+/g, '-')}`;
      const storyLink = page.locator(`[id*="${storyId}"]`);
      
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
    await page.goto(STORYBOOK_URL);
    
    // Navigate to a story that uses GameStateContext
    await page.locator('[id*="gameboard--activegame"]').click();
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
    await page.goto(STORYBOOK_URL);
    
    // Check viewport addon
    const viewportButton = page.locator('[title*="viewport" i]');
    await expect(viewportButton).toBeVisible();
    
    // Check a11y addon tab
    await page.locator('[id*="dominocomponent--default"]').click();
    await page.waitForTimeout(500);
    
    const a11yTab = page.locator('[id="tabbutton-accessibility"]');
    await expect(a11yTab).toBeVisible();
  });

  test('Fixtures are properly imported', async ({ page }) => {
    await page.goto(STORYBOOK_URL);
    
    // Navigate to a story that uses fixtures
    await page.locator('[id*="gameboardplayers--allpositions"]').click();
    await page.waitForTimeout(1000);
    
    const frame = page.frameLocator('#storybook-preview-iframe');
    
    // Check that fixture data is rendered (player names from fixtures)
    await expect(frame.locator('text=Alice')).toBeVisible();
    await expect(frame.locator('text=Bob')).toBeVisible();
    await expect(frame.locator('text=Charlie')).toBeVisible();
    await expect(frame.locator('text=Diana')).toBeVisible();
  });
});