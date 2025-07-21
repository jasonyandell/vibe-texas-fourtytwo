import { Page } from '@playwright/test';
import { getDemoMockData } from './demo-mock-data';
import { MockApiOptions } from './mock-types';

/**
 * Set up mock responses for demo pages and game state
 */
export async function setupDemoRoutes(
  page: Page,
  options: MockApiOptions = {}
): Promise<void> {
  const { gameState = 'board', customGameState } = options;
  
  // Mock game state endpoint
  const mockGameState = customGameState || getDemoMockData(gameState);
  
  await page.route('**/api/games/*/state', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockGameState)
    });
  });

  // Mock demo data endpoint (if exists)
  await page.route('**/api/demo/**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockGameState)
    });
  });
}