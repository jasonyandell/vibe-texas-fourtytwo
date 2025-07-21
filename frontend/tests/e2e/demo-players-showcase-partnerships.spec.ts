import { test, expect } from '@playwright/test'

test.describe('Demo Players Showcase - Partnerships', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/players')
  })

  test('partnership highlighting works correctly', async ({ page }) => {
    // Click on North player
    await page.locator('[data-testid="player-card-north"]').click()

    // North-South partnership should be highlighted (check for CSS module class)
    await expect(page.locator('[data-testid="player-card-north"]')).toHaveClass(/partnershipHighlighted/)
    await expect(page.locator('[data-testid="player-card-south"]')).toHaveClass(/partnershipHighlighted/)

    // East-West partnership should not be highlighted
    await expect(page.locator('[data-testid="player-card-east"]')).not.toHaveClass(/partnershipHighlighted/)
    await expect(page.locator('[data-testid="player-card-west"]')).not.toHaveClass(/partnershipHighlighted/)

    // Click on East player to switch partnerships
    await page.locator('[data-testid="player-card-east"]').click()

    // East-West partnership should now be highlighted
    await expect(page.locator('[data-testid="player-card-east"]')).toHaveClass(/partnershipHighlighted/)
    await expect(page.locator('[data-testid="player-card-west"]')).toHaveClass(/partnershipHighlighted/)

    // North-South partnership should no longer be highlighted
    await expect(page.locator('[data-testid="player-card-north"]')).not.toHaveClass(/partnershipHighlighted/)
    await expect(page.locator('[data-testid="player-card-south"]')).not.toHaveClass(/partnershipHighlighted/)
  })

  test('partnership data attributes are correct', async ({ page }) => {
    // Check North-South partnership
    await expect(page.locator('[data-testid="player-card-north"]')).toHaveAttribute('data-partnership', 'north-south')
    await expect(page.locator('[data-testid="player-card-south"]')).toHaveAttribute('data-partnership', 'north-south')

    // Check East-West partnership
    await expect(page.locator('[data-testid="player-card-east"]')).toHaveAttribute('data-partnership', 'east-west')
    await expect(page.locator('[data-testid="player-card-west"]')).toHaveAttribute('data-partnership', 'east-west')
  })
})