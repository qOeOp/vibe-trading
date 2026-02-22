"use client";

import {
  Play,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Square,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CellStatus } from "@/features/lab/types";

// ─── Cell Toolbar ────────────────────────────────────────

interface CellToolbarProps {
  cellId: string;
  cellName: string;
  status: CellStatus;
  isFirst: boolean;
  isLast: boolean;
  isRunning?: boolean;
  isCollapsed?: boolean;
  onRun: () => void;
  onStop?: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onNameChange: (name: string) => void;
  onToggleCode?: () => void;
  className?: string;
}

function StatusIndicator({ status }: { status: CellStatus }) {
  switch (status) {
    case "running":
      return <Loader2 className="size-3 text-mine-accent-teal animate-spin" />;
    case "done":
      return <CheckCircle2 className="size-3 text-mine-accent-green" />;
    case "error":
      return <XCircle className="size-3 text-mine-accent-red" />;
    case "stale":
      return <Clock className="size-3 text-mine-accent-yellow" />;
    default:
      return null;
  }
}

// Pill button — adapted from Marimo toolbar.tsx ToolbarItem CVA
function ToolbarButton({
  onClick,
  disabled,
  danger,
  children,
  title,
}: {
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "rounded-full border border-mine-border/60 p-[5px]",
        "shadow-sm [&>svg]:size-3",
        "transition-colors active:shadow-none",
        "bg-white",
        disabled
          ? "opacity-30 cursor-not-allowed"
          : danger
            ? "hover:bg-mine-accent-red/10 hover:border-mine-accent-red/30 hover:text-mine-accent-red"
            : "hover:bg-mine-bg hover:border-mine-border",
        !disabled && !danger && "text-mine-muted hover:text-mine-text",
      )}
    >
      {children}
    </button>
  );
}

/**
 * CellToolbar — Floating pill toolbar outside cell (Marimo style)
 *
 * Position: absolute right-2 -top-4 z-10
 * Container: rounded-full pill with border and shadow
 * Buttons: individual rounded-full pill buttons
 *
 * Enhanced with: stop button, collapse toggle
 */
export function CellToolbar({
  status,
  isFirst,
  isLast,
  isRunning,
  isCollapsed,
  onRun,
  onStop,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToggleCode,
  className,
}: CellToolbarProps) {
  return (
    <div
      data-slot="cell-toolbar"
      className={cn(
        "absolute right-2 -top-4 z-10",
        "opacity-0 group-hover/cell:opacity-100",
        "transition-opacity duration-150",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1",
          "bg-white border border-mine-border",
          "rounded-full shadow-sm",
          "px-1 py-0.5",
        )}
      >
        {/* Status indicator */}
        <StatusIndicator status={status} />

        {/* Collapse toggle */}
        {onToggleCode && (
          <ToolbarButton
            onClick={onToggleCode}
            title={isCollapsed ? "Show code" : "Hide code"}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronDown />}
          </ToolbarButton>
        )}

        {/* Run / Stop */}
        {isRunning && onStop ? (
          <ToolbarButton onClick={onStop} title="Stop execution">
            <Square />
          </ToolbarButton>
        ) : (
          <ToolbarButton
            onClick={onRun}
            disabled={isRunning}
            title="Run (Shift+Enter)"
          >
            <Play />
          </ToolbarButton>
        )}

        {/* Move up */}
        <ToolbarButton onClick={onMoveUp} disabled={isFirst} title="Move up">
          <ChevronUp />
        </ToolbarButton>

        {/* Move down */}
        <ToolbarButton onClick={onMoveDown} disabled={isLast} title="Move down">
          <ChevronDown />
        </ToolbarButton>

        {/* Delete */}
        <ToolbarButton onClick={onDelete} danger title="Delete cell">
          <Trash2 />
        </ToolbarButton>
      </div>
    </div>
  );
}
