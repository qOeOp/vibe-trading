'use client';

import { type ReactNode, useCallback, useRef, useState } from 'react';
import {
  Play,
  Square,
  EyeOff,
  Trash2,
  MoreHorizontal,
  Minimize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  isInternalCellName,
  normalizeName,
  getValidName,
} from '@/features/lab/core/cells/names';
import { getCellNames } from '@/features/lab/core/cells/cells';
import { useCellDragProps } from '../editor/SortableCell';

// ─── Mine Cell Toolbar ───────────────────────────────────

type MineCellToolbarProps = {
  isRunning?: boolean;
  disabled?: boolean;
  cellName?: string;
  onNameChange?: (name: string) => void;
  languageIcon?: ReactNode;
  status?: string;
  needsRun?: boolean;
  onRun?: () => void;
  onStop?: () => void;
  onHideCode?: () => void;
  onDelete?: () => void;
  moreActionsSlot?: ReactNode;
  onToggleLanguage?: () => void;
  className?: string;
};

function MineCellToolbar({
  isRunning,
  disabled,
  cellName,
  onNameChange,
  languageIcon,
  status,
  needsRun,
  onRun,
  onStop,
  onHideCode,
  onDelete,
  moreActionsSlot,
  onToggleLanguage,
  className,
}: MineCellToolbarProps) {
  const dragProps = useCellDragProps();

  return (
    <div
      data-slot="mine-cell-toolbar"
      {...dragProps?.attributes}
      {...dragProps?.listeners}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 border-b border-mine-border/20 cursor-grab active:cursor-grabbing',
        disabled && 'pointer-events-none',
        className,
      )}
    >
      {/* Left group: run/stop, hide */}
      {isRunning ? (
        <button
          type="button"
          onClick={onStop}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex items-center text-mine-accent-red hover:text-mine-accent-red/70 transition-colors cursor-pointer"
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
          onPointerDown={(e) => e.stopPropagation()}
          className="flex items-center text-mine-accent-green hover:text-mine-accent-green/70 transition-colors cursor-pointer"
        >
          <Play className="w-3.5 h-3.5" strokeWidth={1.5} fill="currentColor" />
        </button>
      )}

      {/* Hide code */}
      <button
        type="button"
        onClick={onHideCode}
        onPointerDown={(e) => e.stopPropagation()}
        className="flex items-center text-mine-muted hover:text-mine-text transition-colors cursor-pointer"
      >
        <EyeOff className="w-3.5 h-3.5" strokeWidth={1.5} />
      </button>

      {/* Center: editable cell name — inherits cursor-grab, only the text itself overrides */}
      <div className="flex-1 min-w-0 flex justify-center">
        <EditableCellName name={cellName} onChange={onNameChange} />
      </div>

      {/* Right group: status, more, language icon, delete */}

      {/* Status indicator */}
      {needsRun && (
        <span className="w-2 h-2 rounded-full bg-mine-accent-yellow animate-pulse" />
      )}
      {status === 'running' && (
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
      )}
      {status === 'queued' && (
        <span className="w-2 h-2 rounded-full bg-mine-muted animate-pulse" />
      )}

      {/* More actions — slot for dropdown popover anchor */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="flex items-center"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {moreActionsSlot ?? (
          <span className="text-mine-muted">
            <MoreHorizontal className="w-3.5 h-3.5" strokeWidth={1.5} />
          </span>
        )}
      </div>

      {/* Language icon — click to toggle between python/markdown */}
      {languageIcon && (
        <button
          type="button"
          onClick={onToggleLanguage}
          onPointerDown={(e) => e.stopPropagation()}
          className="text-mine-muted hover:text-mine-text transition-colors cursor-pointer flex items-center"
        >
          {languageIcon}
        </button>
      )}

      {/* Delete */}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex items-center text-mine-accent-red hover:text-mine-accent-red/70 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

// ─── Editable Cell Name ──────────────────────────────────

function EditableCellName({
  name,
  onChange,
}: {
  name?: string;
  onChange?: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isInternal = isInternalCellName(name);
  const displayValue = isInternal ? '' : name;

  const startEditing = useCallback(() => {
    if (!onChange) return;
    setDraft(displayValue ?? '');
    setEditing(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [onChange, displayValue]);

  const commit = useCallback(() => {
    setEditing(false);
    if (!onChange) return;
    const trimmed = draft.trim();
    if (!trimmed) {
      onChange('_');
      return;
    }
    const normalized = normalizeName(trimmed);
    if (isInternalCellName(normalized)) {
      onChange(normalized);
      return;
    }
    const validName = getValidName(normalized, getCellNames());
    onChange(validName);
  }, [draft, onChange]);

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === 'Enter') {
            e.currentTarget.blur();
          }
          if (e.key === 'Escape') {
            setEditing(false);
          }
        }}
        onPointerDown={(e) => e.stopPropagation()}
        placeholder="Add description..."
        className="max-w-full text-[11px] font-mono text-mine-text text-center bg-transparent border-none outline-none placeholder:text-mine-muted/40"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={startEditing}
      onPointerDown={(e) => e.stopPropagation()}
      className={cn(
        'max-w-full text-[11px] font-mono truncate text-center transition-colors cursor-text',
        isInternal
          ? 'text-mine-muted/30 hover:text-mine-muted/60'
          : 'text-mine-muted hover:text-mine-text',
      )}
    >
      {isInternal ? 'Add description...' : displayValue}
    </button>
  );
}

