import { test, expect } from '@playwright/test'

test.describe('Demo Dominoes Showcase - Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/dominoes')
  })

  test('allows selecting individual dominoes', async ({ page }) => {
    const domino = page.locator('[data-testid="domino-6-6"]')
    
    // Initially not selected
    await expect(domino).not.toHaveClass(/selected/)
    
    // Click to select
    await domino.click()
    
    await expect(domino).toHaveClass(/selected/)
  })

  test('allows deselecting dominoes', async ({ page }) => {
    const domino = page.locator('[data-testid="domino-6-6"]')
    
    // Select first
    await domino.click()
    await expect(domino).toHaveClass(/selected/)
    
    // Click again to deselect
    await domino.click()
    await expect(domino).not.toHaveClass(/selected/)
  })

  test('allows multiple domino selection', async ({ page }) => {
    const domino1 = page.locator('[data-testid="domino-6-6"]')
    const domino2 = page.locator('[data-testid="domino-5-5"]')
    
    // Select both
    await domino1.click()
    await domino2.click()
    
    await expect(domino1).toHaveClass(/selected/)
    await expect(domino2).toHaveClass(/selected/)
  })

  test('maintains state across control interactions', async ({ page }) => {
    const domino = page.locator('[data-testid="domino-5-0"]')
    const pointToggle = page.locator('[data-testid="toggle-point-values"]')
    const highlightToggle = page.locator('[data-testid="toggle-count-highlighting"]')
    
    // Select a domino
    await domino.click()
    await expect(domino).toHaveClass(/selected/)
    
    // Enable point values
    await pointToggle.click()
    await expect(domino.locator('.point-value')).toBeVisible()
    
    // Enable highlighting
    await highlightToggle.click()
    await expect(domino).toHaveClass(/highlighted/)
    
    // Domino should still be selected
    await expect(domino).toHaveClass(/selected/)
  })
})