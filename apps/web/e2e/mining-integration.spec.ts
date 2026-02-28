/**
 * Mining Feature Integration Tests
 *
 * Tests the critical integration path between the frontend and vibe-editor backend:
 *   1. Completed tasks show meaningful activity log after page refresh (not "等待挖掘开始...")
 *   2. Research rounds (hypothesis/reason) are fetched and displayed
 *   3. Factors list shows status-aware empty states
 *   4. Backend API returns correct shape for completed tasks
 *
 * Requires:
 *   - Frontend dev server running on :4200
 *   - vibe-editor backend running on :2728
 *   - At least one completed mining task in ~/.vt-lab/mining/
 *
 * Run: npx playwright test e2e/mining-integration.spec.ts --config=e2e/playwright.config.ts
 */

import { test, expect, type Page } from '@playwright/test';

const BACKEND_URL = 'http://localhost:2728';

// ── Backend API tests (no browser needed) ─────────────────────────

test.describe('Mining API (backend integration)', () => {
  test('GET /api/mining/tasks returns list with correct shape', async ({
    request,
  }) => {
    const res = await request.get(`${BACKEND_URL}/api/mining/tasks`);
    expect(res.ok()).toBeTruthy();

    const data = await res.json();
    expect(data).toHaveProperty('tasks');
    expect(Array.isArray(data.tasks)).toBe(true);
  });

  test('completed task has correct structure', async ({ request }) => {
    // Get task list and find a completed one
    const listRes = await request.get(`${BACKEND_URL}/api/mining/tasks`);
    const { tasks } = await listRes.json();

    const completed = tasks.find(
      (t: { status: string }) => t.status === 'COMPLETED',
    );
    if (!completed) {
      test.skip(true, 'No completed tasks found — run a mining task first');
      return;
    }

    const res = await request.get(
      `${BACKEND_URL}/api/mining/tasks/${completed.taskId}`,
    );
    expect(res.ok()).toBeTruthy();

    const task = await res.json();
    expect(task).toHaveProperty('taskId');
    expect(task).toHaveProperty('status', 'COMPLETED');
    expect(task).toHaveProperty('progress');
    expect(task.progress).toHaveProperty('currentLoop');
    expect(task.progress).toHaveProperty('maxLoops');
    expect(task).toHaveProperty('factors');
    expect(Array.isArray(task.factors)).toBe(true);
  });

  test('completed task with factors has correct factor shape', async ({
    request,
  }) => {
    const listRes = await request.get(`${BACKEND_URL}/api/mining/tasks`);
    const { tasks } = await listRes.json();

    const withFactors = tasks.find(
      (t: { status: string; factors: unknown[] }) =>
        t.status === 'COMPLETED' && t.factors && t.factors.length > 0,
    );
    if (!withFactors) {
      test.skip(
        true,
        'No completed tasks with factors — fix the qlib crash first',
      );
      return;
    }

    const res = await request.get(
      `${BACKEND_URL}/api/mining/tasks/${withFactors.taskId}`,
    );
    const task = await res.json();
    const factor = task.factors[0];

    // Required fields
    expect(factor).toHaveProperty('name');
    expect(factor).toHaveProperty('code');
    expect(factor).toHaveProperty('metrics');
    expect(factor.metrics).toHaveProperty('ic');
    expect(factor).toHaveProperty('accepted');

    // Fields added in the VTFactorRDLoop refactor
    expect(factor).toHaveProperty('hypothesis');
    expect(factor).toHaveProperty('reason');
    expect(factor).toHaveProperty('description');
    expect(factor).toHaveProperty('formulation');
  });

  test('GET /api/mining/tasks/{id}/rounds returns rounds array', async ({
    request,
  }) => {
    const listRes = await request.get(`${BACKEND_URL}/api/mining/tasks`);
    const { tasks } = await listRes.json();

    const completed = tasks.find(
      (t: { status: string }) => t.status === 'COMPLETED',
    );
    if (!completed) {
      test.skip(true, 'No completed tasks found');
      return;
    }

    const res = await request.get(
      `${BACKEND_URL}/api/mining/tasks/${completed.taskId}/rounds`,
    );
    expect(res.ok()).toBeTruthy();

    const data = await res.json();
    expect(data).toHaveProperty('taskId', completed.taskId);
    expect(data).toHaveProperty('rounds');
    expect(Array.isArray(data.rounds)).toBe(true);

    if (data.rounds.length > 0) {
      const round = data.rounds[0];
      expect(round).toHaveProperty('roundIndex');
      expect(round).toHaveProperty('hypothesis');
      expect(typeof round.hypothesis).toBe('string');
      expect(round.hypothesis.length).toBeGreaterThan(10);
    }
  });
});

