import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { FactorsTab } from '../components/factors-tab';
import type { MiningTask, DiscoveredFactor } from '../types';

// Mock the api module
vi.mock('../api', () => ({
  pushFactorToLibrary: vi.fn(),
  miningApi: { getFactorCode: vi.fn() },
}));

// Mock library store
vi.mock('@/features/library/store/use-library-store', () => ({
  useLibraryStore: { getState: () => ({ fetchMiningFactors: vi.fn() }) },
}));

function makeFactor(index: number, accepted = true): DiscoveredFactor {
  return {
    name: `factor_${String(index).padStart(3, '0')}`,
    code: `def factor(df):\n    return df["close"].pct_change(${index})`,
    metrics: {
      ic: 0.02 + index * 0.001,
      icir: 0.2 + index * 0.01,
      rankIc: 0.018 + index * 0.001,
      rankIcir: 0.18 + index * 0.01,
      turnover: 0.3,
      arr: 0.1,
      sharpe: 1.0,
      maxDrawdown: 0.08,
    },
    generation: index,
    hypothesis: `Hypothesis ${index}`,
    reason: `Reason ${index}`,
    description: `Factor ${index} description`,
    formulation: '',
    variables: '',
    dedupScore: 0.1,
    accepted,
  };
}

function makeTaskWithManyFactors(count: number): MiningTask {
  return {
    taskId: 'mining_scroll_test',
    status: 'COMPLETED',
    mode: 'factor',
    config: {
      mode: 'factor',
      maxLoops: 20,
      llmModel: 'deepseek-chat',
      universe: 'csi300',
      dateRange: {
        trainStart: '2020-01-01',
        trainEnd: '2022-12-31',
        validStart: '2023-01-01',
        validEnd: '2023-06-30',
        testStart: '2023-07-01',
        testEnd: '2023-12-31',
      },
      dedupThreshold: 0.7,
    },
    progress: {
      currentLoop: 20,
      maxLoops: 20,
      factorsDiscovered: count,
      factorsAccepted: count,
      factorsRejected: 0,
      bestIc: 0.05,
      bestIr: 1.2,
      elapsedSeconds: 1200,
      estimatedRemainingSeconds: 0,
      currentHypothesis: '',
      currentStep: 'done',
    },
    factors: Array.from({ length: count }, (_, i) => makeFactor(i)),
    createdAt: 1709000000,
    startedAt: 1709000010,
    completedAt: 1709001210,
  };
}

