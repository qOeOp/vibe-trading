/**
 * useCellActionButtons — Cell action groups for dropdown/context menus
 * Forked from Marimo: actions/useCellActionButton.tsx
 *
 * Modifications:
 * 1. Removed AI completion, SQL toggle, column breakpoint, language conversion
 * 2. Removed Name/Link group (VT doesn't have cell URLs yet)
 * 3. Replaced Marimo HotkeyAction → plain string display
 * 4. Uses VT's useCellActions() from marimo-compat
 * 5. Kept `redundant` flag for filtering toolbar-duplicate items from menus
 */

'use client';

import type React from 'react';
import { useMemo } from 'react';
import type { EditorView } from '@codemirror/view';
import {
  PlayIcon,
  PlusCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronsUpIcon,
  ChevronsDownIcon,
  EyeIcon,
  EyeOffIcon,
  Code2Icon,
  ScissorsIcon,
  ZapIcon,
  ZapOffIcon,
  XCircleIcon,
  Trash2Icon,
} from 'lucide-react';
import {
  useCellActions,
  useCellData,
  useCellRuntime,
} from '../lib/marimo-compat';
import { useLabCellStore } from '../store/use-lab-cell-store';

// ─── Types ────────────────────────────────────────────────

/**
 * Shared interface to render a user action in the editor.
 * This can be in a dropdown menu, context menu, toolbar, or command palette.
 *
 * 迁移自 marimo:components/editor/actions/types.ts L8-L30
 * 修改:
 *   - HotkeyAction → string（原因: VT 无 marimo:core/hotkeys/hotkeys.ts 的 HotkeyAction enum）
 *   - variant 保留 "danger" | "muted" | "disabled"（原样迁移）
 *   - handleHeadless → 保留（原因: 命令面板后续可能使用）
 *   - divider / dropdown → 保留（原因: 高保真迁移）
 */
export interface ActionButton {
  label: string;
  labelElement?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  tooltip?: React.ReactNode;
  variant?: 'danger' | 'muted' | 'disabled';
  disableClick?: boolean;
  icon?: React.ReactElement;
  /** whether the action is applicable */
  hidden?: boolean;
  /** whether to show the action in a menu */
  redundant?: boolean;
  rightElement?: React.ReactNode;
  hotkey?: string;
  handle: (event?: Event) => void;
  /**
   * Special handler for headless contexts: e.g. a command palette.
   */
  handleHeadless?: (event?: Event) => void;
  divider?: boolean;
  dropdown?: ActionButton[];
}

interface UseCellActionButtonsProps {
  cellId: string;
  canDelete: boolean;
  hasOutput: boolean;
  hasConsoleOutput: boolean;
  onRun: () => void;
  onRunAndStay?: () => void;
  getEditorView?: () => EditorView | null;
}

// ─── Hook ─────────────────────────────────────────────────

