import { test, expect } from '@playwright/test'

test.describe('Demo Dominoes Showcase - Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/dominoes')
  })

  test('toggles point value display', async ({ page }) => {
    const toggle = page.locator('[data-testid="toggle-point-values"]')
    const domino50 = page.locator('[data-testid="domino-5-0"]')
    
    // Initially point values should be hidden
    await expect(toggle).toContainText('Show Point Values')
    await expect(domino50.locator('.point-value')).not.toBeVisible()
    
    // Click to show point values
    await toggle.click()
    
    // Should show point values for count dominoes
    await expect(toggle).toContainText('Hide Point Values')
    await expect(domino50.locator('.point-value')).toBeVisible()
    await expect(domino50.locator('.point-value')).toContainText('5')
    
    // Check 10-point domino
    const domino64 = page.locator('[data-testid="domino-6-4"]')
    await expect(domino64.locator('.point-value')).toBeVisible()
    await expect(domino64.locator('.point-value')).toContainText('10')
  })

  test('toggles count domino highlighting', async ({ page }) => {
    const toggle = page.locator('[data-testid="toggle-count-highlighting"]')
    const domino50 = page.locator('[data-testid="domino-5-0"]')
    
    // Initially highlighting should be off
    await expect(toggle).toContainText('Show Count Highlighting')
    
    // Click to enable highlighting
    await toggle.click()
    
    await expect(toggle).toContainText('Hide Count Highlighting')
    // Count dominoes should have highlighting class (visual check)
    await expect(domino50).toHaveClass(/highlighted/)
  })

  test('toggles orientation between horizontal and vertical', async ({ page }) => {
    const toggle = page.locator('[data-testid="toggle-orientation"]')
    const firstDomino = page.locator('[data-testid="domino-0-0"]')
    
    // Initially should be horizontal
    await expect(toggle).toContainText('Vertical View')
    await expect(firstDomino).toHaveClass(/horizontal/)
    
    // Click to change to vertical
    await toggle.click()
    
    await expect(toggle).toContainText('Horizontal View')
    await expect(firstDomino).toHaveClass(/vertical/)
  })
})