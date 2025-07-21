import { test, expect } from '@playwright/test'

test.describe('Demo Players Showcase - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/players')
  })

  test('keyboard navigation works for player cards', async ({ page }) => {
    // Focus on first player card
    await page.locator('[data-testid="player-card-north"]').focus()

    // Should be focusable
    await expect(page.locator('[data-testid="player-card-north"]')).toBeFocused()

    // Should be able to activate with Enter key
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-testid="player-card-north"]')).toHaveClass(/partnershipHighlighted/)

    // Should be able to activate with Space key
    await page.keyboard.press('Space')
    await expect(page.locator('[data-testid="player-card-north"]')).not.toHaveClass(/partnershipHighlighted/)
  })

  test('screen reader announcements work', async ({ page }) => {
    // Check that partnership announcer exists (it's screen reader only, so check for presence)
    await expect(page.locator('[data-testid="partnership-announcer"]')).toHaveCount(1)
    await expect(page.locator('[data-testid="partnership-announcer"]')).toHaveAttribute('aria-live', 'polite')

    // Click a player to trigger announcement
    await page.locator('[data-testid="player-card-north"]').click()

    // Check that announcement is made (content should be updated)
    const announcer = page.locator('[data-testid="partnership-announcer"]')
    await expect(announcer).toContainText(/partnership/i)
  })

  test('maintains proper ARIA structure', async ({ page }) => {
    // Check main section has proper label
    await expect(page.locator('[aria-label="Baseball diamond player layout"]')).toBeVisible()

    // Check that player cards have proper roles
    await expect(page.locator('[data-testid="player-card-north"]')).toHaveAttribute('role', 'button')
    await expect(page.locator('[data-testid="player-card-east"]')).toHaveAttribute('role', 'button')
    await expect(page.locator('[data-testid="player-card-south"]')).toHaveAttribute('role', 'button')
    await expect(page.locator('[data-testid="player-card-west"]')).toHaveAttribute('role', 'button')

    // Check that player cards are keyboard accessible
    await expect(page.locator('[data-testid="player-card-north"]')).toHaveAttribute('tabindex', '0')
  })
})