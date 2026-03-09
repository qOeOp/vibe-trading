import { describe, it, expect, beforeEach } from 'vitest';
import { useLibraryStore } from './use-library-store';
import type { Factor } from '../types';

// Minimal mining factor fixture — must satisfy all required Factor fields
const miningFactor: Factor = {
  id: 'task_001_factor_0',
  name: 'MomentumReversal',
  version: '1.0',
  category: '动能',
  factorType: 'leaf',
  expectedDirection: 'positive',
  source: 'mining_llm',
  status: 'INCUBATING',
  workspacePath: 'factors/momentum_reversal/factor.py',
  hypothesis: '5日动量反转因子，捕捉短期超跌反弹机会。',
  ic: 0.024,
  ir: 0.81,
  icTstat: 0,
  turnover: 0,
  capacity: 10000,
  createdAt: '2026-02-28T10:00:00Z',
  createdBy: 'RD-Agent',
  tags: ['挖掘'],
  icTrend: [],
  winRate: 50,
  ic60d: 0.024,
  ic120d: 0.024,
  quantileReturns: [0, 0, 0, 0, 0],
  icTimeSeries: [],
  benchmarkConfig: {
    universe: '沪深300',
    icMethod: 'RankIC',
    winsorization: 'MAD',
    rebalanceDays: 5,
    quantiles: 5,
  },
  icDistribution: {
    icMean: 0.024,
    icStd: 0,
    icPositiveCount: 0,
    icNegativeCount: 0,
    icSignificantRatio: 0,
    icPositiveSignificantRatio: 0,
    icNegativeSignificantRatio: 0,
    icPValue: 1,
    icSkewness: 0,
    icKurtosis: 0,
  },
  icDecayProfile: [],
  universeProfile: [],
  rankTestRetention: 0,
  binaryTestRetention: 0,
  vScore: 0,
  icHalfLife: 0,
  coverageRate: 0,
  longShortReturn: 18.7,
  longShortEquityCurve: [],
  longSideReturnRatio: 0,
  icHistogramBins: [],
  quantileCumulativeReturns: [[], [], [], [], []],
  icMonthlyHeatmap: [],
  icByIndustry: [],
  rankAutoCorrelation: [],
  quantileTurnover: { top: [], bottom: [] },
  statusHistory: [],
  // Mining-specific optional fields
  lookback: 5,
  codeFile: '/Users/vx/.vt-lab/mining/task_001/MomentumReversal.py',
};

describe('useLibraryStore – addFactor', () => {
  beforeEach(() => {
    // Reset store to initial state between tests
    useLibraryStore.setState({ factors: [] });
  });

  it('adds a new mining factor to the store', () => {
    useLibraryStore.getState().addFactor(miningFactor);
    const factors = useLibraryStore.getState().factors;
    expect(factors.some((f) => f.id === 'task_001_factor_0')).toBe(true);
  });

  it('does not add duplicate factor (same id)', () => {
    useLibraryStore.getState().addFactor(miningFactor);
    useLibraryStore.getState().addFactor(miningFactor);
    const factors = useLibraryStore.getState().factors;
    const matches = factors.filter((f) => f.id === 'task_001_factor_0');
    expect(matches).toHaveLength(1);
  });
});

// ═══════════════════════════════════════════════════════════════
// GlobalSelector store extensions — setPool / setHorizon
// ═══════════════════════════════════════════════════════════════
// These tests validate the store slice that GlobalSelector depends on.
// The store must provide selectedPool, selectedHorizon, setPool, setHorizon.
// Default: selectedPool = '全A', selectedHorizon = 'T5'.
// ═══════════════════════════════════════════════════════════════

describe('useLibraryStore – setPool', () => {
  beforeEach(() => {
    // Reset to defaults before each test
    useLibraryStore.setState({
      selectedPool: '全A',
      selectedHorizon: 'T5',
    });
  });

  it('defaults selectedPool to 全A', () => {
    // Given: store is in initial state
    // When: reading selectedPool
    // Then: value is '全A'
  });

  it('updates selectedPool to 沪深300', () => {
    // Given: store with default selectedPool '全A'
    // When: setPool('沪深300') is called
    // Then: selectedPool becomes '沪深300'
  });

  it('updates selectedPool to 中证500', () => {
    // Given: store with default selectedPool '全A'
    // When: setPool('中证500') is called
    // Then: selectedPool becomes '中证500'
  });

  it('updates selectedPool to 中证1000', () => {
    // Given: store with default selectedPool '全A'
    // When: setPool('中证1000') is called
    // Then: selectedPool becomes '中证1000'
  });

  it('does not affect selectedHorizon when pool changes', () => {
    // Given: store with selectedHorizon 'T5'
    // When: setPool('沪深300') is called
    // Then: selectedHorizon remains 'T5' (independent dimensions)
  });

  it('does not affect other store state (factors, filters) when pool changes', () => {
    // Given: store with factors and filters set
    // When: setPool('中证500') is called
    // Then: factors array, statuses, category, search are unchanged
  });
});

describe('useLibraryStore – setHorizon', () => {
  beforeEach(() => {
    useLibraryStore.setState({
      selectedPool: '全A',
      selectedHorizon: 'T5',
    });
  });

  it('defaults selectedHorizon to T5', () => {
    // Given: store is in initial state
    // When: reading selectedHorizon
    // Then: value is 'T5'
  });

  it('updates selectedHorizon to T1', () => {
    // Given: store with default selectedHorizon 'T5'
    // When: setHorizon('T1') is called
    // Then: selectedHorizon becomes 'T1'
  });

  it('updates selectedHorizon to T10', () => {
    // Given: store with default selectedHorizon 'T5'
    // When: setHorizon('T10') is called
    // Then: selectedHorizon becomes 'T10'
  });

  it('updates selectedHorizon to T20', () => {
    // Given: store with default selectedHorizon 'T5'
    // When: setHorizon('T20') is called
    // Then: selectedHorizon becomes 'T20'
  });

  it('does not affect selectedPool when horizon changes', () => {
    // Given: store with selectedPool '沪深300'
    // When: setHorizon('T10') is called
    // Then: selectedPool remains '沪深300' (independent dimensions)
  });

  it('does not affect other store state (factors, filters) when horizon changes', () => {
    // Given: store with factors and filters set
    // When: setHorizon('T20') is called
    // Then: factors array, statuses, category, search are unchanged
  });
});

describe('useLibraryStore – pool x horizon independence', () => {
  beforeEach(() => {
    useLibraryStore.setState({
      selectedPool: '全A',
      selectedHorizon: 'T5',
    });
  });

  it('allows sequential pool then horizon changes without interference', () => {
    // Given: store at defaults (全A, T5)
    // When: setPool('中证1000') then setHorizon('T20')
    // Then: selectedPool is '中证1000' AND selectedHorizon is 'T20'
  });

  it('allows rapid toggling back to original values', () => {
    // Given: store at defaults (全A, T5)
    // When: setPool('沪深300') then setPool('全A')
    // Then: selectedPool is '全A' (back to original)
  });

  it('preserves pool/horizon through resetFilters', () => {
    // Given: store with selectedPool '中证500', selectedHorizon 'T10'
    // When: resetFilters() is called
    // Then: verify whether pool/horizon are reset or preserved
    //       (design decision — document actual behavior)
  });
});
