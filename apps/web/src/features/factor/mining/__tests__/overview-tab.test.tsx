import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OverviewTab } from '../components/overview-tab';
import type { MiningTask, LogEntry } from '../types';

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
      currentHypothesis: 'Momentum reversal in small-cap stocks',
      currentStep: 'evaluating',
    },
    factors: [],
    createdAt: 1709000000,
    startedAt: 1709000010,
    ...overrides,
  };
}

describe('OverviewTab', () => {
  it('renders KPI stats from task progress', () => {
    const task = makeTask();
    render(<OverviewTab task={task} logEntries={[]} />);

    // factorsDiscovered = 5
    expect(screen.getByText('5')).toBeInTheDocument();
    // factorsAccepted = 2
    expect(screen.getByText('2')).toBeInTheDocument();
    // factorsRejected = 3
    expect(screen.getByText('3')).toBeInTheDocument();
    // bestIc = 0.0456
    expect(screen.getByText('0.0456')).toBeInTheDocument();
    // bestIr = 1.23
    expect(screen.getByText('1.230')).toBeInTheDocument();
    // elapsed 180s = 3m
    expect(screen.getByText('3m')).toBeInTheDocument();
  });

  it('renders activity log entries when RUNNING', () => {
    const task = makeTask({ status: 'RUNNING' });
    const logEntries: LogEntry[] = [
      {
        id: 'log-1',
        timestamp: Date.now(),
        type: 'iteration',
        message: 'Loop 1 started',
      },
      {
        id: 'log-2',
        timestamp: Date.now(),
        type: 'factor_accepted',
        message: 'alpha_momentum IC=0.042 accepted',
      },
    ];

    render(<OverviewTab task={task} logEntries={logEntries} />);

    expect(screen.getByText('Loop 1 started')).toBeInTheDocument();
    expect(
      screen.getByText('alpha_momentum IC=0.042 accepted'),
    ).toBeInTheDocument();
  });

  it('shows current hypothesis when available', () => {
    const task = makeTask({
      progress: {
        currentLoop: 2,
        maxLoops: 10,
        factorsDiscovered: 1,
        factorsAccepted: 0,
        factorsRejected: 1,
        bestIc: 0.01,
        bestIr: 0.5,
        elapsedSeconds: 60,
        estimatedRemainingSeconds: 300,
        currentHypothesis: 'Test hypothesis about volatility clustering',
        currentStep: 'coding',
      },
    });

    render(<OverviewTab task={task} logEntries={[]} />);

    expect(
      screen.getByText('Test hypothesis about volatility clustering'),
    ).toBeInTheDocument();
  });

  it('shows empty log message when no entries', () => {
    const task = makeTask({ status: 'RUNNING' });
    render(<OverviewTab task={task} logEntries={[]} />);

    expect(screen.getByText('等待挖掘开始...')).toBeInTheDocument();
  });

  it('builds completed log for non-running tasks', () => {
    const task = makeTask({
      status: 'COMPLETED',
      completedAt: 1709000200,
      progress: {
        currentLoop: 10,
        maxLoops: 10,
        factorsDiscovered: 5,
        factorsAccepted: 2,
        factorsRejected: 3,
        bestIc: 0.0456,
        bestIr: 1.23,
        elapsedSeconds: 600,
        estimatedRemainingSeconds: 0,
        currentHypothesis: '',
        currentStep: 'done',
      },
      factors: [
        {
          name: 'alpha_mom',
          code: 'return x',
          metrics: {
            ic: 0.042,
            icir: 1.1,
            rankIc: 0.04,
            rankIcir: 1.0,
            turnover: 0.3,
            arr: 0.15,
            sharpe: 1.5,
            maxDrawdown: 0.08,
          },
          generation: 1,
          hypothesis: 'test',
          reason: 'test',
          description: 'test',
          formulation: 'x',
          variables: 'x',
          dedupScore: 0.1,
          accepted: true,
        },
      ],
    });

    // Pass empty logEntries -- OverviewTab should use buildCompletedLog for COMPLETED status
    render(<OverviewTab task={task} logEntries={[]} />);

    // Should show the completed summary log, not the empty message
    expect(screen.getByText(/挖掘完成/)).toBeInTheDocument();
    expect(screen.getByText(/alpha_mom/)).toBeInTheDocument();
  });
});