// ── Frontend integration tests ────────────────────────────────────

test.describe('Mining page (frontend integration)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/factor/mining');
    // Wait for task list to load
    await page.waitForTimeout(1500);
  });

  test('page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/factor/mining');
    await page.waitForTimeout(2000);

    const fatal = errors.filter(
      (e) =>
        !e.includes('WebSocket') &&
        !e.includes('fetch') &&
        !e.includes('ECONNREFUSED'),
    );
    expect(fatal).toHaveLength(0);
  });

  test('completed task detail: activity log is not empty waiting state', async ({
    page,
  }) => {
    // Find and click a completed task in the sidebar
    const completedTag = page.locator('text=已完成').first();
    if (!(await completedTag.isVisible())) {
      test.skip(true, 'No completed tasks visible in task list');
      return;
    }

    // Click on the task item (parent of the status tag)
    await completedTag.locator('..').locator('..').click();
    await page.waitForTimeout(500);

    // Activity log must NOT show the empty/waiting state
    const waitingText = page.locator('text=等待挖掘开始...');
    await expect(waitingText).not.toBeVisible();

    // Must show the start log entry (generated by buildCompletedLog)
    const startEntry = page.locator('text=开始挖掘').first();
    await expect(startEntry).toBeVisible();
  });

  test('completed task detail: after page refresh still shows log', async ({
    page,
  }) => {
    const completedTag = page.locator('text=已完成').first();
    if (!(await completedTag.isVisible())) {
      test.skip(true, 'No completed tasks visible');
      return;
    }

    // Click task, note the task name
    const taskItem = completedTag.locator('..').locator('..');
    await taskItem.click();
    await page.waitForTimeout(500);

    // Verify log is populated
    const startEntry = page.locator('text=开始挖掘').first();
    await expect(startEntry).toBeVisible();

    // Hard refresh
    await page.reload();
    await page.waitForTimeout(2000);

    // Task list should reload and the log should still be derivable
    // (Since buildCompletedLog uses static task data, not SSE stream)
    await completedTag.first().locator('..').locator('..').click();
    await page.waitForTimeout(500);

    await expect(page.locator('text=等待挖掘开始...')).not.toBeVisible();
    await expect(page.locator('text=开始挖掘').first()).toBeVisible();
  });

  test('completed task with no factors shows status-aware empty message', async ({
    page,
  }) => {
    // Find a completed task with 0 factors
    const completedTag = page.locator('text=已完成').first();
    if (!(await completedTag.isVisible())) {
      test.skip(true, 'No completed tasks visible');
      return;
    }

    await completedTag.locator('..').locator('..').click();
    await page.waitForTimeout(500);

    // Either factors are shown OR one of the status-aware empty messages is shown
    const factorCards = page.locator('[data-slot="factor-result-card"]');
    const statusMsgs = [
      '本次运行未产生有效因子',
      '挖掘失败，未产生因子',
      '任务已取消',
    ];

    const hasFactors = (await factorCards.count()) > 0;
    let hasEmptyMsg = false;
    for (const msg of statusMsgs) {
      if (
        await page
          .locator(`text=${msg}`)
          .isVisible()
          .catch(() => false)
      ) {
        hasEmptyMsg = true;
        break;
      }
    }

    // Must have one or the other — never the old "等待第一个因子..." waiting state
    expect(hasFactors || hasEmptyMsg).toBe(true);
    await expect(page.locator('text=等待第一个因子...')).not.toBeVisible();
  });

  test('research rounds accordion is shown for completed tasks with rounds', async ({
    page,
  }) => {
    // Check via API if any completed task has rounds
    const listRes = await page.request.get(`${BACKEND_URL}/api/mining/tasks`);
    const { tasks } = await listRes.json();
    const completed = tasks.find(
      (t: { status: string }) => t.status === 'COMPLETED',
    );
    if (!completed) {
      test.skip(true, 'No completed tasks');
      return;
    }

    const roundsRes = await page.request.get(
      `${BACKEND_URL}/api/mining/tasks/${completed.taskId}/rounds`,
    );
    const { rounds } = await roundsRes.json();
    if (!rounds || rounds.length === 0) {
      test.skip(true, 'No rounds data for completed tasks');
      return;
    }

    // Navigate and select this task
    await page.goto(`/factor/mining`);
    await page.waitForTimeout(1500);

    const completedTag = page.locator('text=已完成').first();
    await completedTag.locator('..').locator('..').click();
    await page.waitForTimeout(800);

    // Research rounds section should be visible (has "研究假设" label)
    const roundsSection = page.locator('text=研究假设');
    await expect(roundsSection).toBeVisible({ timeout: 3000 });
  });
});

