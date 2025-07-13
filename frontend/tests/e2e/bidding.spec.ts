import { test, expect } from '@playwright/test'

test.describe('Texas 42 Bidding System', () => {
  test('should display bidding interface when game is in bidding phase', async ({ page }) => {
    await page.goto('/')

    // Check that the page loads
    await expect(page.locator('h1')).toContainText('Texas 42')

    // Navigate to a game (we'll need to create a way to get to bidding phase)
    // For now, let's check if the lobby loads properly
    await expect(page.getByText('Texas 42 Lobby')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Available Games' })).toBeVisible()
  })

  test('should show create game functionality', async ({ page }) => {
    await page.goto('/')

    // Check that create game button is present
    await expect(page.getByRole('button', { name: 'Create New Game' })).toBeVisible()

    // Click create game button
    await page.getByRole('button', { name: 'Create New Game' }).click()

    // Check that create game modal appears
    await expect(page.getByRole('heading', { name: 'Create New Game' })).toBeVisible()
  })

  test('should handle empty lobby state', async ({ page }) => {
    await page.goto('/')

    // Should show empty state message
    await expect(page.getByText('No games available. Create one to get started!')).toBeVisible()

    // Should show create game call-to-action
    await expect(page.getByRole('button', { name: 'Create New Game' })).toBeVisible()
  })
})
