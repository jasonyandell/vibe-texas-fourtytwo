import { test, expect } from '@playwright/test'

test.describe('Demo Board Showcase - Navigation & Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/board')
  })

  test('trick cycling navigation works correctly', async ({ page }) => {
    const centerPlayArea = page.locator('[data-testid="demo-center-play-area"]')
    
    // Check initial state
    await expect(page.getByRole('heading', { name: 'Opening Trick' })).toBeVisible()
    await expect(centerPlayArea.getByText('1 of 3')).toBeVisible()

    // Test next button
    await page.click('[data-testid="next-trick-button"]')
    await expect(page.getByRole('heading', { name: 'Trump Trick' })).toBeVisible()
    await expect(centerPlayArea.getByText('Trick won with trump dominoes (sixes)')).toBeVisible()
    await expect(centerPlayArea.getByText('Winner: South')).toBeVisible()
    await expect(centerPlayArea.getByText('2 of 3')).toBeVisible()

    // Test next button again
    await page.click('[data-testid="next-trick-button"]')
    await expect(page.getByRole('heading', { name: 'Count Domino Trick' })).toBeVisible()
    await expect(centerPlayArea.getByText('High-value trick with multiple count dominoes')).toBeVisible()
    await expect(centerPlayArea.getByText('Winner: South')).toBeVisible()
    await expect(centerPlayArea.getByText('3 of 3')).toBeVisible()

    // Test wrapping to first trick
    await page.click('[data-testid="next-trick-button"]')
    await expect(page.getByRole('heading', { name: 'Opening Trick' })).toBeVisible()
    await expect(centerPlayArea.getByText('1 of 3')).toBeVisible()

    // Test previous button
    await page.click('[data-testid="prev-trick-button"]')
    await expect(page.getByRole('heading', { name: 'Count Domino Trick' })).toBeVisible()
    await expect(centerPlayArea.getByText('3 of 3')).toBeVisible()
  })

  test('game state switching updates all displays correctly', async ({ page }) => {
    const gameStatus = page.locator('[data-testid="demo-game-status"]')
    const scoresDisplay = page.locator('[data-testid="demo-scores-display"]')
    const nsStack = page.locator('[data-testid="demo-trick-stack-north-south"]')
    const ewStack = page.locator('[data-testid="demo-trick-stack-east-west"]')
    
    // Check initial state (Playing Phase)
    await expect(gameStatus.getByText('Playing Phase')).toBeVisible()
    await expect(scoresDisplay.locator('[class*="scoreValue"]').nth(0)).toHaveText('15') // North-South score
    await expect(scoresDisplay.locator('[class*="scoreValue"]').nth(1)).toHaveText('8')  // East-West score
    await expect(nsStack.getByText('Tricks: 3')).toBeVisible() // North-South tricks
    await expect(ewStack.getByText('Tricks: 2')).toBeVisible() // East-West tricks

    // Switch to Scoring Phase
    await page.click('[data-testid="game-state-button-1"]')
    
    // Check updated displays
    await expect(gameStatus.getByText('Scoring Phase')).toBeVisible()
    await expect(scoresDisplay.locator('[class*="scoreValue"]').nth(0)).toHaveText('28') // Updated North-South score
    await expect(scoresDisplay.locator('[class*="scoreValue"]').nth(1)).toHaveText('14') // Updated East-West score
    await expect(nsStack.getByText('Tricks: 4')).toBeVisible() // Updated North-South tricks
    await expect(ewStack.getByText('Tricks: 3')).toBeVisible() // Updated East-West tricks

    // Check bid information updated
    await expect(gameStatus.getByText('35 - Fours (4s)')).toBeVisible()
    await expect(gameStatus.getByText('by East')).toBeVisible()

    // Switch to Game Finished
    await page.click('[data-testid="game-state-button-2"]')
    
    // Check final state
    await expect(gameStatus.getByText('Game Finished')).toBeVisible()
    await expect(scoresDisplay.locator('[class*="scoreValue"]').nth(0)).toHaveText('42') // North-South final score
    await expect(scoresDisplay.locator('[class*="scoreValue"]').nth(1)).toHaveText('0')  // East-West final score
    await expect(nsStack.getByText('Tricks: 7')).toBeVisible() // North-South all tricks
    await expect(ewStack.getByText('Tricks: 0')).toBeVisible() // East-West no tricks

    // Check bid information
    await expect(gameStatus.getByText('42 - Blanks (0s)')).toBeVisible()
    await expect(gameStatus.getByText('by South')).toBeVisible()

    // Check game scores updated
    await expect(scoresDisplay.getByText('Games: 3')).toBeVisible() // North-South wins
    await expect(scoresDisplay.getByText('Games: 2')).toBeVisible() // East-West games
  })

  test('game state buttons show active state correctly', async ({ page }) => {
    // Check initial state - first button should be selected by comparing data
    const button0 = page.locator('[data-testid="game-state-button-0"]')
    const button1 = page.locator('[data-testid="game-state-button-1"]')
    const button2 = page.locator('[data-testid="game-state-button-2"]')
    
    // Initially, Playing Phase (15-8) should be selected
    await expect(button0.locator('[class*="buttonScore"]')).toHaveText('15-8')
    await expect(button1.locator('[class*="buttonScore"]')).toHaveText('28-14')
    await expect(button2.locator('[class*="buttonScore"]')).toHaveText('42-0')
    
    // Verify game state displays match button 0 initially
    const gameStatus = page.locator('[data-testid="demo-game-status"]')
    await expect(gameStatus.getByText('Playing Phase')).toBeVisible()

    // Click second button and verify state change
    await button1.click()
    await expect(gameStatus.getByText('Scoring Phase')).toBeVisible()

    // Click third button and verify state change
    await button2.click()
    await expect(gameStatus.getByText('Game Finished')).toBeVisible()
    
    // Click first button again to verify cycling back
    await button0.click()
    await expect(gameStatus.getByText('Playing Phase')).toBeVisible()
  })

  test('keyboard navigation works for interactive elements', async ({ page }) => {
    const gameStatus = page.locator('[data-testid="demo-game-status"]')
    
    // Focus on next trick button and use keyboard
    await page.focus('[data-testid="next-trick-button"]')
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { name: 'Trump Trick' })).toBeVisible()

    // Focus on previous trick button and use keyboard
    await page.focus('[data-testid="prev-trick-button"]')
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { name: 'Opening Trick' })).toBeVisible()

    // Focus on game state button and use keyboard
    await page.focus('[data-testid="game-state-button-1"]')
    await page.keyboard.press('Enter')
    await expect(gameStatus.getByText('Scoring Phase')).toBeVisible()
  })
})