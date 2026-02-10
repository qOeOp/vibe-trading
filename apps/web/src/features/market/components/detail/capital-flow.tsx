"use client";

import { memo, useMemo } from "react";
import { mockSectors } from "@/features/market/data/mock-sectors";
import { formatFlow } from "@/features/market/utils/formatters";
import { cn } from "@/lib/utils";
import { SectionHeader } from "../shared/section-header";

// ============ Types ============

interface FlowSummary {
  totalIn: number;
  totalOut: number;
  net: number;
  inPercent: number;
}

// ============ Hooks ============

function useCapitalFlowData() {
  return useMemo(() => {
    const totalIn = mockSectors
      .filter((s) => s.capitalFlow > 0)
      .reduce((acc, s) => acc + s.capitalFlow, 0);

    const totalOut = mockSectors
      .filter((s) => s.capitalFlow < 0)
      .reduce((acc, s) => acc + s.capitalFlow, 0);

    const net = totalIn + totalOut;
    const total = totalIn + Math.abs(totalOut);

    const summary: FlowSummary = {
      totalIn,
      totalOut,
      net,
      inPercent: total > 0 ? (totalIn / total) * 100 : 50,
    };

    const topInflow = [...mockSectors]
      .filter((s) => s.capitalFlow > 0)
      .sort((a, b) => b.capitalFlow - a.capitalFlow)
      .slice(0, 5);

    return { summary, topInflow };
  }, []);
}

// ============ Sub Components ============

interface FlowBarProps {
  name: string;
  flow: number;
  maxFlow: number;
}

const FlowBar = memo(function FlowBar({ name, flow, maxFlow }: FlowBarProps) {
  const barWidth = (flow / maxFlow) * 100;

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-mine-text w-16 truncate">{name}</span>
      <div className="flex-1 h-1.5 rounded-full bg-mine-muted/20 overflow-hidden">
        <div
          className="h-full bg-market-up-medium/50 rounded-full transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${barWidth}%` }}
        />
      </div>
      <span className="text-[10px] text-market-up-medium w-14 text-right tabular-nums">
        {formatFlow(flow)}
      </span>
    </div>
  );
});

// ============ Main Component ============

export const CapitalFlow = memo(function CapitalFlow() {
  const { summary, topInflow } = useCapitalFlowData();
  const { totalIn, totalOut, net, inPercent } = summary;

  return (
    <div className="space-y-3">
      <SectionHeader title="资金流向" />

      {/* Summary Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px]">
          <span className="text-market-up-medium font-medium tabular-nums">
            流入 {formatFlow(totalIn)}
          </span>
          <span className="text-market-down-medium font-medium tabular-nums">
            流出 {formatFlow(totalOut)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 rounded-full overflow-hidden flex bg-mine-muted/30">
          <div
            className="bg-market-up-medium/70 h-full transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${inPercent}%` }}
          />
          <div
            className="bg-market-down-medium/70 h-full transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${100 - inPercent}%` }}
          />
        </div>

        {/* Net Flow */}
        <div className="text-center">
          <span
            className={cn(
              "text-sm font-bold tabular-nums",
              net > 0 ? "text-market-up-medium" : "text-market-down-medium"
            )}
          >
            净流入 {formatFlow(net)}
          </span>
        </div>
      </div>

      {/* Top Inflow List */}
      <div className="space-y-1 mt-2">
        <div className="text-[10px] text-mine-muted mb-1">主力净流入</div>
        {topInflow.map((sector) => (
          <FlowBar
            key={sector.name}
            name={sector.name}
            flow={sector.capitalFlow}
            maxFlow={topInflow[0].capitalFlow}
          />
        ))}
      </div>
    </div>
  );
});
