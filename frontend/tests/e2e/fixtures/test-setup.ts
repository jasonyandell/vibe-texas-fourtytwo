import { Page, expect } from '@playwright/test';
import { MockApiSetup, MockApiOptions } from './mock-api-setup';

/**
 * Comprehensive test setup utilities for E2E tests
 */
export class TestSetup {
  private page: Page;
  private mockApi: MockApiSetup;

  constructor(page: Page) {
    this.page = page;
    this.mockApi = new MockApiSetup(page);
  }

  /**
   * Navigate to a page with proper mock setup
   */
  async navigateWithMocks(url: string, mockOptions?: MockApiOptions): Promise<void> {
    // Setup mocks before navigation
    if (mockOptions) {
      await this.mockApi.setupDemoMocks(mockOptions);
    } else {
      await this.mockApi.setupStandardMocks();
    }

    // Navigate to the page
    await this.page.goto(url);

    // Wait for the page to be ready
    await this.waitForPageReady();
  }

  /**
   * Navigate to demo pages with appropriate mock data
   */
  async navigateToDemo(section: 'board' | 'dominoes' | 'players' | 'bidding' | 'flow' = 'board'): Promise<void> {
    const mockOptions: MockApiOptions = {
      gameState: section === 'bidding' ? 'players' : section,
      enableLobby: false
    };

    await this.navigateWithMocks(`/demo/${section}`, mockOptions);
  }

  /**
   * Navigate to lobby with mock games
   */
  async navigateToLobby(games: Record<string, unknown>[] = []): Promise<void> {
    const mockOptions: MockApiOptions = {
      enableLobby: true,
      lobbyGames: games
    };

    await this.navigateWithMocks('/', mockOptions);
  }

  /**
   * Wait for the page to be ready (common loading indicators)
   */
  async waitForPageReady(): Promise<void> {
    // Wait for React to mount
    await this.page.waitForSelector('[data-testid], [id="root"]', { timeout: 10000 });

    // Wait for any initial loading states to complete
    try {
      await this.page.waitForSelector('[data-testid*="loading"]', { 
        state: 'detached', 
        timeout: 5000 
      });
    } catch {
      // Loading indicators might not be present, which is fine
    }

    // Ensure DOM is stable
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify demo page structure is loaded
   */
  async verifyDemoPageStructure(): Promise<void> {
    // Check for demo showcase container
    await expect(this.page.locator('[data-testid="demo-showcase"]')).toBeVisible();
    
    // Check for navigation
    await expect(this.page.locator('[data-testid="demo-navigation"]')).toBeVisible();
  }

  /**
   * Verify lobby page structure is loaded
   */
  async verifyLobbyPageStructure(): Promise<void> {
    // Wait for either games list or empty state
    const gamesContainer = this.page.locator('[data-testid="games-list"], [data-testid="lobby-empty-state"]');
    await expect(gamesContainer.first()).toBeVisible();
  }

  /**
   * Take screenshot for debugging
   */
  async takeDebugScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/debug-${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Print page HTML for debugging
   */
  async printPageHTML(): Promise<void> {
    const html = await this.page.content();
    console.log('=== PAGE HTML ===');
    console.log(html);
    console.log('=== END HTML ===');
  }

  /**
   * Print console errors
   */
  printConsoleErrors(): void {
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`Console error: ${msg.text()}`);
      }
    });

    this.page.on('pageerror', error => {
      console.log(`Page error: ${error.message}`);
    });
  }

  /**
   * Setup comprehensive debugging for failing tests
   */
  setupDebugging(): void {
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`Console error: ${msg.text()}`);
      }
    });

    this.page.on('pageerror', error => {
      console.log(`Page error: ${error.message}`);
    });

    this.page.on('requestfailed', request => {
      console.log(`Failed request: ${request.url()} - ${request.failure()?.errorText}`);
    });
  }

  /**
   * Clean up after tests
   */
  async cleanup(): Promise<void> {
    await this.mockApi.clearMocks();
  }

  /**
   * Get mock API setup instance for advanced usage
   */
  getMockApi(): MockApiSetup {
    return this.mockApi;
  }
}

/**
 * Factory function to create TestSetup instance
 */
export const createTestSetup = (page: Page): TestSetup => {
  return new TestSetup(page);
};

/**
 * Common test data for reuse across tests
 */
export const testData = {
  games: {
    waiting: {
      id: 'test-game-waiting',
      name: 'Waiting Game',
      creator: 'test-user',
      players: [
        { id: 'test-user', name: 'Test User', position: 'north' }
      ],
      status: 'waiting',
      gameCode: 'WAIT01',
      createdAt: new Date().toISOString()
    },
    full: {
      id: 'test-game-full',
      name: 'Full Game',
      creator: 'test-user',
      players: [
        { id: 'test-user-1', name: 'Player 1', position: 'north' },
        { id: 'test-user-2', name: 'Player 2', position: 'east' },
        { id: 'test-user-3', name: 'Player 3', position: 'south' },
        { id: 'test-user-4', name: 'Player 4', position: 'west' }
      ],
      status: 'playing',
      gameCode: 'FULL01',
      createdAt: new Date().toISOString()
    }
  },
  players: {
    creator: { id: 'creator-1', name: 'Game Creator' },
    joiner: { id: 'joiner-1', name: 'Game Joiner' },
    spectator: { id: 'spectator-1', name: 'Spectator' }
  }
};