import { test, expect } from '@playwright/test'

test.describe('Texas 42 Lobby', () => {
  test('should display the lobby page', async ({ page }) => {
    await page.goto('/')
    
    // Check that the header is present
    await expect(page.locator('h1')).toContainText('Texas 42')
    
    // Check that the lobby content is present
    await expect(page.locator('h2')).toContainText('Game Lobby')
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
