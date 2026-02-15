"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadarChart } from "@/lib/ngx-charts/radar-chart";
import type { RadarSeries } from "@/lib/ngx-charts/radar-chart";
import type { Factor } from "../types";
import { STATUS_COLORS, STATUS_LABELS } from "../types";
import {
  computeRadarScores,
  radarScoresToValues,
  RADAR_LABELS,
} from "../utils/compute-radar-scores";

// ─── Constants ──────────────────────────────────────────

/** Color palette for comparison series (max 5 factors) */
const COMPARISON_COLORS = [
  "#26a69a", // teal
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#ec4899", // pink
  "#8b5cf6", // purple
];

// ─── Metric definitions ─────────────────────────────────

interface MetricDef {
  key: keyof Factor;
  label: string;
  format: (v: number) => string;
  colorFn: (v: number) => string;
  /** How to rank for "best" highlight. Return comparable number (higher = better). */
  rank: (v: number) => number;
}

const METRICS: MetricDef[] = [
  {
    key: "ic",
    label: "IC (20D)",
    format: (v) => `${v >= 0 ? "+" : ""}${v.toFixed(3)}`,
    colorFn: (v) => (v >= 0 ? "#2EBD85" : "#F6465D"),
    rank: (v) => Math.abs(v),
  },
  {
    key: "ir",
    label: "IR",
    format: (v) => v.toFixed(2),
    colorFn: (v) =>
      Math.abs(v) >= 1.0 ? "#2EBD85" : Math.abs(v) >= 0.5 ? "#76808E" : "#F6465D",
    rank: (v) => Math.abs(v),
  },
  {
    key: "icTstat",
    label: "t-stat",
    format: (v) => v.toFixed(2),
    colorFn: (v) => (Math.abs(v) >= 2 ? "#2EBD85" : "#F6465D"),
    rank: (v) => Math.abs(v),
  },
  {
    key: "winRate",
    label: "胜率",
    format: (v) => `${v}%`,
    colorFn: (v) => (v >= 55 ? "#2EBD85" : "#76808E"),
    rank: (v) => v,
  },
  {
    key: "turnover",
    label: "换手",
    format: (v) => `${v}%`,
    colorFn: () => "#1a1a1a",
    rank: (v) => -v, // lower turnover is generally better
  },
  {
    key: "capacity",
    label: "容量",
    format: (v) =>
      v >= 10000 ? `${(v / 10000).toFixed(0)}亿` : `${v}万`,
    colorFn: () => "#1a1a1a",
    rank: (v) => v,
  },
  {
    key: "ic60d",
    label: "IC 60D",
    format: (v) => `${v >= 0 ? "+" : ""}${v.toFixed(3)}`,
    colorFn: (v) => (v >= 0 ? "#2EBD85" : "#F6465D"),
    rank: (v) => Math.abs(v),
  },
  {
    key: "ic120d",
    label: "IC 120D",
    format: (v) => `${v >= 0 ? "+" : ""}${v.toFixed(3)}`,
    colorFn: (v) => (v >= 0 ? "#2EBD85" : "#F6465D"),
    rank: (v) => Math.abs(v),
  },
  {
    key: "vScore",
    label: "V-Score",
    format: (v) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}`,
    colorFn: (v) =>
      v < -1 ? "#3b82f6" : v > 1 ? "#f5a623" : "#8a8a8a",
    rank: (v) => -Math.abs(v), // closer to 0 = more fairly valued (neutral rank)
  },
  {
    key: "rankTestRetention",
    label: "Rank Test",
    format: (v) => `${Math.round(v * 100)}%`,
    colorFn: (v) =>
      v >= 0.7 ? "#2EBD85" : v >= 0.3 ? "#76808E" : "#F6465D",
    rank: (v) => v,
  },
  {
    key: "binaryTestRetention",
    label: "Binary Test",
    format: (v) => `${Math.round(v * 100)}%`,
    colorFn: (v) =>
      v >= 0.7 ? "#2EBD85" : v >= 0.3 ? "#76808E" : "#F6465D",
    rank: (v) => v,
  },
];

// ─── Props ──────────────────────────────────────────────

interface ComparisonPanelProps {
  factors: Factor[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemoveFactor?: (factorId: string) => void;
}

// ─── Component ──────────────────────────────────────────

export function ComparisonPanel({
  factors,
  open,
  onOpenChange,
  onRemoveFactor,
}: ComparisonPanelProps) {
  // Limit to 5 factors
  const displayFactors = factors.slice(0, 5);

  // Compute radar series for overlay chart
  const radarSeries = useMemo<RadarSeries[]>(
    () =>
      displayFactors.map((f, i) => ({
        label: f.name,
        values: radarScoresToValues(computeRadarScores(f)),
        color: COMPARISON_COLORS[i % COMPARISON_COLORS.length],
      })),
    [displayFactors],
  );

  // For each metric, find which factor has the "best" value
  const bestIndices = useMemo(() => {
    if (displayFactors.length < 2) return new Map<string, number>();
    const map = new Map<string, number>();
    for (const m of METRICS) {
      const ranked = displayFactors.map((f) => m.rank(f[m.key] as number));
      const maxVal = Math.max(...ranked);
      map.set(m.key as string, ranked.indexOf(maxVal));
    }
    return map;
  }, [displayFactors]);

  if (displayFactors.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>因子对比</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Factor name tags */}
          <div className="flex items-center gap-2 flex-wrap">
            {displayFactors.map((f, i) => {
              const color =
                COMPARISON_COLORS[i % COMPARISON_COLORS.length];
              const statusColor = STATUS_COLORS[f.status];
              return (
                <div
                  key={f.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
                  style={{
                    borderColor: color,
                    backgroundColor: `${color}08`,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[11px] font-semibold text-mine-text">
                    {f.name}
                  </span>
                  <span className="text-[9px] text-mine-muted font-mono">
                    {f.version}
                  </span>
                  <span
                    className="text-[8px] font-bold px-1 py-0.5 rounded ml-1"
                    style={{
                      backgroundColor: `${statusColor}18`,
                      color: statusColor,
                    }}
                  >
                    {STATUS_LABELS[f.status]}
                  </span>
                  {onRemoveFactor && (
                    <button
                      type="button"
                      onClick={() => onRemoveFactor(f.id)}
                      className="ml-1 text-mine-muted hover:text-mine-text transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Radar Chart overlay */}
          <div className="flex justify-center">
            <RadarChart
              labels={[...RADAR_LABELS]}
              values={radarSeries[0]?.values ?? []}
              series={radarSeries}
              size={280}
            />
          </div>

          {/* Metrics comparison table */}
          <div>
            <div className="text-[10px] text-mine-muted uppercase tracking-wider mb-2">
              核心指标对比
            </div>
            <div className="border border-mine-border rounded-lg overflow-hidden">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-mine-bg/50">
                    <th className="text-left py-2 px-3 text-[9px] text-mine-muted uppercase tracking-wider font-medium w-[100px]">
                      指标
                    </th>
                    {displayFactors.map((f, i) => (
                      <th
                        key={f.id}
                        className="text-right py-2 px-3 text-[9px] font-semibold"
                        style={{
                          color:
                            COMPARISON_COLORS[
                              i % COMPARISON_COLORS.length
                            ],
                        }}
                      >
                        {f.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {METRICS.map((m) => {
                    const bestIdx = bestIndices.get(m.key as string) ?? -1;
                    return (
                      <tr
                        key={m.key as string}
                        className="border-t border-mine-border/50"
                      >
                        <td className="py-1.5 px-3 text-mine-muted font-medium">
                          {m.label}
                        </td>
                        {displayFactors.map((f, i) => {
                          const val = f[m.key] as number;
                          const isBest =
                            i === bestIdx && displayFactors.length > 1;
                          return (
                            <td
                              key={f.id}
                              className="py-1.5 px-3 text-right font-mono tabular-nums"
                              style={{
                                color: m.colorFn(val),
                                fontWeight: isBest ? 700 : 400,
                              }}
                            >
                              {m.format(val)}
                              {isBest && (
                                <span className="ml-1 text-[8px] text-mine-accent-green">
                                  ★
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