export function useCellActionButtons({
  cellId,
  canDelete,
  hasOutput,
  hasConsoleOutput,
  onRun,
  onRunAndStay,
  getEditorView,
}: UseCellActionButtonsProps): ActionButton[][] {
  const actions = useCellActions();
  const cellData = useCellData(cellId);
  const cellRuntime = useCellRuntime(cellId);

  return useMemo(() => {
    if (!cellData || !cellRuntime) return [];

    const isDisabled = cellData.config.disabled;
    const isRunning =
      cellRuntime.status === 'running' || cellRuntime.status === 'queued';
    const isCodeHidden = cellData.config.hide_code ?? false;

    // Group 1: Run + Code ops
    // Mirrors Marimo group 1: Run, Split, Format, Hide code, Disable
    const runAndCodeGroup: ActionButton[] = [
      {
        label: 'Run cell',
        icon: <PlayIcon />,
        hotkey: '⇧+Enter',
        handle: onRun,
        hidden: isRunning || isDisabled,
        redundant: true, // Already in toolbar
      },
      {
        label: 'Run and stay',
        icon: <PlayIcon />,
        hotkey: '⌘+Enter',
        handle: () => onRunAndStay?.(),
        hidden: isRunning || isDisabled || !onRunAndStay,
      },
      {
        label: 'Split',
        icon: <ScissorsIcon />,
        hotkey: '⌘+⇧+S',
        handle: () => {
          // TODO: Implement split cell (requires CodeMirror cursor position)
        },
        hidden: true, // Hidden until split is implemented
      },
      {
        label: 'Format',
        icon: <Code2Icon />,
        hotkey: '⌘+B',
        handle: () => {
          const editorView = getEditorView?.();
          if (!editorView) return;
          // TODO: Hook into formatEditorViews when available
        },
        hidden: !getEditorView, // Hide if no editor access
      },
      {
        label: isCodeHidden ? 'Show code' : 'Hide code',
        icon: isCodeHidden ? <EyeIcon /> : <EyeOffIcon />,
        handle: () =>
          actions.setCellConfig(cellId, { hide_code: !isCodeHidden }),
      },
      {
        label: isDisabled ? 'Enable execution' : 'Disable execution',
        icon: isDisabled ? <ZapOffIcon /> : <ZapIcon />,
        handle: () => actions.setCellConfig(cellId, { disabled: !isDisabled }),
      },
    ];

    // Group 2: Movement
    // Mirrors Marimo group 3: Create above/below, Move up/down, Send to top/bottom
    const movementGroup: ActionButton[] = [
      {
        label: 'Create cell above',
        icon: <PlusCircleIcon />,
        handle: () => {
          // addCell(afterId) inserts AFTER afterId.
          // To insert above current cell, insert after the previous cell.
          const idx = getCellIndex(cellId);
          if (idx > 0) {
            const prevId = useLabCellStore.getState().cellIds[idx - 1];
            actions.addCell(prevId);
          } else {
            // Current cell is first — add at end then reorder to position 0
            actions.addCell();
            const ids = useLabCellStore.getState().cellIds;
            actions.reorderCells(ids.length - 1, 0);
          }
        },
        redundant: true, // Create buttons exist in cell gutters
      },
      {
        label: 'Create cell below',
        icon: <PlusCircleIcon />,
        handle: () => actions.addCell(cellId),
        redundant: true, // Create buttons exist in cell gutters
      },
      {
        label: 'Move cell up',
        icon: <ChevronUpIcon />,
        handle: () => {
          const idx = getCellIndex(cellId);
          if (idx > 0) actions.reorderCells(idx, idx - 1);
        },
      },
      {
        label: 'Move cell down',
        icon: <ChevronDownIcon />,
        handle: () => {
          const idx = getCellIndex(cellId);
          actions.reorderCells(idx, idx + 1);
        },
      },
      {
        label: 'Send to top',
        icon: <ChevronsUpIcon />,
        handle: () => {
          const idx = getCellIndex(cellId);
          if (idx > 0) actions.reorderCells(idx, 0);
        },
      },
      {
        label: 'Send to bottom',
        icon: <ChevronsDownIcon />,
        handle: () => {
          const idx = getCellIndex(cellId);
          actions.reorderCells(idx, 999);
        },
      },
    ];

    // Group 3: Outputs
    // Mirrors Marimo group 4: Export output as PNG, Clear output
    const outputGroup: ActionButton[] = [
      {
        label: 'Clear output',
        icon: <XCircleIcon />,
        handle: () => actions.setConsoleOutputs(cellId, []),
        hidden: !hasOutput && !hasConsoleOutput,
      },
    ];

    // Group 4: Delete
    // Mirrors Marimo group 6
    const deleteGroup: ActionButton[] = [
      {
        label: 'Delete',
        icon: <Trash2Icon />,
        handle: () => actions.removeCell(cellId),
        variant: 'danger' as const,
        hidden: !canDelete,
        disabled: isRunning,
      },
    ];

    // Filter hidden actions and empty groups
    return [runAndCodeGroup, movementGroup, outputGroup, deleteGroup]
      .map((group) => group.filter((action) => !action.hidden))
      .filter((group) => group.length > 0);
  }, [
    cellId,
    cellData,
    cellRuntime,
    canDelete,
    hasOutput,
    hasConsoleOutput,
    onRun,
    onRunAndStay,
    getEditorView,
    actions,
  ]);

  // Helper: get cell index from store (non-reactive snapshot)
  function getCellIndex(id: string): number {
    const { cellIds } = useLabCellStore.getState();
    return cellIds.indexOf(id);
  }
}
