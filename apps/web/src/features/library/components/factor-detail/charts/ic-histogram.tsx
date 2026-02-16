"use client";

import { DetailSection, DetailChartBox } from "@/components/shared/detail-panel";
import type { Factor } from "../../../types";

function ICHistogramChart({
  bins,
  icMean,
}: {
  bins: number[];
  icMean: number;
}) {
  if (!bins || bins.length === 0) return null;

  const w = 320;
  const h = 80;
  const padding = { top: 4, right: 8, bottom: 4, left: 8 };
  const plotW = w - padding.left - padding.right;
  const plotH = h - padding.top - padding.bottom;

  const maxCount = Math.max(...bins, 1);
  const barCount = bins.length;
  const gap = 1;
  const barWidth = (plotW - (barCount - 1) * gap) / barCount;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      {bins.map((count, i) => {
        const barH = (count / maxCount) * plotH;
        const x = padding.left + i * (barWidth + gap);
        const y = padding.top + plotH - barH;
        const distFromCenter = Math.abs(i - barCount / 2) / (barCount / 2);
        const opacity = 0.4 + distFromCenter * 0.4;
        return (
          <rect
            key={`bin-${i}`}
            x={x} y={y}
            width={barWidth}
            height={Math.max(barH, 0.5)}
            className="fill-mine-accent-teal"
            opacity={opacity}
            rx={1}
          />
        );
      })}
      {icMean !== 0 && (
        <>
          <line
            x1={w / 2} y1={padding.top}
            x2={w / 2} y2={padding.top + plotH}
            stroke="#a8b2c7" strokeWidth={0.8} strokeDasharray="3 2"
          />
          <text
            x={w / 2 + 3} y={padding.top + 8}
            fill="#a8b2c7" fontSize={7}
          >
            {"μ="}
            {icMean.toFixed(3)}
          </text>
        </>
      )}
    </svg>
  );
}

interface ICHistogramSectionProps {
  factor: Factor;
}

export function ICHistogramSection({ factor }: ICHistogramSectionProps) {
  return (
    <DetailSection title="IC 分布直方图" suffix="20-bin">
      <DetailChartBox>
        <ICHistogramChart
          bins={factor.icHistogramBins}
          icMean={factor.icDistribution.icMean}
        />
      </DetailChartBox>
    </DetailSection>
  );
}