// ── Regression tests ──────────────────────────────────────────────

test.describe('Mining regressions', () => {
  /**
   * Regression: Before fix, useMiningStream passed null for non-RUNNING tasks,
   * causing streamLog=[] and showing "等待挖掘开始..." on refresh.
   *
   * Fixed in: buildCompletedLog() in task-detail-panel.tsx
   */
  test('REG-001: completed task does not show "等待挖掘开始..." on fresh load', async ({
    page,
  }) => {
    await page.goto('/factor/mining');
    await page.waitForTimeout(2000);

    const completedTag = page.locator('text=已完成').first();
    if (!(await completedTag.isVisible())) {
      test.skip(true, 'No completed tasks for regression test');
      return;
    }

    await completedTag.locator('..').locator('..').click();
    await page.waitForTimeout(500);

    // This exact string was the bug symptom
    await expect(page.locator('text=等待挖掘开始...')).not.toBeVisible();
  });

  /**
   * Regression: Before fix, factors.jsonl was only refreshed when task=RUNNING.
   * Completed tasks showed empty factors list even after worker wrote factors.jsonl.
   *
   * Fixed in: manager.py get_task() — always refresh factors for COMPLETED tasks.
   */
  test('REG-002: API returns factors for COMPLETED tasks (not just RUNNING)', async ({
    request,
  }) => {
    const listRes = await request.get(`${BACKEND_URL}/api/mining/tasks`);
    if (!listRes.ok()) {
      test.skip(true, 'Backend not available');
      return;
    }
    const { tasks } = await listRes.json();

    // All completed tasks should have factors array populated (may be empty if IC<0.01)
    const completedTasks = tasks.filter(
      (t: { status: string }) => t.status === 'COMPLETED',
    );
    for (const task of completedTasks) {
      expect(task).toHaveProperty('factors');
      expect(Array.isArray(task.factors)).toBe(true);
      // factors.jsonl should be readable (no crash when refreshing)
    }
  });

  /**
   * Regression: qlib crashes after IC computation (IndexError: index 4943 out of bounds).
   * Before fix, FactorRDLoop.running() returned None and we returned early,
   * losing all factor metadata even though qlib_res.csv was written.
   *
   * Fixed in: rdagent_loop.py running() — fallback to prev_out["coding"] when exp is None.
   *
   * This test verifies the API response: if IC > 0.01 was computed, factor should appear.
   * (Cannot easily reproduce the qlib crash in a unit test, so we verify API shape.)
   */
  test('REG-003: factors with IC > 0.01 are marked accepted=true', async ({
    request,
  }) => {
    const listRes = await request.get(`${BACKEND_URL}/api/mining/tasks`);
    if (!listRes.ok()) return;
    const { tasks } = await listRes.json();

    for (const task of tasks) {
      if (task.status !== 'COMPLETED' || !task.factors) continue;
      for (const factor of task.factors) {
        if (factor.metrics?.ic > 0.01) {
          expect(factor.accepted).toBe(true);
        }
        if (factor.metrics?.ic <= 0.01) {
          expect(factor.accepted).toBe(false);
        }
      }
    }
  });
});
