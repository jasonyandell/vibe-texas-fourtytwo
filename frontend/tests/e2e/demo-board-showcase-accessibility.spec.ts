import { test, expect } from '@playwright/test'

test.describe('Demo Board Showcase - Accessibility & Responsive', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/board')
  })

  test('displays proper ARIA labels and accessibility features', async ({ page }) => {
    // Check main container has proper aria-label
    await expect(page.locator('[data-testid="game-board-section-container"]')).toHaveAttribute('aria-label', 'Game board elements showcase')

    // Check center play area has proper role and label
    await expect(page.locator('[data-testid="demo-center-play-area"]')).toHaveAttribute('role', 'region')
    await expect(page.locator('[data-testid="demo-center-play-area"]')).toHaveAttribute('aria-label', 'Current trick display')

    // Check trick dominoes group has proper label
    await expect(page.locator('[data-testid="current-trick-dominoes"]')).toHaveAttribute('role', 'group')
    await expect(page.locator('[data-testid="current-trick-dominoes"]')).toHaveAttribute('aria-label', 'Dominoes in current trick')

    // Check button aria labels
    await expect(page.locator('[data-testid="prev-trick-button"]')).toHaveAttribute('aria-label', 'Show previous trick example')
    await expect(page.locator('[data-testid="next-trick-button"]')).toHaveAttribute('aria-label', 'Show next trick example')
    await expect(page.locator('[data-testid="game-state-button-0"]')).toHaveAttribute('aria-label', 'Switch to Playing Phase scenario')
  })

  test('responsive design works on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check that elements are still visible and functional
    await expect(page.locator('[data-testid="game-board-section-container"]')).toBeVisible()
    await expect(page.locator('[data-testid="demo-center-play-area"]')).toBeVisible()
    await expect(page.locator('[data-testid="demo-trick-stack-north-south"]')).toBeVisible()
    await expect(page.locator('[data-testid="demo-scores-display"]')).toBeVisible()

    const gameStatus = page.locator('[data-testid="demo-game-status"]')

    // Test that trick cycling still works
    await page.click('[data-testid="next-trick-button"]')
    await expect(page.getByRole('heading', { name: 'Trump Trick' })).toBeVisible()

    // Test that game state switching still works
    await page.click('[data-testid="game-state-button-1"]')
    await expect(gameStatus.getByText('Scoring Phase')).toBeVisible()
  })
})