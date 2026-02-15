"use client";

interface SparklineSVGProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  /** Auto-color: green if last > first, red otherwise */
  autoColor?: boolean;
}

export function SparklineSVG({
  data,
  width = 100,
  height = 26,
  color,
  autoColor = true,
}: SparklineSVGProps) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 0.001;
  const isUp = data[data.length - 1] >= data[0];
  const strokeColor =
    color ?? (autoColor ? (isUp ? "#2EBD85" : "#F6465D") : "#8a8a8a");

  const d = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path
        d={d}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
