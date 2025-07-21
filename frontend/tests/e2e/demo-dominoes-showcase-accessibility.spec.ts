import { test, expect } from '@playwright/test'

test.describe('Demo Dominoes Showcase - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/dominoes')
  })

  test('has proper accessibility features', async ({ page }) => {
    // Check ARIA labels and roles
    const section = page.locator('[data-testid="dominoes-section-container"]')
    await expect(section).toHaveAttribute('aria-label', 'Complete domino set showcase')
    
    const grid = page.locator('[data-testid="dominoes-grid"]')
    await expect(grid).toHaveAttribute('role', 'grid')
    await expect(grid).toHaveAttribute('aria-label', 'All 28 dominoes from double-6 set')
    
    // Check that dominoes are keyboard accessible
    const firstDomino = page.locator('[data-testid="domino-0-0"]')
    await expect(firstDomino).toHaveAttribute('tabindex', '0')
    await expect(firstDomino).toHaveAttribute('role', 'button')
  })

  test('announces selection changes to screen readers', async ({ page }) => {
    const announcer = page.locator('[data-testid="selection-announcer"]')
    await expect(announcer).toHaveAttribute('aria-live', 'polite')
    await expect(announcer).toHaveAttribute('aria-atomic', 'true')
    
    // Select a domino and check announcement
    const domino = page.locator('[data-testid="domino-6-6"]')
    await domino.click()
    
    await expect(announcer).toContainText('Selected domino 6-6')
  })

  test('supports keyboard navigation', async ({ page }) => {
    const firstDomino = page.locator('[data-testid="domino-0-0"]')
    
    // Focus the first domino
    await firstDomino.focus()
    await expect(firstDomino).toBeFocused()
    
    // Press Enter to select
    await page.keyboard.press('Enter')
    await expect(firstDomino).toHaveClass(/selected/)
  })
})