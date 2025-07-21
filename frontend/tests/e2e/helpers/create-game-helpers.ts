import { Page, expect, Locator } from '@playwright/test';
import { TestSetup } from '../fixtures/test-setup';

export class CreateGameHelpers {
  private page: Page;
  private testSetup: TestSetup;
  
  constructor(page: Page) {
    this.page = page;
    this.testSetup = new TestSetup(page);
  }

  async openCreateGameModal(): Promise<void> {
    const createButton = this.page.locator('button', { hasText: 'Create Game' }).first();
    await createButton.click();
    
    const modal = this.getModal();
    await expect(modal).toBeVisible();
  }

  async fillGameName(name: string): Promise<void> {
    const gameNameInput = this.page.locator('input#game-name');
    await gameNameInput.fill(name);
  }

  async submitCreateGame(): Promise<void> {
    const submitButton = this.page.locator('button[type="submit"]');
    await submitButton.click();
  }

  async cancelCreateGame(): Promise<void> {
    const cancelButton = this.getModal().locator('button', { hasText: 'Cancel' });
    await cancelButton.click();
  }

  async createGame(name: string): Promise<void> {
    await this.openCreateGameModal();
    await this.fillGameName(name);
    await this.submitCreateGame();
    await this.verifyModalClosed();
    
    // Wait for the new game to appear in the lobby
    await this.page.waitForSelector(`[data-testid="game-card"]:has-text("${name}")`, { timeout: 10000 });
  }

  async verifyModalOpen(): Promise<void> {
    await expect(this.getModal()).toBeVisible();
  }

  async verifyModalClosed(): Promise<void> {
    await expect(this.getModal()).not.toBeVisible();
  }

  async verifyErrorMessage(message: string): Promise<void> {
    const errorMessage = this.page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(message);
  }

  getGameCard(gameName: string): Locator {
    return this.page.locator('[data-testid="game-card"]').filter({ hasText: gameName });
  }

  async waitForGameToAppear(gameName: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector(`[data-testid="game-card"]:has-text("${gameName}")`, { timeout });
  }

  async setupMocksForTesting(): Promise<void> {
    // Setup default mocks for lobby functionality
    await this.testSetup.navigateToLobby([]);
  }

  private getModal(): Locator {
    return this.page.locator('[role="dialog"]');
  }
}