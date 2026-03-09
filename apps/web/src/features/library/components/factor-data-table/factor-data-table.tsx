'use client';

import { useCallback } from 'react';
import type { Row } from '@tanstack/react-table';
import { SearchInput } from '@/components/ui/search-input';
import { DataTable } from '@/lib/data-table/components/data-table';
import { DataTableAdvancedToolbar } from '@/lib/data-table/components/data-table-advanced-toolbar';
import { DataTableFacetedFilter } from '@/lib/data-table/components/data-table-faceted-filter';
import { DataTableDateFilter } from '@/lib/data-table/components/data-table-date-filter';
import { DataTableSortList } from '@/lib/data-table/components/data-table-sort-list';
import type { Factor } from '@/features/library/types';
import {
  FACTOR_CATEGORIES,
  FACTOR_LIFECYCLE_STATUSES,
} from '@/features/library/types';
import { useLibraryStore } from '@/features/library/store/use-library-store';
import { useFactorTable } from './use-factor-table';
import { useFactorRowClick } from './use-factor-row-click';
import { FactorRowRenderer } from './factor-row-renderer';

// ─── FactorDataTable ────────────────────────────────────

interface FactorDataTableProps {
  factors: Factor[];
}

export function FactorDataTable({ factors }: FactorDataTableProps) {
  // Search from store
  const search = useLibraryStore((s) => s.search);
  const setSearch = useLibraryStore((s) => s.setSearch);

  // ─── Table instance ──────────────────────────────────

  const { table } = useFactorTable({ data: factors });

  // ─── Row click handling ──────────────────────────────

  const { handleRowClick, lastClickedId } = useFactorRowClick(table);

  // Adapter: DataTable.onRowClick signature → our handleRowClick signature
  const onRowClick = useCallback(
    (row: Row<Factor>, event: React.MouseEvent) => {
      handleRowClick(event, row);
    },
    [handleRowClick],
  );

  // ─── Custom body renderer (for custom cells) ─────────

  const renderBody = useCallback(
    (rows: Row<Factor>[]) => (
      <FactorRowRenderer
        rows={rows}
        factors={factors}
        lastClickedId={lastClickedId}
        handleRowClick={handleRowClick}
      />
    ),
    [factors, lastClickedId, handleRowClick],
  );

  // ─── Render ────────────────────────────────────────────

  return (
    <DataTable
      table={table}
      renderBody={renderBody}
      onRowClick={onRowClick}
      fixedLayout
      showPagination={false}
      className="flex-1 flex flex-col overflow-hidden"
      emptyState={<span className="text-mine-muted text-sm">暂无数据</span>}
    >
      {/* Toolbar: Pill search (left) + Filters + Sort + View (right) */}
      <DataTableAdvancedToolbar
        table={table}
        rightSlot={
          <>
            {table.getColumn('status') && (
              <DataTableFacetedFilter
                column={table.getColumn('status')}
                title="Status"
                options={FACTOR_LIFECYCLE_STATUSES.map((s) => ({
                  label: s,
                  value: s,
                }))}
                multiple
              />
            )}
            {table.getColumn('category') && (
              <DataTableFacetedFilter
                column={table.getColumn('category')}
                title="Category"
                options={FACTOR_CATEGORIES.map((c) => ({
                  label: c,
                  value: c,
                }))}
                multiple
              />
            )}
            {table.getColumn('createdAt') && (
              <DataTableDateFilter
                column={table.getColumn('createdAt')!}
                title="Created At"
                multiple
              />
            )}
            <DataTableSortList table={table} align="end" />
          </>
        }
      >
        <SearchInput
          variant="pill"
          value={search}
          onChange={setSearch}
          placeholder="搜索因子..."
          className="w-52"
        />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
}
