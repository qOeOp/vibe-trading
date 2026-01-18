import { test, expect } from '@playwright/test';

test('check for console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', exception => {
    errors.push(`Page Error: ${exception.message}`);
  });

  await page.goto('/');
  
  // Wait a bit to ensure JS executes
  await page.waitForTimeout(1000);

  if (errors.length > 0) {
    console.error('Browser Console Errors:', errors);
  }
  
  // Fail if there are any critical errors
  expect(errors.length).toBe(0);
});

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vibe Trading/);
});

test('navigation links work', async ({ page }) => {
  await page.goto('/');

  // Check for the "Documentation" link in hero
  const docLink = page.getByRole('link', { name: 'Documentation' }).first();
  try {
    await expect(docLink).toBeVisible({ timeout: 5000 });
  } catch (e) {
    console.log('--- PAGE CONTENT DUMP ---');
    console.log(await page.content());
    console.log('--- END DUMP ---');
    throw e;
  }
  await docLink.click();

  // Expect URL to change
  await expect(page).toHaveURL(/.*\/architecture\//);
  
  // Check content existence
  // Note: content might load via client-side routing, so we wait for text
  await expect(page.getByText('Multi-Language Monorepo Design')).toBeVisible();
});
