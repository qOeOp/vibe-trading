"use client";

import { useCallback, useRef, useState } from "react";
import type { Row } from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTable } from "@/lib/data-table/components/data-table";
import { DataTableAdvancedToolbar } from "@/lib/data-table/components/data-table-advanced-toolbar";
import { DataTableFacetedFilter } from "@/lib/data-table/components/data-table-faceted-filter";
import { DataTableDateFilter } from "@/lib/data-table/components/data-table-date-filter";
import { DataTableSortList } from "@/lib/data-table/components/data-table-sort-list";
import type { Factor } from "@/features/library/types";
import {
  FACTOR_CATEGORIES,
  FACTOR_LIFECYCLE_STATUSES,
} from "@/features/library/types";
import { useLibraryStore } from "@/features/library/store/use-library-store";
import { useFactorTable } from "./use-factor-table";
import { useFactorRowClick } from "./use-factor-row-click";
import { FactorRowRenderer } from "./factor-row-renderer";

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
      emptyState={
        <span className="text-muted-foreground text-sm">暂无数据</span>
      }
    >
      {/* Toolbar: Pill search (left) + Filters + Sort + View (right) */}
      <DataTableAdvancedToolbar
        table={table}
        rightSlot={
          <>
            {table.getColumn("status") && (
              <DataTableFacetedFilter
                column={table.getColumn("status")}
                title="Status"
                options={FACTOR_LIFECYCLE_STATUSES.map((s) => ({
                  label: s,
                  value: s,
                }))}
                multiple
              />
            )}
            {table.getColumn("category") && (
              <DataTableFacetedFilter
                column={table.getColumn("category")}
                title="Category"
                options={FACTOR_CATEGORIES.map((c) => ({
                  label: c,
                  value: c,
                }))}
                multiple
              />
            )}
            {table.getColumn("createdAt") && (
              <DataTableDateFilter
                column={table.getColumn("createdAt")!}
                title="Created At"
                multiple
              />
            )}
            <DataTableSortList table={table} align="end" />
          </>
        }
      >
        {/* Pill-shaped search (treemap style) */}
        <PillSearch
          value={search}
          onChange={setSearch}
          placeholder="搜索因子..."
        />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
}

// ─── Pill-shaped search (matches treemap SearchBox style) ──

function PillSearch({
  value,
  onChange,
  placeholder = "搜索...",
  className,
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
} & Omit<React.ComponentProps<"label">, "onChange">) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const id = `pill-search-${useRef(Math.random()).current}`;

  return (
    <label
      data-slot="pill-search"
      htmlFor={id}
      className={cn(
        `
        relative flex items-center gap-2
        h-8 px-3
        bg-white rounded-full shadow-sm
        transition-shadow duration-200
        cursor-text
        `,
        isFocused ? "shadow-md ring-1 ring-mine-text/10" : "",
        "w-52",
        className,
      )}
      {...props}
    >
      <Search className="w-3.5 h-3.5 text-mine-muted shrink-0" />
      <input
        id={id}
        ref={inputRef}
        type="search"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onChange("");
            inputRef.current?.blur();
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="
          flex-1 min-w-0
          text-sm text-mine-text
          bg-transparent border-none
          p-0
          focus:outline-none focus:ring-0
        "
        aria-label="Search factors"
      />
      {value && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onChange("");
            inputRef.current?.focus();
          }}
          className="shrink-0 p-0.5 text-mine-muted hover:text-mine-text rounded-full transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </label>
  );
}
