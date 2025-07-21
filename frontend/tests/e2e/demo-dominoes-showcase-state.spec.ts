import { test, expect } from '@playwright/test'

test.describe('Demo Dominoes Showcase - State Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/dominoes')
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

  test('shows correct point values for all count dominoes', async ({ page }) => {
    const pointToggle = page.locator('[data-testid="toggle-point-values"]')
    await pointToggle.click()
    
    // Check 5-point dominoes
    await expect(page.locator('[data-testid="domino-5-0"] .point-value')).toContainText('5')
    await expect(page.locator('[data-testid="domino-4-1"] .point-value')).toContainText('5')
    await expect(page.locator('[data-testid="domino-3-2"] .point-value')).toContainText('5')
    
    // Check 10-point dominoes
    await expect(page.locator('[data-testid="domino-6-4"] .point-value')).toContainText('10')
    await expect(page.locator('[data-testid="domino-5-5"] .point-value')).toContainText('10')
  })
})