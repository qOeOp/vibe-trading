/* Copyright 2026 Marimo. All rights reserved. */
/**
 * MineEditableCell — MineCell visual shell wrapping marimo's cell logic.
 *
 * This component reuses all of marimo's jotai state, hooks, and child
 * components (CellEditor, OutputArea, ConsoleOutput, SortableCell, etc.)
 * but replaces the chrome (toolbar, shoulders, delete button) with MineCell.
 *
 * Rollback: remove the `isLabMode` branch in notebook-cell.tsx CellComponent.
 */
import { closeCompletion, completionStatus } from '@codemirror/autocomplete';
import { MoreHorizontal } from 'lucide-react';
import type { EditorView } from '@codemirror/view';
import clsx from 'clsx';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  type FocusEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useEvent from 'react-use-event-hook';

import { aiCompletionCellAtom } from '@/features/lab/core/ai/state';
import { outputIsLoading, outputIsStale } from '@/features/lab/core/cells/cell';
import {
  createUntouchedCellAtom,
  useCellActions,
  useCellData,
  useCellRuntime,
} from '@/features/lab/core/cells/cells';
import { isOutputEmpty } from '@/features/lab/core/cells/outputs';
import { autocompletionKeymap } from '@/features/lab/core/codemirror/cm';
import type { LanguageAdapterType } from '@/features/lab/core/codemirror/language/types';
import { CSSClasses } from '@/features/lab/core/constants';
import { canCollapseOutline } from '@/features/lab/core/dom/outline';
import {
  useErrorDetailsActions,
  useIsCellErrorDetailsOpen,
} from '@/features/lab/core/errors/state';
import { isErrorMime } from '@/features/lab/core/mime';
import { connectionAtom } from '@/features/lab/core/network/connection';
import { useRequestClient } from '@/features/lab/core/network/requests';
import { isAppInteractionDisabled } from '@/features/lab/core/websocket/connection-utils';

import type { CellProps } from './notebook-cell';
import { cellDomProps } from './common';
import { CellActionsContextMenu } from './cell/cell-context-menu';
import { CellEditor } from './cell/code/cell-editor';
import { CollapsedCellBanner, CollapseToggle } from './cell/collapse';
import {
  StagedAICellBackground,
  StagedAICellFooter,
} from './cell/StagedAICell';
import { useDeleteCellCallback } from './cell/useDeleteCell';
import { useRunCell } from './cell/useRunCells';
import { SortableCell } from './SortableCell';
import { useCellNavigationProps } from './navigation/navigation';
import {
  useTemporarilyShownCode,
  useTemporarilyShownCodeActions,
} from './navigation/state';
import { type OnRefactorWithAI, OutputArea } from './Output';
import { ConsoleOutput } from './output/console/ConsoleOutput';
import { PendingDeleteConfirmation } from './cell/PendingDeleteConfirmation';
import { SqlValidationErrorBanner } from './errors/sql-validation-errors';
import {
  type CellActionsDropdownHandle,
  CellActionsDropdown,
} from './cell/cell-actions';
import { switchLanguage } from '@/features/lab/core/codemirror/language/extension';
import { PythonIcon, MarkdownIcon } from './cell/code/icons';
import { MineCell } from '../shell/mine-cell';

// ─── MineEditableCell ────────────────────────────────────────

