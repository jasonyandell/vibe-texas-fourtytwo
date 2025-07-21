import { test, expect } from '@playwright/test'

test.describe('Demo Board Showcase - Display Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/board')
  })

  test('displays game board section with all main elements', async ({ page }) => {
    // Wait for the board section to load
    await expect(page.locator('[data-testid="game-board-section-container"]')).toBeVisible()

    // Check section title and description
    await expect(page.locator('h3')).toContainText('Game Board & Trick Play')
    await expect(page.getByText('Explore the center play area, trick stacks, and scoring displays')).toBeVisible()

    // Check that all main sections are present using more specific selectors
    await expect(page.getByRole('heading', { name: 'Center Play Area' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Trick Stacks' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Score & Game Status' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Game State Examples' })).toBeVisible()
  })

  test('center play area displays current trick correctly', async ({ page }) => {
    // Check center play area is visible
    const centerPlayArea = page.locator('[data-testid="demo-center-play-area"]')
    await expect(centerPlayArea).toBeVisible()

    // Check initial trick display (Opening Trick)
    await expect(page.getByRole('heading', { name: 'Opening Trick' })).toBeVisible()
    await expect(centerPlayArea.getByText('First trick of the hand with mixed suits')).toBeVisible()
    await expect(centerPlayArea.getByText('Winner: North')).toBeVisible()

    // Check that all 4 player positions have dominoes
    await expect(page.locator('[data-testid="played-domino-north"]')).toBeVisible()
    await expect(page.locator('[data-testid="played-domino-east"]')).toBeVisible()
    await expect(page.locator('[data-testid="played-domino-south"]')).toBeVisible()
    await expect(page.locator('[data-testid="played-domino-west"]')).toBeVisible()

    // Check player labels are visible - use CSS module class pattern
    await expect(page.locator('[data-testid="played-domino-north"] [class*="playerLabel"]')).toHaveText('North')
    await expect(page.locator('[data-testid="played-domino-east"] [class*="playerLabel"]')).toHaveText('East')
    await expect(page.locator('[data-testid="played-domino-south"] [class*="playerLabel"]')).toHaveText('South')
    await expect(page.locator('[data-testid="played-domino-west"] [class*="playerLabel"]')).toHaveText('West')
  })

  test('trick stacks display partnership information correctly', async ({ page }) => {
    // Check both partnership stacks are visible
    const nsStack = page.locator('[data-testid="demo-trick-stack-north-south"]')
    const ewStack = page.locator('[data-testid="demo-trick-stack-east-west"]')
    
    await expect(nsStack).toBeVisible()
    await expect(ewStack).toBeVisible()

    // Check partnership labels
    await expect(page.getByRole('heading', { name: 'North-South Partnership' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'East-West Partnership' })).toBeVisible()

    // Check initial trick counts and points (default game state)
    await expect(nsStack.getByText('Tricks: 3')).toBeVisible()
    await expect(nsStack.getByText('Points: 15')).toBeVisible()
    await expect(ewStack.getByText('Tricks: 2')).toBeVisible()
    await expect(ewStack.getByText('Points: 8')).toBeVisible()

    // Check that trick stack items are visible
    await expect(page.locator('[data-testid="trick-stack-item-ns-0"]')).toBeVisible()
    await expect(page.locator('[data-testid="trick-stack-item-ns-1"]')).toBeVisible()
    await expect(page.locator('[data-testid="trick-stack-item-ns-2"]')).toBeVisible()
    await expect(page.locator('[data-testid="trick-stack-item-ew-0"]')).toBeVisible()
    await expect(page.locator('[data-testid="trick-stack-item-ew-1"]')).toBeVisible()
  })

  test('score display shows game status and scores correctly', async ({ page }) => {
    // Check game status card
    const gameStatus = page.locator('[data-testid="demo-game-status"]')
    await expect(gameStatus).toBeVisible()
    await expect(gameStatus.getByText('Phase:')).toBeVisible()
    await expect(gameStatus.getByText('Playing Phase')).toBeVisible()

    // Check current bid information
    await expect(gameStatus.getByText('Current Bid:')).toBeVisible()
    await expect(gameStatus.getByText('32 - Sixes (6s)')).toBeVisible()
    await expect(gameStatus.getByText('by North')).toBeVisible()

    // Check scores display
    const scoresDisplay = page.locator('[data-testid="demo-scores-display"]')
    await expect(scoresDisplay).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Current Hand Scores' })).toBeVisible()

    // Check team scores - use CSS module class pattern
    await expect(scoresDisplay.getByText('North-South')).toBeVisible()
    await expect(scoresDisplay.getByText('East-West')).toBeVisible()
    await expect(scoresDisplay.locator('[class*="scoreValue"]').nth(0)).toHaveText('15') // North-South current score
    await expect(scoresDisplay.locator('[class*="scoreValue"]').nth(1)).toHaveText('8')  // East-West current score
    await expect(scoresDisplay.getByText('Games: 2')).toBeVisible() // North-South game score
    await expect(scoresDisplay.getByText('Games: 1')).toBeVisible() // East-West game score
  })
})