"use client";

interface SparklineSVGProps {
  data: number[];
  /** Internal viewBox width (default 120) */
  viewBoxWidth?: number;
  /** Internal viewBox height (default 26) */
  viewBoxHeight?: number;
  color?: string;
  /** Auto-color: green if last > first, red otherwise */
  autoColor?: boolean;
  /** CSS class for the svg element — use w-full h-[26px] for responsive sizing */
  className?: string;
}

export function SparklineSVG({
  data,
  viewBoxWidth = 120,
  viewBoxHeight = 26,
  color,
  autoColor = true,
  className,
}: SparklineSVGProps) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 0.001;
  const isUp = data[data.length - 1] >= data[0];
  const fillColor =
    color ?? (autoColor ? (isUp ? "#F6465D" : "#2EBD85") : "#8a8a8a");

  const barCount = data.length;
  const gap = 1;
  const barWidth = Math.max(1, (viewBoxWidth - gap * (barCount - 1)) / barCount);

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      preserveAspectRatio="none"
      className={className}
      style={!className ? { width: viewBoxWidth, height: viewBoxHeight } : undefined}
    >
      {data.map((v, i) => {
        const barHeight = Math.max(1, ((v - min) / range) * (viewBoxHeight - 2));
        const x = i * (barWidth + gap);
        const y = viewBoxHeight - barHeight;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            fill={fillColor}
            opacity={0.85}
            rx={0.5}
          />
        );
      })}
    </svg>
  );
}
