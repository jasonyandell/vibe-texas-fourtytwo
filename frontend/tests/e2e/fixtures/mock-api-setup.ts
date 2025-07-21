import { Page } from '@playwright/test';
import { MockApiOptions } from './mock-types';
import { setupDemoRoutes } from './mock-demo-routes';
import { setupLobbyRoutes } from './mock-lobby-routes';
import { injectMockWebSocket } from './mock-websocket';

/**
 * Sets up mock API responses for E2E tests
 */
export class MockApiSetup {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Set up mock responses for demo pages
   */
  async setupDemoMocks(options: MockApiOptions = {}): Promise<void> {
    const { enableLobby = false, lobbyGames = [] } = options;

    // Set up demo routes
    await setupDemoRoutes(this.page, options);

    // Mock lobby endpoints if enabled
    if (enableLobby) {
      await this.setupLobbyMocks(lobbyGames);
    }
  }

  /**
   * Set up mock responses for lobby functionality
   */
  async setupLobbyMocks(games: Record<string, unknown>[] = []): Promise<void> {
    // Set up lobby routes
    await setupLobbyRoutes(this.page, games);
    
    // Mock WebSocket connections
    await this.page.addInitScript(injectMockWebSocket());
  }

  /**
   * Mock error responses for testing error handling
   */
  async setupErrorMocks(): Promise<void> {
    await this.page.route('**/api/**', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
  }

  /**
   * Clear all mocked routes
   */
  async clearMocks(): Promise<void> {
    await this.page.unroute('**/api/**');
  }

  /**
   * Setup default mocks for standard test scenarios
   */
  async setupStandardMocks(): Promise<void> {
    await this.setupDemoMocks({
      gameState: 'board',
      enableLobby: true,
      lobbyGames: [
        {
          id: 'test-game-1',
          name: 'Test Game 1',
          creator: 'test-user',
          players: [
            { id: 'test-user', name: 'Test User', position: 'north' }
          ],
          playerCount: 1,
          maxPlayers: 4,
          status: 'waiting',
          gameCode: 'TEST01',
          createdAt: new Date().toISOString()
        }
      ]
    });
  }
}

// Re-export types for convenience
export type { MockApiOptions } from './mock-types';