const MineEditableCell = ({
  theme,
  showPlaceholder,
  cellId,
  canDelete,
  userConfig,
  isCollapsed,
  collapseCount,
  canMoveX,
  editorView,
  setEditorView,
}: CellProps & {
  editorView: React.RefObject<EditorView | null>;
  setEditorView: (view: EditorView) => void;
}) => {
  const cellRef = useRef<HTMLDivElement>(null);
  const cellData = useCellData(cellId);
  const cellRuntime = useCellRuntime(cellId);
  const cellActionDropdownRef = useRef<CellActionsDropdownHandle>(null);
  const editorViewParentRef = useRef<HTMLDivElement>(null);
  const cellContainerRef = useRef<HTMLDivElement>(null);
  const prevStatusRef = useRef(cellRuntime.status);

  const actions = useCellActions();
  const connection = useAtomValue(connectionAtom);
  const setAiCompletionCell = useSetAtom(aiCompletionCellAtom);
  const deleteCell = useDeleteCellCallback();
  const runCell = useRunCell(cellId);
  const { sendStdin } = useRequestClient();

  const [languageAdapter, setLanguageAdapter] = useState<LanguageAdapterType>();

  const disabledOrAncestorDisabled =
    cellData.config.disabled || cellRuntime.status === 'disabled-transitively';

  const needsRun =
    cellData.edited ||
    cellRuntime.interrupted ||
    (cellRuntime.staleInputs && !disabledOrAncestorDisabled);

  const loading = outputIsLoading(cellRuntime.status);

  const consoleOutputStale =
    (cellRuntime.status === 'queued' ||
      cellData.edited ||
      cellRuntime.staleInputs) &&
    !cellRuntime.interrupted;

  const getEditorView = useCallback(() => editorView.current, [editorView]);

  // ── Completion focus management ──
  const closeCompletionHandler = useEvent((e: FocusEvent) => {
    if (
      cellRef.current !== null &&
      !cellRef.current.contains(e.relatedTarget) &&
      editorView.current !== null
    ) {
      closeCompletion(editorView.current);
    }
  });

  const resumeCompletionHandler = useEvent((e: KeyboardEvent) => {
    if (
      cellRef.current !== document.activeElement ||
      editorView.current === null ||
      completionStatus(editorView.current.state) !== 'active'
    ) {
      return;
    }
    for (const keymap of autocompletionKeymap) {
      if (e.key === keymap.key && keymap.run) {
        keymap.run(editorView.current);
        e.preventDefault();
        e.stopPropagation();
        break;
      }
    }
    editorView.current.focus();
  });

  // ── Hidden code logic ──
  const temporarilyVisible = useTemporarilyShownCode(cellId);
  const temporarilyShownCodeActions = useTemporarilyShownCodeActions();
  const isUntouched = useAtomValue(
    useMemo(() => createUntouchedCellAtom(cellId), [cellId]),
  );

  const isCellCodeShown =
    !cellData.config.hide_code || temporarilyVisible || isUntouched;
  const isMarkdown = languageAdapter === 'markdown';
  const isMarkdownCodeHidden = isMarkdown && !isCellCodeShown;

  const showHiddenCode = useEvent((opts?: { focus?: boolean }) => {
    if (isCellCodeShown) return;
    const focus = opts?.focus ?? true;
    temporarilyShownCodeActions.add(cellId);
    if (focus) editorView.current?.focus();
  });

  const showHiddenCodeIfMarkdown = useEvent(() => {
    if (isMarkdownCodeHidden) showHiddenCode({ focus: true });
  });

  // ── Navigation ──
  const navigationProps = useCellNavigationProps(cellId, {
    canMoveX,
    editorView,
    cellActionDropdownRef,
  });

  const canCollapse = canCollapseOutline(cellRuntime.outline);
  const hasOutput = !isOutputEmpty(cellRuntime.output);
  const isErrorOutput = isErrorMime(cellRuntime.output?.mimetype);
  const isErrorDetailsOpen = useIsCellErrorDetailsOpen(cellId);
  const { clearCellErrorDetails } = useErrorDetailsActions();
  const hasAnyConsoleOutput = cellRuntime.consoleOutputs.length > 0;
  const syntheticErrorConsoleOutput =
    isErrorOutput &&
    isErrorDetailsOpen &&
    cellRuntime.output != null &&
    !hasAnyConsoleOutput
      ? [{ ...cellRuntime.output, channel: 'stderr' as const }]
      : [];
  const rawDisplayConsoleOutputs = isErrorOutput
    ? isErrorDetailsOpen
      ? [...cellRuntime.consoleOutputs, ...syntheticErrorConsoleOutput]
      : []
    : cellRuntime.consoleOutputs;
  const hasTracebackOutput = rawDisplayConsoleOutputs.some(
    (output) => output.mimetype === 'application/vnd.marimo+traceback',
  );
  const displayConsoleOutputs = hasTracebackOutput
    ? rawDisplayConsoleOutputs.filter(
        (output) => output.mimetype !== 'application/vnd.marimo+error',
      )
    : rawDisplayConsoleOutputs;
  const isStaleCell = outputIsStale(cellRuntime, cellData.edited);
  const hasConsoleOutput = displayConsoleOutputs.length > 0;
  const cellOutput = userConfig.display.cell_output;
  const hasVisibleOutput = hasOutput && !isErrorOutput;

  const isEmptyMarkdownContent =
    isMarkdown && editorView.current?.state.doc.toString().trim() === '';

  useEffect(() => {
    if (!isErrorOutput) {
      clearCellErrorDetails(cellId);
    }
  }, [cellId, clearCellErrorDetails, isErrorOutput]);

  useEffect(() => {
    if (cellRuntime.status === 'queued' || cellRuntime.status === 'running') {
      clearCellErrorDetails(cellId);
    }
  }, [cellId, cellRuntime.status, clearCellErrorDetails]);

  // ── Shine border effect ──
  useEffect(() => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = cellRuntime.status;

    const el = cellContainerRef.current;
    if (!el) return;

    if (
      prev === 'running' &&
      cellRuntime.status === 'idle' &&
      !cellRuntime.errored
    ) {
      el.setAttribute('data-shine', 'success');
      const timer = setTimeout(() => el.removeAttribute('data-shine'), 700);
      return () => clearTimeout(timer);
    }

    if (cellRuntime.errored && prev !== cellRuntime.status) {
      el.setAttribute('data-shine', 'error');
      const timer = setTimeout(() => el.removeAttribute('data-shine'), 700);
      return () => clearTimeout(timer);
    }
  }, [cellRuntime.status, cellRuntime.errored]);

  // ── AI refactor ──
  const handleRefactorWithAI: OnRefactorWithAI = useEvent(
    (opts: { prompt: string; triggerImmediately: boolean }) => {
      setAiCompletionCell({
        cellId,
        initialPrompt: opts.prompt,
        triggerImmediately: opts.triggerImmediately,
      });
    },
  );

  // ── Cell handlers ──
  const handleDelete = useEvent(() => {
    if (!loading && !isAppInteractionDisabled(connection.state)) {
      deleteCell({ cellId });
    }
  });

  const handleHideCode = useEvent(() => {
    actions.updateCellConfig({
      cellId,
      config: { hide_code: !cellData.config.hide_code },
    });
  });

  const handleToggleLanguage = useEvent(() => {
    if (!editorView.current) return;
    const target = languageAdapter === 'markdown' ? 'python' : 'markdown';
    switchLanguage(editorView.current, { language: target });
  });

  const handleCollapse = useEvent(() => {
    actions.updateCellConfig({
      cellId,
      config: { hide_code: true },
    });
  });

  // ── Derived classes for the marimo-cell div ──
  const marimoClassName = clsx('marimo-cell', 'hover-actions-parent z-10', {
    interactive: true,
    'needs-run': needsRun,
    'has-error': cellRuntime.errored,
    stopped: cellRuntime.stopped,
    disabled: cellData.config.disabled,
    stale: cellRuntime.status === 'disabled-transitively',
    borderless:
      isMarkdownCodeHidden &&
      hasVisibleOutput &&
      !navigationProps['data-selected'],
  });

  // ── Output area ──
  const emptyMarkdownPlaceholder = isMarkdownCodeHidden &&
    isEmptyMarkdownContent &&
    !needsRun && (
      <div
        role="button"
        aria-label="Double-click to edit markdown"
        className="relative cursor-pointer px-3 py-2"
        onDoubleClick={showHiddenCodeIfMarkdown}
        onKeyDown={(e) => {
          if (e.key === 'Enter') showHiddenCodeIfMarkdown();
        }}
        tabIndex={0}
      >
        <span className="text-(--slate-8) text-sm">
          Double-click (or enter) to edit
        </span>
      </div>
    );

  const outputArea = hasVisibleOutput && !isEmptyMarkdownContent && (
    <div className="relative" onDoubleClick={showHiddenCodeIfMarkdown}>
      <div className="absolute top-5 -left-7 z-20 print:hidden">
        <CollapseToggle
          isCollapsed={isCollapsed}
          onClick={() => {
            if (isCollapsed) {
              actions.expandCell({ cellId });
            } else {
              actions.collapseCell({ cellId });
            }
          }}
          canCollapse={canCollapse}
        />
      </div>
      <OutputArea
        allowExpand={true}
        forceExpand={isMarkdownCodeHidden}
        className={CSSClasses.outputArea}
        cellId={cellId}
        output={cellRuntime.output}
        stale={isStaleCell}
        loading={outputIsLoading(cellRuntime.status)}
      />
    </div>
  );

  // ── Render ──
  return (
    <CellActionsContextMenu cellId={cellId} getEditorView={getEditorView}>
      <SortableCell
        tabIndex={-1}
        ref={cellRef}
        data-status={cellRuntime.status}
        onBlur={closeCompletionHandler}
        onKeyDown={resumeCompletionHandler}
        cellId={cellId}
        canMoveX={canMoveX}
      >
        <div
          tabIndex={-1}
          {...navigationProps}
          className={marimoClassName}
          ref={cellContainerRef}
          {...cellDomProps(cellId, cellData.name)}
        >
          <MineCell
            isActive={navigationProps['data-selected'] === true}
            isRunning={loading}
            needsRun={needsRun}
            hasError={cellRuntime.errored}
            cellName={cellData.name}
            onNameChange={(name) => actions.updateCellName({ cellId, name })}
            languageIcon={
              languageAdapter === 'markdown' ? (
                <MarkdownIcon className="w-3.5 h-3.5" />
              ) : (
                <PythonIcon className="w-3.5 h-3.5" />
              )
            }
            status={cellRuntime.status ?? undefined}
            onRun={runCell}
            onStop={runCell}
            onHideCode={handleHideCode}
            onDelete={canDelete ? handleDelete : undefined}
            moreActionsSlot={
              <CellActionsDropdown
                ref={cellActionDropdownRef}
                cellId={cellId}
                status={cellRuntime.status}
                getEditorView={getEditorView}
                name={cellData.name}
                config={cellData.config}
                hasOutput={hasOutput}
                hasConsoleOutput={hasConsoleOutput}
                showTooltip={false}
              >
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  className="text-mine-muted hover:text-mine-text transition-colors cursor-pointer"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </CellActionsDropdown>
            }
            onToggleLanguage={handleToggleLanguage}
            onCollapse={handleCollapse}
            output={
              <>
                {cellOutput === 'above' &&
                  (outputArea || emptyMarkdownPlaceholder)}
                {cellOutput === 'below' &&
                  (outputArea || emptyMarkdownPlaceholder)}
                <SqlValidationErrorBanner
                  cellId={cellId}
                  hide={cellRuntime.errored && !isStaleCell}
                />
                {(!isErrorOutput || isErrorDetailsOpen) && (
                  <ConsoleOutput
                    consoleOutputs={displayConsoleOutputs}
                    stale={consoleOutputStale}
                    cellName={cellRuntime.serialization ? '_' : cellData.name}
                    onRefactorWithAI={handleRefactorWithAI}
                    onClear={() => actions.clearCellConsoleOutput({ cellId })}
                    onSubmitDebugger={(text, index) => {
                      actions.setStdinResponse({
                        cellId,
                        response: text,
                        outputIndex: index,
                      });
                      sendStdin({ text });
                    }}
                    cellId={cellId}
                    debuggerActive={cellRuntime.debuggerActive}
                  />
                )}
              </>
            }
          >
            <StagedAICellBackground cellId={cellId} />
            <CellEditor
              theme={theme}
              showPlaceholder={showPlaceholder}
              showLanguageToggles={false}
              id={cellId}
              code={cellData.code}
              config={cellData.config}
              status={cellRuntime.status}
              serializedEditorState={cellData.serializedEditorState}
              runCell={runCell}
              setEditorView={setEditorView}
              userConfig={userConfig}
              editorViewRef={editorView}
              editorViewParentRef={editorViewParentRef}
              hidden={!isCellCodeShown}
              hasOutput={hasVisibleOutput}
              showHiddenCode={showHiddenCode}
              languageAdapter={languageAdapter}
              setLanguageAdapter={setLanguageAdapter}
              outputArea={cellOutput}
            />
          </MineCell>
          <PendingDeleteConfirmation cellId={cellId} />
        </div>
        <StagedAICellFooter cellId={cellId} />
        {isCollapsed && (
          <CollapsedCellBanner
            onClick={() => actions.expandCell({ cellId })}
            count={collapseCount}
            cellId={cellId}
          />
        )}
      </SortableCell>
    </CellActionsContextMenu>
  );
};

export { MineEditableCell };
