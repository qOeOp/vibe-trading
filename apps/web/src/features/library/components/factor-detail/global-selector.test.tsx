import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
// import { GlobalSelector } from './global-selector';
import type { Factor, UniversePool } from '@/features/library/types';

// ═══════════════════════════════════════════════════════════════
// 覆盖矩阵: GlobalSelector
// ═══════════════════════════════════════════════════════════════
// | #    | 场景               | 验收标准                                      | 类型   |
// |------|--------------------|-----------------------------------------------|--------|
// | GS-1 | Pool tabs 渲染     | 4 个 pool tab 全部渲染                         | Unit   |
// | GS-2 | Horizon tabs 渲染  | 4 个 horizon tab 全部渲染                      | Unit   |
// | GS-3 | 默认选中           | 默认选中 全A + T5                              | Unit   |
// | GS-4 | Pool 切换          | 点击 沪深300 → store.selectedPool 更新         | Integ  |
// | GS-5 | Horizon 切换       | 点击 T+10 → store.selectedHorizon 更新         | Integ  |
// | GS-6 | Ready 状态         | ready config 无圆点标记                         | Unit   |
// | GS-7 | Loading 状态       | loading config 显示 amber pulse 圆点           | Unit   |
// | GS-8 | Error 状态         | error config 显示 red 圆点                     | Unit   |
// | GS-9 | Best-dot           | 最高 IC 的 pool tab 显示 teal 圆点             | Unit   |
// | GS-10| Best-dot 更新      | IC 数据变化 → best-dot 跟随最高 IC pool        | Unit   |
// | GS-11| data-slot          | 组件有 data-slot="global-selector"             | Unit   |
// | GS-12| className 合并     | 外部 className 被合并                           | Unit   |
// | GS-13| sticky 定位        | 容器有 sticky 定位 class                        | Unit   |
// | GS-14| 空 universeProfile | universeProfile 为空数组 → 无 best-dot、不崩溃  | Edge   |
// | GS-15| 所有 IC 相同       | universeProfile 全部 IC 相同 → best-dot 在首项  | Edge   |
// | GS-16| 所有 config error  | 全部 error 状态 → 所有 tab 显示 red 圆点       | Edge   |
// | GS-17| 内容 fade 动效     | 切换 tab 后内容区域有 opacity 过渡 class        | Visual |
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// Store mock
// ═══════════════════════════════════════════════════════════════

const mockSetPool = vi.fn();
const mockSetHorizon = vi.fn();

vi.mock('@/features/library/store/use-library-store', () => ({
  useLibraryStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      selectedPool: '全A',
      selectedHorizon: 'T5',
      setPool: mockSetPool,
      setHorizon: mockSetHorizon,
    }),
}));

// ═══════════════════════════════════════════════════════════════
// Fixture factory
// ═══════════════════════════════════════════════════════════════

function createMockFactor(overrides: Partial<Factor> = {}): Factor {
  return {
    id: 'test-factor-1',
    name: 'Vol Adj Momentum',
    version: '1.0.0',
    category: '动能',
    factorType: 'leaf',
    expectedDirection: 'positive',
    source: 'manual',
    status: 'PAPER_TEST',
    ic: 0.035,
    ir: 1.2,
    icTstat: 2.5,
    turnover: 45,
    capacity: 500000,
    createdAt: '2026-01-15T10:00:00Z',
    createdBy: 'Vincent',
    tags: ['动量', '波动率'],
    icTrend: [],
    winRate: 58,
    ic60d: 0.03,
    ic120d: 0.028,
    quantileReturns: [0.02, 0.01, 0, -0.01, -0.02],
    icTimeSeries: [],
    benchmarkConfig: {
      universe: '全A',
      icMethod: 'RankIC',
      winsorization: 'MAD',
      rebalanceDays: 5,
      quantiles: 5,
    },
    icDistribution: {
      icMean: 0.035,
      icStd: 0.02,
      icPositiveCount: 140,
      icNegativeCount: 100,
      icSignificantRatio: 0.6,
      icPositiveSignificantRatio: 0.4,
      icNegativeSignificantRatio: 0.2,
      icPValue: 0.001,
      icSkewness: 0.1,
      icKurtosis: -0.2,
    },
    icDecayProfile: [],
    universeProfile: [
      { universe: '全A', ic: 0.035, ir: 1.2 },
      { universe: '沪深300', ic: 0.042, ir: 1.5 },
      { universe: '中证500', ic: 0.038, ir: 1.3 },
      { universe: '中证1000', ic: 0.028, ir: 0.9 },
    ],
    rankTestRetention: 0.85,
    binaryTestRetention: 0.72,
    vScore: 1.5,
    icHalfLife: 8,
    coverageRate: 0.95,
    longShortReturn: 12.5,
    longShortEquityCurve: [],
    longSideReturnRatio: 0.65,
    icHistogramBins: [],
    quantileCumulativeReturns: [[], [], [], [], []],
    icMonthlyHeatmap: [],
    icByIndustry: [],
    rankAutoCorrelation: [],
    quantileTurnover: { top: [], bottom: [] },
    statusHistory: [],
    workspacePath: 'factors/vol_adj_momentum/factor.py',
    hypothesis: '经波动率调整的20日动量因子。',
    ...overrides,
  } as Factor;
}

