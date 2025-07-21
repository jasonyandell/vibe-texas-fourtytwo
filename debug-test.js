const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Collect console messages and errors
  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  try {
    await page.goto('http://localhost:3000/demo');
    await page.waitForTimeout(5000); // Wait for any errors to appear
    
    // Check if the page loaded correctly
    const title = await page.title();
    console.log('Page title:', title);
    
    const content = await page.content();
    console.log('Page content length:', content.length);
    
    // Try to find elements
    const demoShowcase = await page.locator('[data-testid="demo-showcase"]').count();
    console.log('Demo showcase elements found:', demoShowcase);
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
  
  await browser.close();
})();