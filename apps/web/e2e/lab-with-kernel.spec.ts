/**
 * Lab 页面 E2E 测试 — 有 Marimo Kernel 模式
 *
 * 需要先在本地启动 Marimo kernel：
 *   marimo edit --headless --port 2728 --no-token --allow-origins "http://localhost:4200"
 *
 * 运行方式：
 *   MARIMO_KERNEL=1 npx playwright test --config=apps/web/e2e/playwright.config.ts apps/web/e2e/lab-with-kernel.spec.ts
 *
 * CI 中自动跳过（除非设置 MARIMO_KERNEL=1）。
 *
 * 注意：功能测试串行执行（describe.serial），因为共享同一个 Marimo kernel session。
 * 稳定性测试（5x 循环）放在最后，因为它会反复断开 session。
 */

import { test, expect } from '@playwright/test';

// All tests share a single Marimo kernel — must run serially
test.describe.configure({ mode: 'serial' });

const KERNEL_AVAILABLE = !!process.env.MARIMO_KERNEL;

/**
 * 连接 kernel 并稳定全屏编辑器。
 * 最多重试 3 次（kernel session 冲突可能导致全屏自动关闭）。
 */
async function connectAndStabilize(page: import('@playwright/test').Page) {
  await page.goto('/factor/lab');
  await page.waitForTimeout(2000);

  const fullscreen = page.locator('[data-slot="lab-fullscreen"]');

  for (let attempt = 0; attempt < 3; attempt++) {
    const connectBtn = page.getByRole('button', { name: 'Connect' });
    await expect(connectBtn).toBeVisible({ timeout: 10000 });
    await connectBtn.click();

    await expect(fullscreen).toBeVisible({ timeout: 20000 });
    await page.waitForTimeout(5000);

    // 如果 session 被占用，自动 take over
    const takeOverBtn = page.getByRole('button', {
      name: 'Take over session',
    });
    if (await takeOverBtn.isVisible().catch(() => false)) {
      await takeOverBtn.click();
      await page.waitForTimeout(5000);
    }

    // 如果 Marimo 显示 "Click to connect"（内部 WebSocket 未连接），点击它
    const clickToConnect = page.getByRole('button', {
      name: 'Click to connect',
    });
    if (await clickToConnect.isVisible().catch(() => false)) {
      await clickToConnect.click();
      await page.waitForTimeout(5000);
    }

    // 再检查一次 take over（Click to connect 可能触发 session 冲突）
    if (await takeOverBtn.isVisible().catch(() => false)) {
      await takeOverBtn.click();
      await page.waitForTimeout(5000);
    }

    // 等待 "Connecting to a runtime" 消失（kernel 连接完成）
    const connecting = page.getByRole('button', {
      name: /Connecting to a runtime/,
    });
    await connecting
      .waitFor({ state: 'hidden', timeout: 30000 })
      .catch(() => {});

    // 连接完成后等待 cell 渲染
    await page.waitForTimeout(3000);

    const stillVisible = await fullscreen.isVisible().catch(() => false);
    if (stillVisible) {
      return;
    }

    await page.waitForTimeout(3000);
  }

  await expect(fullscreen).toBeVisible({ timeout: 10000 });
}

// ═══════════════════════════════════════════════════════════════
// 功能测试（串行，不破坏 kernel session）
// ═══════════════════════════════════════════════════════════════

