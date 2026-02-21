'use client';

import {
  Play,
  Square,
  EyeOff,
  Trash2,
  MoreHorizontal,
  Minimize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Mine Cell Toolbar ───────────────────────────────────

type MineCellToolbarProps = {
  isRunning?: boolean;
  disabled?: boolean;
  onRun?: () => void;
  onStop?: () => void;
  onHideCode?: () => void;
  onDelete?: () => void;
  onExpandToolbar?: () => void;
  className?: string;
};

function MineCellToolbar({
  isRunning,
  disabled,
  onRun,
  onStop,
  onHideCode,
  onDelete,
  onExpandToolbar,
  className,
}: MineCellToolbarProps) {
  return (
    <div
      data-slot="mine-cell-toolbar"
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 border-b border-mine-border/20',
        // When disabled: looks normal visually but ignores all clicks
        disabled && 'pointer-events-none',
        className,
      )}
    >
      {/* Run / Stop */}
      {isRunning ? (
        <button
          type="button"
          onClick={onStop}
          className="text-[#e74c3c] hover:text-[#e74c3c]/70 transition-colors cursor-pointer"
        >
          <Square
            className="w-3.5 h-3.5"
            strokeWidth={1.5}
            fill="currentColor"
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={onRun}
          className="text-[#4caf50] hover:text-[#4caf50]/70 transition-colors cursor-pointer"
        >
          <Play className="w-3.5 h-3.5" strokeWidth={1.5} fill="currentColor" />
        </button>
      )}

      {/* Hide code */}
      <button
        type="button"
        onClick={onHideCode}
        className="text-[#b3b3b3] hover:text-mine-text transition-colors cursor-pointer"
      >
        <EyeOff className="w-3.5 h-3.5" strokeWidth={1.5} />
      </button>

      <div className="flex-1" />

      {/* Expand toolbar (reveals move up/down, etc.) */}
      <button
        type="button"
        onClick={onExpandToolbar}
        className="text-[#b3b3b3] hover:text-mine-text transition-colors cursor-pointer"
      >
        <MoreHorizontal className="w-3.5 h-3.5" strokeWidth={1.5} />
      </button>

      {/* Delete */}
      <button
        type="button"
        onClick={onDelete}
        className="text-[#e74c3c] hover:text-[#e74c3c]/70 transition-colors cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}

// ─── Mine Cell ───────────────────────────────────────────

type MineCellProps = {
  /** Whether this cell grows to fill available space */
  flex?: boolean;
  /** Whether the cell is currently active/focused */
  isActive?: boolean;
  /** Whether the cell is running */
  isRunning?: boolean;
  /** Disable all toolbar interactions (e.g. disconnected state) */
  disabled?: boolean;
  /** Cell toolbar callbacks */
  onRun?: () => void;
  onStop?: () => void;
  onHideCode?: () => void;
  onDelete?: () => void;
  onExpandToolbar?: () => void;
  /** Code content (CodeMirror or static CodeBlock) */
  children?: React.ReactNode;
  /** Output area rendered below the code */
  output?: React.ReactNode;
  className?: string;
};

function MineCell({
  flex,
  isActive,
  isRunning,
  disabled,
  onRun,
  onStop,
  onHideCode,
  onDelete,
  onExpandToolbar,
  children,
  output,
  className,
  ...props
}: MineCellProps & Omit<React.ComponentProps<'div'>, 'children'>) {
  return (
    <div
      data-slot="mine-cell"
      className={cn(
        'bg-white rounded-lg overflow-hidden shadow-sm relative group/cell',
        flex ? 'flex-1 min-h-0' : 'shrink-0',
        isActive && 'ring-1 ring-mine-accent-teal/30',
        className,
      )}
      {...props}
    >
      {/* Toolbar */}
      <MineCellToolbar
        isRunning={isRunning}
        disabled={disabled}
        onRun={onRun}
        onStop={onStop}
        onHideCode={onHideCode}
        onDelete={onDelete}
        onExpandToolbar={onExpandToolbar}
      />

      {/* Code content */}
      <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>

      {/* Fold indicator (bottom-right) */}
      <div className="absolute bottom-1.5 right-1.5 pointer-events-none opacity-40">
        <Minimize2 className="w-3 h-3 text-mine-muted" strokeWidth={1.5} />
      </div>

      {/* Output area (if any) */}
      {output}
    </div>
  );
}

export { MineCell, MineCellToolbar };
