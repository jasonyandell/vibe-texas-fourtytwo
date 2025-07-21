import { Page } from '@playwright/test';

/**
 * Debugging utilities for E2E tests
 */
export class TestDebugUtilities {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Take screenshot for debugging
   */
  async takeDebugScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/debug-${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Print page HTML for debugging
   */
  async printPageHTML(): Promise<void> {
    const html = await this.page.content();
    console.log('=== PAGE HTML ===');
    console.log(html);
    console.log('=== END HTML ===');
  }

  /**
   * Print console errors
   */
  printConsoleErrors(): void {
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`Console error: ${msg.text()}`);
      }
    });

    this.page.on('pageerror', error => {
      console.log(`Page error: ${error.message}`);
    });
  }

  /**
   * Setup comprehensive debugging for failing tests
   */
  setupDebugging(): void {
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`Console error: ${msg.text()}`);
      }
    });

    this.page.on('pageerror', error => {
      console.log(`Page error: ${error.message}`);
    });

    this.page.on('requestfailed', request => {
      console.log(`Failed request: ${request.url()} - ${request.failure()?.errorText}`);
    });
  }
}