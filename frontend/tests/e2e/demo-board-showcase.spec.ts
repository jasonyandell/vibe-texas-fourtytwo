import { test, expect } from '@playwright/test'

test.describe('Demo Board Showcase', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/board')
  })

  test('displays game board section with all main elements', async ({ page }) => {
    // Wait for the board section to load
    await expect(page.locator('[data-testid="game-board-section-container"]')).toBeVisible()

    // Check section title and description
    await expect(page.locator('h3')).toContainText('Game Board & Trick Play')
    await expect(page.getByText('Explore the center play area, trick stacks, and scoring displays')).toBeVisible()

    // Check that all main sections are present
    await expect(page.getByText('Center Play Area')).toBeVisible()
    await expect(page.getByText('Trick Stacks')).toBeVisible()
    await expect(page.getByText('Score & Game Status')).toBeVisible()
    await expect(page.getByText('Game State Examples')).toBeVisible()
  })

  test('center play area displays current trick correctly', async ({ page }) => {
    // Check center play area is visible
    await expect(page.locator('[data-testid="demo-center-play-area"]')).toBeVisible()

    // Check initial trick display (Opening Trick)
    await expect(page.getByText('Opening Trick')).toBeVisible()
    await expect(page.getByText('First trick of the hand with mixed suits')).toBeVisible()
    await expect(page.getByText('Winner: North')).toBeVisible()

    // Check that all 4 player positions have dominoes
    await expect(page.locator('[data-testid="played-domino-north"]')).toBeVisible()
    await expect(page.locator('[data-testid="played-domino-east"]')).toBeVisible()
    await expect(page.locator('[data-testid="played-domino-south"]')).toBeVisible()
    await expect(page.locator('[data-testid="played-domino-west"]')).toBeVisible()

    // Check player labels are visible
    await expect(page.getByText('North')).toBeVisible()
    await expect(page.getByText('East')).toBeVisible()
    await expect(page.getByText('South')).toBeVisible()
    await expect(page.getByText('West')).toBeVisible()
  })

  test('trick cycling navigation works correctly', async ({ page }) => {
    // Check initial state
    await expect(page.getByText('Opening Trick')).toBeVisible()
    await expect(page.getByText('1 of 3')).toBeVisible()

    // Test next button
    await page.click('[data-testid="next-trick-button"]')
    await expect(page.getByText('Trump Trick')).toBeVisible()
    await expect(page.getByText('Trick won with trump dominoes (sixes)')).toBeVisible()
    await expect(page.getByText('Winner: South')).toBeVisible()
    await expect(page.getByText('2 of 3')).toBeVisible()

    // Test next button again
    await page.click('[data-testid="next-trick-button"]')
    await expect(page.getByText('Count Domino Trick')).toBeVisible()
    await expect(page.getByText('High-value trick with multiple count dominoes')).toBeVisible()
    await expect(page.getByText('Winner: South')).toBeVisible()
    await expect(page.getByText('3 of 3')).toBeVisible()

    // Test wrapping to first trick
    await page.click('[data-testid="next-trick-button"]')
    await expect(page.getByText('Opening Trick')).toBeVisible()
    await expect(page.getByText('1 of 3')).toBeVisible()

    // Test previous button
    await page.click('[data-testid="prev-trick-button"]')
    await expect(page.getByText('Count Domino Trick')).toBeVisible()
    await expect(page.getByText('3 of 3')).toBeVisible()
  })

  test('trick stacks display partnership information correctly', async ({ page }) => {
    // Check both partnership stacks are visible
    await expect(page.locator('[data-testid="demo-trick-stack-north-south"]')).toBeVisible()
    await expect(page.locator('[data-testid="demo-trick-stack-east-west"]')).toBeVisible()

    // Check partnership labels
    await expect(page.getByText('North-South Partnership')).toBeVisible()
    await expect(page.getByText('East-West Partnership')).toBeVisible()

    // Check initial trick counts and points (default game state)
    await expect(page.getByText('Tricks: 3')).toBeVisible()
    await expect(page.getByText('Points: 15')).toBeVisible()
    await expect(page.getByText('Tricks: 2')).toBeVisible()
    await expect(page.getByText('Points: 8')).toBeVisible()

    // Check that trick stack items are visible
    await expect(page.locator('[data-testid="trick-stack-item-ns-0"]')).toBeVisible()
    await expect(page.locator('[data-testid="trick-stack-item-ns-1"]')).toBeVisible()
    await expect(page.locator('[data-testid="trick-stack-item-ns-2"]')).toBeVisible()
    await expect(page.locator('[data-testid="trick-stack-item-ew-0"]')).toBeVisible()
    await expect(page.locator('[data-testid="trick-stack-item-ew-1"]')).toBeVisible()
  })

  test('score display shows game status and scores correctly', async ({ page }) => {
    // Check game status card
    await expect(page.locator('[data-testid="demo-game-status"]')).toBeVisible()
    await expect(page.getByText('Phase:')).toBeVisible()
    await expect(page.getByText('Playing Phase')).toBeVisible()

    // Check current bid information
    await expect(page.getByText('Current Bid:')).toBeVisible()
    await expect(page.getByText('32 - Sixes (6s)')).toBeVisible()
    await expect(page.getByText('by North')).toBeVisible()

    // Check scores display
    await expect(page.locator('[data-testid="demo-scores-display"]')).toBeVisible()
    await expect(page.getByText('Current Hand Scores')).toBeVisible()

    // Check team scores
    await expect(page.getByText('North-South')).toBeVisible()
    await expect(page.getByText('East-West')).toBeVisible()
    await expect(page.getByText('15')).toBeVisible() // North-South current score
    await expect(page.getByText('8')).toBeVisible()  // East-West current score
    await expect(page.getByText('Games: 2')).toBeVisible() // North-South game score
    await expect(page.getByText('Games: 1')).toBeVisible() // East-West game score
  })

  test('game state switching updates all displays correctly', async ({ page }) => {
    // Check initial state (Playing Phase)
    await expect(page.getByText('Playing Phase')).toBeVisible()
    await expect(page.getByText('15')).toBeVisible() // North-South score
    await expect(page.getByText('8')).toBeVisible()  // East-West score
    await expect(page.getByText('Tricks: 3')).toBeVisible() // North-South tricks
    await expect(page.getByText('Tricks: 2')).toBeVisible() // East-West tricks

    // Switch to Scoring Phase
    await page.click('[data-testid="game-state-button-1"]')
    
    // Check updated displays
    await expect(page.getByText('Scoring Phase')).toBeVisible()
    await expect(page.getByText('28')).toBeVisible() // Updated North-South score
    await expect(page.getByText('14')).toBeVisible() // Updated East-West score
    await expect(page.getByText('Tricks: 4')).toBeVisible() // Updated North-South tricks
    await expect(page.getByText('Tricks: 3')).toBeVisible() // Updated East-West tricks

    // Check bid information updated
    await expect(page.getByText('35 - Fours (4s)')).toBeVisible()
    await expect(page.getByText('by East')).toBeVisible()

    // Switch to Game Finished
    await page.click('[data-testid="game-state-button-2"]')
    
    // Check final state
    await expect(page.getByText('Game Finished')).toBeVisible()
    await expect(page.getByText('42')).toBeVisible() // North-South final score
    await expect(page.getByText('0')).toBeVisible()  // East-West final score
    await expect(page.getByText('Tricks: 7')).toBeVisible() // North-South all tricks
    await expect(page.getByText('Tricks: 0')).toBeVisible() // East-West no tricks

    // Check bid information
    await expect(page.getByText('42 - Blanks (0s)')).toBeVisible()
    await expect(page.getByText('by South')).toBeVisible()

    // Check game scores updated
    await expect(page.getByText('Games: 3')).toBeVisible() // North-South wins
    await expect(page.getByText('Games: 2')).toBeVisible() // East-West games
  })

  test('game state buttons show active state correctly', async ({ page }) => {
    // Initially first button should be active
    await expect(page.locator('[data-testid="game-state-button-0"]')).toHaveClass(/active/)
    await expect(page.locator('[data-testid="game-state-button-1"]')).not.toHaveClass(/active/)
    await expect(page.locator('[data-testid="game-state-button-2"]')).not.toHaveClass(/active/)

    // Click second button
    await page.click('[data-testid="game-state-button-1"]')
    await expect(page.locator('[data-testid="game-state-button-0"]')).not.toHaveClass(/active/)
    await expect(page.locator('[data-testid="game-state-button-1"]')).toHaveClass(/active/)
    await expect(page.locator('[data-testid="game-state-button-2"]')).not.toHaveClass(/active/)

    // Click third button
    await page.click('[data-testid="game-state-button-2"]')
    await expect(page.locator('[data-testid="game-state-button-0"]')).not.toHaveClass(/active/)
    await expect(page.locator('[data-testid="game-state-button-1"]')).not.toHaveClass(/active/)
    await expect(page.locator('[data-testid="game-state-button-2"]')).toHaveClass(/active/)
  })

  test('keyboard navigation works for interactive elements', async ({ page }) => {
    // Focus on next trick button and use keyboard
    await page.focus('[data-testid="next-trick-button"]')
    await page.keyboard.press('Enter')
    await expect(page.getByText('Trump Trick')).toBeVisible()

    // Focus on previous trick button and use keyboard
    await page.focus('[data-testid="prev-trick-button"]')
    await page.keyboard.press('Enter')
    await expect(page.getByText('Opening Trick')).toBeVisible()

    // Focus on game state button and use keyboard
    await page.focus('[data-testid="game-state-button-1"]')
    await page.keyboard.press('Enter')
    await expect(page.getByText('Scoring Phase')).toBeVisible()
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

    // Test that trick cycling still works
    await page.click('[data-testid="next-trick-button"]')
    await expect(page.getByText('Trump Trick')).toBeVisible()

    // Test that game state switching still works
    await page.click('[data-testid="game-state-button-1"]')
    await expect(page.getByText('Scoring Phase')).toBeVisible()
  })

  test('maintains state consistency across interactions', async ({ page }) => {
    // Change game state first
    await page.click('[data-testid="game-state-button-1"]')
    await expect(page.getByText('Scoring Phase')).toBeVisible()
    await expect(page.getByText('28')).toBeVisible() // Updated score

    // Change trick
    await page.click('[data-testid="next-trick-button"]')
    await expect(page.getByText('Trump Trick')).toBeVisible()

    // Game state should remain the same
    await expect(page.getByText('Scoring Phase')).toBeVisible()
    await expect(page.getByText('28')).toBeVisible() // Score should still be updated

    // Change game state again
    await page.click('[data-testid="game-state-button-2"]')
    await expect(page.getByText('Game Finished')).toBeVisible()

    // Trick should remain the same
    await expect(page.getByText('Trump Trick')).toBeVisible()
  })
})
