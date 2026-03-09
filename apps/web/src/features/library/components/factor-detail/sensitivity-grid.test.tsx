import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
// import { SensitivityGrid } from './sensitivity-grid';
import type { Factor, UniverseIC } from '@/features/library/types';

// ═══════════════════════════════════════════════════════════════
// Store mock — SensitivityGrid reads selectedPool/selectedHorizon
// and calls setPool/setHorizon on cell click
// ═══════════════════════════════════════════════════════════════

const mockSetPool = vi.fn();
const mockSetHorizon = vi.fn();

vi.mock('@/features/library/store/use-library-store', () => ({
  useLibraryStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      selectedPool: '全A',
      selectedHorizon: 5,
      setPool: mockSetPool,
      setHorizon: mockSetHorizon,
    }),
}));

// ═══════════════════════════════════════════════════════════════
// Fixture helpers
// ═══════════════════════════════════════════════════════════════

const POOLS = ['全A', '沪深300', '中证500', '中证1000'] as const;
const HORIZONS = [1, 5, 10, 20] as const;

/**
 * Generate a full 4x4 grid of UniverseIC entries.
 * IC values are seeded to produce a spread of quality levels.
 * Overrides can replace specific cells.
 */
function createGridData(
  overrides?: Partial<Record<string, Partial<UniverseIC>>>,
): UniverseIC[] {
  const baseIC: Record<string, number> = {
    '全A-1': 0.042,
    '全A-5': 0.038,
    '全A-10': 0.029,
    '全A-20': 0.015,
    '沪深300-1': 0.051,
    '沪深300-5': 0.045,
    '沪深300-10': 0.033,
    '沪深300-20': 0.021,
    '中证500-1': 0.035,
    '中证500-5': 0.031,
    '中证500-10': 0.022,
    '中证500-20': 0.01,
    '中证1000-1': 0.028,
    '中证1000-5': 0.024,
    '中证1000-10': 0.018,
    '中证1000-20': 0.008,
  };

  return POOLS.flatMap((pool) =>
    HORIZONS.map((h) => {
      const key = `${pool}-${h}`;
      const ic = baseIC[key] ?? 0.02;
      return {
        universe: pool,
        horizon: h,
        ic,
        ir: ic * 30, // Simplified: IR ~ IC * 30 for realistic range
        ...overrides?.[key],
      } as UniverseIC;
    }),
  );
}

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
    universeProfile: createGridData(),
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
// Setup
// ═══════════════════════════════════════════════════════════════

beforeEach(() => {
  mockSetPool.mockClear();
  mockSetHorizon.mockClear();
});

// ═══════════════════════════════════════════════════════════════
// Tests
// ═══════════════════════════════════════════════════════════════

