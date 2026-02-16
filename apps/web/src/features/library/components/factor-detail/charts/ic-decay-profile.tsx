"use client";

import { DetailSection, DetailChartBox } from "@/components/shared/detail-panel";
import type { Factor } from "../../../types";

function ICDecayChart({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;

  const w = 320;
  const h = 70;
  const padding = { top: 6, right: 8, bottom: 14, left: 8 };
  const plotW = w - padding.left - padding.right;
  const plotH = h - padding.top - padding.bottom;

  const maxAbs = Math.max(...data.map(Math.abs), 0.001);
  const barCount = data.length;
  const gap = 2;
  const barWidth = (plotW - (barCount - 1) * gap) / barCount;
  const baselineY = padding.top + plotH / 2;
  const labelIndices = [0, 5, 10, 15, 19];

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      <line
        x1={padding.left} y1={baselineY}
        x2={w - padding.right} y2={baselineY}
        className="stroke-mine-border" strokeWidth={0.5}
      />
      {data.map((ic, i) => {
        const x = padding.left + i * (barWidth + gap);
        const barH = (Math.abs(ic) / maxAbs) * (plotH / 2);
        const y = ic >= 0 ? baselineY - barH : baselineY;
        return (
          <rect
            key={`bar-${i}`}
            x={x} y={y}
            width={barWidth}
            height={Math.max(barH, 0.5)}
            fill={ic >= 0 ? "#3b82f6" : undefined}
            className={ic < 0 ? "fill-market-up-medium" : undefined}
            opacity={0.75}
            rx={1}
          />
        );
      })}
      {labelIndices.map((idx) => {
        if (idx >= barCount) return null;
        const x = padding.left + idx * (barWidth + gap) + barWidth / 2;
        return (
          <text
            key={`label-${idx}`}
            x={x} y={h - 2}
            textAnchor="middle"
            className="fill-mine-muted"
            fontSize={7}
          >
            T+{idx + 1}
          </text>
        );
      })}
    </svg>
  );
}

interface ICDecayProfileSectionProps {
  factor: Factor;
}

export function ICDecayProfileSection({ factor }: ICDecayProfileSectionProps) {
  return (
    <DetailSection title="IC 衰减剖面" suffix="Lag T+1 ~ T+20">
      <DetailChartBox>
        <ICDecayChart data={factor.icDecayProfile} />
      </DetailChartBox>
    </DetailSection>
  );
}
