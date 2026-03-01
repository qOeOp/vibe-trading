import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ResearchLogTab } from '../components/research-log-tab';
import type { MiningTask, MiningRound } from '../types';

vi.mock('../api', () => ({
  miningApi: {
    getRounds: vi.fn(),
  },
}));

import { miningApi } from '../api';

const mockedGetRounds = vi.mocked(miningApi.getRounds);

function makeTask(overrides: Partial<MiningTask> = {}): MiningTask {
  return {
    taskId: 'mining_test_001',
    status: 'RUNNING',
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
      currentLoop: 3,
      maxLoops: 10,
      factorsDiscovered: 5,
      factorsAccepted: 2,
      factorsRejected: 3,
      bestIc: 0.0456,
      bestIr: 1.23,
      elapsedSeconds: 180,
      estimatedRemainingSeconds: 420,
      currentHypothesis: '',
      currentStep: 'evaluating',
    },
    factors: [],
    createdAt: 1709000000,
    startedAt: 1709000010,
    ...overrides,
  };
}

function makeRound(overrides: Partial<MiningRound> = {}): MiningRound {
  return {
    roundIndex: 1,
    hypothesis: 'Momentum reversal in small-cap stocks',
    reason: 'Small-cap stocks show stronger mean reversion after extreme moves',
    ...overrides,
  };
}

describe('ResearchLogTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders rounds from API', async () => {
    const rounds: MiningRound[] = [
      makeRound({ roundIndex: 1, hypothesis: 'Momentum drives returns' }),
      makeRound({
        roundIndex: 2,
        hypothesis: 'Volatility predicts drawdowns',
      }),
    ];
    mockedGetRounds.mockResolvedValue(rounds);

    render(<ResearchLogTab task={makeTask()} />);

    await waitFor(() => {
      expect(screen.getByText('Round 1')).toBeInTheDocument();
    });
    expect(screen.getByText('Round 2')).toBeInTheDocument();
    expect(screen.getByText(/Momentum drives returns/)).toBeInTheDocument();
  });

  it('expands round to show reasoning', async () => {
    const rounds: MiningRound[] = [
      makeRound({
        roundIndex: 1,
        hypothesis: 'Test hypothesis',
        reason: 'Because mean reversion is strong in this universe',
      }),
    ];
    mockedGetRounds.mockResolvedValue(rounds);

    render(<ResearchLogTab task={makeTask()} />);

    await waitFor(() => {
      expect(screen.getByText('Round 1')).toBeInTheDocument();
    });

    // First round should be auto-expanded (it's the latest)
    expect(
      screen.getByText('Because mean reversion is strong in this universe'),
    ).toBeInTheDocument();
  });

  it('shows empty state when no rounds', async () => {
    mockedGetRounds.mockResolvedValue([]);

    render(<ResearchLogTab task={makeTask()} />);

    await waitFor(() => {
      expect(screen.getByText(/暂无研究记录/)).toBeInTheDocument();
    });
  });
});
