"use client";

import { useMemo } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import type { Row } from "@tanstack/react-table";
import { TableRow, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Factor } from "../types";
import {
  STATUS_LABELS,
  SOURCE_LABELS,
  TYPE_LABELS,
} from "../types";
import { formatIC, formatNum2 } from "./factor-data-table/constants";

// ─── Helpers ─────────────────────────────────────────────

function getGroupLabel(columnId: string, value: string): string {
  switch (columnId) {
    case "status":
      return STATUS_LABELS[value as keyof typeof STATUS_LABELS] ?? value;
    case "source":
      return SOURCE_LABELS[value as keyof typeof SOURCE_LABELS] ?? value;
    case "factorType":
      return TYPE_LABELS[value as keyof typeof TYPE_LABELS] ?? value;
    default:
      return value;
  }
}

// ─── Flatten subRows recursively to get all leaf factors ──

function collectLeafFactors(row: Row<Factor>): Factor[] {
  if (!row.subRows || row.subRows.length === 0) {
    return [row.original];
  }
  return row.subRows.flatMap(collectLeafFactors);
}

// ─── AG Grid style Group Header Row ─────────────────────
// Renders individual cells per column (not colSpan), with
// aggregated values in their respective columns.

interface GroupHeaderRowProps {
  row: Row<Factor>;
  leafColumnCount: number;
}

export function GroupHeaderRow({ row, leafColumnCount }: GroupHeaderRowProps) {
  const groupByColumn = row.groupingColumnId!;
  const groupValue = row.groupingValue as string;
  const isExpanded = row.getIsExpanded();
  const depth = row.depth;

  const label = getGroupLabel(groupByColumn, groupValue);

  // Compute aggregates from all leaf factors (handles nested grouping)
  const aggregates = useMemo(() => {
    const factors = collectLeafFactors(row);
    const count = factors.length;
    if (count === 0) return { count: 0, avgIC: 0, avgIR: 0 };
    const avgIC = factors.reduce((s, f) => s + f.ic, 0) / count;
    const avgIR = factors.reduce((s, f) => s + f.ir, 0) / count;
    return { count, avgIC, avgIR };
  }, [row]);

  // Get visible cells to know which columns exist
  const visibleCells = row.getVisibleCells();

  return (
    <TableRow
      className={cn(
        "cursor-pointer transition-colors",
        "bg-mine-bg/60 hover:bg-mine-bg",
        depth === 0 && "border-l-2 border-l-mine-accent-teal/40",
        depth > 0 && "border-l-2 border-l-mine-border",
      )}
      onClick={row.getToggleExpandedHandler()}
    >
      {visibleCells.map((cell) => {
        const columnId = cell.column.id;
        const align = (cell.column.columnDef.meta as Record<string, unknown> | undefined)?.align;

        // ── First column (type): expand chevron ──
        if (columnId === "type") {
          return (
            <TableCell key={cell.id} className="px-2">
              <div
                className="flex items-center justify-center"
                style={{ paddingLeft: depth * 12 }}
              >
                {isExpanded ? (
                  <ChevronDown className="size-3.5 text-mine-muted" />
                ) : (
                  <ChevronRight className="size-3.5 text-mine-muted" />
                )}
              </div>
            </TableCell>
          );
        }

        // ── Name column: group label + count badge ──
        if (columnId === "name") {
          return (
            <TableCell key={cell.id}>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-mine-text">
                  {label}
                </span>
                <span className="text-[10px] text-mine-muted numeric bg-mine-border/40 px-1.5 py-0.5 rounded">
                  {aggregates.count}
                </span>
              </div>
            </TableCell>
          );
        }

        // ── IC column: show avg IC ──
        if (columnId === "ic") {
          return (
            <TableCell key={cell.id} className="text-right">
              <span
                className={cn(
                  "numeric text-[11px]",
                  aggregates.avgIC >= 0
                    ? "text-market-down-medium/70"
                    : "text-market-up-medium/70",
                )}
              >
                {formatIC(aggregates.avgIC)}
              </span>
            </TableCell>
          );
        }

        // ── IR column: show avg IR ──
        if (columnId === "ir") {
          return (
            <TableCell key={cell.id} className="text-right">
              <span className="numeric text-[11px] text-mine-muted">
                {formatNum2(aggregates.avgIR)}
              </span>
            </TableCell>
          );
        }

        // ── All other columns: empty cell ──
        return (
          <TableCell
            key={cell.id}
            className={align === "right" ? "text-right" : undefined}
          />
        );
      })}
    </TableRow>
  );
}
