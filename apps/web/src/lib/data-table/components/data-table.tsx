'use client';

import {
  flexRender,
  type Row,
  type Table as TanstackTable,
} from '@tanstack/react-table';
import type * as React from 'react';

import { DataTablePagination } from '@/lib/data-table/components/data-table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getColumnPinningStyle } from '@/lib/data-table/utils';
import { cn } from '@/lib/utils';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  /** Custom empty state content (defaults to "No results.") */
  emptyState?: React.ReactNode;
  /** Row click handler */
  onRowClick?: (row: Row<TData>, event: React.MouseEvent) => void;
  /** Dynamic row className based on row data and index */
  getRowClassName?: (row: Row<TData>, index: number) => string;
  /** Replace the default TableBody rendering loop (for grouping/expansion/custom rows) */
  renderBody?: (rows: Row<TData>[]) => React.ReactNode;
  /** Whether to show pagination (defaults to true) */
  showPagination?: boolean;
  /** Use table-fixed layout with column.getSize() as percentage widths */
  fixedLayout?: boolean;
  /** Custom page size options for pagination */
  pageSizeOptions?: number[];
}

export function DataTable<TData>({
  table,
  actionBar,
  emptyState,
  onRowClick,
  getRowClassName,
  renderBody,
  showPagination = true,
  fixedLayout = false,
  pageSizeOptions,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  const headerGroups = table.getHeaderGroups();

  /**
   * Get the column width as a percentage string.
   * Uses `columnDef.size` directly instead of `getSize()` because TanStack
   * Table enforces a default `minSize` of 20, inflating small columns
   * (e.g. size:3 → getSize():20) and breaking percentage totals.
   */
  const getColumnWidth = (header: (typeof headerGroups)[0]['headers'][0]) => {
    const defSize = header.column.columnDef.size;
    return defSize != null ? `${defSize}%` : undefined;
  };

  return (
    <div
      className={cn('flex w-full flex-col gap-2.5 overflow-auto', className)}
      {...props}
    >
      {children}

      <div className="flex-1 min-h-0 overflow-auto rounded-md border">
        <Table className={fixedLayout ? 'table-fixed' : undefined}>
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const headerAlign = (
                    header.column.columnDef.meta as
                      | Record<string, unknown>
                      | undefined
                  )?.align;
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        'group/th',
                        headerAlign === 'right'
                          ? 'text-right px-1'
                          : headerAlign === 'center'
                            ? 'text-center px-1'
                            : undefined,
                      )}
                      style={{
                        ...getColumnPinningStyle({ column: header.column }),
                        ...(fixedLayout
                          ? { width: getColumnWidth(header) }
                          : undefined),
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
            {renderBody ? (
              renderBody(table.getRowModel().rows)
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    onRowClick && 'cursor-pointer',
                    getRowClassName?.(row, index),
                  )}
                  onClick={
                    onRowClick ? (event) => onRowClick(row, event) : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getColumnPinningStyle({ column: cell.column }),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  {emptyState ?? 'No results.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <div className="flex flex-col gap-2.5">
          <DataTablePagination
            table={table}
            {...(pageSizeOptions ? { pageSizeOptions } : {})}
          />
          {actionBar &&
            table.getFilteredSelectedRowModel().rows.length > 0 &&
            actionBar}
        </div>
      )}
    </div>
  );
}
