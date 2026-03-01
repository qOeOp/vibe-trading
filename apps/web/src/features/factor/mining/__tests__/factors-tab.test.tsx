import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FactorsTab } from '../components/factors-tab';
import type { MiningTask, DiscoveredFactor } from '../types';

// Mock the api module
vi.mock('../api', () => ({
  pushFactorToLibrary: vi.fn(),
}));

// Mock library store
vi.mock('@/features/library/store/use-library-store', () => ({
  useLibraryStore: { getState: () => ({ fetchMiningFactors: vi.fn() }) },
}));

function makeFactor(
  overrides: Partial<DiscoveredFactor> = {},
): DiscoveredFactor {
  return {
    name: 'momentum_vol_001',
    code: 'def factor(df):\n    return df["close"].pct_change(10)',
    metrics: {
      ic: 0.028,
      icir: 0.22,
      rankIc: 0.025,
      rankIcir: 0.2,
      turnover: 0.35,
      arr: 0.12,
      sharpe: 1.1,
      maxDrawdown: 0.08,
    },
    generation: 1,
    hypothesis: 'Price momentum captures trend persistence',
    reason: 'Strong autocorrelation in 10-day returns',
    description:
      '[Momentum Factor] 10-day price momentum normalized by volatility',
    formulation: 'r_{t-10:t} / \\sigma_{t-20:t}',
    variables: 'r = return, sigma = volatility',
    dedupScore: 0.15,
    accepted: true,
    ...overrides,
  };
}

function makeRejectedFactor(): DiscoveredFactor {
  return makeFactor({
    name: 'weak_signal_002',
    code: 'def factor(df):\n    return df["volume"].diff()',
    metrics: {
      ic: 0.005,
      icir: 0.08,
      rankIc: 0.004,
      rankIcir: 0.07,
      turnover: 0.6,
      arr: 0.01,
      sharpe: 0.2,
      maxDrawdown: 0.15,
    },
    generation: 2,
    hypothesis: 'Volume changes predict returns',
    reason: 'Weak signal, low IC',
    description: '[Volume Factor] Simple volume diff',
    formulation: '',
    variables: '',
    dedupScore: 0.8,
    accepted: false,
  });
}

function makeTask(overrides: Partial<MiningTask> = {}): MiningTask {
  return {
    taskId: 'mining_test_001',
    status: 'COMPLETED',
    mode: 'factor',
    config: {
      mode: 'factor',
      maxLoops: 10,
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
      currentLoop: 10,
      maxLoops: 10,
      factorsDiscovered: 2,
      factorsAccepted: 1,
      factorsRejected: 1,
      bestIc: 0.028,
      bestIr: 0.22,
      elapsedSeconds: 600,
      estimatedRemainingSeconds: 0,
      currentHypothesis: '',
      currentStep: 'done',
    },
    factors: [makeFactor(), makeRejectedFactor()],
    createdAt: 1709000000,
    startedAt: 1709000010,
    completedAt: 1709000610,
    ...overrides,
  };
}

describe('FactorsTab', () => {
  it('renders factor list with all factors', () => {
    const task = makeTask();
    render(<FactorsTab task={task} />);

    // momentum_vol_001 appears in both the list card and the detail panel (auto-selected)
    expect(
      screen.getAllByText('momentum_vol_001').length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('weak_signal_002')).toBeInTheDocument();
  });

  it('shows factor detail when a factor is selected', () => {
    const task = makeTask();
    render(<FactorsTab task={task} />);

    // Click the second factor to see its detail
    fireEvent.click(screen.getByText('weak_signal_002'));

    // Check detail metrics are visible for the rejected factor
    expect(screen.getByText('0.0050')).toBeInTheDocument(); // IC
    expect(screen.getByText('0.0800')).toBeInTheDocument(); // ICIR
  });

  it('shows empty state when no factors', () => {
    const task = makeTask({
      status: 'RUNNING',
      factors: [],
    });
    render(<FactorsTab task={task} />);

    expect(screen.getByText(/等待第一个因子/)).toBeInTheDocument();
  });

  it('filters by accepted/rejected', () => {
    const task = makeTask();
    render(<FactorsTab task={task} />);

    // Click the "通过" filter tab
    fireEvent.click(screen.getByRole('button', { name: '通过' }));

    // Only accepted factor should be visible (may appear in both list and detail)
    expect(
      screen.getAllByText('momentum_vol_001').length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('weak_signal_002')).not.toBeInTheDocument();
  });
});
