import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IdentityHeader } from './identity-header';
import type { Factor } from '@/features/library/types';

// ═══════════════════════════════════════════════════════════════
// Store mock — ProposalBar uses useLibraryStore internally
// ═══════════════════════════════════════════════════════════════

vi.mock('@/features/library/store/use-library-store', () => ({
  useLibraryStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      updateFactorStatus: vi.fn(),
      dismissProposal: vi.fn(),
    }),
}));

// ═══════════════════════════════════════════════════════════════
// Mock AnimatedBeam (LifecycleTimeline uses it, may need canvas/RAF)
// ═══════════════════════════════════════════════════════════════

vi.mock('@/components/ui/animated-beam', () => ({
  AnimatedBeam: () => null,
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
    universeProfile: [],
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
    hypothesis:
      '经波动率调整的20日动量因子。假设高动量且低波动的股票具有更强的趋势延续性。',
    ...overrides,
  } as Factor;
}

/** Simulate text overflow by mocking scrollHeight > clientHeight */
function mockOverflow(overflow: boolean) {
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get() {
      return overflow ? 100 : 20;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get() {
      return 20;
    },
  });
}

beforeEach(() => {
  // Default: no overflow
  mockOverflow(false);
});

describe('IdentityHeader', () => {
  describe('SourceBlock 集成', () => {
    it('renders SourceBlock with factor workspace path', () => {
      const factor = createMockFactor();
      const { container } = render(<IdentityHeader factor={factor} />);
      expect(
        container.querySelector('[data-slot="source-block"]'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('factors/vol_adj_momentum/factor.py'),
      ).toBeInTheDocument();
    });
  });

  describe('金融假设', () => {
    it('renders the hypothesis text', () => {
      const factor = createMockFactor({
        hypothesis:
          '经波动率调整的20日动量因子。假设高动量且低波动的股票具有更强的趋势延续性。',
      });
      render(<IdentityHeader factor={factor} />);
      expect(
        screen.getByText(
          '经波动率调整的20日动量因子。假设高动量且低波动的股票具有更强的趋势延续性。',
        ),
      ).toBeInTheDocument();
    });

    it('truncates to 3 lines by default (line-clamp-3)', () => {
      const factor = createMockFactor();
      render(<IdentityHeader factor={factor} />);
      const hypEl = screen.getByText(factor.hypothesis);
      expect(hypEl.className).toMatch(/line-clamp-3/);
    });

    it('shows expand button when hypothesis overflows 3 lines', () => {
      mockOverflow(true);
      const factor = createMockFactor({
        hypothesis:
          '这是一段非常长的假设文本，用于测试展开按钮是否出现。' +
          '这是一段非常长的假设文本，用于测试展开按钮是否出现。' +
          '这是一段非常长的假设文本，用于测试展开按钮是否出现。' +
          '这是一段非常长的假设文本，用于测试展开按钮是否出现。',
      });
      render(<IdentityHeader factor={factor} />);
      expect(screen.getByText('展开')).toBeInTheDocument();
    });

    it('expands hypothesis on clicking expand button', () => {
      mockOverflow(true);
      const factor = createMockFactor({
        hypothesis: '这是一段非常长的假设文本。'.repeat(10),
      });
      render(<IdentityHeader factor={factor} />);
      fireEvent.click(screen.getByText('展开'));
      // After expand: line-clamp-3 should be removed
      const hypEl = screen.getByText(factor.hypothesis);
      expect(hypEl.className).not.toMatch(/line-clamp-3/);
      // Button text should change to '收起'
      expect(screen.getByText('收起')).toBeInTheDocument();
    });

    it('collapses hypothesis on clicking collapse button', () => {
      mockOverflow(true);
      const factor = createMockFactor({
        hypothesis: '这是一段非常长的假设文本。'.repeat(10),
      });
      render(<IdentityHeader factor={factor} />);
      // Expand first
      fireEvent.click(screen.getByText('展开'));
      // Then collapse
      fireEvent.click(screen.getByText('收起'));
      const hypEl = screen.getByText(factor.hypothesis);
      expect(hypEl.className).toMatch(/line-clamp-3/);
      expect(screen.getByText('展开')).toBeInTheDocument();
    });

    it('does not show expand button for short hypothesis', () => {
      mockOverflow(false);
      const factor = createMockFactor({ hypothesis: '短假设。' });
      render(<IdentityHeader factor={factor} />);
      expect(screen.queryByText('展开')).not.toBeInTheDocument();
      expect(screen.queryByText('收起')).not.toBeInTheDocument();
    });

    it('applies correct typography classes to hypothesis', () => {
      const factor = createMockFactor();
      render(<IdentityHeader factor={factor} />);
      const hypEl = screen.getByText(factor.hypothesis);
      expect(hypEl.className).toMatch(/text-\[11px\]/);
      expect(hypEl.className).toMatch(/text-mine-muted/);
    });
  });

  describe('LifecycleTimeline', () => {
    it('renders LifecycleTimeline with factor status', () => {
      const factor = createMockFactor({ status: 'PAPER_TEST' });
      render(<IdentityHeader factor={factor} />);
      // LifecycleTimeline renders status labels — PAPER is the label for PAPER_TEST
      expect(screen.getByText('PAPER')).toBeInTheDocument();
    });
  });

  describe('ProposalBar 集成', () => {
    it('renders ProposalBar when factor has pendingProposal', () => {
      const factor = createMockFactor({
        pendingProposal: {
          targetStatus: 'LIVE_ACTIVE',
          reason: 'IC 连续 60 期达标',
          proposedAt: '2026-03-01T15:30:00Z',
        },
      });
      const { container } = render(<IdentityHeader factor={factor} />);
      expect(
        container.querySelector('[data-slot="proposal-bar"]'),
      ).toBeInTheDocument();
    });

    it('does not render ProposalBar when no pendingProposal', () => {
      const factor = createMockFactor({ pendingProposal: undefined });
      const { container } = render(<IdentityHeader factor={factor} />);
      expect(
        container.querySelector('[data-slot="proposal-bar"]'),
      ).not.toBeInTheDocument();
    });
  });

  describe('组件顺序与布局', () => {
    it('renders components in correct vertical order: Source → Hypothesis → Timeline → Proposal', () => {
      const factor = createMockFactor({
        pendingProposal: {
          targetStatus: 'LIVE_ACTIVE',
          reason: '达标',
          proposedAt: '2026-03-01T15:30:00Z',
        },
      });
      const { container } = render(<IdentityHeader factor={factor} />);
      const sourceBlock = container.querySelector('[data-slot="source-block"]');
      const proposalBar = container.querySelector('[data-slot="proposal-bar"]');
      expect(sourceBlock).toBeInTheDocument();
      expect(proposalBar).toBeInTheDocument();
      // Source should appear before Proposal in DOM order
      const allElements = container.querySelectorAll('[data-slot]');
      const slots = Array.from(allElements).map((el) =>
        el.getAttribute('data-slot'),
      );
      const sourceIdx = slots.indexOf('source-block');
      const proposalIdx = slots.indexOf('proposal-bar');
      expect(sourceIdx).toBeLessThan(proposalIdx);
    });

    it('wraps content in PanelSection with noBorder', () => {
      const factor = createMockFactor();
      const { container } = render(<IdentityHeader factor={factor} />);
      expect(
        container.querySelector('[data-slot="panel-section"]'),
      ).toBeInTheDocument();
    });
  });

  describe('删除验证 (重构确认)', () => {
    it('does NOT render expression collapsible section', () => {
      const factor = createMockFactor();
      render(<IdentityHeader factor={factor} />);
      expect(screen.queryByText('表达式')).not.toBeInTheDocument();
    });

    it('does NOT render StatusActionsSection', () => {
      const factor = createMockFactor();
      render(<IdentityHeader factor={factor} />);
      expect(screen.queryByText('状态变更')).not.toBeInTheDocument();
    });
  });

  describe('边界情况', () => {
    it('renders gracefully when hypothesis is empty string', () => {
      mockOverflow(false);
      const factor = createMockFactor({ hypothesis: '' });
      render(<IdentityHeader factor={factor} />);
      expect(screen.queryByText('展开')).not.toBeInTheDocument();
    });

    it('resets expanded state when factor changes', () => {
      mockOverflow(true);
      const factorA = createMockFactor({
        id: 'factor-a',
        hypothesis: '这是一段非常长的假设文本。'.repeat(10),
      });
      const factorB = createMockFactor({
        id: 'factor-b',
        hypothesis: '另一段很长的假设文本。'.repeat(10),
      });

      const { rerender } = render(<IdentityHeader factor={factorA} />);
      // Expand factor A
      fireEvent.click(screen.getByText('展开'));
      expect(screen.getByText('收起')).toBeInTheDocument();

      // Switch to factor B
      rerender(<IdentityHeader factor={factorB} />);
      // Should reset to truncated state
      const hypEl = screen.getByText(factorB.hypothesis);
      expect(hypEl.className).toMatch(/line-clamp-3/);
      // Button should show '展开' not '收起'
      expect(screen.getByText('展开')).toBeInTheDocument();
      expect(screen.queryByText('收起')).not.toBeInTheDocument();
    });
  });
});
