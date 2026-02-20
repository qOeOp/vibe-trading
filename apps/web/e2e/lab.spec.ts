/**
 * Lab 页面 E2E 测试 — 无 Marimo Kernel 模式
 *
 * 这些测试验证 /factor/lab 页面在 Marimo kernel 未运行时的行为。
 * 页面应正常加载、不白屏、不产生致命错误。
 *
 * CI 安全：不需要 Marimo kernel。
 */

import { test, expect } from '@playwright/test';

test.describe('Lab Page (no kernel)', () => {
  test('页面加载不白屏', async ({ page }) => {
    await page.goto('/factor/lab');
    // 等待动态导入完成（next/dynamic SSR=false + vite-env-polyfill）
    await page.waitForTimeout(3000);

    // 页面应有可见内容，不是空白
    const body = page.locator('body');
    const text = await body.innerText();
    expect(text.length).toBeGreaterThan(0);
  });

  test('无 console 致命错误', async ({ page }) => {
    const errors: string[] = [];

    page.on('pageerror', (error) => {
      const msg = error.message;
      // 过滤已知的连接类错误（kernel 未运行时正常）
      const knownErrors = [
        'WebSocket',
        'ws://',
        'wss://',
        'fetch',
        'ECONNREFUSED',
        'Failed to fetch',
        'NetworkError',
        'net::ERR_CONNECTION_REFUSED',
        'marimo',
      ];
      const isKnown = knownErrors.some((k) =>
        msg.toLowerCase().includes(k.toLowerCase()),
      );
      if (!isKnown) {
        errors.push(msg);
      }
    });

    await page.goto('/factor/lab');
    await page.waitForTimeout(5000);

    expect(errors).toEqual([]);
  });

  test('显示 Lab UI 壳', async ({ page }) => {
    await page.goto('/factor/lab');
    await page.waitForTimeout(3000);

    // LabBootstrap 设置 ready=true 后，AppChrome 应渲染
    // 检查是否有 data-slot 属性的元素（VT/Marimo 组件标记）
    const hasSlot = await page
      .locator('[data-slot]')
      .first()
      .isVisible()
      .catch(() => false);

    // 或者检查页面是否包含任何实质性 UI 元素
    const hasUI =
      (await page.locator('button').count()) > 0 ||
      (await page.locator('[role]').count()) > 0;

    expect(hasSlot || hasUI).toBe(true);
  });

  test('页面无 unhandled rejection 导致白屏', async ({ page }) => {
    let hasUnhandledRejection = false;

    page.on('pageerror', (error) => {
      // 检测可能导致白屏的 React 渲染错误
      if (
        error.message.includes('Cannot read properties of') ||
        error.message.includes('is not a function') ||
        error.message.includes('is not defined')
      ) {
        hasUnhandledRejection = true;
      }
    });

    await page.goto('/factor/lab');
    await page.waitForTimeout(5000);

    expect(hasUnhandledRejection).toBe(false);
  });
});
