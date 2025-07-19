import { test, expect } from '@playwright/test'

test.describe('Demo Players Showcase', () => {
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

    // Check status indicators
    await expect(page.getByText('Ready')).toBeVisible()
    await expect(page.getByText('Current Turn')).toBeVisible()
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
