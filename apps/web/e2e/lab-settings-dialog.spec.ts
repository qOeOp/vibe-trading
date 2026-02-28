/**
 * Settings Dialog E2E 测试 — 验证 "Edit AI settings" 按钮能弹出设置模态框
 *
 * 需要先启动 vibe-editor (marimo kernel):
 *   nx run vibe-editor:serve
 *
 * 运行方式：
 *   MARIMO_KERNEL=1 npx playwright test --config=apps/web/e2e/playwright.config.ts apps/web/e2e/lab-settings-dialog.spec.ts
 */

import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

const KERNEL_AVAILABLE = !!process.env.MARIMO_KERNEL;

/**
 * Navigate to lab, click "Try live" CTA, wait for connected state.
 */
async function connectAndStabilize(page: import('@playwright/test').Page) {
  await page.goto('/factor/lab');
  await page.waitForTimeout(2000);

  for (let attempt = 0; attempt < 3; attempt++) {
    // CTA button says "Try live"
    const tryLiveBtn = page.getByRole('button', { name: /Try live/i });
    await expect(tryLiveBtn).toBeVisible({ timeout: 10000 });
    await tryLiveBtn.click();

    // Wait for connected state — lab-fullscreen appears inside MineAppChrome
    const fullscreen = page.locator('[data-slot="lab-fullscreen"]');
    try {
      await expect(fullscreen).toBeVisible({ timeout: 30000 });
    } catch {
      // May not appear on first try — retry
      await page.waitForTimeout(3000);
      continue;
    }

    await page.waitForTimeout(3000);

    // Handle session conflicts
    const takeOverBtn = page.getByRole('button', {
      name: 'Take over session',
    });
    if (await takeOverBtn.isVisible().catch(() => false)) {
      await takeOverBtn.click();
      await page.waitForTimeout(5000);
    }

    // Handle marimo internal "Click to connect"
    const clickToConnect = page.getByRole('button', {
      name: 'Click to connect',
    });
    if (await clickToConnect.isVisible().catch(() => false)) {
      await clickToConnect.click();
      await page.waitForTimeout(5000);
    }

    // Wait for "Connecting to a runtime" to disappear
    const connecting = page.getByRole('button', {
      name: /Connecting to a runtime/,
    });
    await connecting
      .waitFor({ state: 'hidden', timeout: 30000 })
      .catch(() => {});

    await page.waitForTimeout(2000);

    if (await fullscreen.isVisible().catch(() => false)) {
      return;
    }
  }

  // Final assertion
  await expect(page.locator('[data-slot="lab-fullscreen"]')).toBeVisible({
    timeout: 10000,
  });
}

test.describe.serial('Settings Dialog (with kernel)', () => {
  test.skip(
    !KERNEL_AVAILABLE,
    '需要 MARIMO_KERNEL=1 环境变量（本地启动 Marimo kernel）',
  );

  test.setTimeout(120_000);

  test('点击 "Edit AI settings" 打开设置模态框', async ({ page }) => {
    await connectAndStabilize(page);

    // ── Step 1: 打开 AI 面板 ──
    // Activity Bar 中的 "AI 助手" 按钮 (title attribute)
    const aiButton = page.locator('button[title="AI 助手"]');
    await expect(aiButton).toBeVisible({ timeout: 10000 });
    await aiButton.click();
    await page.waitForTimeout(2000);

    // ── Step 2: 找到 "Edit AI settings" 按钮 ──
    // ChatPanel empty state shows this button when no AI provider configured
    const editAiBtn = page.getByRole('button', { name: /Edit AI settings/i });
    await expect(editAiBtn).toBeVisible({ timeout: 10000 });

    // ── Step 3: 点击 "Edit AI settings" ──
    await editAiBtn.click();
    await page.waitForTimeout(1000);

    // ── Step 4: 验证设置模态框弹出 ──
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Dialog 内应包含 AI 类别 tab（因为 handleClick("ai") 设置了 activeCategory）
    const aiTab = dialog.getByText('AI', { exact: true });
    await expect(aiTab).toBeVisible({ timeout: 5000 });

    // ── Step 5: 验证 AI Providers 子 tab 可见 ──
    const providersTab = dialog.getByRole('tab', { name: /Providers/i });
    await expect(providersTab).toBeVisible({ timeout: 5000 });

    // ── Step 6: 关闭模态框 ──
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible({ timeout: 5000 });
  });
});
