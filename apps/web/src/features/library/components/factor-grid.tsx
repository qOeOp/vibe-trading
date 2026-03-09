'use client';

import { useMemo, useCallback, useState, Fragment } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import type {
  ColumnDef,
  SortingState,
  RowSelectionState,
  Row,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import type { Factor } from '../types';
import {
  CATEGORY_COLORS,
  STATUS_COLORS,
  STATUS_LABELS,
  SOURCE_LABELS,
  SOURCE_COLORS,
  TYPE_LABELS,
  TYPE_COLORS,
} from '../types';
import { useLibraryStore } from '../store/use-library-store';
import { SparklineSVG } from './sparkline-svg';

// ─── Formatters ──────────────────────────────────────────

function formatIC(v: number | null | undefined): string {
  if (v == null) return '';
  return `${v >= 0 ? '+' : ''}${v.toFixed(3)}`;
}

function formatNum2(v: number | null | undefined): string {
  if (v == null) return '';
  return v.toFixed(2);
}

function formatPct(v: number | null | undefined): string {
  if (v == null) return '';
  return `${Math.round(v)}%`;
}

function formatCapacity(v: number | null | undefined): string {
  if (v == null) return '';
  if (v >= 10000) return `${(v / 10000).toFixed(0)}亿`;
  return `${v.toFixed(0)}万`;
}

// ─── Cell Renderers ──────────────────────────────────────

function NameCell({ factor }: { factor: Factor }) {
  const typeColor = TYPE_COLORS[factor.factorType];
  const typeLabel = TYPE_LABELS[factor.factorType];
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-flex items-center justify-center shrink-0 rounded-[3px]"
        style={{
          width: 16,
          height: 16,
          backgroundColor: `color-mix(in srgb, ${typeColor} 9%, transparent)`,
          color: typeColor,
          fontSize: 9,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {typeLabel[0]}
      </span>
      <span className="text-[13px] font-semibold text-mine-text truncate">
        {factor.name}
      </span>
      <span className="text-[11px] font-mono text-mine-muted/50">
        {factor.version}
      </span>
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const c =
    CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] ??
    'var(--color-mine-muted)';
  return (
    <span
      className="inline-flex items-center rounded-md text-[11px] font-semibold tracking-[0.02em]"
      style={{
        padding: '2px 10px',
        backgroundColor: `color-mix(in srgb, ${c} 9%, transparent)`,
        color: c,
      }}
    >
      {category}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color =
    STATUS_COLORS[status as keyof typeof STATUS_COLORS] ??
    'var(--color-mine-muted)';
  const label = STATUS_LABELS[status as keyof typeof STATUS_LABELS] ?? status;
  return (
    <span
      className="inline-flex items-center rounded text-[10px] font-bold tracking-[0.05em]"
      style={{
        padding: '2px 8px',
        backgroundColor: `color-mix(in srgb, ${color} 9%, transparent)`,
        color: color,
      }}
    >
      {label}
    </span>
  );
}

function SourceLabel({ source }: { source: string }) {
  const label = SOURCE_LABELS[source as keyof typeof SOURCE_LABELS] ?? source;
  const color =
    SOURCE_COLORS[source as keyof typeof SOURCE_COLORS] ??
    'var(--color-mine-muted)';
  return (
    <span style={{ color }} className="text-[11px] font-medium">
      {label}
    </span>
  );
}

function PeakBadge({ factor }: { factor: Factor }) {
  const profile = factor.universeProfile;
  if (!profile || profile.length === 0) return null;

  const defaultPool = factor.benchmarkConfig.universe;
  const best = profile.reduce((a, b) =>
    Math.abs(b.ic) > Math.abs(a.ic) ? b : a,
  );

  if (best.universe === defaultPool) return null;

  return (
    <span
      className="inline-flex items-center rounded text-[10px] font-semibold tracking-[0.02em] whitespace-nowrap"
      style={{
        padding: '2px 8px',
        backgroundColor:
          'oklch(from var(--color-mine-accent-teal) l c h / 0.12)',
        color: 'var(--color-mine-accent-teal)',
      }}
    >
      {best.universe} {best.ic >= 0 ? '+' : ''}
      {best.ic.toFixed(3)}
    </span>
  );
}

// ─── Sort Header ─────────────────────────────────────────

function SortableHeader({
  label,
  column,
  align = 'left',
}: {
  label: string;
  column: {
    getIsSorted: () => false | 'asc' | 'desc';
    toggleSorting: (desc?: boolean) => void;
  };
  align?: 'left' | 'right';
}) {
  const sorted = column.getIsSorted();
  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(sorted === 'asc')}
      className={`flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-mine-muted hover:text-mine-text transition-colors select-none ${
        align === 'right' ? 'ml-auto' : ''
      }`}
    >
      {label}
      {sorted === 'asc' ? (
        <ArrowUp className="w-3 h-3 text-mine-text" />
      ) : sorted === 'desc' ? (
        <ArrowDown className="w-3 h-3 text-mine-text" />
      ) : (
        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/th:opacity-40 transition-opacity" />
      )}
    </button>
  );
}

// ─── FactorGrid Component ────────────────────────────────

interface FactorGridProps {
  factors: Factor[];
}

export function FactorGrid({ factors }: FactorGridProps) {
  const selectedFactorId = useLibraryStore((s) => s.selectedFactorId);
  const selectFactor = useLibraryStore((s) => s.selectFactor);
  const selectAllFactors = useLibraryStore((s) => s.selectAllFactors);
  const clearSelection = useLibraryStore((s) => s.clearSelection);
  const storeSelectedIds = useLibraryStore((s) => s.selectedFactorIds);

  const [sorting, setSorting] = useState<SortingState>([]);

  // Convert store Set<string> → TanStack RowSelectionState
  const rowSelection = useMemo<RowSelectionState>(() => {
    const state: RowSelectionState = {};
    for (const id of storeSelectedIds) {
      // TanStack uses row index by default, but with getRowId we use factor.id
      const idx = factors.findIndex((f) => f.id === id);
      if (idx >= 0) state[String(idx)] = true;
    }
    return state;
  }, [storeSelectedIds, factors]);

  // Sync TanStack selection back to store
  const onRowSelectionChange = useCallback(
    (
      updaterOrValue:
        | RowSelectionState
        | ((old: RowSelectionState) => RowSelectionState),
    ) => {
      const newState =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(rowSelection)
          : updaterOrValue;
      const ids = Object.keys(newState)
        .filter((k) => newState[k])
        .map((k) => factors[Number(k)]?.id)
        .filter(Boolean) as string[];
      if (ids.length === 0) {
        clearSelection();
      } else {
        selectAllFactors(ids);
      }
    },
    [rowSelection, factors, clearSelection, selectAllFactors],
  );

  const columns = useMemo<ColumnDef<Factor>[]>(
    () => [
      // Checkbox column
      {
        id: 'select',
        size: 40,
        enableSorting: false,
        enableResizing: false,
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="全选"
            className="translate-y-[1px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="选择此因子"
            className="translate-y-[1px]"
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
      // Name
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader label="因子" column={column} />,
        size: 220,
        minSize: 180,
        cell: ({ row }) => <NameCell factor={row.original} />,
      },
      // Category
      {
        accessorKey: 'category',
        header: ({ column }) => <SortableHeader label="类别" column={column} />,
        size: 90,
        minSize: 85,
        cell: ({ row }) => <CategoryBadge category={row.original.category} />,
      },
      // Source
      {
        accessorKey: 'source',
        header: ({ column }) => <SortableHeader label="来源" column={column} />,
        size: 75,
        minSize: 70,
        cell: ({ row }) => <SourceLabel source={row.original.source} />,
      },
      // IC
      {
        accessorKey: 'ic',
        header: ({ column }) => (
          <SortableHeader label="IC" column={column} align="right" />
        ),
        size: 90,
        minSize: 85,
        cell: ({ row }) => {
          const v = row.original.ic;
          return (
            <span
              className={`numeric text-[13px] tracking-[-0.01em] ${
                v >= 0 ? 'text-market-up-medium' : 'text-market-down-medium'
              }`}
            >
              {formatIC(v)}
            </span>
          );
        },
        meta: { align: 'right' },
      },
      // Peak Badge
      {
        id: 'peak',
        header: () => (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-mine-muted">
            峰值
          </span>
        ),
        size: 120,
        minSize: 110,
        enableSorting: false,
        cell: ({ row }) => <PeakBadge factor={row.original} />,
      },
      // IR
      {
        accessorKey: 'ir',
        header: ({ column }) => (
          <SortableHeader label="IR" column={column} align="right" />
        ),
        size: 80,
        minSize: 75,
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
            <span
              className={`numeric text-[13px] tracking-[-0.01em] ${cls}`}
            >
              {formatNum2(v)}
            </span>
          );
        },
        meta: { align: 'right' },
      },
      // Win Rate
      {
        accessorKey: 'winRate',
        header: ({ column }) => (
          <SortableHeader label="胜率" column={column} align="right" />
        ),
        size: 70,
        minSize: 65,
        cell: ({ row }) => (
          <span className="numeric text-[13px] text-mine-text tracking-[-0.01em]">
            {formatPct(row.original.winRate)}
          </span>
        ),
        meta: { align: 'right' },
      },
      // Turnover
      {
        accessorKey: 'turnover',
        header: ({ column }) => (
          <SortableHeader label="换手" column={column} align="right" />
        ),
        size: 70,
        minSize: 65,
        cell: ({ row }) => (
          <span className="numeric text-[13px] text-mine-text tracking-[-0.01em]">
            {formatPct(row.original.turnover)}
          </span>
        ),
        meta: { align: 'right' },
      },
      // Capacity
      {
        accessorKey: 'capacity',
        header: ({ column }) => (
          <SortableHeader label="容量" column={column} align="right" />
        ),
        size: 75,
        minSize: 70,
        cell: ({ row }) => (
          <span className="numeric text-[13px] text-mine-text tracking-[-0.01em]">
            {formatCapacity(row.original.capacity)}
          </span>
        ),
        meta: { align: 'right' },
      },
      // IC Trend (Sparkline)
      {
        id: 'icTrend',
        header: () => (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-mine-muted">
            IC趋势
          </span>
        ),
        size: 130,
        minSize: 120,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="py-1">
            <SparklineSVG data={row.original.icTrend} />
          </div>
        ),
      },
      // Status
      {
        accessorKey: 'status',
        header: ({ column }) => <SortableHeader label="状态" column={column} />,
        size: 80,
        minSize: 75,
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: factors,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  });

  const handleRowClick = useCallback(
    (row: Row<Factor>) => {
      const factorId = row.original.id;
      selectFactor(selectedFactorId === factorId ? null : factorId);
    },
    [selectedFactorId, selectFactor],
  );

  return (
    <div data-slot="factor-grid" className="mine-table w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-b border-mine-border/50 bg-mine-bg hover:bg-mine-bg"
            >
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as
                  | { align?: 'left' | 'right' }
                  | undefined;
                return (
                  <TableHead
                    key={header.id}
                    className={`group/th h-10 px-4 ${
                      meta?.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                    style={{
                      width: header.getSize(),
                      minWidth: header.column.columnDef.minSize,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-mine-muted text-sm"
              >
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row, idx) => {
              const factor = row.original;
              const isActive = selectedFactorId === factor.id;
              const isProbation = factor.status === 'PROBATION';
              const isRetired = factor.status === 'RETIRED';

              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                  onClick={() => handleRowClick(row)}
                  className={`
                    cursor-pointer transition-colors border-b border-mine-border-light
                    ${idx % 2 === 1 ? 'bg-zinc-50' : 'bg-white'}
                    ${isActive ? '!bg-mine-accent-teal/5 ring-1 ring-inset ring-mine-accent-teal/20' : ''}
                    ${isProbation ? 'border-l-[3px] border-l-mine-accent-yellow' : ''}
                    ${isRetired ? 'opacity-60 grayscale-[0.5] bg-zinc-50' : ''}
                    hover:bg-mine-hover
                  `}
                  style={{ height: 44 }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as
                      | { align?: 'left' | 'right' }
                      | undefined;
                    return (
                      <TableCell
                        key={cell.id}
                        className={`px-4 py-0 ${
                          meta?.align === 'right' ? 'text-right' : 'text-left'
                        }`}
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.columnDef.minSize,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
