import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProposalBar, getProposalDirection } from './proposal-bar';
import type { Factor, FactorLifecycleStatus } from '@/features/library/types';

// ═══════════════════════════════════════════════════════════════
// Store mock — replace the entire module
// ═══════════════════════════════════════════════════════════════

const mockUpdateFactorStatus = vi.fn();
const mockDismissProposal = vi.fn();

vi.mock('@/features/library/store/use-library-store', () => ({
  useLibraryStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      updateFactorStatus: mockUpdateFactorStatus,
      dismissProposal: mockDismissProposal,
    }),
}));

// ═══════════════════════════════════════════════════════════════
// Fixtures
// ═══════════════════════════════════════════════════════════════

function makeProposal(
  targetStatus: FactorLifecycleStatus,
  reason: string,
): NonNullable<Factor['pendingProposal']> {
  return {
    targetStatus,
    reason,
    proposedAt: '2026-03-01T15:30:00Z',
  };
}

beforeEach(() => {
  mockUpdateFactorStatus.mockClear();
  mockDismissProposal.mockClear();
});

// ═══════════════════════════════════════════════════════════════
// Pure function tests
// ═══════════════════════════════════════════════════════════════

describe('getProposalDirection', () => {
  it('returns "upgrade" when target is later in lifecycle', () => {
    expect(getProposalDirection('INCUBATING', 'PAPER_TEST')).toBe('upgrade');
    expect(getProposalDirection('PAPER_TEST', 'LIVE_ACTIVE')).toBe('upgrade');
    expect(getProposalDirection('INCUBATING', 'LIVE_ACTIVE')).toBe('upgrade');
  });

  it('returns "downgrade" when target is earlier in lifecycle', () => {
    // FACTOR_LIFECYCLE_STATUSES: INCUBATING(0), PAPER_TEST(1), LIVE_ACTIVE(2), PROBATION(3), RETIRED(4)
    expect(getProposalDirection('PAPER_TEST', 'INCUBATING')).toBe('downgrade');
    expect(getProposalDirection('PROBATION', 'LIVE_ACTIVE')).toBe('downgrade');
    expect(getProposalDirection('LIVE_ACTIVE', 'INCUBATING')).toBe('downgrade');
  });

  it('LIVE_ACTIVE → PROBATION is upgrade by enum index', () => {
    // FACTOR_LIFECYCLE_STATUSES: INCUBATING(0), PAPER_TEST(1), LIVE_ACTIVE(2), PROBATION(3), RETIRED(4)
    // PROBATION index(3) > LIVE_ACTIVE index(2) → 'upgrade'
    expect(getProposalDirection('LIVE_ACTIVE', 'PROBATION')).toBe('upgrade');
  });

  it('PROBATION → LIVE_ACTIVE is downgrade by enum index', () => {
    // LIVE_ACTIVE(2) < PROBATION(3) → 'downgrade'
    expect(getProposalDirection('PROBATION', 'LIVE_ACTIVE')).toBe('downgrade');
  });
});

// ═══════════════════════════════════════════════════════════════
// Component tests
// ═══════════════════════════════════════════════════════════════

