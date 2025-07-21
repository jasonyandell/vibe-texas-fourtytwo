import { Page, expect } from '@playwright/test';
import { MockApiSetup, MockApiOptions } from './mock-api-setup';
import { TestDebugUtilities } from './test-debug-utilities';

/**
 * Comprehensive test setup utilities for E2E tests
 */
export class TestSetup {
  private page: Page;
  private mockApi: MockApiSetup;
  private debugUtils: TestDebugUtilities;

  constructor(page: Page) {
    this.page = page;
    this.mockApi = new MockApiSetup(page);
    this.debugUtils = new TestDebugUtilities(page);
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
  async navigateToDemo(section: 'board' | 'dominoes' | 'players' | 'bidding' = 'board'): Promise<void> {
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
    await this.debugUtils.takeDebugScreenshot(name);
  }

  /**
   * Print page HTML for debugging
   */
  async printPageHTML(): Promise<void> {
    await this.debugUtils.printPageHTML();
  }

  /**
   * Print console errors
   */
  printConsoleErrors(): void {
    this.debugUtils.printConsoleErrors();
  }

  /**
   * Setup comprehensive debugging for failing tests
   */
  setupDebugging(): void {
    this.debugUtils.setupDebugging();
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

// Re-export test data for backwards compatibility
export { testData } from './test-data';