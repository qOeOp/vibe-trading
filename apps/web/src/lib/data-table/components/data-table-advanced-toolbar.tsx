"use client";

import type { Table } from "@tanstack/react-table";
import type * as React from "react";

import { DataTableViewOptions } from "@/lib/data-table/components/data-table-view-options";
import { cn } from "@/lib/utils";

interface DataTableAdvancedToolbarProps<TData>
  extends React.ComponentProps<"div"> {
  table: Table<TData>;
  /** Extra elements rendered on the right side, before the View button */
  rightSlot?: React.ReactNode;
}

export function DataTableAdvancedToolbar<TData>({
  table,
  children,
  rightSlot,
  className,
  ...props
}: DataTableAdvancedToolbarProps<TData>) {
  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        "flex w-full items-center justify-between gap-2 p-1",
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">{children}</div>
      <div className="flex items-center gap-2">
        {rightSlot}
        <DataTableViewOptions table={table} align="end" />
      </div>
    </div>
  );
}