describe('SensitivityGrid', () => {
  // ─── Rendering ────────────────────────────────────────────

  describe('4x4 grid rendering', () => {
    it('renders all 4 pool rows and 4 horizon columns', () => {
      // Given: a factor with a full 16-cell universeProfile
      // When: the component renders
      // Then: 4 pool labels (全A, 沪深300, 中证500, 中证1000) are visible
      // And: 4 horizon headers (1D, 5D, 10D, 20D) are visible
    });

    it('displays IC values in each cell formatted to 3 decimal places', () => {
      // Given: a factor with known IC values (e.g., 全A/1D = 0.042)
      // When: the component renders in IC tab (default)
      // Then: the cell for 全A/1D shows "0.042"
      // And: the cell for 沪深300/5D shows "0.045"
    });

    it('uses numeric for all numeric cells', () => {
      // Given: a factor with grid data
      // When: the component renders
      // Then: every cell containing a numeric value has font-mono and tabular-nums classes
    });

    it('has data-slot="sensitivity-grid" on the root element', () => {
      // Given: a factor with grid data
      // When: the component renders
      // Then: container has data-slot="sensitivity-grid"
    });

    it('accepts and merges className prop', () => {
      // Given: a factor and className="mt-4"
      // When: rendered with className
      // Then: the root element includes "mt-4" in its classes
    });
  });

  // ─── IC / IR tab switching ─────────────────────────────────

  describe('IC / IR tab switching', () => {
    it('shows IC values by default', () => {
      // Given: a factor with known IC and IR values
      // When: the component renders
      // Then: IC tab is visually active
      // And: IC values are displayed (not IR values)
    });

    it('switches to IR values when IR tab is clicked', () => {
      // Given: a factor with IR = 1.26 for 全A/1D
      // When: user clicks the "IR" tab
      // Then: IR tab becomes active
      // And: cell for 全A/1D shows "1.26" (2 decimal places)
      // And: IC values are no longer displayed
    });

    it('switches back to IC values when IC tab is clicked after viewing IR', () => {
      // Given: component showing IR tab
      // When: user clicks the "IC" tab
      // Then: IC values are displayed again
    });

    it('re-evaluates Global Best star on tab switch', () => {
      // Given: a factor where best IC is 沪深300/1D but best IR is 中证500/5D
      // When: user switches from IC tab to IR tab
      // Then: the star moves from 沪深300/1D cell to 中证500/5D cell
    });
  });

  // ─── Color coding (红=好, 琥珀=中, 灰=弱) ──────────────────

  describe('color dot coding', () => {
    it('shows red/strong dot for normalized score >= 0.5 (high IC)', () => {
      // Given: a factor where 沪深300/1D has IC = 0.051 → normalized >= 0.5
      // When: the component renders
      // Then: that cell has a red/strong quality indicator
    });

    it('shows amber/medium dot for normalized score 0.2–0.5', () => {
      // Given: a factor where 全A/10D has IC = 0.029 → normalized in [0.2, 0.5)
      // When: the component renders
      // Then: that cell has an amber/medium quality indicator
    });

    it('shows gray/weak dot for normalized score < 0.2', () => {
      // Given: a factor where 中证1000/20D has IC = 0.008 → normalized < 0.2
      // When: the component renders
      // Then: that cell has a gray/weak quality indicator
    });

    it('applies color coding based on IR when IR tab is active', () => {
      // Given: a factor with varied IR values
      // When: IR tab is active
      // Then: color dots reflect IR-based normalization, not IC-based
    });

    it('follows A-share convention: red = good = high score', () => {
      // Given: the strongest cell in the grid
      // When: the component renders
      // Then: the indicator uses market-up / red color family (not green)
      // And: the weakest cell uses gray (not red)
    });
  });

  // ─── Selected cell highlighting ────────────────────────────

  describe('selected cell highlighting', () => {
    it('highlights the cell matching store selectedPool + selectedHorizon', () => {
      // Given: store has selectedPool='全A' and selectedHorizon=5
      // When: the component renders
      // Then: the cell at 全A/5D has teal background and teal text
      // And: the selected cell does NOT show a color dot
    });

    it('does not highlight any cell when selected combination has no data', () => {
      // Given: store has selectedPool='全A' and selectedHorizon=5
      // But: the universeProfile is missing the 全A/5D entry
      // When: the component renders
      // Then: no cell has the selected highlight style
    });
  });

  // ─── Cell click → store update ─────────────────────────────

  describe('cell click interaction', () => {
    it('calls setPool and setHorizon when a non-selected cell is clicked', () => {
      // Given: store has selectedPool='全A', selectedHorizon=5
      // When: user clicks the cell for 沪深300/10D
      // Then: setPool is called with '沪深300'
      // And: setHorizon is called with 10
    });

    it('does not call store actions when the already-selected cell is clicked', () => {
      // Given: store has selectedPool='全A', selectedHorizon=5
      // When: user clicks the cell for 全A/5D (already selected)
      // Then: setPool is NOT called
      // And: setHorizon is NOT called
    });

    it('does not call store actions when a disabled cell is clicked', () => {
      // Given: a factor with missing data for 中证1000/20D
      // When: user clicks the disabled 中证1000/20D cell
      // Then: setPool is NOT called
      // And: setHorizon is NOT called
    });

    it('shows pointer cursor on clickable cells and default cursor on disabled', () => {
      // Given: a factor with some cells having data and some missing
      // When: the component renders
      // Then: cells with data have cursor-pointer
      // And: disabled cells have cursor-default or cursor-not-allowed
    });
  });

  // ─── Global Best ★ ─────────────────────────────────────────

  describe('Global Best star', () => {
    it('places ★ on the cell with highest absolute IC in IC tab', () => {
      // Given: a factor where 沪深300/1D has the highest IC (0.051)
      // When: the component renders in IC tab
      // Then: the 沪深300/1D cell displays the ★ marker
      // And: no other cell displays ★
    });

    it('places ★ on the cell with highest absolute IR in IR tab', () => {
      // Given: a factor where the highest IR is at a different pool/horizon than highest IC
      // When: user switches to IR tab
      // Then: the ★ moves to the cell with highest IR
    });

    it('does not show ★ when all cells are disabled', () => {
      // Given: a factor with empty universeProfile
      // When: the component renders
      // Then: no ★ marker is present
    });
  });

  // ─── Default Config ◆ ──────────────────────────────────────

  describe('Default Config diamond', () => {
    it('places ◆ on the cell matching factor benchmarkConfig universe + rebalanceDays', () => {
      // Given: a factor with benchmarkConfig.universe='全A' and rebalanceDays=5
      // When: the component renders
      // Then: the 全A/5D cell displays the ◆ marker
    });

    it('shows ◆ regardless of which tab is active', () => {
      // Given: a factor with known default config
      // When: user switches between IC and IR tabs
      // Then: ◆ remains on the same cell in both tabs
    });

    it('does not show ◆ if the default config cell has no data', () => {
      // Given: a factor where the benchmarkConfig pool/horizon combo is missing from universeProfile
      // When: the component renders
      // Then: no ◆ marker is present
    });
  });

  // ─── Disabled cells ────────────────────────────────────────

  describe('disabled cells', () => {
    it('shows "—" for pool/horizon combos missing from universeProfile', () => {
      // Given: a factor with only 12 of 16 entries (missing 中证1000 × all horizons)
      // When: the component renders
      // Then: the 4 cells for 中证1000 show "—"
    });

    it('renders disabled cells with gray/muted text', () => {
      // Given: a factor with missing cells
      // When: the component renders
      // Then: "—" cells use text-mine-muted or equivalent muted color
    });

    it('disabled cells do not show color dots', () => {
      // Given: a factor with some missing cells
      // When: the component renders
      // Then: missing cells have no color quality indicator
    });
  });

  // ─── Empty / edge cases ────────────────────────────────────

  describe('empty data', () => {
    it('returns null when universeProfile is empty', () => {
      // Given: a factor with universeProfile = []
      // When: the component renders
      // Then: nothing is rendered (null)
    });

    it('returns null when universeProfile is undefined', () => {
      // Given: a factor with universeProfile = undefined
      // When: the component renders
      // Then: nothing is rendered (null)
    });
  });

  describe('extreme IC values', () => {
    it('handles IC > 0.1 (unrealistically strong factor)', () => {
      // Given: a factor with IC = 0.15 for one cell
      // When: the component renders
      // Then: the cell shows "0.150" (3dp)
      // And: the color dot is red/strong (normalized score clamps to high)
    });

    it('handles negative IC values', () => {
      // Given: a factor with IC = -0.03 for one cell
      // When: the component renders
      // Then: the cell shows "-0.030" (3dp with sign)
      // And: the color coding is based on absolute IC value
    });

    it('handles zero IC', () => {
      // Given: a factor with IC = 0.000 for one cell
      // When: the component renders
      // Then: the cell shows "0.000"
      // And: the color dot is gray/weak
    });

    it('handles very small IC (0.001) as gray/weak', () => {
      // Given: a factor with IC = 0.001
      // When: the component renders
      // Then: normalized score is < 0.2
      // And: the dot is gray/weak
    });
  });

  // ─── Number formatting ─────────────────────────────────────

  describe('number formatting', () => {
    it('formats IC to 3 decimal places', () => {
      // Given: a factor with IC = 0.0423456 for a cell
      // When: IC tab is active
      // Then: the cell shows "0.042" (truncated/rounded to 3dp)
    });

    it('formats IR to 2 decimal places', () => {
      // Given: a factor with IR = 1.2567 for a cell
      // When: IR tab is active
      // Then: the cell shows "1.26" (rounded to 2dp)
    });

    it('preserves sign for negative IC values', () => {
      // Given: a factor with IC = -0.028
      // When: the component renders
      // Then: the cell shows "-0.028" (includes negative sign)
    });
  });

  // ─── Hover feedback ────────────────────────────────────────

  describe('hover feedback', () => {
    it('shows subtle background change on hover for clickable cells', () => {
      // Given: a factor with grid data
      // When: user hovers over a non-selected, non-disabled cell
      // Then: the cell has a hover class (e.g., hover:bg-*)
      // Note: this tests the class exists, not the visual — CSS is not computed in jsdom
    });
  });
});
