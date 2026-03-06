'use client';

import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLibraryStore } from '@/features/library/store/use-library-store';
import type { Factor, FactorLifecycleStatus } from '@/features/library/types';
import {
  FACTOR_LIFECYCLE_STATUSES,
  STATUS_LABELS,
} from '@/features/library/types';

function getProposalDirection(
  currentStatus: FactorLifecycleStatus,
  targetStatus: FactorLifecycleStatus,
): 'upgrade' | 'downgrade' {
  const order = FACTOR_LIFECYCLE_STATUSES;
  return order.indexOf(targetStatus) > order.indexOf(currentStatus)
    ? 'upgrade'
    : 'downgrade';
}

interface ProposalBarProps extends React.ComponentProps<'div'> {
  proposal: NonNullable<Factor['pendingProposal']>;
  currentStatus: FactorLifecycleStatus;
  factorId: string;
}

function ProposalBar({
  proposal,
  currentStatus,
  factorId,
  className,
  ...props
}: ProposalBarProps) {
  const updateFactorStatus = useLibraryStore((s) => s.updateFactorStatus);
  const dismissProposal = useLibraryStore((s) => s.dismissProposal);

  const direction = getProposalDirection(currentStatus, proposal.targetStatus);
  const isUpgrade = direction === 'upgrade';
  const targetLabel = STATUS_LABELS[proposal.targetStatus];

  return (
    <div
      data-slot="proposal-bar"
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-md mt-2',
        isUpgrade
          ? 'bg-mine-accent-teal/[0.06] border border-mine-accent-teal/20'
          : 'bg-market-up/[0.06] border border-market-up/20',
        className,
      )}
      {...props}
    >
      {isUpgrade ? (
        <ArrowUpCircle className="w-3 h-3 text-mine-accent-teal shrink-0" />
      ) : (
        <ArrowDownCircle className="w-3 h-3 text-market-up shrink-0" />
      )}
      <span className="text-[10px] text-mine-text leading-relaxed flex-1">
        {isUpgrade ? '系统建议升级至 ' : '系统建议降级至 '}
        <span className="font-semibold">{targetLabel}</span>
        {'：'}
        {proposal.reason}
      </span>
      <div className="flex gap-1 shrink-0">
        <button
          type="button"
          className="px-2 py-0.5 text-[9px] font-semibold rounded border border-mine-accent-teal text-mine-accent-teal bg-transparent hover:opacity-70 transition-opacity cursor-pointer"
          title="批准"
          onClick={() =>
            updateFactorStatus(factorId, proposal.targetStatus, 'auto-approved')
          }
        >
          ✓
        </button>
        <button
          type="button"
          className="px-2 py-0.5 text-[9px] font-semibold rounded border border-market-up text-market-up bg-transparent hover:opacity-70 transition-opacity cursor-pointer"
          title="驳回"
          onClick={() => dismissProposal(factorId)}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export { ProposalBar, getProposalDirection };
