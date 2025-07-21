import { Page } from '@playwright/test';
import { getDemoMockData } from './demo-mock-data';

export interface MockApiOptions {
  gameState?: 'board' | 'dominoes' | 'players' | 'custom';
  customGameState?: Record<string, unknown>;
  enableLobby?: boolean;
  lobbyGames?: Record<string, unknown>[];
}

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
    const { gameState = 'board', customGameState, enableLobby = false, lobbyGames = [] } = options;

    // Mock game state endpoint
    const mockGameState = customGameState || getDemoMockData(gameState);
    
    await this.page.route('**/api/games/*/state', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockGameState)
      });
    });

    // Mock demo data endpoint (if exists)
    await this.page.route('**/api/demo/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockGameState)
      });
    });

    // Mock lobby endpoints if enabled
    if (enableLobby) {
      await this.setupLobbyMocks(lobbyGames);
    }
  }

  /**
   * Set up mock responses for lobby functionality
   */
  async setupLobbyMocks(games: Record<string, unknown>[] = []): Promise<void> {
    // Mock games list endpoint
    await this.page.route('**/api/games', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ games })
        });
      } else if (route.request().method() === 'POST') {
        // Mock game creation
        const requestBody = await route.request().postDataJSON() as Record<string, unknown>;
        const newGame = {
          id: 'new-game-' + Date.now(),
          name: requestBody.name as string,
          creator: 'test-user',
          players: [{ id: 'test-user', name: 'Test User', position: 'north' }],
          status: 'waiting',
          gameCode: 'TEST01',
          createdAt: new Date().toISOString()
        };
        
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(newGame)
        });
      }
    });

    // Mock specific game endpoints
    await this.page.route('**/api/games/*', async route => {
      const gameId = route.request().url().split('/').pop();
      
      if (route.request().method() === 'GET') {
        const game = games.find(g => (g.id as string) === gameId) || {
          id: gameId,
          name: 'Test Game',
          creator: 'test-user',
          players: [],
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

    // Mock WebSocket connections (placeholder)
    await this.page.addInitScript(() => {
      // Override WebSocket to prevent actual connections during tests
      (window as typeof window & { WebSocket: typeof WebSocket }).WebSocket = class MockWebSocket {
        static readonly CONNECTING = 0;
        static readonly OPEN = 1;
        static readonly CLOSING = 2;
        static readonly CLOSED = 3;
        
        constructor(_url: string) {
          setTimeout(() => {
            if (this.onopen) this.onopen({} as Event);
          }, 100);
        }
        onopen: ((event: Event) => void) | null = null;
        onmessage: ((event: MessageEvent) => void) | null = null;
        onclose: ((event: CloseEvent) => void) | null = null;
        onerror: ((event: Event) => void) | null = null;
        send() { /* mock */ }
        close() { /* mock */ }
      } as any;
    });
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
          status: 'waiting',
          gameCode: 'TEST01',
          createdAt: new Date().toISOString()
        }
      ]
    });
  }
}