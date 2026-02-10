"use client";

export interface LegendItem {
  label: string;
  color: string;
}

interface ChartLegendInlineProps {
  items: LegendItem[];
  /** Currently active/highlighted label */
  activeLabel?: string | null;
  /** Called when hovering a legend entry */
  onActivate?: (label: string) => void;
  /** Called when leaving a legend entry */
  onDeactivate?: (label: string) => void;
}

export function ChartLegendInline({
  items,
  activeLabel,
  onActivate,
  onDeactivate,
}: ChartLegendInlineProps) {
  const hasActive = activeLabel != null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {items.map((item) => {
        const isActive = activeLabel === item.label;
        const dimmed = hasActive && !isActive;

        return (
          <div
            key={item.label}
            className="flex items-center gap-1.5 cursor-pointer select-none transition-opacity"
            style={{ opacity: dimmed ? 0.35 : 1 }}
            onMouseEnter={() => onActivate?.(item.label)}
            onMouseLeave={() => onDeactivate?.(item.label)}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-mine-muted whitespace-nowrap">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
