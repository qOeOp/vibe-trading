'use client';

import { useMemo } from 'react';
import type { ColumnDef, FilterFn } from '@tanstack/react-table';
import { Box, Boxes } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import type { Factor, FactorType } from '@/features/library/types';
import { FACTOR_CATEGORIES, FACTOR_LIFECYCLE_STATUSES } from '@/features/library/types';
import { SparklineSVG } from '../sparkline-svg';
import { DataTableColumnHeader } from '@/lib/data-table/components/data-table-column-header';
import {
  NameCell,
  CategoryBadge,
  StatusBadge,
  SourceBadge,
  PeakCell,
} from './factor-cell-renderers';
import { formatIC, formatNum2, formatPct, formatCapacity } from './constants';

// ─── Filter functions ─────────────────────────────────────

/** Faceted filter: row value must be in the selected array */
const facetedFilterFn: FilterFn<Factor> = (row, columnId, filterValue) => {
  if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
  const value = row.getValue(columnId);
  return filterValue.includes(value);
};

/** Date range filter: row createdAt timestamp within [from, to] */
const dateRangeFilterFn: FilterFn<Factor> = (row, columnId, filterValue) => {
  if (!filterValue) return true;
  const rowDate = new Date(row.getValue<string>(columnId)).getTime();
  if (Array.isArray(filterValue)) {
    const [from, to] = filterValue;
    if (from && to) return rowDate >= from && rowDate <= to;
    if (from) return rowDate >= from;
    if (to) return rowDate <= to;
    return true;
  }
  // Single date — match same day
  if (typeof filterValue === 'number') {
    const filterDate = new Date(filterValue);
    const rowDateObj = new Date(row.getValue<string>(columnId));
    return (
      rowDateObj.getFullYear() === filterDate.getFullYear() &&
      rowDateObj.getMonth() === filterDate.getMonth() &&
      rowDateObj.getDate() === filterDate.getDate()
    );
  }
  return true;
};

// ─── Filter option lists ──────────────────────────────────

const STATUS_OPTIONS = FACTOR_LIFECYCLE_STATUSES.map((s) => ({
  label: s,
  value: s,
}));

const CATEGORY_OPTIONS = FACTOR_CATEGORIES.map((c) => ({
  label: c,
  value: c,
}));

// ─── Type Icon Cell (hover → checkbox) ───────────────────

const TYPE_ICONS: Record<FactorType, React.FC<{ className?: string }>> = {
  leaf: Box,
  composite: Boxes,
};

