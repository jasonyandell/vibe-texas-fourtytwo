import { Page } from '@playwright/test';
import { MockGame } from './mock-types';

/**
 * Set up mock responses for lobby functionality
 */
export async function setupLobbyRoutes(
  page: Page,
  initialGames: Record<string, unknown>[] = []
): Promise<void> {
  // Create a mutable array to track games during the test session
  const gamesList = [...initialGames];
  
  // Mock games list endpoint
  await page.route('**/api/games', async route => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: gamesList })
      });
    } else if (route.request().method() === 'POST') {
      // Mock game creation
      const requestBody = await route.request().postDataJSON() as Record<string, unknown>;
      const gameName = requestBody.name as string;
      
      // Check for duplicate names (same validation as backend)
      if (gamesList.some(g => g.name === gameName)) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, error: 'A game with this name already exists' })
        });
        return;
      }
      
      const newGame: MockGame = {
        id: 'new-game-' + Date.now(),
        name: gameName,
        creator: 'test-user',
        players: [{ id: 'test-user', name: 'Test User', position: 'north' }],
        playerCount: 1,
        maxPlayers: 4,
        status: 'waiting',
        gameCode: 'TEST01',
        createdAt: new Date().toISOString()
      };
      
      // Add the new game to our stateful list
      gamesList.push(newGame);
      
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: newGame })
      });
    }
  });

  // Mock specific game endpoints
  await page.route('**/api/games/*', async route => {
    const gameId = route.request().url().split('/').pop();
    
    if (route.request().method() === 'GET') {
      const game = initialGames.find(g => (g.id as string) === gameId) || {
        id: gameId,
        name: 'Test Game',
        creator: 'test-user',
        players: [],
        playerCount: 0,
        maxPlayers: 4,
        status: 'waiting',
        gameCode: 'TEST01',
        createdAt: new Date().toISOString()
      };
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(game)
      });
    }
  });
}