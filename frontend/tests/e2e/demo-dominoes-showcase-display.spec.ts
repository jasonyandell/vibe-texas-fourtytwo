import { test, expect } from '@playwright/test'

test.describe('Demo Dominoes Showcase - Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/dominoes')
  })

  test('displays all 28 dominoes correctly', async ({ page }) => {
    // Wait for the dominoes section to load
    await expect(page.locator('[data-testid="dominoes-section-container"]')).toBeVisible()

    // Check that all 28 dominoes are present in the grid
    const dominoes = page.locator('[data-testid="dominoes-grid"] [data-testid^="domino-"]')
    await expect(dominoes).toHaveCount(28)

    // Check specific dominoes exist
    await expect(page.locator('[data-testid="domino-0-0"]')).toBeVisible()
    await expect(page.locator('[data-testid="domino-6-6"]')).toBeVisible()
    await expect(page.locator('[data-testid="domino-5-0"]')).toBeVisible() // 5-point domino
    await expect(page.locator('[data-testid="domino-6-4"]')).toBeVisible() // 10-point domino
  })



  test('displays section title and description', async ({ page }) => {
    await expect(page.locator('h3')).toContainText('Complete Domino Set')
    await expect(page.getByText('All 28 dominoes from the double-6 set')).toBeVisible()
  })

  test('has all interactive controls', async ({ page }) => {
    await expect(page.locator('[data-testid="toggle-point-values"]')).toBeVisible()
    await expect(page.locator('[data-testid="toggle-count-highlighting"]')).toBeVisible()
    await expect(page.locator('[data-testid="toggle-orientation"]')).toBeVisible()
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