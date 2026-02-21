/**
 * useCellActionButtons — Cell action groups for dropdown/context menus
 * Forked from Marimo: actions/useCellActionButton.tsx
 *
 * Modifications:
 * 1. Removed AI completion, SQL toggle, column breakpoint, language conversion
 * 2. Removed Name/Link group (VT doesn't have cell URLs yet)
 * 3. Replaced Marimo HotkeyAction → plain string display
 * 4. Data-layer agnostic: config, status, and actions passed as props
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
  ZapIcon,
  ZapOffIcon,
  XCircleIcon,
  Trash2Icon,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────

/**
 * Shared interface to render a user action in the editor.
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
  hidden?: boolean;
  redundant?: boolean;
  rightElement?: React.ReactNode;
  hotkey?: string;
  handle: (event?: Event) => void;
  handleHeadless?: (event?: Event) => void;
  divider?: boolean;
  dropdown?: ActionButton[];
}

/**
 * Cell action callbacks. Callers provide these from whatever data layer
 * they use (marimo jotai in connected mode, zustand in disconnected mode).
 */
export interface CellActionCallbacks {
  setCellConfig: (cellId: string, config: Record<string, unknown>) => void;
  createCellAbove: (cellId: string) => void;
  createCellBelow: (cellId: string) => void;
  moveCellUp: (cellId: string) => void;
  moveCellDown: (cellId: string) => void;
  sendToTop: (cellId: string) => void;
  sendToBottom: (cellId: string) => void;
  clearConsoleOutput: (cellId: string) => void;
  removeCell: (cellId: string) => void;
}

interface UseCellActionButtonsProps {
  cellId: string;
  canDelete: boolean;
  hasOutput: boolean;
  hasConsoleOutput: boolean;
  onRun: () => void;
  onRunAndStay?: () => void;
  getEditorView?: () => EditorView | null;
  config: { disabled?: boolean; hide_code?: boolean };
  status: string;
  actions: CellActionCallbacks;
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
  config,
  status,
  actions,
}: UseCellActionButtonsProps): ActionButton[][] {
  return useMemo(() => {
    const isDisabled = config.disabled ?? false;
    const isRunning = status === 'running' || status === 'queued';
    const isCodeHidden = config.hide_code ?? false;

    // Group 1: Run + Code ops
    const runAndCodeGroup: ActionButton[] = [
      {
        label: 'Run cell',
        icon: <PlayIcon />,
        hotkey: 'cell.run',
        handle: onRun,
        hidden: isRunning || isDisabled,
        redundant: true,
      },
      {
        label: 'Run and stay',
        icon: <PlayIcon />,
        hotkey: 'cell.runAndNewBelow',
        handle: () => onRunAndStay?.(),
        hidden: isRunning || isDisabled || !onRunAndStay,
      },
      {
        label: 'Format',
        icon: <Code2Icon />,
        hotkey: 'cell.format',
        handle: () => {
          const editorView = getEditorView?.();
          if (!editorView) return;
        },
        hidden: !getEditorView,
      },
      {
        label: isCodeHidden ? 'Show code' : 'Hide code',
        icon: isCodeHidden ? <EyeIcon /> : <EyeOffIcon />,
        hotkey: 'cell.hideCode',
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
    const movementGroup: ActionButton[] = [
      {
        label: 'Create cell above',
        icon: <PlusCircleIcon />,
        hotkey: 'cell.createAbove',
        handle: () => actions.createCellAbove(cellId),
        redundant: true,
      },
      {
        label: 'Create cell below',
        icon: <PlusCircleIcon />,
        hotkey: 'cell.createBelow',
        handle: () => actions.createCellBelow(cellId),
        redundant: true,
      },
      {
        label: 'Move cell up',
        icon: <ChevronUpIcon />,
        hotkey: 'cell.moveUp',
        handle: () => actions.moveCellUp(cellId),
      },
      {
        label: 'Move cell down',
        icon: <ChevronDownIcon />,
        hotkey: 'cell.moveDown',
        handle: () => actions.moveCellDown(cellId),
      },
      {
        label: 'Send to top',
        icon: <ChevronsUpIcon />,
        hotkey: 'cell.sendToTop',
        handle: () => actions.sendToTop(cellId),
      },
      {
        label: 'Send to bottom',
        icon: <ChevronsDownIcon />,
        hotkey: 'cell.sendToBottom',
        handle: () => actions.sendToBottom(cellId),
      },
    ];

    // Group 3: Outputs
    const outputGroup: ActionButton[] = [
      {
        label: 'Clear output',
        icon: <XCircleIcon />,
        handle: () => actions.clearConsoleOutput(cellId),
        hidden: !hasOutput && !hasConsoleOutput,
      },
    ];

    // Group 4: Delete
    const deleteGroup: ActionButton[] = [
      {
        label: 'Delete',
        icon: <Trash2Icon />,
        hotkey: 'cell.delete',
        handle: () => actions.removeCell(cellId),
        variant: 'danger' as const,
        hidden: !canDelete,
        disabled: isRunning,
      },
    ];

    return [runAndCodeGroup, movementGroup, outputGroup, deleteGroup]
      .map((group) => group.filter((action) => !action.hidden))
      .filter((group) => group.length > 0);
  }, [
    cellId,
    config,
    status,
    canDelete,
    hasOutput,
    hasConsoleOutput,
    onRun,
    onRunAndStay,
    getEditorView,
    actions,
  ]);
}
