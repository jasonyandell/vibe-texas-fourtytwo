import { test, expect } from '@playwright/test'

test.describe('Demo Dominoes Showcase', () => {
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

  test('has responsive grid layout', async ({ page }) => {
    const grid = page.locator('[data-testid="dominoes-grid"]')
    await expect(grid).toBeVisible()

    // Check that grid has proper CSS grid properties
    const gridStyles = await grid.evaluate(el => {
      const styles = window.getComputedStyle(el)
      return {
        display: styles.display
      }
    })

    expect(gridStyles.display).toBe('grid')

    // Check that dominoes are arranged in a grid layout
    const dominoes = page.locator('[data-testid="dominoes-grid"] [data-testid^="domino-"]')
    await expect(dominoes.first()).toBeVisible()
    await expect(dominoes.last()).toBeVisible()
  })

  test('works on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Should still show all dominoes
    const dominoes = page.locator('[data-testid="dominoes-grid"] [data-testid^="domino-"]')
    await expect(dominoes).toHaveCount(28)
    
    // Controls should be stacked vertically on mobile
    const controls = page.locator('[data-testid="toggle-point-values"]')
    await expect(controls).toBeVisible()
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
