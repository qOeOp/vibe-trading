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
  expression: 'pct_change(5)',
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