// ─── Mine Cell ───────────────────────────────────────────

type MineCellProps = {
  flex?: boolean;
  isActive?: boolean;
  isRunning?: boolean;
  disabled?: boolean;
  cellName?: string;
  onNameChange?: (name: string) => void;
  languageIcon?: ReactNode;
  status?: string;
  needsRun?: boolean;
  hasError?: boolean;
  onRun?: () => void;
  onStop?: () => void;
  onHideCode?: () => void;
  onDelete?: () => void;
  moreActionsSlot?: ReactNode;
  onToggleLanguage?: () => void;
  onCollapse?: () => void;
  children?: ReactNode;
  output?: ReactNode;
  className?: string;
};

function MineCell({
  flex,
  isActive,
  isRunning,
  disabled,
  cellName,
  onNameChange,
  languageIcon,
  status,
  needsRun,
  hasError,
  onRun,
  onStop,
  onHideCode,
  onDelete,
  moreActionsSlot,
  onToggleLanguage,
  onCollapse,
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
        isActive && 'ring-1 ring-indigo-500/30',
        needsRun && 'ring-1 ring-mine-accent-yellow/30',
        hasError && 'ring-1 ring-mine-accent-red/30',
        className,
      )}
      {...props}
    >
      {/* Toolbar — entire bar is drag handle */}
      <MineCellToolbar
        isRunning={isRunning}
        disabled={disabled}
        cellName={cellName}
        onNameChange={onNameChange}
        languageIcon={languageIcon}
        status={status}
        needsRun={needsRun}
        onRun={onRun}
        onStop={onStop}
        onHideCode={onHideCode}
        onDelete={onDelete}
        moreActionsSlot={moreActionsSlot}
        onToggleLanguage={onToggleLanguage}
      />

      {/* Body — accent line targets this via [data-slot="mine-cell-body"]::before */}
      <div data-slot="mine-cell-body" className="relative">
        {/* Code content */}
        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>

        {/* Fold/collapse indicator (bottom-right) */}
        <button
          type="button"
          onClick={onCollapse}
          className="absolute bottom-1.5 right-1.5 opacity-40 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <Minimize2 className="w-3 h-3 text-mine-muted" strokeWidth={1.5} />
        </button>

        {/* Output area (if any) */}
        {output}
      </div>
    </div>
  );
}

export { MineCell, MineCellToolbar };
