import { test, expect } from '@playwright/test'

test.describe('Demo Foundation - Navigation and Routing', () => {
  test('should load demo page successfully', async ({ page }) => {
    await page.goto('/demo')

    // Check that the demo showcase container is present
    await expect(page.locator('[data-testid="demo-showcase"]')).toBeVisible()

    // Check that the demo showcase title is present (more specific selector)
    await expect(page.locator('[data-testid="demo-showcase"] h1')).toContainText('Texas 42 Demo Showcase')
  })

  test('should display navigation tabs for all 5 sections', async ({ page }) => {
    await page.goto('/demo')
    
    // Check that all 5 navigation tabs are present
    await expect(page.locator('[data-testid="nav-dominoes"]')).toBeVisible()
    await expect(page.locator('[data-testid="nav-players"]')).toBeVisible()
    await expect(page.locator('[data-testid="nav-bidding"]')).toBeVisible()
    await expect(page.locator('[data-testid="nav-board"]')).toBeVisible()
    await expect(page.locator('[data-testid="nav-flow"]')).toBeVisible()
    
    // Check that navigation tabs have correct text
    await expect(page.locator('[data-testid="nav-dominoes"]')).toContainText('Dominoes')
    await expect(page.locator('[data-testid="nav-players"]')).toContainText('Players')
    await expect(page.locator('[data-testid="nav-bidding"]')).toContainText('Bidding')
    await expect(page.locator('[data-testid="nav-board"]')).toContainText('Board')
    await expect(page.locator('[data-testid="nav-flow"]')).toContainText('Flow')
  })

  test('should navigate between sections and update URL', async ({ page }) => {
    await page.goto('/demo')
    
    // Click on Dominoes tab
    await page.click('[data-testid="nav-dominoes"]')
    await expect(page).toHaveURL('/demo/dominoes')
    await expect(page.locator('[data-testid="nav-dominoes"]')).toHaveClass(/active/)
    
    // Click on Players tab
    await page.click('[data-testid="nav-players"]')
    await expect(page).toHaveURL('/demo/players')
    await expect(page.locator('[data-testid="nav-players"]')).toHaveClass(/active/)
    
    // Click on Bidding tab
    await page.click('[data-testid="nav-bidding"]')
    await expect(page).toHaveURL('/demo/bidding')
    await expect(page.locator('[data-testid="nav-bidding"]')).toHaveClass(/active/)
  })

  test('should support direct links to sections', async ({ page }) => {
    // Test direct link to dominoes section
    await page.goto('/demo/dominoes')
    await expect(page.locator('[data-testid="demo-showcase"]')).toBeVisible()
    await expect(page.locator('[data-testid="nav-dominoes"]')).toHaveClass(/active/)
    
    // Test direct link to players section
    await page.goto('/demo/players')
    await expect(page.locator('[data-testid="demo-showcase"]')).toBeVisible()
    await expect(page.locator('[data-testid="nav-players"]')).toHaveClass(/active/)
  })

  test('should have responsive layout', async ({ page }) => {
    // Test desktop layout
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.goto('/demo')
    
    // Navigation should be visible on desktop
    const nav = page.locator('[data-testid="demo-navigation"]')
    await expect(nav).toBeVisible()
    
    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/demo')
    
    // Navigation should still be visible on mobile
    await expect(nav).toBeVisible()
  })

  test('should have proper ARIA labels for accessibility', async ({ page }) => {
    await page.goto('/demo')
    
    // Check main landmarks
    await expect(page.locator('[data-testid="demo-showcase"]')).toHaveAttribute('aria-label', 'Texas 42 Demo Showcase')
    
    // Check navigation has proper role
    await expect(page.locator('[data-testid="demo-navigation"]')).toHaveAttribute('role', 'navigation')
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/demo')
    
    // Tab through navigation
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="nav-dominoes"]')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="nav-players"]')).toBeFocused()
    
    // Enter to activate navigation
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL('/demo/players')
    await expect(page.locator('[data-testid="nav-players"]')).toHaveClass(/active/)
  })
})
