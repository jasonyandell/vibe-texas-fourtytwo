import { test, expect } from '@playwright/test'

test.describe('Demo Foundation', () => {
  test('should load demo page successfully', async ({ page }) => {
    await page.goto('/demo')

    // Check that the demo showcase container is present
    await expect(page.locator('[data-testid="demo-showcase"]')).toBeVisible()

    // Check that the demo showcase title is present
    await expect(page.locator('[data-testid="demo-showcase"] h1')).toContainText('Texas 42 Demo Showcase')
  })

  test('should display all navigation tabs', async ({ page }) => {
    await page.goto('/demo')

    // Check that navigation is visible
    await expect(page.locator('[data-testid="demo-navigation"]')).toBeVisible()

    // Check that all 5 navigation tabs are present
    await expect(page.locator('[data-testid="nav-dominoes"]')).toBeVisible()
    await expect(page.locator('[data-testid="nav-players"]')).toBeVisible()
    await expect(page.locator('[data-testid="nav-bidding"]')).toBeVisible()
    await expect(page.locator('[data-testid="nav-board"]')).toBeVisible()
    await expect(page.locator('[data-testid="nav-flow"]')).toBeVisible()
  })

  test('should navigate to different sections', async ({ page }) => {
    await page.goto('/demo')

    // Wait for navigation to be ready
    await expect(page.locator('[data-testid="demo-navigation"]')).toBeVisible()

    // Navigate to players section
    await page.click('[data-testid="nav-players"]')
    await expect(page).toHaveURL('/demo/players')
    await expect(page.locator('[data-testid="nav-players"]')).toHaveClass(/active/)

    // Navigate to bidding section
    await page.click('[data-testid="nav-bidding"]')
    await expect(page).toHaveURL('/demo/bidding')
    await expect(page.locator('[data-testid="nav-bidding"]')).toHaveClass(/active/)

    // Verify previous tab is no longer active
    await expect(page.locator('[data-testid="nav-players"]')).not.toHaveClass(/active/)
  })

  test('should support direct URL navigation', async ({ page }) => {
    // Navigate directly to dominoes section
    await page.goto('/demo/dominoes')
    await expect(page.locator('[data-testid="demo-showcase"]')).toBeVisible()
    await expect(page.locator('[data-testid="nav-dominoes"]')).toHaveClass(/active/)

    // Navigate directly to flow section
    await page.goto('/demo/flow')
    await expect(page.locator('[data-testid="demo-showcase"]')).toBeVisible()
    await expect(page.locator('[data-testid="nav-flow"]')).toHaveClass(/active/)

    // Verify other tabs are not active
    await expect(page.locator('[data-testid="nav-dominoes"]')).not.toHaveClass(/active/)
  })

  test('should have proper accessibility features', async ({ page }) => {
    await page.goto('/demo')

    // Check ARIA labels and roles
    await expect(page.locator('[data-testid="demo-showcase"]')).toHaveAttribute('aria-label', 'Texas 42 Demo Showcase')
    await expect(page.locator('[data-testid="demo-navigation"]')).toHaveAttribute('role', 'navigation')
    await expect(page.locator('[data-testid="demo-navigation"]')).toHaveAttribute('aria-label', 'Demo sections navigation')

    // Check that navigation links have proper accessibility attributes
    await expect(page.locator('[data-testid="nav-dominoes"]')).toHaveAttribute('tabindex', '0')
    await expect(page.locator('[data-testid="nav-players"]')).toHaveAttribute('tabindex', '0')

    // Check aria-current for active section (default should be dominoes)
    await page.goto('/demo/dominoes')
    await expect(page.locator('[data-testid="nav-dominoes"]')).toHaveAttribute('aria-current', 'page')
  })
})
