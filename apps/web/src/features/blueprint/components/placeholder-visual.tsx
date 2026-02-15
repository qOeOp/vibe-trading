"use client";

import {
  BarChart3,
  Table2,
  TreePine,
  Code2,
  Flame,
  Radar,
  LayoutGrid,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TYPE_ICONS: Record<string, LucideIcon> = {
  chart: BarChart3,
  "ag-grid": Table2,
  treemap: TreePine,
  editor: Code2,
  heatmap: Flame,
  radar: Radar,
  generic: LayoutGrid,
  table: Table2,
};

interface PlaceholderVisualProps {
  type?: string;
  label?: string;
}

/**
 * Renders a dashed-border placeholder box indicating
 * a future component (chart, table, editor, etc.).
 *
 * Used when a card's `render` field is set to `"placeholder"`.
 */
export function PlaceholderVisual({ type, label }: PlaceholderVisualProps) {
  const Icon = TYPE_ICONS[type ?? "generic"] ?? LayoutGrid;
  const displayLabel = label ?? type ?? "Component";

  return (
    <div className="flex flex-col items-center justify-center gap-3 h-full min-h-[160px] mx-3 my-2 rounded-lg border-2 border-dashed border-mine-border/60 bg-mine-bg/40">
      <Icon className="w-8 h-8 text-mine-muted/50" />
      <span className="text-[11px] text-mine-muted font-medium">
        {displayLabel}
      </span>
      <span className="text-[9px] text-mine-muted/60 italic">
        placeholder — expand for PRD docs
      </span>
    </div>
  );
}
