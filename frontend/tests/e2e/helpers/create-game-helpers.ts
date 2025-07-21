import { Page, expect, Locator } from '@playwright/test';

export class CreateGameHelpers {
  private page: Page;
  
  constructor(page: Page) {
    this.page = page;
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

  private getModal(): Locator {
    return this.page.locator('[role="dialog"]');
  }
}