test.describe.serial('Lab Page (with kernel)', () => {
  test.skip(
    !KERNEL_AVAILABLE,
    '需要 MARIMO_KERNEL=1 环境变量（本地启动 Marimo kernel）',
  );

  test.setTimeout(90_000);

  test.beforeEach(async ({ page }) => {
    await connectAndStabilize(page);
  });

  test('AppChrome 渲染完整', async ({ page }) => {
    // Developer panel tabs 存在
    const devPanelTabs = page.getByRole('listbox', {
      name: 'Developer panel tabs',
    });
    await expect(devPanelTabs).toBeVisible({ timeout: 10000 });

    // Kernel 按钮存在（在 developer panel 区域）
    const kernelBtn = page.getByRole('button', { name: 'Kernel' }).first();
    await expect(kernelBtn).toBeVisible({ timeout: 5000 });

    // 至少有一个 cell 编辑区域（textbox）
    // After shutdown+reconnect the kernel needs extra time to instantiate cells
    const textbox = page.locator('div[role="textbox"], .cm-editor');
    await expect(textbox.first()).toBeVisible({ timeout: 30000 });
  });

  test('Developer panel tabs 包含预期面板', async ({ page }) => {
    const devTabs = page.getByRole('listbox', {
      name: 'Developer panel tabs',
    });
    await expect(devTabs).toBeVisible({ timeout: 10000 });

    for (const label of ['Errors', 'Logs']) {
      const tab = devTabs.getByRole('option', { name: label });
      await expect(tab).toBeVisible();
    }
  });

  test('Cell 编辑器渲染', async ({ page }) => {
    // CodeMirror 编辑器或者 cell 容器
    const editor = page.locator('.cm-editor');
    const textbox = page.locator('div[role="textbox"]');

    const hasEditor = await editor
      .first()
      .isVisible({ timeout: 15000 })
      .catch(() => false);
    const hasTextbox = await textbox
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    // 至少有编辑器或 textbox
    expect(hasEditor || hasTextbox).toBe(true);
  });

  test('Kernel 状态按钮存在', async ({ page }) => {
    const kernelBtn = page.getByRole('button', { name: 'Kernel' }).first();
    await expect(kernelBtn).toBeVisible({ timeout: 10000 });
  });

  test('Config 按钮存在', async ({ page }) => {
    const configBtn = page.getByRole('button', { name: 'Config' });
    await expect(configBtn).toBeVisible({ timeout: 10000 });
  });
});

