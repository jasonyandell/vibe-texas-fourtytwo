import { test, expect } from '@playwright/test';
import { TestSetup } from './fixtures/test-setup';
import { CreateGameHelpers } from './helpers/create-game-helpers';

test.describe('Story 001: Empty Lobby', () => {
  test.beforeEach(async ({ page }) => {
    const testSetup = new TestSetup(page);
    await testSetup.navigateToLobby([]);
  });

  test('displays empty lobby state when no games exist', async ({ page }) => {
    // Verify lobby header
    const header = page.locator('h2');
    await expect(header).toContainText('Texas 42 Lobby');

    // Verify games section exists by looking for the Available Games heading
    const availableGamesHeading = page.locator('h3', { hasText: 'Available Games' });
    await expect(availableGamesHeading).toBeVisible();

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
    // Verify create game button exists (not in empty state)
    const createButton = page.locator('button', { hasText: 'Create Game' }).first();
    await expect(createButton).toBeVisible();
    await expect(createButton).toBeEnabled();
    
    // Also verify Join Random Game button exists
    const joinButton = page.locator('button', { hasText: 'Join Random Game' });
    await expect(joinButton).toBeVisible();
  });

  test('opens create game modal when clicking create button', async ({ page }) => {
    // Click create game button (not in empty state)
    const createButton = page.locator('button', { hasText: 'Create Game' }).first();
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
    await expect(submitButton).toContainText('Create');
  });

  test('can create a new game', async ({ page }) => {
    const helpers = new CreateGameHelpers(page);
    
    // Create a new game
    await helpers.createGame('Test Game');

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
    const connectedPlayers = page.locator('text=players online');
    await expect(connectedPlayers).toBeVisible();
  });

  test('shows welcome message', async ({ page }) => {
    // Verify welcome message
    const welcomeMessage = page.locator('text=Welcome to Texas 42!');
    await expect(welcomeMessage).toBeVisible();
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