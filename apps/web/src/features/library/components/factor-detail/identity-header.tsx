'use client';

import { useState, useRef, useEffect } from 'react';
import { PanelSection } from '@/components/shared/panel';
import { LifecycleTimeline } from '../lifecycle-timeline';
import { SourceBlock } from './source-block';
import { ProposalBar } from './proposal-bar';
import type { Factor } from '@/features/library/types';

interface IdentityHeaderProps {
  factor: Factor;
}

export function IdentityHeader({ factor }: IdentityHeaderProps) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    setExpanded(false);
  }, [factor.id]);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    setIsClamped(el.scrollHeight > el.clientHeight);
  }, [factor.hypothesis, factor.id]);

  return (
    <PanelSection noBorder>
      <SourceBlock factor={factor} />

      <div className="mt-2">
        <p
          ref={textRef}
          className={`text-[11px] text-mine-muted leading-relaxed whitespace-pre-line ${
            expanded ? '' : 'line-clamp-3'
          }`}
        >
          {factor.hypothesis}
        </p>
        {isClamped && (
          <button
            type="button"
            className="text-[10px] text-mine-accent-teal cursor-pointer hover:underline"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '收起' : '展开'}
          </button>
        )}
      </div>

      <LifecycleTimeline status={factor.status} />

      {factor.pendingProposal && (
        <ProposalBar
          proposal={factor.pendingProposal}
          currentStatus={factor.status}
          factorId={factor.id}
        />
      )}
    </PanelSection>
  );
}
