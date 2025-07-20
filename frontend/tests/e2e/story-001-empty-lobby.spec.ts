import { test, expect } from '@playwright/test';

test.describe('Story 001: Empty Lobby', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays empty lobby state when no games exist', async ({ page }) => {
    // Verify lobby header
    const header = page.locator('h2');
    await expect(header).toContainText('Texas 42 Lobby');

    // Verify games section exists by looking for "Available Games" heading
    const availableGamesHeading = page.locator('h3', { hasText: 'Available Games' });
    await expect(availableGamesHeading).toBeVisible();

    // Verify empty state is shown
    const emptyState = page.locator('[data-testid="lobby-empty-state"]');
    await expect(emptyState).toBeVisible();
    
    // Verify empty state text
    await expect(emptyState).toContainText('No games available');
    await expect(emptyState).toContainText('Create a new game to get started!');
  });

  test('shows create game button in lobby actions', async ({ page }) => {
    // Verify create game button exists and is visible
    const createButton = page.locator('button', { hasText: 'Create New Game' });
    await expect(createButton).toBeVisible();
    await expect(createButton).toBeEnabled();
  });

  test('opens create game modal when clicking create button', async ({ page }) => {
    // Click create game button
    const createButton = page.locator('button', { hasText: 'Create New Game' });
    await createButton.click();

    // Verify modal opens
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Verify modal title
    await expect(modal).toContainText('Create New Game');

    // Verify form fields
    const gameNameInput = modal.locator('input#game-name');
    await expect(gameNameInput).toBeVisible();
    await expect(gameNameInput).toHaveAttribute('placeholder', 'Enter a name for your game...');

    // Verify submit button
    const submitButton = modal.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText('Create Game');
  });

  test('can create a new game', async ({ page }) => {
    // Click create game button
    const createButton = page.locator('button', { hasText: 'Create New Game' });
    await createButton.click();

    // Fill in game name
    const gameNameInput = page.locator('input#game-name');
    await gameNameInput.fill('Test Game');

    // Submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Verify modal closes
    const modal = page.locator('[role="dialog"]');
    await expect(modal).not.toBeVisible();

    // Verify game appears in lobby (empty state should be gone)
    const emptyState = page.locator('[data-testid="lobby-empty-state"]');
    await expect(emptyState).not.toBeVisible();

    // Verify game appears in the games list
    const gamesList = page.locator('[data-testid="game-grid"]');
    await expect(gamesList).toBeVisible();
    
    // Verify game card appears with the correct name
    const gameCard = gamesList.locator('[data-testid="game-card"]').first();
    await expect(gameCard).toBeVisible();
    await expect(gameCard).toContainText('Test Game');
  });

  test('displays connected players count', async ({ page }) => {
    // Verify connected players display by looking for the text
    const connectedPlayers = page.locator('text=players online');
    await expect(connectedPlayers).toBeVisible();
  });

  test('shows welcome message', async ({ page }) => {
    // Verify welcome message exists
    const welcomeMessage = page.locator('text=Welcome to Texas 42!');
    await expect(welcomeMessage).toBeVisible();
  });

  test('join random game button is disabled when no games exist', async ({ page }) => {
    // Verify join random game button is disabled
    const joinButton = page.locator('button', { hasText: 'Join Random Game' });
    await expect(joinButton).toBeVisible();
    await expect(joinButton).toBeDisabled();
  });
});