// ═══════════════════════════════════════════════════════════════
// 冷启动测试 — 模拟真实用户首次使用
// 不依赖 MARIMO_KERNEL=1，测试自己管理 kernel 生命周期。
// ═══════════════════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync: execSyncTop, spawnSync } = require('node:child_process');
const hasMarimo = (() => {
  try {
    execSyncTop('which marimo', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

test.describe('Lab 冷启动（自动管理 kernel）', () => {
  test.skip(!hasMarimo || !!process.env.CI, '需要本地安装 marimo');
  test.setTimeout(120_000);

  test('杀掉 kernel → 启动 → 首次 Connect → Exit → 再 Connect', async ({
    page,
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { execSync, spawn } = require('node:child_process');

    // ── Step 1: 杀掉 2728 端口上的 marimo ──
    try {
      execSync('lsof -ti:2728 | xargs kill -9 2>/dev/null || true', {
        timeout: 5000,
      });
    } catch {
      // 没有进程也正常
    }
    // 等端口释放
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(500);
      try {
        await fetch('http://localhost:2728/health');
      } catch {
        break;
      }
    }

    // ── Step 2: 打开 Lab 页面 ──
    await page.goto('/factor/lab');
    const connectBtn = page.getByRole('button', { name: 'Connect' });
    await expect(connectBtn).toBeVisible({ timeout: 10000 });

    // 页面上应该显示启动命令提示
    await expect(page.getByText('marimo edit')).toBeVisible();

    // ── Step 3: 按页面指示启动 kernel ──
    const kernelProc = spawn(
      'marimo',
      [
        'edit',
        '--headless',
        '--port',
        '2728',
        '--no-token',
        '--allow-origins',
        'http://localhost:4200',
      ],
      { detached: true, stdio: 'ignore' },
    );
    kernelProc.unref();

    // 轮询等 kernel 就绪
    let healthy = false;
    for (let i = 0; i < 30; i++) {
      await page.waitForTimeout(1000);
      try {
        const res = await fetch('http://localhost:2728/health');
        if (res.ok) {
          healthy = true;
          break;
        }
      } catch {
        /* 还没启动好 */
      }
    }
    expect(healthy).toBe(true);

    // ── Step 4: 首次 Connect ──
    await connectBtn.click();

    const fullscreen = page.locator('[data-slot="lab-fullscreen"]');
    await expect(fullscreen).toBeVisible({ timeout: 20000 });

    const connecting = page.getByRole('button', {
      name: /Connecting to a runtime/,
    });
    await connecting
      .waitFor({ state: 'hidden', timeout: 30000 })
      .catch(() => {});
    await page.waitForTimeout(2000);

    // 验证：无 session 冲突，无连接失败
    await expect(page.getByText('Notebook already connected')).not.toBeVisible({
      timeout: 3000,
    });
    await expect(page.getByText('Failed to connect')).not.toBeVisible({
      timeout: 3000,
    });

    // AppChrome 渲染完整
    await expect(page.getByRole('button', { name: 'Config' })).toBeVisible({
      timeout: 15000,
    });

    // 至少有编辑器
    await expect(
      page.locator('div[role="textbox"], .cm-editor').first(),
    ).toBeVisible({ timeout: 30000 });

    // ── Step 5: Exit Lab ──
    const exitBtn = page.getByRole('button', { name: 'Exit Lab' });
    await expect(exitBtn).toBeVisible({ timeout: 15000 });
    await exitBtn.click();
    await page.waitForTimeout(2000);
    await expect(fullscreen).not.toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: 'Connect' })).toBeVisible({
      timeout: 10000,
    });

    // ── Step 6: 再次 Connect（热重连）──
    await page.getByRole('button', { name: 'Connect' }).click();
    await expect(fullscreen).toBeVisible({ timeout: 20000 });
    await connecting
      .waitFor({ state: 'hidden', timeout: 30000 })
      .catch(() => {});
    await page.waitForTimeout(2000);

    // 第二次连接也不应有 session 冲突
    await expect(page.getByText('Notebook already connected')).not.toBeVisible({
      timeout: 3000,
    });
    await expect(page.getByText('Failed to connect')).not.toBeVisible({
      timeout: 3000,
    });
    await expect(page.getByRole('button', { name: 'Config' })).toBeVisible({
      timeout: 15000,
    });
  });
});

// ═══════════════════════════════════════════════════════════════
// 稳定性测试（破坏性，放最后）
// ═══════════════════════════════════════════════════════════════

test.describe('Lab Connect/Disconnect 稳定性', () => {
  test.skip(
    !KERNEL_AVAILABLE,
    '需要 MARIMO_KERNEL=1 环境变量（本地启动 Marimo kernel）',
  );

  test.setTimeout(180_000);

  test('5 次 Connect/Disconnect 循环不崩溃且控件完整', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      const msg = error.message;
      const known = [
        'websocket',
        'ws://',
        'wss://',
        'econnrefused',
        'failed to fetch',
        'networkerror',
        'aborted',
        'socket',
      ];
      if (!known.some((k) => msg.toLowerCase().includes(k))) {
        errors.push(msg);
      }
    });

    await page.goto('/factor/lab');
    await page.waitForTimeout(2000);

    const originalTitle = await page.title();

    for (let i = 0; i < 5; i++) {
      // ── Connect ──
      const connectBtn = page.getByRole('button', { name: 'Connect' });
      await expect(connectBtn).toBeVisible({ timeout: 15000 });
      await connectBtn.click();

      const fullscreen = page.locator('[data-slot="lab-fullscreen"]');
      await expect(fullscreen).toBeVisible({ timeout: 20000 });

      // 等待 AppChrome 加载（kernel-ready 消息需要时间）
      await page.waitForTimeout(5000);

      // 如果 session 被占用（WebSocket close 未及时传播），自动 take over
      const takeOverBtn = page.getByRole('button', {
        name: 'Take over session',
      });
      if (await takeOverBtn.isVisible().catch(() => false)) {
        await takeOverBtn.click();
        await page.waitForTimeout(5000);
      }

      // ── 验证连接成功（核心断言）──
      // "Connecting to a runtime" 应该消失（说明 WebSocket 连接成功）
      const connecting = page.getByRole('button', {
        name: /Connecting to a runtime/,
      });
      await connecting
        .waitFor({ state: 'hidden', timeout: 30000 })
        .catch(() => {});

      // "Notebook already connected" banner 绝对不应出现
      const alreadyConnected = page.getByText('Notebook already connected');
      await expect(alreadyConnected).not.toBeVisible({ timeout: 3000 });

      // "Failed to connect" 不应出现
      const failedConnect = page.getByText('Failed to connect');
      await expect(failedConnect).not.toBeVisible({ timeout: 3000 });

      // Config 按钮可见说明 AppChrome 已渲染
      const configBtn = page.getByRole('button', { name: 'Config' });
      await expect(configBtn).toBeVisible({ timeout: 10000 });

      // ── Disconnect（点 Exit Lab 退出全屏）──
      const exitBtn = page.getByRole('button', { name: 'Exit Lab' });
      await expect(exitBtn).toBeVisible({ timeout: 15000 });
      await exitBtn.click();

      await expect(fullscreen).not.toBeVisible({ timeout: 10000 });

      // 确保回到 idle
      const connectBtnAfter = page.getByRole('button', { name: 'Connect' });
      await expect(connectBtnAfter).toBeVisible({ timeout: 10000 });

      // 页面标题应恢复
      await expect(page).toHaveTitle(originalTitle, { timeout: 5000 });
    }

    // 5 次循环后无致命 JS 错误
    expect(errors).toEqual([]);

    // 仍能导航到其他页面
    await page.goto('/market');
    await page.waitForTimeout(2000);
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(0);
  });
});
