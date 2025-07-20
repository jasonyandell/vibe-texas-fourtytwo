import { test, expect } from '@playwright/test';

test.describe('Story 001: Empty Lobby', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lobby');
  });

  test('displays empty lobby state when no games exist', async ({ page }) => {
    // Verify lobby header
    const header = page.locator('h2');
    await expect(header).toContainText('Game Lobby');

    // Verify games section exists
    const gamesSection = page.locator('.gamesSection');
    await expect(gamesSection).toBeVisible();

    // Verify empty state is shown
    const emptyState = page.locator('[data-testid="lobby-empty-state"]');
    await expect(emptyState).toBeVisible();
    
    // Verify empty state text
    await expect(emptyState).toContainText('No games available');
    await expect(emptyState).toContainText('Create a new game to get started!');

    // Verify create game button in empty state
    const createButton = emptyState.locator('button', { hasText: 'Create New Game' });
    await expect(createButton).toBeVisible();
    await expect(createButton).toBeEnabled();
  });

  test('shows create game button in lobby actions', async ({ page }) => {
    // Verify lobby actions section
    const lobbyActions = page.locator('.lobbyActions');
    await expect(lobbyActions).toBeVisible();

    // Verify create game button
    const createButton = lobbyActions.locator('button', { hasText: 'Create Game' });
    await expect(createButton).toBeVisible();
    await expect(createButton).toBeEnabled();
  });

  test('opens create game modal when clicking create button', async ({ page }) => {
    // Click create game button
    const createButton = page.locator('.lobbyActions button', { hasText: 'Create Game' });
    await createButton.click();

    // Verify modal opens
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Verify modal title
    await expect(modal).toContainText('Create New Game');

    // Verify form fields
    const gameNameInput = modal.locator('input[name="gameName"]');
    await expect(gameNameInput).toBeVisible();
    await expect(gameNameInput).toHaveAttribute('placeholder', 'Enter game name');

    // Verify submit button
    const submitButton = modal.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText('Create');
  });

  test('can create a new game', async ({ page }) => {
    // Click create game button
    const createButton = page.locator('.lobbyActions button', { hasText: 'Create Game' });
    await createButton.click();

    // Fill in game name
    const gameNameInput = page.locator('input[name="gameName"]');
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

    // Verify game card appears
    const gameCard = page.locator('[data-testid="game-card"]');
    await expect(gameCard).toBeVisible();
    await expect(gameCard).toContainText('Test Game');
  });

  test('displays connected players count', async ({ page }) => {
    // Verify connected players display
    const connectedPlayers = page.locator('.connectedPlayers');
    await expect(connectedPlayers).toBeVisible();
    await expect(connectedPlayers).toContainText('Connected Players:');
  });

  test('shows welcome message', async ({ page }) => {
    // Verify welcome message
    const welcomeMessage = page.locator('.welcomeMessage');
    await expect(welcomeMessage).toBeVisible();
    await expect(welcomeMessage).toContainText('Welcome to Texas 42 Online!');
  });

  test('empty state create button opens modal', async ({ page }) => {
    // Click create button in empty state
    const emptyState = page.locator('[data-testid="lobby-empty-state"]');
    const createButton = emptyState.locator('button', { hasText: 'Create New Game' });
    await createButton.click();

    // Verify modal opens
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Create New Game');
  });
});