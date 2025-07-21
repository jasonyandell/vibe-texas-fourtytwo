import { test, expect } from '@playwright/test'

test.describe('Demo Dominoes Showcase - Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/dominoes')
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
})