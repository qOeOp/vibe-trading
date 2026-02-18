"use client";

import { DetailSection } from "@/components/shared/detail-panel";
import type { Factor } from "../../types";

function retentionColorClass(pct: number): string {
  if (pct >= 70) return "text-market-down-medium";
  if (pct >= 30) return "text-market-flat";
  return "text-market-up-medium";
}

function retentionBgClass(pct: number): string {
  if (pct >= 70) return "bg-market-down-medium/8 text-market-down-medium";
  if (pct >= 30) return "bg-market-flat/8 text-market-flat";
  return "bg-market-up-medium/8 text-market-up-medium";
}

function retentionLabel(pct: number): string {
  if (pct >= 70) return "逻辑扎实";
  if (pct >= 30) return "中等";
  return "过拟合风险";
}

interface RobustnessSectionProps {
  factor: Factor;
}

export function RobustnessSection({ factor }: RobustnessSectionProps) {
  const rankPct = Math.round(factor.rankTestRetention * 100);
  const binaryPct = Math.round(factor.binaryTestRetention * 100);

  return (
    <DetailSection>
      <div className="text-xs font-medium text-mine-muted mb-3 uppercase tracking-wider">
        鲁棒性检验
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-mine-text">Rank Test</span>
            <span className="text-[9px] text-mine-muted">rank(X) 保留率</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold font-mono tabular-nums ${retentionColorClass(rankPct)}`}>
              {rankPct}%
            </span>
            <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded ${retentionBgClass(rankPct)}`}>
              {retentionLabel(rankPct)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-mine-text">Binary Test</span>
            <span className="text-[9px] text-mine-muted">sign(X) 保留率</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold font-mono tabular-nums ${retentionColorClass(binaryPct)}`}>
              {binaryPct}%
            </span>
            <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded ${retentionBgClass(binaryPct)}`}>
              {retentionLabel(binaryPct)}
            </span>
          </div>
        </div>

        <div className="text-[9px] text-mine-muted leading-relaxed mt-1">
          变换后 Sharpe 保留 &gt;70% 表示因子捕捉的是结构性信号；&lt;30% 提示过拟合风险
        </div>
      </div>
    </DetailSection>
  );
}
