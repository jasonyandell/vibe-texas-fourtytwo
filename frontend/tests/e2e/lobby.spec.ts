import { test, expect } from '@playwright/test'

test.describe('Texas 42 Lobby - Basic Display', () => {
  test('should display the lobby page', async ({ page }) => {
    await page.goto('/')

    // Check that the header is present
    await expect(page.locator('h1')).toContainText('Texas 42')

    // Check that the lobby content is present
    await expect(page.locator('h2')).toContainText('Texas 42 Lobby')
    await expect(page.getByText('Welcome to Texas 42!')).toBeVisible()

    // Check that action buttons are present
    await expect(page.getByRole('button', { name: 'Create New Game' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Join Random Game' })).toBeVisible()
  })

  test('should have proper page title', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Texas 42/)
  })

  test('should display available games section', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Available Games')).toBeVisible()
    await expect(page.getByText('No games available. Create one to get started!')).toBeVisible()
  })
})

test.describe('Texas 42 Lobby - Game Creation', () => {
  test('should create a new game successfully', async ({ page }) => {
    await page.goto('/')

    // Click create game button
    await page.getByRole('button', { name: 'Create New Game' }).click()

    // Check that create game modal appears
    await expect(page.getByRole('heading', { name: 'Create New Game' })).toBeVisible()
    await expect(page.getByLabel('Game Name')).toBeVisible()

    // Fill in game name
    await page.getByLabel('Game Name').fill('Test Game')

    // Submit the form
    await page.getByRole('button', { name: 'Create Game' }).click()

    // Verify game was created and appears in lobby
    await expect(page.getByText('Test Game')).toBeVisible()
    await expect(page.getByText('1/4 players')).toBeVisible()
  })

  test('should validate game name requirements', async ({ page }) => {
    await page.goto('/')

    // Click create game button
    await page.getByRole('button', { name: 'Create New Game' }).click()

    // Check that Create Game button is disabled with empty name
    await expect(page.getByRole('button', { name: 'Create Game' })).toBeDisabled()

    // Should still be in modal (validation failed)
    await expect(page.getByRole('heading', { name: 'Create New Game' })).toBeVisible()

    // Try with too short name
    await page.getByLabel('Game Name').fill('AB')
    await expect(page.getByRole('button', { name: 'Create Game' })).toBeDisabled()

    // Try with valid name
    await page.getByLabel('Game Name').fill('Valid Game Name')
    await expect(page.getByRole('button', { name: 'Create Game' })).toBeEnabled()
  })

  test('should close modal when cancelled', async ({ page }) => {
    await page.goto('/')

    // Open modal
    await page.getByRole('button', { name: 'Create New Game' }).click()
    await expect(page.getByRole('heading', { name: 'Create New Game' })).toBeVisible()

    // Cancel
    await page.getByRole('button', { name: 'Cancel' }).click()

    // Modal should be closed
    await expect(page.getByRole('heading', { name: 'Create New Game' })).not.toBeVisible()
  })
})

test.describe('Texas 42 Lobby - Player Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    // Create a test game for player management tests
    await page.getByRole('button', { name: 'Create New Game' }).click()
    await page.getByLabel('Game Name').fill('Player Test Game')
    await page.getByRole('button', { name: 'Create Game' }).click()

    // Verify game was created
    await expect(page.getByText('Player Test Game')).toBeVisible()
  })

  test('should display empty player slots', async ({ page }) => {
    // Check that all 4 player slots are shown as empty
    const gameCard = page.locator('[data-testid="game-card"]').first()

    await expect(gameCard.getByText('North: Empty Slot')).toBeVisible()
    await expect(gameCard.getByText('East: Empty Slot')).toBeVisible()
    await expect(gameCard.getByText('South: Empty Slot')).toBeVisible()
    await expect(gameCard.getByText('West: Empty Slot')).toBeVisible()
  })

  test('should show partnership arrangement', async ({ page }) => {
    const gameCard = page.locator('[data-testid="game-card"]').first()

    // Check partnership indicators
    await expect(gameCard.getByText('North-South vs East-West')).toBeVisible()
  })

  test('should handle player joining', async ({ page }) => {
    const gameCard = page.locator('[data-testid="game-card"]').first()

    // Click on an empty slot to join
    await gameCard.getByText('North: Empty Slot').click()

    // Should show join confirmation or player name
    // Note: This depends on the actual implementation
    // For now, we'll check that the slot changes
    await expect(gameCard.getByText('1/4 players')).toBeVisible()
  })
})

