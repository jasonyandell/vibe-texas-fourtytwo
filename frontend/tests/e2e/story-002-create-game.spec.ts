import { test, expect } from '@playwright/test';
import { CreateGameHelpers } from './helpers/create-game-helpers';

test.describe('Story 002: Create Game', () => {
  test.beforeEach(async ({ page }) => {
    const helpers = new CreateGameHelpers(page);
    await helpers.setupMocksForTesting();
  });

  test('can create a game with custom name', async ({ page }) => {
    const helpers = new CreateGameHelpers(page);
    
    await helpers.openCreateGameModal();
    await helpers.fillGameName('My Custom Game');
    await helpers.submitCreateGame();

    await helpers.verifyModalClosed();
    
    const gameCard = helpers.getGameCard('My Custom Game');
    await expect(gameCard).toBeVisible();
    await expect(gameCard).toContainText('Waiting for Players');
    await expect(gameCard).toContainText('0/4 players');
  });

  test('validates game name input', async ({ page }) => {
    const helpers = new CreateGameHelpers(page);
    
    await helpers.openCreateGameModal();

    // Submit button should be disabled without a name
    await helpers.verifySubmitButtonDisabled();

    // Enter a name that's too short
    await helpers.fillGameName('ab');
    await helpers.verifySubmitButtonDisabled();

    // Enter a name that's too long
    await helpers.fillGameName('a'.repeat(51));
    await helpers.verifySubmitButtonDisabled();

    // Enter a valid name
    await helpers.fillGameName('Valid Game Name');
    await helpers.verifySubmitButtonEnabled();
  });

  test('creator automatically joins the game', async ({ page }) => {
    const helpers = new CreateGameHelpers(page);
    
    await helpers.createGame('Auto Join Game');
    
    const gameCard = helpers.getGameCard('Auto Join Game');
    await expect(gameCard).toContainText('1/4 players');
    
    // Verify join button is not shown for creator
    const joinButton = gameCard.locator('button', { hasText: 'Join' });
    await expect(joinButton).not.toBeVisible();
    
    // Verify leave button is shown instead
    const leaveButton = gameCard.locator('button', { hasText: 'Leave' });
    await expect(leaveButton).toBeVisible();
  });

  test('shows game code for sharing', async ({ page }) => {
    const helpers = new CreateGameHelpers(page);
    
    await helpers.createGame('Shareable Game');
    
    const gameCard = helpers.getGameCard('Shareable Game');
    const gameCode = gameCard.locator('[data-testid="game-code"]');
    await expect(gameCode).toBeVisible();
    
    // Game code should be 6 characters (letters and numbers)
    const codeText = await gameCode.textContent();
    expect(codeText).toMatch(/^[A-Z0-9]{6}$/);
  });

  test('can cancel game creation', async ({ page }) => {
    const helpers = new CreateGameHelpers(page);
    
    await helpers.openCreateGameModal();
    await helpers.cancelCreateGame();
    await helpers.verifyModalClosed();

    // Verify no new game was created (empty state still visible if no games)
    const emptyState = page.locator('[data-testid="lobby-empty-state"]');
    await expect(emptyState).toBeVisible();
  });

  test('handles server errors gracefully', async ({ page }) => {
    const helpers = new CreateGameHelpers(page);
    
    // Mock a server error response
    await page.route('**/api/games', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    await helpers.openCreateGameModal();
    await helpers.fillGameName('Error Test Game');
    await helpers.submitCreateGame();

    await helpers.verifyErrorMessage('Failed to create game');
    await helpers.verifyModalOpen();
  });

  test('prevents duplicate game names', async ({ page }) => {
    const helpers = new CreateGameHelpers(page);
    
    // Create first game
    await helpers.createGame('Unique Game Name');
    await expect(helpers.getGameCard('Unique Game Name')).toBeVisible();

    // Try to create second game with same name
    await helpers.openCreateGameModal();
    await helpers.fillGameName('Unique Game Name');
    await helpers.submitCreateGame();

    await helpers.verifyErrorMessage('A game with this name already exists');
  });
});