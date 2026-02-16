"use client";

import { useState } from "react";
import { Copy, Clock, ChevronRight } from "lucide-react";
import { DetailHeader } from "@/components/shared/detail-panel";
import { LifecycleTimeline } from "../lifecycle-timeline";
import type { Factor } from "../../types";
import {
  CATEGORY_COLORS,
  STATUS_COLORS,
  STATUS_LABELS,
  SOURCE_LABELS,
  SOURCE_COLORS,
  TYPE_LABELS,
  TYPE_COLORS,
} from "../../types";

interface IdentityHeaderProps {
  factor: Factor;
}

export function IdentityHeader({ factor }: IdentityHeaderProps) {
  const [exprOpen, setExprOpen] = useState(false);

  const catColor = CATEGORY_COLORS[factor.category];
  const statusColor = STATUS_COLORS[factor.status];
  const statusLabel = STATUS_LABELS[factor.status];
  const sourceLabel = SOURCE_LABELS[factor.source];
  const sourceColor = SOURCE_COLORS[factor.source];
  const typeLabel = TYPE_LABELS[factor.factorType];
  const typeColor = TYPE_COLORS[factor.factorType];

  return (
    <DetailHeader>
      {/* Row 1: Name + Status */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-mine-text">{factor.name}</h3>
            <span className="text-[10px] text-mine-muted font-mono">
              {factor.version}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="px-2 py-0.5 text-[10px] font-semibold rounded"
              style={{ backgroundColor: `${catColor}18`, color: catColor }}
            >
              {factor.category}
            </span>
            <span
              className="px-1.5 py-0.5 text-[10px] font-semibold rounded"
              style={{ backgroundColor: `${typeColor}18`, color: typeColor }}
            >
              {typeLabel}
            </span>
            <span
              className="text-[10px] font-medium"
              style={{ color: sourceColor }}
            >
              {sourceLabel}
            </span>
          </div>
        </div>
        <span
          className="px-2 py-0.5 text-[10px] font-bold rounded"
          style={{ backgroundColor: `${statusColor}18`, color: statusColor }}
        >
          {statusLabel}
        </span>
      </div>

      {/* Row 2: Collapsible Expression */}
      <button
        type="button"
        className="flex items-center gap-1.5 w-full text-left mt-2 group"
        onClick={() => setExprOpen(!exprOpen)}
      >
        <ChevronRight
          className="w-3 h-3 text-mine-muted transition-transform shrink-0"
          style={{ transform: exprOpen ? "rotate(90deg)" : "rotate(0deg)" }}
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

      {/* Row 3: Meta */}
      <div className="flex items-center gap-4 mt-2 text-[10px] text-mine-muted">
        <span>
          <Clock className="w-3 h-3 inline mr-0.5 -mt-0.5" />
          {factor.createdAt}
        </span>
        <span>by {factor.createdBy}</span>
        {factor.tags.length > 0 && (
          <div className="flex items-center gap-1">
            {factor.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-mine-bg rounded text-[9px]"
              >
                {tag}
              </span>
            ))}
            {factor.tags.length > 3 && (
              <span className="text-[9px]">+{factor.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Row 4: Lifecycle Timeline */}
      <LifecycleTimeline status={factor.status} />
    </DetailHeader>
  );
}
