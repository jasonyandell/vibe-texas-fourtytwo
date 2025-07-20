import { test, expect } from '@playwright/test';

test.describe('Story 002: Create Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('can create a game with custom name', async ({ page }) => {
    // Click create game button
    const createButton = page.locator('button', { hasText: 'Create Game' }).first();
    await createButton.click();

    // Verify modal opens
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Fill in game name
    const gameNameInput = modal.locator('input#game-name');
    await gameNameInput.fill('My Custom Game');

    // Submit form
    const submitButton = modal.locator('button[type="submit"]');
    await submitButton.click();

    // Verify modal closes
    await expect(modal).not.toBeVisible();

    // Verify game appears in lobby
    const gameCard = page.locator('[data-testid="game-card"]');
    await expect(gameCard).toBeVisible();
    await expect(gameCard).toContainText('My Custom Game');
    
    // Verify game shows waiting for players status
    await expect(gameCard).toContainText('Waiting for players');
    await expect(gameCard).toContainText('1/4 players');
  });

  test('validates game name input', async ({ page }) => {
    // Click create game button
    const createButton = page.locator('button', { hasText: 'Create Game' }).first();
    await createButton.click();

    // Try to submit without entering a name
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Verify validation error appears
    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Game name is required');

    // Enter a name that's too short
    const gameNameInput = page.locator('input#game-name');
    await gameNameInput.fill('ab');
    await submitButton.click();

    // Verify validation error for minimum length
    await expect(errorMessage).toContainText('Game name must be at least 3 characters');

    // Enter a name that's too long
    await gameNameInput.fill('a'.repeat(51));
    await submitButton.click();

    // Verify validation error for maximum length
    await expect(errorMessage).toContainText('Game name must be less than 50 characters');
  });

  test('creator automatically joins the game', async ({ page }) => {
    // Create a game
    const createButton = page.locator('button', { hasText: 'Create Game' }).first();
    await createButton.click();

    const gameNameInput = page.locator('input#game-name');
    await gameNameInput.fill('Auto Join Game');

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for modal to close
    const modal = page.locator('[role="dialog"]');
    await expect(modal).not.toBeVisible();

    // Verify game card shows creator as first player
    const gameCard = page.locator('[data-testid="game-card"]').filter({ hasText: 'Auto Join Game' });
    await expect(gameCard).toContainText('1/4 players');
    
    // Verify join button is not shown for creator
    const joinButton = gameCard.locator('button', { hasText: 'Join' });
    await expect(joinButton).not.toBeVisible();
    
    // Verify leave button is shown instead
    const leaveButton = gameCard.locator('button', { hasText: 'Leave' });
    await expect(leaveButton).toBeVisible();
  });

  test('shows game code for sharing', async ({ page }) => {
    // Create a game
    const createButton = page.locator('button', { hasText: 'Create Game' }).first();
    await createButton.click();

    const gameNameInput = page.locator('input#game-name');
    await gameNameInput.fill('Shareable Game');

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for game to be created
    const gameCard = page.locator('[data-testid="game-card"]').filter({ hasText: 'Shareable Game' });
    await expect(gameCard).toBeVisible();

    // Verify game code is displayed
    const gameCode = gameCard.locator('[data-testid="game-code"]');
    await expect(gameCode).toBeVisible();
    
    // Game code should be 6 characters (letters and numbers)
    const codeText = await gameCode.textContent();
    expect(codeText).toMatch(/^[A-Z0-9]{6}$/);
  });

  test('can cancel game creation', async ({ page }) => {
    // Click create game button
    const createButton = page.locator('button', { hasText: 'Create Game' }).first();
    await createButton.click();

    // Verify modal opens
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Click cancel button
    const cancelButton = modal.locator('button', { hasText: 'Cancel' });
    await cancelButton.click();

    // Verify modal closes
    await expect(modal).not.toBeVisible();

    // Verify no new game was created (empty state still visible if no games)
    const emptyState = page.locator('[data-testid="lobby-empty-state"]');
    await expect(emptyState).toBeVisible();
  });

  test('handles server errors gracefully', async ({ page }) => {
    // Mock a server error response
    await page.route('**/api/games', route => {
      void route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    // Try to create a game
    const createButton = page.locator('button', { hasText: 'Create Game' }).first();
    await createButton.click();

    const gameNameInput = page.locator('input#game-name');
    await gameNameInput.fill('Error Test Game');

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Verify error message is displayed
    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Failed to create game');

    // Verify modal stays open for retry
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
  });

  test('prevents duplicate game names', async ({ page }) => {
    // Create first game
    const createButton = page.locator('button', { hasText: 'Create Game' }).first();
    await createButton.click();

    let gameNameInput = page.locator('input#game-name');
    await gameNameInput.fill('Unique Game Name');

    let submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for first game to be created
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="game-card"]').filter({ hasText: 'Unique Game Name' })).toBeVisible();

    // Try to create second game with same name
    await createButton.click();
    
    gameNameInput = page.locator('input#game-name');
    await gameNameInput.fill('Unique Game Name');

    submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Verify error message about duplicate name
    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('A game with this name already exists');
  });
});