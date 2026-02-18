"use client";

import { cn } from "@/lib/utils";
import { Loader2, CheckCircle2, XCircle, Clock, Circle } from "lucide-react";
import type { RuntimeState } from "../../types";

// ─── Cell Status Indicator ───────────────────────────────

interface CellStatusProps {
  status: RuntimeState;
  staleInputs?: boolean;
  errored?: boolean;
  className?: string;
}

/**
 * CellStatus — Visual status indicator for a cell
 *
 * Shows icon + color for current runtime state.
 * Adapted from Marimo's cell status indicators.
 */
export function CellStatus({
  status,
  staleInputs,
  errored,
  className,
}: CellStatusProps) {
  // Error state takes priority
  if (errored) {
    return (
      <div
        data-slot="cell-status"
        className={cn("flex items-center gap-1", className)}
        title="Error"
      >
        <XCircle className="size-3 text-mine-accent-red" />
      </div>
    );
  }

  // Stale takes priority over idle
  if (staleInputs && status === "idle") {
    return (
      <div
        data-slot="cell-status"
        className={cn("flex items-center gap-1", className)}
        title="Needs run"
      >
        <Clock className="size-3 text-mine-accent-yellow" />
      </div>
    );
  }

  switch (status) {
    case "running":
      return (
        <div
          data-slot="cell-status"
          className={cn("flex items-center gap-1", className)}
          title="Running"
        >
          <Loader2 className="size-3 text-mine-accent-teal animate-spin" />
        </div>
      );

    case "queued":
      return (
        <div
          data-slot="cell-status"
          className={cn("flex items-center gap-1", className)}
          title="Queued"
        >
          <Circle className="size-3 text-mine-accent-yellow" />
        </div>
      );

    case "idle":
      return (
        <div
          data-slot="cell-status"
          className={cn("flex items-center gap-1", className)}
          title="Idle"
        >
          <CheckCircle2 className="size-3 text-mine-accent-green" />
        </div>
      );

    case "disabled-transitively":
      return (
        <div
          data-slot="cell-status"
          className={cn("flex items-center gap-1", className)}
          title="Disabled"
        >
          <Circle className="size-3 text-mine-muted" />
        </div>
      );

    default:
      return null;
  }
}
