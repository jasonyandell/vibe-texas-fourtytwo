import { test, expect } from '@playwright/test'

test.describe('Demo Players Showcase - Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/players')
  })

  test('displays baseball diamond layout with all 4 players', async ({ page }) => {
    // Wait for the players section to load
    await expect(page.locator('[data-testid="players-section-container"]')).toBeVisible()

    // Check that all 4 player cards are present in diamond formation
    await expect(page.locator('[data-testid="player-card-north"]')).toBeVisible()
    await expect(page.locator('[data-testid="player-card-east"]')).toBeVisible()
    await expect(page.locator('[data-testid="player-card-south"]')).toBeVisible()
    await expect(page.locator('[data-testid="player-card-west"]')).toBeVisible()

    // Check the diamond container
    await expect(page.locator('[data-testid="players-diamond"]')).toBeVisible()
    await expect(page.locator('[data-testid="players-diamond"]')).toHaveClass(/baseballDiamond/)
  })

  test('displays section title and description', async ({ page }) => {
    await expect(page.locator('h3')).toContainText('Baseball Diamond Layout')
    await expect(page.getByText('4-player positioning with North-South vs East-West partnerships')).toBeVisible()
  })

  test('shows player information correctly', async ({ page }) => {
    // Check player names
    await expect(page.getByText('Alice')).toBeVisible()
    await expect(page.getByText('Bob')).toBeVisible()
    await expect(page.getByText('Charlie')).toBeVisible()
    await expect(page.getByText('Diana')).toBeVisible()

    // Check position labels (use more specific selectors)
    await expect(page.locator('[data-testid="player-card-north"]').getByText('North')).toBeVisible()
    await expect(page.locator('[data-testid="player-card-east"]').getByText('East')).toBeVisible()
    await expect(page.locator('[data-testid="player-card-south"]').getByText('South')).toBeVisible()
    await expect(page.locator('[data-testid="player-card-west"]').getByText('West')).toBeVisible()

    // Check that dealer badge is present (use more specific selector)
    await expect(page.locator('.dealerBadge, [class*="dealerBadge"]')).toBeVisible()

    // Check status indicators - be more specific since there are multiple "Ready" badges
    await expect(page.getByTestId('player-card-north').getByText('Ready')).toBeVisible()
    await expect(page.getByText('Current Turn')).toBeVisible()
  })

  test('responsive design works on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check that diamond layout adapts
    await expect(page.locator('[data-testid="players-diamond"]')).toHaveClass(/mobileFriendly/)

    // All player cards should still be visible
    await expect(page.locator('[data-testid="player-card-north"]')).toBeVisible()
    await expect(page.locator('[data-testid="player-card-east"]')).toBeVisible()
    await expect(page.locator('[data-testid="player-card-south"]')).toBeVisible()
    await expect(page.locator('[data-testid="player-card-west"]')).toBeVisible()

    // Controls should still be accessible
    await expect(page.locator('[data-testid="toggle-hand-visibility"]')).toBeVisible()
  })
})