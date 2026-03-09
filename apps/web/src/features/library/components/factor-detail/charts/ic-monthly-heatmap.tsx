'use client';

import { Fragment, useMemo } from 'react';
import { PanelSection } from '@/components/shared/panel';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Factor } from '@/features/library/types';

/* ── Color mapping (A股: 正IC=因子有效=好=绿, 负IC=因子失效=差=红) ── */

function icToColorClass(ic: number): string {
  if (ic > 0.03) return 'bg-market-down';
  if (ic > 0.01) return 'bg-market-down-medium';
  if (ic >= -0.01) return 'bg-mine-border';
  if (ic >= -0.03) return 'bg-mine-accent-yellow';
  return 'bg-market-up-medium';
}

/* ── Data transform ──────────────────────────────────────── */

interface TrackerBlock {
  year: string;
  month: string;
  ic: number;
  colorClass: string;
  tooltip: string;
}

function useTrackerData(heatmap: Factor['icMonthlyHeatmap']) {
  return useMemo(() => {
    if (!heatmap || heatmap.length === 0)
      return { blocks: [] as TrackerBlock[], years: [] as string[] };

    // Extract year list from the first month's series
    const years = heatmap[0].series.map((s) => s.name);

    // Flatten: year(outer) × month(inner) → chronological order
    const blocks: TrackerBlock[] = [];
    for (const year of years) {
      for (const monthData of heatmap) {
        const cell = monthData.series.find((s) => s.name === year);
        if (cell) {
          blocks.push({
            year,
            month: monthData.name,
            ic: cell.value,
            colorClass: icToColorClass(cell.value),
            tooltip: `${year}年${monthData.name}: IC ${cell.value >= 0 ? '+' : ''}${cell.value.toFixed(3)}`,
          });
        }
      }
    }

    return { blocks, years };
  }, [heatmap]);
}

/* ── Tracker Component ───────────────────────────────────── */

function ICMonthlyTracker({ data }: { data: Factor['icMonthlyHeatmap'] }) {
  const { blocks, years } = useTrackerData(data);

  if (blocks.length === 0) return null;

  const monthsPerYear = 12;

  return (
    <div data-slot="ic-monthly-tracker">
      {/* Year labels row — each year label centered over its 12 blocks */}
      <div className="flex items-end mb-0.5">
        {years.map((year, yi) => (
          <Fragment key={year}>
            {yi > 0 && <div className="w-px shrink-0" />}
            <div className="text-center" style={{ flex: monthsPerYear }}>
              <span className="text-[10px] text-mine-muted font-medium">
                {year}
              </span>
            </div>
          </Fragment>
        ))}
      </div>

      {/* Tracker blocks row */}
      <div className="flex h-7 w-full items-stretch">
        {blocks.map((block, i) => {
          const isYearBoundary = i > 0 && i % monthsPerYear === 0;
          const isFirst = i === 0;
          const isLast = i === blocks.length - 1;

          return (
            <Fragment key={`${block.year}-${block.month}`}>
              {isYearBoundary && (
                <div className="w-px bg-mine-border/50 shrink-0" />
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      'flex-1 rounded-[1px] transition-opacity hover:opacity-60 cursor-default',
                      block.colorClass,
                      isFirst && 'rounded-l-[3px]',
                      isLast && 'rounded-r-[3px]',
                      /* 1px gap via margin except at boundaries */
                      !isFirst && !isYearBoundary && 'ml-px',
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>
                  <span className="numeric">
                    {block.tooltip}
                  </span>
                </TooltipContent>
              </Tooltip>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ── Section Export ────────────────────────────────────────── */

interface ICMonthlyHeatmapSectionProps {
  factor: Factor;
}

export function ICMonthlyHeatmapSection({
  factor,
}: ICMonthlyHeatmapSectionProps) {
  return (
    <PanelSection>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-mine-muted">
          IC 月度热力图
        </span>
        <span className="text-[10px] text-mine-muted">3Y</span>
      </div>
      <ICMonthlyTracker data={factor.icMonthlyHeatmap} />
    </PanelSection>
  );
}
