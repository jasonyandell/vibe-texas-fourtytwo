import { test, expect } from '@playwright/test'

test.describe('Demo Board Showcase - State Consistency', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/board')
  })

  test('maintains state consistency across interactions', async ({ page }) => {
    const gameStatus = page.locator('[data-testid="demo-game-status"]')
    const scoresDisplay = page.locator('[data-testid="demo-scores-display"]')
    
    // Change game state first
    await page.click('[data-testid="game-state-button-1"]')
    await expect(gameStatus.getByText('Scoring Phase')).toBeVisible()
    await expect(scoresDisplay.locator('[class*="scoreValue"]').nth(0)).toHaveText('28') // Updated score

    // Change trick
    await page.click('[data-testid="next-trick-button"]')
    await expect(page.getByRole('heading', { name: 'Trump Trick' })).toBeVisible()

    // Game state should remain the same
    await expect(gameStatus.getByText('Scoring Phase')).toBeVisible()
    await expect(scoresDisplay.locator('[class*="scoreValue"]').nth(0)).toHaveText('28') // Score should still be updated

    // Change game state again
    await page.click('[data-testid="game-state-button-2"]')
    await expect(gameStatus.getByText('Game Finished')).toBeVisible()

    // Trick should remain the same
    await expect(page.getByRole('heading', { name: 'Trump Trick' })).toBeVisible()
  })
})