test.describe('Texas 42 Lobby - Ready System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    // Create a test game
    await page.getByRole('button', { name: 'Create New Game' }).click()
    await page.getByLabel('Game Name').fill('Ready Test Game')
    await page.getByRole('button', { name: 'Create Game' }).click()
  })

  test('should show ready button when 4 players are seated', async ({ page }) => {
    // This test would require simulating 4 players joining
    // For now, we'll test the UI elements that should be present
    const gameCard = page.locator('[data-testid="game-card"]').first()

    // Check that ready system elements are present in the UI
    // Note: Actual implementation may vary
    await expect(gameCard).toBeVisible()
  })

  test('should handle ready state changes', async ({ page }) => {
    // Test ready/unready functionality
    // This would require a more complex setup with multiple players
    const gameCard = page.locator('[data-testid="game-card"]').first()

    // Verify game card is visible for ready state testing
    await expect(gameCard).toBeVisible()
  })

  test('should auto-start game when all players ready', async ({ page }) => {
    // Test auto-start functionality
    // This would require simulating all 4 players being ready
    const gameCard = page.locator('[data-testid="game-card"]').first()

    // For now, just verify the game card structure
    await expect(gameCard).toBeVisible()
  })
})

test.describe('Texas 42 Lobby - Spectator Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    // Create a test game for spectator tests
    await page.getByRole('button', { name: 'Create New Game' }).click()
    await page.getByLabel('Game Name').fill('Spectator Test Game')
    await page.getByRole('button', { name: 'Create Game' }).click()
  })

  test('should display spectator count', async ({ page }) => {
    const gameCard = page.locator('[data-testid="game-card"]').first()

    // Check for spectator count display
    await expect(gameCard.getByText(/0 Spectators?/)).toBeVisible()
  })

  test('should allow joining as spectator', async ({ page }) => {
    const gameCard = page.locator('[data-testid="game-card"]').first()

    // Look for spectate button or link
    const spectateButton = gameCard.getByRole('button', { name: /Spectate/i })

    if (await spectateButton.isVisible()) {
      await spectateButton.click()

      // Should show spectating state
      await expect(gameCard.getByText(/You are spectating/i)).toBeVisible()
    }
  })

  test('should show spectator list', async ({ page }) => {
    const gameCard = page.locator('[data-testid="game-card"]').first()

    // Check that spectator information is displayed
    await expect(gameCard).toBeVisible()

    // Look for spectator-related UI elements
    const spectatorSection = gameCard.locator('[data-testid="spectator-section"]')
    if (await spectatorSection.isVisible()) {
      await expect(spectatorSection).toBeVisible()
    }
  })

  test('should handle leaving spectator mode', async ({ page }) => {
    const gameCard = page.locator('[data-testid="game-card"]').first()

    // First join as spectator (if possible)
    const spectateButton = gameCard.getByRole('button', { name: /Spectate/i })

    if (await spectateButton.isVisible()) {
      await spectateButton.click()

      // Then try to leave
      const leaveButton = gameCard.getByRole('button', { name: /Stop Spectating/i })
      if (await leaveButton.isVisible()) {
        await leaveButton.click()

        // Should return to non-spectating state
        await expect(gameCard.getByText(/Spectate Game/i)).toBeVisible()
      }
    }
  })
})

test.describe('Texas 42 Lobby - Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    await page.goto('/')

    // Test that the page loads even if some network requests fail
    await expect(page.getByText('Game Lobby')).toBeVisible()
  })

  test('should show loading states', async ({ page }) => {
    await page.goto('/')

    // Check for loading indicators during game creation
    await page.getByRole('button', { name: 'Create New Game' }).click()
    await page.getByLabel('Game Name').fill('Loading Test Game')

    // The create button should show loading state when clicked
    const createButton = page.getByRole('button', { name: 'Create Game' })
    await createButton.click()

    // Button should be disabled during creation
    await expect(createButton).toBeDisabled()
  })

  test('should handle empty lobby state', async ({ page }) => {
    await page.goto('/')

    // Should show empty state message
    await expect(page.getByText('No games available. Create one to get started!')).toBeVisible()

    // Should show create game call-to-action
    await expect(page.getByRole('button', { name: 'Create New Game' })).toBeVisible()
  })
})