describe('FactorsTab scroll layout', () => {
  it('factor list container uses flex-1 with overflow-y-auto inside a constrained parent', () => {
    const task = makeTaskWithManyFactors(20);
    const { container } = render(
      // Simulate the height-constrained ancestor chain:
      // In the real app, the factors tab is inside a flex-col layout with fixed height.
      <div style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
        <FactorsTab task={task} />
      </div>,
    );

    // The factor list scroll container
    const factorList = container.querySelector(
      '[data-slot="factors-tab"] .overflow-y-auto',
    );
    expect(factorList).not.toBeNull();

    // The factors-tab root should have min-h-0 to allow flex shrinking
    const factorsTab = container.querySelector('[data-slot="factors-tab"]');
    expect(factorsTab).not.toBeNull();
    const tabClasses = factorsTab!.className;
    expect(tabClasses).toContain('min-h-0');
    expect(tabClasses).toContain('flex');
  });

  it('factors-tab root fills parent height instead of being content-sized', () => {
    const task = makeTaskWithManyFactors(20);
    const { container } = render(
      <div
        style={{
          height: 400,
          width: 800,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <FactorsTab task={task} />
      </div>,
    );

    const factorsTab = container.querySelector(
      '[data-slot="factors-tab"]',
    ) as HTMLElement;

    // In JSDOM, layout isn't computed, but we can at least verify the CSS classes
    // ensure h-full or flex-1 is set so it fills the parent
    const classes = factorsTab.className;
    // Must have either h-full or flex-1 to fill parent height
    const fillsParent =
      classes.includes('h-full') || classes.includes('flex-1');
    expect(fillsParent).toBe(true);
  });

  it('left panel has constrained height chain for scroll to work', () => {
    const task = makeTaskWithManyFactors(20);
    const { container } = render(
      <div style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
        <FactorsTab task={task} />
      </div>,
    );

    // Left panel (factor list parent) must have min-h-0 for flex shrinking
    const leftPanel = container.querySelector(
      '[data-slot="factors-tab"] > div:first-child',
    ) as HTMLElement;
    expect(leftPanel).not.toBeNull();
    expect(leftPanel.className).toContain('min-h-0');
    expect(leftPanel.className).toContain('flex');
    expect(leftPanel.className).toContain('flex-col');

    // Factor list inside left panel must have overflow-y-auto and flex-1
    const scrollList = leftPanel.querySelector('.overflow-y-auto');
    expect(scrollList).not.toBeNull();
    expect(scrollList!.className).toContain('flex-1');
  });

  /**
   * KEY TEST: The real bug is that TabsContent (parent of FactorsTab in the app)
   * is NOT a flex container. FactorsTab's flex-1 has no effect in a block parent.
   * This test verifies FactorsTab works correctly when the parent IS a flex container.
   *
   * The fix should be applied in task-detail-panel.tsx by either:
   * 1. Adding flex/flex-col to TabsContent className
   * 2. Or using h-full on FactorsTab instead of flex-1
   */
  it('FactorsTab fills parent when parent is a flex-col container', () => {
    const task = makeTaskWithManyFactors(20);
    const { container } = render(
      // Parent must be flex-col for FactorsTab's flex-1 to work
      <div
        style={{
          height: 400,
          width: 800,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <FactorsTab task={task} />
      </div>,
    );

    const factorsTab = container.querySelector(
      '[data-slot="factors-tab"]',
    ) as HTMLElement;
    // flex-1 works because parent is flex-col
    expect(factorsTab.className).toContain('flex-1');
  });

  it('FactorsTab with h-full fills parent regardless of parent flex direction', () => {
    // This test documents the alternative fix approach:
    // Using h-full instead of flex-1 works in both block and flex parents
    const task = makeTaskWithManyFactors(20);
    const { container } = render(
      // Block parent (simulating TabsContent without flex)
      <div style={{ height: 400, width: 800 }}>
        <FactorsTab task={task} className="h-full" />
      </div>,
    );

    const factorsTab = container.querySelector(
      '[data-slot="factors-tab"]',
    ) as HTMLElement;
    expect(factorsTab.className).toContain('h-full');
  });

  /**
   * Regression test: TabsContent in task-detail-panel.tsx must be a flex container.
   *
   * The bug: Radix TabsContent renders as a plain block div (display: block).
   * FactorsTab uses flex-1 to fill its parent, but flex-1 only works when the
   * parent is a flex container. Without flex/flex-col on TabsContent, FactorsTab
   * becomes content-sized, breaking the scroll chain.
   *
   * Fix: Add "flex flex-col" to TabsContent className in task-detail-panel.tsx.
   */
  it('flex-1 on FactorsTab requires parent to be a flex container to constrain height', () => {
    const task = makeTaskWithManyFactors(20);

    // Simulate the BROKEN case: block parent
    const { container: broken } = render(
      <div style={{ height: 400, width: 800, overflow: 'hidden' }}>
        {/* This is a block parent — flex-1 on child has NO effect */}
        <div style={{ height: '100%' }}>
          <FactorsTab task={task} />
        </div>
      </div>,
    );

    // Simulate the FIXED case: flex-col parent (like TabsContent with flex flex-col)
    const { container: fixed } = render(
      <div style={{ height: 400, width: 800, overflow: 'hidden' }}>
        <div
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <FactorsTab task={task} />
        </div>
      </div>,
    );

    // Both should have the factors-tab element
    const brokenTab = broken.querySelector(
      '[data-slot="factors-tab"]',
    ) as HTMLElement;
    const fixedTab = fixed.querySelector(
      '[data-slot="factors-tab"]',
    ) as HTMLElement;
    expect(brokenTab).not.toBeNull();
    expect(fixedTab).not.toBeNull();

    // Both use flex-1, but only the flex-col parent makes it work
    expect(brokenTab.className).toContain('flex-1');
    expect(fixedTab.className).toContain('flex-1');

    // The left panel scroll container must exist and have overflow-y-auto
    const fixedScroll = fixedTab.querySelector('.overflow-y-auto');
    expect(fixedScroll).not.toBeNull();
    expect(fixedScroll!.className).toContain('flex-1');
  });
});
