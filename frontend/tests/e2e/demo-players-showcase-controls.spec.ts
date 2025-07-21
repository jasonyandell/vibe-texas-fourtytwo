import { test, expect } from '@playwright/test'

test.describe('Demo Players Showcase - Interactive Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/players')
  })

  test('hand visibility controls work', async ({ page }) => {
    // Check that hand visibility toggle exists
    await expect(page.locator('[data-testid="toggle-hand-visibility"]')).toBeVisible()
    await expect(page.getByText('Show Player Hands')).toBeVisible()

    // Hands should be hidden by default
    await expect(page.locator('[data-testid^="domino-hand-"]')).toHaveCount(0)

    // Enable hand visibility
    await page.locator('[data-testid="toggle-hand-visibility"]').click()

    // Should show domino hands for all 4 players
    await expect(page.locator('[data-testid^="domino-hand-"]')).toHaveCount(4)

    // Check face-down toggle
    await expect(page.locator('[data-testid="toggle-face-down"]')).toBeVisible()
    await page.locator('[data-testid="toggle-face-down"]').click()

    // Hands should be face-down (check for CSS module class)
    const hands = page.locator('[data-testid^="domino-hand-"]')
    for (let i = 0; i < await hands.count(); i++) {
      await expect(hands.nth(i)).toHaveClass(/faceDown/)
    }
  })

  test('dealer rotation works', async ({ page }) => {
    // Find initial dealer
    const initialDealerCard = page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Dealer' })
    const initialDealerPosition = await initialDealerCard.getAttribute('data-testid')

    // Click dealer rotation toggle
    await page.locator('[data-testid="toggle-dealer-rotation"]').click()

    // Find new dealer
    const newDealerCard = page.locator('[data-testid^="player-card-"]').filter({ hasText: 'Dealer' })
    const newDealerPosition = await newDealerCard.getAttribute('data-testid')

    // Dealer should have changed
    expect(newDealerPosition).not.toBe(initialDealerPosition)
  })

  test('interactive controls are accessible', async ({ page }) => {
    // Check that all controls have proper labels
    await expect(page.locator('[data-testid="toggle-hand-visibility"]')).toBeVisible()
    await expect(page.locator('[data-testid="toggle-face-down"]')).toBeVisible()
    await expect(page.locator('[data-testid="toggle-dealer-rotation"]')).toBeVisible()

    // Check that controls section has proper ARIA label
    await expect(page.locator('[aria-label="Player interaction controls"]')).toBeVisible()
  })
})