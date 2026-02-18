"use client";

import type { Column } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  EyeOff,
  X,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>;
  label: string;
  /** Render a drag handle in the left slot (pass DnD listeners/ref) */
  dragHandle?: React.ReactNode;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  label,
  dragHandle,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  // Three-column layout: [drag handle | label | sort icon]
  // All columns use this layout; columns without drag get an empty spacer to keep alignment.

  const canSort = column.getCanSort();
  const canHide = column.getCanHide();

  const sortIcon = canSort
    ? column.getIsSorted() === "desc"
      ? <ChevronDown className="size-3.5" />
      : column.getIsSorted() === "asc"
        ? <ChevronUp className="size-3.5" />
        : <ChevronsUpDown className="size-3.5" />
    : null;

  // Left slot: drag handle or empty spacer (same width for alignment)
  const leftSlot = dragHandle ?? (
    <span className="w-3 shrink-0" aria-hidden />
  );

  // Non-interactive header (no sort, no hide)
  if (!canSort && !canHide) {
    return (
      <div className={cn("flex items-center w-full", className)}>
        {leftSlot}
        <span className="flex-1 text-center truncate">{label}</span>
        <span className="w-3.5 shrink-0" aria-hidden />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center w-full", className)}>
      {leftSlot}

      {/* Center: label as dropdown trigger for sort/hide */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "flex-1 inline-flex items-center justify-center gap-1 h-8 rounded-md py-1.5 px-1 truncate",
            "hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 data-[state=open]:bg-white/10",
            "[&_svg]:shrink-0 [&_svg]:text-white/50",
          )}
          {...props}
        >
          {label}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-28">
          {canSort && (
            <>
              <DropdownMenuCheckboxItem
                className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
                checked={column.getIsSorted() === "asc"}
                onClick={() => column.toggleSorting(false)}
              >
                <ChevronUp />
                Asc
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
                checked={column.getIsSorted() === "desc"}
                onClick={() => column.toggleSorting(true)}
              >
                <ChevronDown />
                Desc
              </DropdownMenuCheckboxItem>
              {column.getIsSorted() && (
                <DropdownMenuItem
                  className="pl-2 [&_svg]:text-muted-foreground"
                  onClick={() => column.clearSorting()}
                >
                  <X />
                  Reset
                </DropdownMenuItem>
              )}
            </>
          )}
          {canHide && (
            <DropdownMenuCheckboxItem
              className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
              checked={!column.getIsVisible()}
              onClick={() => column.toggleVisibility(false)}
            >
              <EyeOff />
              Hide
            </DropdownMenuCheckboxItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Right slot: sort icon */}
      <span className="w-3.5 shrink-0 flex items-center justify-center text-white/50">
        {sortIcon}
      </span>
    </div>
  );
}