// ═══════════════════════════════════════════════════════════════
// Tests
// ═══════════════════════════════════════════════════════════════

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GlobalSelector', () => {
  describe('Pool tabs 渲染', () => {
    it('renders all 4 pool tabs: 全A, 沪深300, 中证500, 中证1000', () => {
      // Given: a factor with universeProfile covering all 4 pools
      // When: GlobalSelector is rendered
      // Then: all 4 pool labels are visible in the DOM
    });

    it('highlights the currently selected pool tab (default: 全A)', () => {
      // Given: store.selectedPool is '全A' (default)
      // When: GlobalSelector is rendered
      // Then: the 全A tab has active/selected styling
    });
  });

  describe('Horizon tabs 渲染', () => {
    it('renders all 4 horizon tabs: T+1, T+5, T+10, T+20', () => {
      // Given: a factor with valid data
      // When: GlobalSelector is rendered
      // Then: all 4 horizon labels are visible
    });

    it('highlights the currently selected horizon tab (default: T+5)', () => {
      // Given: store.selectedHorizon is 'T5' (default)
      // When: GlobalSelector is rendered
      // Then: the T+5 tab has active/selected styling
    });
  });

  describe('Tab 交互 — Pool 切换', () => {
    it('calls setPool when user clicks a different pool tab', () => {
      // Given: GlobalSelector rendered with default 全A selected
      // When: user clicks 沪深300 tab
      // Then: mockSetPool is called with '沪深300'
    });

    it('does not call setPool when clicking the already-selected pool', () => {
      // Given: GlobalSelector rendered with 全A selected
      // When: user clicks 全A tab (already selected)
      // Then: mockSetPool is NOT called (or called with same value — verify no-op)
    });
  });

  describe('Tab 交互 — Horizon 切换', () => {
    it('calls setHorizon when user clicks a different horizon tab', () => {
      // Given: GlobalSelector rendered with default T5 selected
      // When: user clicks T+10 tab
      // Then: mockSetHorizon is called with 'T10'
    });

    it('does not call setHorizon when clicking the already-selected horizon', () => {
      // Given: GlobalSelector rendered with T5 selected
      // When: user clicks T+5 tab (already selected)
      // Then: mockSetHorizon is NOT called
    });
  });

  describe('状态圆点 — ComputeStatus 可视化', () => {
    it('shows no dot indicator for ready status config', () => {
      // Given: a factor where configStatus['全A_T5'] = { signalStatus: 'ready', portfolioStatus: 'ready' }
      // When: GlobalSelector is rendered
      // Then: the 全A tab has no colored dot
    });

    it('shows amber pulsing dot for loading status config', () => {
      // Given: a factor where configStatus['全A_T5'] = { signalStatus: 'loading', portfolioStatus: 'ready' }
      // When: GlobalSelector is rendered
      // Then: the 全A tab has an amber dot with animate-pulse class
    });

    it('shows red dot for error status config', () => {
      // Given: a factor where configStatus['全A_T5'] = { signalStatus: 'error', portfolioStatus: 'ready' }
      // When: GlobalSelector is rendered
      // Then: the 全A tab has a red dot (no pulse)
    });

    it('prioritizes error over loading when both exist', () => {
      // Given: a factor where signalStatus='error' and portfolioStatus='loading'
      // When: GlobalSelector is rendered
      // Then: the tab shows red error dot, not amber loading dot
    });
  });

  describe('Best-dot — 最高 IC 标记', () => {
    it('shows teal dot on the pool tab with highest IC', () => {
      // Given: a factor with universeProfile where 沪深300 has highest IC (0.042)
      // When: GlobalSelector is rendered
      // Then: 沪深300 tab has a teal/cyan best-dot indicator
      // And: other pool tabs do NOT have the teal best-dot
    });

    it('updates best-dot when factor changes to one with different IC ranking', () => {
      // Given: factor A where 沪深300 has highest IC
      // When: rerender with factor B where 中证500 has highest IC
      // Then: best-dot moves to 中证500 tab
    });

    it('places best-dot on first pool when all IC values are equal', () => {
      // Given: a factor where all universeProfile entries have IC = 0.03
      // When: GlobalSelector is rendered
      // Then: best-dot appears on the first pool tab (全A)
    });
  });

  describe('组件结构', () => {
    it('has data-slot="global-selector" attribute', () => {
      // Given: a standard factor
      // When: GlobalSelector is rendered
      // Then: root element has data-slot="global-selector"
    });

    it('merges external className with cn()', () => {
      // Given: className="mt-4" passed as prop
      // When: GlobalSelector is rendered
      // Then: root element's className includes 'mt-4'
    });

    it('has sticky positioning class for scroll behavior', () => {
      // Given: a standard factor
      // When: GlobalSelector is rendered
      // Then: root element has 'sticky' and 'top-*' positioning classes
    });
  });

  describe('内容过渡动效', () => {
    it('applies opacity transition class to content wrapper after tab switch', () => {
      // Given: GlobalSelector is rendered
      // When: user clicks a different pool tab
      // Then: content area has transition-opacity and duration-150 classes
    });
  });

  describe('边界情况', () => {
    it('renders without crashing when universeProfile is empty', () => {
      // Given: a factor with universeProfile: []
      // When: GlobalSelector is rendered
      // Then: component renders without errors, no best-dot shown
    });

    it('renders without crashing when configStatus is undefined', () => {
      // Given: a factor without configStatus field (legacy data)
      // When: GlobalSelector is rendered
      // Then: all tabs render as ready (no dots), no crash
    });

    it('handles negative IC values correctly for best-dot', () => {
      // Given: a factor where all IC values are negative (e.g., -0.02, -0.01, -0.03, -0.015)
      // When: GlobalSelector is rendered
      // Then: best-dot appears on the pool with highest (least negative) IC = -0.01
    });

    it('handles IC = 0 without dividing by zero or NaN', () => {
      // Given: a factor where all IC values are 0
      // When: GlobalSelector is rendered
      // Then: renders without error, best-dot on first pool
    });

    it('all pools in error state shows red dot on every tab', () => {
      // Given: configStatus has all 4 pools in error state
      // When: GlobalSelector is rendered
      // Then: all 4 pool tabs show red error dots
    });
  });

  describe('A 股色彩编码正确性', () => {
    it('best-dot uses teal/cyan color (not red/green — best is neutral indicator)', () => {
      // Given: a factor with 沪深300 having highest IC
      // When: GlobalSelector is rendered
      // Then: best-dot element color is teal/cyan (semantic: informational, not evaluative)
      // And: NOT red (which means "up/good" in A股) — best-dot is selection hint, not evaluation
    });

    it('error dot uses red color (consistent with negative/bad semantic)', () => {
      // Given: a factor with error status config
      // When: GlobalSelector is rendered
      // Then: error dot uses red (red=bad in error context, green=bad only for 跌/down)
    });

    it('loading dot uses amber color (neutral/in-progress semantic)', () => {
      // Given: a factor with loading status config
      // When: GlobalSelector is rendered
      // Then: loading dot uses amber (neutral, market-flat range)
    });
  });
});