describe('ProposalBar', () => {
  describe('升级建议 (INCUBATING → PAPER_TEST)', () => {
    const proposal = makeProposal(
      'PAPER_TEST',
      '样本外 IC 连续 60 期 > 0.02, ICIR > 0.5',
    );

    it('applies teal color scheme to container', () => {
      const { container } = render(
        <ProposalBar
          proposal={proposal}
          currentStatus="INCUBATING"
          factorId="factor-1"
        />,
      );
      const el = container.querySelector('[data-slot="proposal-bar"]');
      expect(el?.className).toMatch(/mine-accent-teal/);
    });

    it('renders ArrowUpCircle icon in teal', () => {
      const { container } = render(
        <ProposalBar
          proposal={proposal}
          currentStatus="INCUBATING"
          factorId="factor-1"
        />,
      );
      // ArrowUpCircle renders as SVG; teal color applied to parent/svg
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThanOrEqual(1);
      // The icon wrapper should have teal class
      const iconParent = svgs[0]?.parentElement;
      // The SVG itself gets the class from Lucide
      expect(
        container.querySelector('.text-mine-accent-teal'),
      ).toBeInTheDocument();
    });

    it('displays correct upgrade text template', () => {
      render(
        <ProposalBar
          proposal={proposal}
          currentStatus="INCUBATING"
          factorId="factor-1"
        />,
      );
      expect(screen.getByText(/系统建议升级至/)).toBeInTheDocument();
      expect(screen.getByText('PAPER')).toBeInTheDocument();
      expect(
        screen.getByText(/样本外 IC 连续 60 期 > 0.02/),
      ).toBeInTheDocument();
    });

    it('renders target status label in bold (font-semibold)', () => {
      render(
        <ProposalBar
          proposal={proposal}
          currentStatus="INCUBATING"
          factorId="factor-1"
        />,
      );
      const label = screen.getByText('PAPER');
      expect(label.className).toMatch(/font-semibold/);
    });
  });

  describe('降级建议 (PROBATION → LIVE_ACTIVE)', () => {
    // Based on getProposalDirection: PROBATION(3) → LIVE_ACTIVE(2) = downgrade
    const proposal = makeProposal(
      'LIVE_ACTIVE',
      'IC 回升至正常水平, 解除观察期',
    );

    it('applies red (market-up) color scheme to container', () => {
      const { container } = render(
        <ProposalBar
          proposal={proposal}
          currentStatus="PROBATION"
          factorId="factor-1"
        />,
      );
      const el = container.querySelector('[data-slot="proposal-bar"]');
      expect(el?.className).toMatch(/market-up/);
    });

    it('renders ArrowDownCircle icon in red', () => {
      const { container } = render(
        <ProposalBar
          proposal={proposal}
          currentStatus="PROBATION"
          factorId="factor-1"
        />,
      );
      expect(container.querySelector('.text-market-up')).toBeInTheDocument();
    });

    it('displays correct downgrade text template', () => {
      render(
        <ProposalBar
          proposal={proposal}
          currentStatus="PROBATION"
          factorId="factor-1"
        />,
      );
      expect(screen.getByText(/系统建议降级至/)).toBeInTheDocument();
      expect(screen.getByText('LIVE')).toBeInTheDocument();
    });

    it('displays the full reason text', () => {
      const reason = 'IC 连续 20 期 < 0.01, 信号已衰减';
      const p = makeProposal('RETIRED', reason);
      render(
        <ProposalBar
          proposal={p}
          currentStatus="LIVE_ACTIVE"
          factorId="factor-1"
        />,
      );
      expect(screen.getByText(new RegExp(reason))).toBeInTheDocument();
    });
  });

  describe('操作按钮', () => {
    const proposal = makeProposal('PAPER_TEST', 'IC 达标');

    it('renders Approve button', () => {
      render(
        <ProposalBar
          proposal={proposal}
          currentStatus="INCUBATING"
          factorId="factor-1"
        />,
      );
      expect(screen.getByTitle('批准')).toBeInTheDocument();
    });

    it('renders Reject button', () => {
      render(
        <ProposalBar
          proposal={proposal}
          currentStatus="INCUBATING"
          factorId="factor-1"
        />,
      );
      expect(screen.getByTitle('驳回')).toBeInTheDocument();
    });

    it('calls updateFactorStatus on Approve click', () => {
      render(
        <ProposalBar
          proposal={proposal}
          currentStatus="INCUBATING"
          factorId="factor-1"
        />,
      );
      fireEvent.click(screen.getByTitle('批准'));
      expect(mockUpdateFactorStatus).toHaveBeenCalledOnce();
      expect(mockUpdateFactorStatus).toHaveBeenCalledWith(
        'factor-1',
        'PAPER_TEST',
        'auto-approved',
      );
    });

    it('calls dismissProposal on Reject click', () => {
      render(
        <ProposalBar
          proposal={proposal}
          currentStatus="INCUBATING"
          factorId="factor-1"
        />,
      );
      fireEvent.click(screen.getByTitle('驳回'));
      expect(mockDismissProposal).toHaveBeenCalledOnce();
      expect(mockDismissProposal).toHaveBeenCalledWith('factor-1');
    });
  });

  describe('组件结构', () => {
    const proposal = makeProposal('PAPER_TEST', 'IC 达标');

    it('has data-slot="proposal-bar" attribute', () => {
      const { container } = render(
        <ProposalBar
          proposal={proposal}
          currentStatus="INCUBATING"
          factorId="factor-1"
        />,
      );
      expect(
        container.querySelector('[data-slot="proposal-bar"]'),
      ).toBeInTheDocument();
    });

    it('merges external className', () => {
      const { container } = render(
        <ProposalBar
          proposal={proposal}
          currentStatus="INCUBATING"
          factorId="factor-1"
          className="mt-4"
        />,
      );
      const el = container.querySelector('[data-slot="proposal-bar"]');
      expect(el?.className).toMatch(/mt-4/);
    });
  });
});
