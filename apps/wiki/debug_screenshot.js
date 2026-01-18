const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:8216');
    await page.screenshot({ path: 'apps/wiki/debug-home.png', fullPage: true });
    
    // Log the HTML content to checking the link
    const html = await page.content();
    console.log('--- HTML CONTENT START ---');
    console.log(html);
    console.log('--- HTML CONTENT END ---');
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();