function TypeIconCell({
  factorType,
  isSelected,
  onToggle,
}: {
  factorType: FactorType;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const Icon = TYPE_ICONS[factorType];
  return (
    <div
      className="group/type flex items-center justify-center"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      {/* Icon: visible by default, hidden on row hover */}
      <Icon
        className={`size-4 text-muted-foreground transition-opacity ${
          isSelected ? 'hidden' : 'group-hover/row:hidden'
        }`}
      />
      {/* Checkbox: hidden by default, visible on row hover or when selected */}
      <Checkbox
        checked={isSelected}
        className={`${isSelected ? '' : 'hidden group-hover/row:inline-flex'}`}
        aria-label="选择"
      />
    </div>
  );
}

/** Returns stable column definitions for the factor data table */
export function useFactorColumns() {
  return useMemo<ColumnDef<Factor, unknown>[]>(
    () => [
      // ── Type icon / checkbox (narrow, left) ──
      // Column widths (size = % of table width, visible columns total 100):
      //   type:3  name:10  category:7  source:7  ic:5  peak:5
      //   ir:5  winRate:5  turnover:5  capacity:5  icTrend:12  status:7  createdAt:7  actions:12  (factorType:0 hidden)
      //   Total visible = 100 ← everything adds up
      {
        id: 'type',
        header: () => null,
        size: 3,
        enableSorting: false,
        enableHiding: false,
        enableGrouping: false,
        enableColumnFilter: false,
        meta: { label: '' },
        cell: () => null, // rendered by FactorRowRenderer
      },
      // ── Name (left-aligned, no sort, no drag) ──
      {
        accessorKey: 'name',
        header: () => <span className="text-mine-text text-sm">Factor</span>,
        size: 10,
        enableSorting: false,
        enableHiding: false,
        enableGrouping: false,
        enableColumnFilter: false,
        meta: { label: 'Factor' },
        cell: () => null, // overridden by custom row rendering via renderBody
      },
      // ── Category badge (center-aligned, filterable, groupable) ──
      {
        accessorKey: 'category',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Category" />
        ),
        size: 7,
        enableSorting: false,
        enableGrouping: false,
        filterFn: facetedFilterFn,
        meta: {
          label: 'Category',
          variant: 'multiSelect' as const,
          options: CATEGORY_OPTIONS,
          align: 'center' as const,
        },
        cell: ({ row }) => <CategoryBadge category={row.original.category} />,
      },
      // ── Source badge (center-aligned, groupable) ──
      {
        accessorKey: 'source',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Source" />
        ),
        size: 7,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        meta: { label: 'Source', align: 'center' as const },
        cell: ({ row }) => <SourceBadge source={row.original.source} />,
      },
      // ── IC (center-aligned numeric) ──
      {
        accessorKey: 'ic',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="IC" />
        ),
        size: 5,
        enableGrouping: false,
        enableColumnFilter: false,
        aggregationFn: 'mean',
        cell: ({ row }) => {
          const v = row.original.ic;
          return (
            <span
              className={`font-mono tabular-nums ${
                v >= 0 ? 'text-market-up-medium' : 'text-market-down-medium'
              }`}
            >
              {formatIC(v)}
            </span>
          );
        },
        meta: { label: 'IC', align: 'center' as const },
      },
      // ── Peak (center-aligned, two-line: universe + IC) ──
      {
        id: 'peak',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Peak" />
        ),
        size: 5,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        meta: { label: 'Peak', align: 'center' as const },
        cell: ({ row }) => <PeakCell factor={row.original} />,
      },
      // ── IR (center-aligned numeric) ──
      {
        accessorKey: 'ir',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="IR" />
        ),
        size: 5,
        enableGrouping: false,
        enableColumnFilter: false,
        aggregationFn: 'mean',
        cell: ({ row }) => {
          const v = row.original.ir;
          const absV = Math.abs(v);
          const cls =
            absV >= 1.5
              ? 'text-market-up-medium font-semibold'
              : absV >= 0.5
                ? 'text-market-up-medium'
                : 'text-market-down-medium';
          return (
            <span className={`font-mono tabular-nums ${cls}`}>
              {formatNum2(v)}
            </span>
          );
        },
        meta: { label: 'IR', align: 'center' as const },
      },
      // ── Win Rate (center-aligned numeric) ──
      {
        accessorKey: 'winRate',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="WR" />
        ),
        size: 5,
        enableGrouping: false,
        enableColumnFilter: false,
        aggregationFn: 'mean',
        cell: ({ row }) => (
          <span className="font-mono tabular-nums text-mine-text">
            {formatPct(row.original.winRate)}
          </span>
        ),
        meta: { label: 'Win Rate', align: 'center' as const },
      },
      // ── Turnover (center-aligned numeric) ──
      {
        accessorKey: 'turnover',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Turn" />
        ),
        size: 5,
        enableGrouping: false,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span className="font-mono tabular-nums text-mine-text">
            {formatPct(row.original.turnover)}
          </span>
        ),
        meta: { label: 'Turnover', align: 'center' as const },
      },
      // ── Capacity (center-aligned numeric) ──
      {
        accessorKey: 'capacity',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Cap" />
        ),
        size: 5,
        enableGrouping: false,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span className="font-mono tabular-nums text-mine-text">
            {formatCapacity(row.original.capacity)}
          </span>
        ),
        meta: { label: 'Capacity', align: 'center' as const },
      },
      // ── IC Trend sparkline (center-aligned) ──
      {
        id: 'icTrend',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="IC Trend" />
        ),
        size: 12,
        enableSorting: false,
        enableGrouping: false,
        enableColumnFilter: false,
        meta: { label: 'IC Trend', align: 'center' as const },
        cell: ({ row }) => (
          <div className="py-1">
            <SparklineSVG
              data={row.original.icTrend}
              className="w-full h-[26px]"
            />
          </div>
        ),
      },
      // ── Status badge (center-aligned, groupable, filterable) ──
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        size: 7,
        enableSorting: false,
        enableGrouping: false,
        filterFn: facetedFilterFn,
        meta: {
          label: 'Status',
          variant: 'multiSelect' as const,
          options: STATUS_OPTIONS,
          align: 'center' as const,
        },
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      // ── Created date (center-aligned, sortable, filterable) ──
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Created" />
        ),
        size: 7,
        enableGrouping: false,
        filterFn: dateRangeFilterFn,
        meta: {
          label: 'Created At',
          align: 'center' as const,
          variant: 'dateRange' as const,
        },
        cell: ({ row }) => {
          const date = new Date(row.original.createdAt);
          const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          return (
            <span className="font-mono tabular-nums text-mine-muted">
              {formatted}
            </span>
          );
        },
      },
      // ── Actions (center-aligned outline icon buttons) ──
      {
        id: 'actions',
        header: () => <span className="text-mine-muted">Actions</span>,
        size: 12,
        enableSorting: false,
        enableHiding: false,
        enableGrouping: false,
        enableColumnFilter: false,
        meta: { label: 'Actions', align: 'center' as const },
        cell: () => null, // rendered by FactorRowRenderer
      },
      // Hidden accessor for factorType
      {
        accessorKey: 'factorType',
        header: () => null,
        size: 0,
        enableGrouping: false,
        enableHiding: true,
        enableColumnFilter: false,
        meta: { label: 'Type' },
        cell: () => null,
      },
    ],
    [],
  );
}

export { TypeIconCell };
