'use client';

import { useState } from 'react';
import { Copy, ChevronRight } from 'lucide-react';
import { PanelSection } from '@/components/shared/panel';
import { LifecycleTimeline } from '../lifecycle-timeline';
import type { Factor } from '@/features/library/types';

interface IdentityHeaderProps {
  factor: Factor;
}

export function IdentityHeader({ factor }: IdentityHeaderProps) {
  const [exprOpen, setExprOpen] = useState(false);

  return (
    <PanelSection noBorder>
      {/* Collapsible Expression — the only info not visible in the table row */}
      <button
        type="button"
        className="flex items-center gap-1.5 w-full text-left group"
        onClick={() => setExprOpen(!exprOpen)}
      >
        <ChevronRight
          className="w-3 h-3 text-mine-muted transition-transform shrink-0"
          style={{ transform: exprOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
        />
        <span className="text-[10px] text-mine-muted">表达式</span>
      </button>
      {exprOpen && (
        <div className="bg-mine-bg rounded-md px-3 py-2 mt-1 flex items-center gap-2">
          <code className="text-[11px] text-mine-text font-mono flex-1 break-all leading-relaxed">
            {factor.expression}
          </code>
          <button
            type="button"
            className="text-mine-muted hover:text-mine-text transition-colors shrink-0"
            title="复制表达式"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(factor.expression);
            }}
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Lifecycle Timeline */}
      <LifecycleTimeline status={factor.status} />
    </PanelSection>
  );
}
