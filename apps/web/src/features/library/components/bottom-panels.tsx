"use client";

import { useMemo } from "react";
import type { LibraryFactor } from "../types";

/* ── Correlation Matrix ──────────────────────────────────────── */

interface CorrelationMatrixProps {
  factors: LibraryFactor[];
}

/** Generate a symmetric correlation matrix from factor names */
function generateCorrelationMatrix(names: string[]): number[][] {
  const n = names.length;
  const matrix: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => 0)
  );
  for (let i = 0; i < n; i++) {
    matrix[i][i] = 1;
    for (let j = i + 1; j < n; j++) {
      // Deterministic pseudo-random based on indices
      const seed = (i * 31 + j * 17) % 100;
      const corr = (seed - 50) / 50; // Range: -1 to 1
      matrix[i][j] = Math.round(corr * 100) / 100;
      matrix[j][i] = matrix[i][j];
    }
  }
  return matrix;
}

function getCorrelationColor(value: number): string {
  if (value >= 0.6) return "#CF304A";
  if (value >= 0.3) return "#E8626F";
  if (value >= 0.1) return "#F6465D33";
  if (value <= -0.6) return "#0B8C5F";
  if (value <= -0.3) return "#2EBD85";
  if (value <= -0.1) return "#2EBD8533";
  return "#f5f3ef";
}

export function CorrelationMatrix({ factors }: CorrelationMatrixProps) {
  const topFactors = factors.slice(0, 8);
  const names = topFactors.map((f) => f.name);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- stable when name list is the same
  const nameKey = names.join(",");
  const matrix = useMemo(() => generateCorrelationMatrix(names), [nameKey]);

  return (
    <div className="bg-white shadow-sm border border-mine-border rounded-xl p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xs font-medium text-mine-muted uppercase tracking-wide">
          相关性矩阵
        </h3>
        <span className="text-[10px] text-mine-muted">CORRELATION MATRIX</span>
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse text-[11px] font-mono tabular-nums">
          <thead>
            <tr>
              <th className="p-1.5 text-left text-mine-muted font-medium" />
              {names.map((name) => (
                <th
                  key={name}
                  className="p-1.5 text-center text-mine-muted font-medium min-w-[42px]"
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={names[i]}>
                <td className="p-1.5 text-mine-muted font-medium whitespace-nowrap">
                  {names[i]}
                </td>
                {row.map((val, j) => (
                  <td
                    key={j}
                    className="p-1.5 text-center min-w-[42px] rounded-sm"
                    style={{
                      backgroundColor: getCorrelationColor(val),
                      color: Math.abs(val) > 0.4 ? "#fff" : "#1a1a1a",
                    }}
                  >
                    {i === j ? "" : val.toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Effectiveness Distribution ──────────────────────────────── */

interface EffectivenessDistProps {
  factors: LibraryFactor[];
}

export function EffectivenessDistribution({ factors }: EffectivenessDistProps) {
  const distribution = useMemo(() => {
    const bins = [
      { label: "强有效", count: 0, color: "#F6465D" },
      { label: "有效", count: 0, color: "#2EBD85" },
      { label: "弱", count: 0, color: "#76808E" },
      { label: "反向", count: 0, color: "#f5a623" },
    ];
    for (const f of factors) {
      const bin = bins.find((b) => b.label === f.status);
      if (bin) bin.count++;
    }
    return bins;
  }, [factors]);

  const maxCount = Math.max(...distribution.map((b) => b.count), 1);

  return (
    <div className="bg-white shadow-sm border border-mine-border rounded-xl p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xs font-medium text-mine-muted uppercase tracking-wide">
          因子有效性分布
        </h3>
        <span className="text-[10px] text-mine-muted">EFFECTIVENESS DIST</span>
      </div>

      <div className="flex-1 flex flex-col gap-3 justify-center">
        {distribution.map((bin) => (
          <div key={bin.label} className="flex items-center gap-3">
            <span className="text-xs text-mine-text w-12 text-right shrink-0">
              {bin.label}
            </span>
            <div className="flex-1 h-7 bg-mine-bg rounded-md overflow-hidden">
              <div
                className="h-full rounded-md transition-all duration-500 flex items-center justify-end pr-2"
                style={{
                  width: `${(bin.count / maxCount) * 100}%`,
                  backgroundColor: bin.color,
                  minWidth: bin.count > 0 ? "32px" : "0px",
                }}
              >
                <span className="text-[11px] font-semibold text-white">
                  {bin.count}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
