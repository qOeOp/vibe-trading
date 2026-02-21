# 01 — components/editor/

> Migration inventory of `marimo/frontend/src/components/editor/`
> Generated 2026-02-19. Source: ~220 files across 18 subdirectories.

---

## Root files

### ❌ REMOVE — Disconnected.tsx (reason: kernel connection management, VT has no Python kernel)

- **Lines**: 73
- **Exports**: `Disconnected` (L14, component)
- **Purpose**: Session disconnected/takeover banner with reconnect and restart options
- **Deps**: `@/core/network/api`, `@/core/network/connection`, `@/plugins/impl/common/error-banner`, `@/utils/errors`, `@/utils/reload-safe`

### ❌ REMOVE — KernelStartupErrorModal.tsx (reason: Python kernel startup errors, not applicable to VT)

- **Lines**: 102
- **Exports**: `KernelStartupErrorModal` (L19, component)
- **Purpose**: AlertDialog modal for kernel startup failures with copy-to-clipboard traceback
- **Deps**: `@/core/errors/state`, `@/components/ui/alert-dialog`, `@/components/ui/button`, `@/utils/copy`

### ⚠️ ADAPT — Output.tsx (reason: core output rendering needed, but must strip Python-specific mimetypes and adapt Jotai→Zustand)

- **Lines**: 523
- **Exports**: `MimeType` (L16, type), `OnRefactorWithAI` (L21, type), `OutputRenderer` (L69-L255, component), `OutputArea` (L363-L406, component)
- **Purpose**: Core output rendering engine — dispatches by mimetype (html, text, json, image, video, vega, error, traceback, csv, markdown, mimebundle)
- **Deps**: `@/core/cells/ids`, `@/core/cells/outputs`, `@/core/kernel/messages`, `@/core/mode`, `@/core/mime`, `@/utils/cn`, `@/utils/events`, `@/utils/invariant`, `@/utils/mime-types`, `@/utils/objects`, `@/theme/useTheme`, `@/hooks/useIframeCapabilities`, `@/plugins/core/RenderHTML`
- **Main exports**:
  - `OutputRenderer` (L69-L255): Switch-case renderer for all mime types
  - `OutputArea` (L363-L406): Container with expand/collapse and toolbar

### ❌ REMOVE — RecoveryButton.tsx (reason: disaster recovery for unsaved kernel state, VT manages state differently)

- **Lines**: 162
- **Exports**: `RecoveryButton` (L31, component)
- **Purpose**: Downloads unsaved cell changes as JSON file for disaster recovery
- **Deps**: `@/core/cells/cells`, `@/core/cells/utils`, `@/core/meta/globals`, `@/hooks/useEvent`, `@/utils/download`, `@/utils/paths`

### 🔄 ALREADY — SortableCell.tsx (reason: already migrated as sortable-cell.tsx in Batch 1)

- **Lines**: 162
- **Exports**: `CellDragHandle` (L25, component), `SortableCell` (L43, component)
- **Purpose**: dnd-kit sortable wrapper for cells with drag handle via React context
- **Deps**: `@/core/cells/ids`, `@/utils/cn`, `@/utils/events`, `@/utils/mergeRefs`

### ❌ REMOVE — app-container.tsx (reason: VT has its own app shell via Next.js layout, no WASM/Pyodide)

- **Lines**: 56
- **Exports**: `AppContainer` (L15, component)
- **Purpose**: Top-level app shell with DynamicFavicon, StatusOverlay, PyodideLoader, sidebar
- **Deps**: `@/core/config/config-schema`, `@/core/wasm/PyodideLoader`, `@/core/websocket/connection-utils`, `@/core/websocket/types`

### ⚠️ ADAPT — common.ts (reason: cell DOM attribute helpers needed, but CellId→string ID conversion required)

- **Lines**: 21
- **Exports**: `cellDomProps` (L5, function)
- **Purpose**: Creates data-cell-id, data-cell-name, id attributes for cell DOM elements
- **Deps**: `@/core/cells/ids`

### ❌ REMOVE — documentation.css (reason: marimo API documentation tooltips, VT doesn't need Python API docs panel)

- **Lines**: 140
- **Purpose**: Styles for documentation tooltips and panels (`.docs-documentation`, `.docs-tooltip`)

### ❌ REMOVE — dynamic-favicon.tsx (reason: VT has its own favicon handling, no kernel state-based favicon)

- **Lines**: 127
- **Exports**: `DynamicFavicon` (L17, component)
- **Purpose**: Changes browser favicon based on running/error/success state, sends desktop notifications
- **Deps**: `@/core/cells/cells`, `@/hooks/useEventListener`

### ❌ REMOVE — kiosk-mode.tsx (reason: VT doesn't have kiosk/presentation mode)

- **Lines**: 26
- **Exports**: `HideInKioskMode` (L8, component), `ShowInKioskMode` (L17, component)
- **Purpose**: Conditional rendering wrappers based on kiosk mode atom
- **Deps**: `@/core/mode`

### ❌ REMOVE — notebook-banner.tsx (reason: kernel error banners, VT handles errors differently)

- **Lines**: 76
- **Exports**: `NotebookBanner` (L17, component)
- **Purpose**: Displays error/info banners at top of notebook with optional restart action
- **Deps**: `@/core/config/config-schema`, `@/core/errors/state`, `@/plugins/core/RenderHTML`, `@/plugins/impl/common/error-banner`

### 🔄 ALREADY — notebook-cell.tsx (reason: already migrated as notebook-cell.tsx in Batch 1)

- **Lines**: 1219
- **Exports**: `CellComponentActions` (L208, type), `CellHandle` (L228, type), `CellProps` (L239, type), `Cell` (L1219, component)
- **Purpose**: THE MAIN CELL COMPONENT. Orchestrates cell editing, output, toolbar, drag handles, AI completion, markdown hiding, navigation, and console output
- **Deps**: `@/core/cells/cells`, `@/core/cells/ids`, `@/core/cells/utils`, `@/core/codemirror/cm`, `@/core/codemirror/language/types`, `@/core/constants`, `@/core/dom/outline`, `@/core/mime`, `@/core/mode`, `@/core/network/connection`, `@/core/network/requests`, `@/core/network/types`, `@/core/ai/state`, `@/core/config/config-schema`, `@/core/websocket/connection-utils`, `@/hooks/useResizeObserver`, `@/utils/cn`, `@/utils/time`, `@/utils/dereference`, `@/utils/functions`, `@/utils/Logger`
- **Main exports**:
  - `CellComponent` (~L280-L450): Wrapper dispatching editable/readonly/setup variants
  - `EditableCellComponent` (~L450-L900): Full editable cell with editor, output, toolbar, AI
  - `ReadonlyCellComponent` (~L900-L1000): Read-only cell variant
  - `SetupCellComponent` (~L1000-L1060): Setup/initialization cell variant
  - `CellRightSideActions` (~L1060-L1120): Run/stop/status buttons
  - `CellLeftSideActions` (~L1120-L1160): Drag handle, collapse toggle
  - `CellToolbar` (~L1160-L1219): Top toolbar with action buttons

### ❌ REMOVE — package-alert.tsx (reason: Python package installation, VT doesn't manage pip packages)

- **Lines**: 663
- **Exports**: `PackageAlert` (L67, component)
- **Purpose**: Missing/installing package banner with version selection, extras checkbox, and micropackage support
- **Deps**: `@/core/alerts/state`, `@/core/config/config`, `@/core/kernel/messages`, `@/core/network/requests`, `@/core/wasm/utils`, `@/hooks/usePackageMetadata`
- **Main exports**:
  - `PackageAlert` (L67-L200): Main alert container
  - `MissingPackageAlert` (~L200-L450): Individual missing package row with install action
  - `InstallingPackageAlert` (~L450-L550): Installing package progress display
  - `MicropackageAlert` (~L550-L663): Micropackage version selection

### ❌ REMOVE — renderMimeIcon.tsx (reason: Python output mime type icons, not applicable to VT's output model)

- **Lines**: 41
- **Exports**: `renderMimeIcon` (L2, function)
- **Purpose**: Maps mime types to emoji icons for output type indicators

### ❌ REMOVE — stdin-blocking-alert.tsx (reason: Python stdin blocking, VT has no stdin interaction)

- **Lines**: 84
- **Exports**: `StdinBlockingAlert` (L32, component)
- **Purpose**: Floating alert when program is blocked on stdin, with jump-to-cell action
- **Deps**: `@/core/cells/cells`, `@/utils/Logger`

---

## **tests**/

### ❌ REMOVE — **tests**/Output.test.tsx (reason: tests for removed/adapted Output component, rewrite needed if Output.tsx is adapted)

- **Lines**: ~58
- **Purpose**: Tests for Output component rendering

### ⚠️ ADAPT — **tests**/data-attributes.test.tsx (reason: tests for common.ts cellDomProps, update for string IDs)

- **Lines**: ~163
- **Purpose**: Tests for cell data attribute generation (cellDomProps)

### ❌ REMOVE — **tests**/dynamic-favicon.test.tsx (reason: tests for removed DynamicFavicon)

- **Lines**: ~141
- **Purpose**: Tests for DynamicFavicon component state transitions

---

## actions/

### ✅ KEEP — actions/name-cell-input.tsx

- **Lines**: 159
- **Exports**: `NameCellInput` (L25, component), `NameCellContentEditable` (L67, component)
- **Purpose**: Cell name editing input with validation and contenteditable variant
- **Deps**: `@/core/cells/cells`, `@/core/cells/ids`, `@/core/cells/names`

### ⚠️ ADAPT — actions/types.ts (reason: hotkey system may differ in VT)

- **Lines**: 57
- **Exports**: `ActionButton` (L8, interface), `isParentAction` (L32, function), `flattenActions` (L42, function)
- **Purpose**: Shared action button type system with parent/child grouping support
- **Deps**: `@/core/hotkeys/hotkeys`

### 🔄 ALREADY — actions/useCellActionButton.tsx (reason: already migrated as use-cell-action-buttons.tsx in Batch 2)

- **Lines**: 448
- **Exports**: `CellActionButtonProps` (L65, type), `useCellActionButtons` (L79, hook)
- **Purpose**: Comprehensive cell action menu builder: run, AI refactor, split, format, hide code, disable, convert language, movement, export, naming, delete
- **Deps**: `@/core/ai/state`, `@/core/cells/cells`, `@/core/cells/ids`, `@/core/codemirror/format`, `@/core/codemirror/language/commands`, `@/core/config/config`, `@/core/mode`, `@/core/network/requests`, `@/core/network/types`

### ❌ REMOVE — actions/useConfigActions.tsx (reason: marimo config actions — width/theme/keymap/copilot, VT has own settings)

- **Lines**: 172
- **Exports**: `useConfigActions` (L9, hook)
- **Purpose**: Config-related actions: width, theme, keymap, copilot, reference highlighting, cell output position
- **Deps**: `@/core/config/config`, `@/core/config/config-schema`, `@/core/config/widths`, `@/core/network/requests`

### ❌ REMOVE — actions/useCopyNotebook.tsx (reason: copy notebook via network request to Python backend)

- **Lines**: 42
- **Exports**: `useCopyNotebook` (L7, hook)
- **Purpose**: Copy notebook to new filename via network request
- **Deps**: `@/core/network/requests`, `@/utils/links`, `@/utils/paths`

### ❌ REMOVE — actions/useHideAllMarkdownCode.ts (reason: batch hide markdown code via kernel requests)

- **Lines**: 54
- **Exports**: `useHideAllMarkdownCode` (L10, hook)
- **Purpose**: Batch hide/show code for all markdown cells
- **Deps**: `@/core/cells/cells`, `@/core/cells/ids`, `@/core/codemirror/language/languages/markdown`, `@/core/network/requests`, `@/core/network/types`

### ❌ REMOVE — actions/useNotebookActions.tsx (reason: heavily depends on Python kernel — download/share/HTML export/restart/WASM)

- **Lines**: 574
- **Exports**: `useNotebookActions` (L101, hook)
- **Purpose**: Full notebook-level actions: download (HTML/MD/Python/PNG/PDF), share, panels, present, duplicate, clipboard, enable all, add setup/database cell, undo delete, restart, run all, clear outputs, hide markdown, collapse/expand, command palette, keyboard shortcuts, settings, resources, home, new notebook
- **Deps**: extensive — `@/core/cells/cells`, `@/core/codemirror/language/*`, `@/core/config/config`, `@/core/dom/htmlEncoder`, `@/core/dom/marimo-tag`, `@/core/islands/utils`, `@/core/layout/types`, `@/core/network/requests`, `@/core/saving/save-component`, `@/core/static/download-html`, `@/core/wasm/utils`, plus many more

### ❌ REMOVE — actions/useRestartKernel.tsx (reason: Python kernel restart, VT has no kernel)

- **Lines**: 37
- **Exports**: `useRestartKernel` (L8, hook)
- **Purpose**: Kernel restart with confirmation dialog
- **Deps**: `@/core/network/connection`, `@/core/network/requests`, `@/core/websocket/types`

---

## ai/

### ❌ REMOVE — ai/add-cell-with-ai.tsx (reason: AI cell generation tightly coupled to marimo kernel, VT may build own AI features later)

- **Lines**: ~442
- **Exports**: `AddCellWithAI` (L91, component), `AdditionalCompletions` (L315, component), `PromptInput` (L340, component)
- **Purpose**: AI cell generation UI with language dropdown, file attachments, CodeMirror prompt input, and @-mention completions
- **Deps**: `@/core/ai/state`, `@/core/cells/cells`, `@/core/cells/ids`, `@/core/codemirror/language/LanguageAdapters`, `@/core/config/config`, `@/core/network/requests`, `@/utils/cn`

### ❌ REMOVE — ai/ai-completion-editor.tsx (reason: AI merge view tightly coupled to marimo AI state)

- **Lines**: ~446
- **Exports**: `AiCompletionEditor` (L76, component)
- **Purpose**: CodeMirror merge view for AI completions showing diff between original and AI-suggested code
- **Deps**: `@/core/ai/state`, `@/core/cells/cells`, `@/core/codemirror/cm`, `@/core/codemirror/language/utils`, `@/theme/useTheme`

### ❌ REMOVE — ai/completion-handlers.tsx (reason: AI completion accept/reject tightly coupled to marimo state)

- **Lines**: ~171
- **Exports**: `createAiCompletionOnKeydown` (L13, function), `CompletionActionsCellFooter` (L44, component), `AcceptCompletionButton` (L65, component), `RejectCompletionButton` (L152, component)
- **Purpose**: Keyboard handlers and UI buttons for accepting/rejecting AI completions
- **Deps**: `@/core/ai/state`, `@/core/cells/cells`, `@/core/cells/ids`

### ❌ REMOVE — ai/completion-utils.ts (reason: AI completion utilities coupled to marimo kernel)

- **Lines**: ~213
- **Exports**: `CONTEXT_TRIGGER` (L18, const), `getAICompletionBody` (L32, function), `getAICompletionBodyWithAttachments` (L56, function), `mentionsCompletionSource` (L106, function), `addContextCompletion` (L127, function), `AiCompletion` (L150, interface), `codeToCells` (L160, function)
- **Purpose**: AI completion utilities — request body builders, @-mention completion source for CodeMirror, cell code splitter
- **Deps**: `@/core/ai/state`, `@/core/cells/cells`, `@/core/codemirror/language/utils`

### ❌ REMOVE — ai/merge-editor.css (reason: styles for removed AI merge editor)

- **Lines**: 8
- **Purpose**: Styles for AI merge editor (`.cm-mergeView` overrides)

### ❌ REMOVE — ai/transport/chat-transport.tsx (reason: AI transport layer coupled to marimo backend)

- **Lines**: ~35
- **Exports**: `StreamingChunkTransport` (L13, class)
- **Purpose**: Wrapper around DefaultChatTransport for streaming AI response callbacks

### ❌ REMOVE — ai/**tests**/completion-utils.test.ts (reason: tests for removed AI utilities)

- **Lines**: ~470
- **Purpose**: Tests for AI completion utility functions

---

## alerts/

### ❌ REMOVE — alerts/connecting-alert.tsx (reason: kernel connection status alerts, VT has no Python kernel)

- **Lines**: 93
- **Exports**: `ConnectingAlert` (L21, component), `NotStartedConnectionAlert` (L74, component)
- **Purpose**: Connection status alerts — subtle loading dots → banner escalation, and "not connected" prompt
- **Deps**: `@/components/icons/loading-ellipsis`, `@/components/icons/spinner`, `@/components/ui/button`, `@/components/utils/delay-mount`, `@/core/network/connection`, `@/core/runtime/config`, `@/plugins/impl/common/error-banner`

### ❌ REMOVE — alerts/floating-alert.tsx (reason: kernel alert infrastructure, VT uses own toast/alert system)

- **Lines**: 48
- **Exports**: `FloatingAlert` (L15, component)
- **Purpose**: Reusable floating alert banner with delayed mount and configurable severity
- **Deps**: `@/plugins/impl/common/error-banner`

### ❌ REMOVE — alerts/startup-logs-alert.tsx (reason: Python kernel startup logs)

- **Lines**: 73
- **Exports**: `StartupLogsAlert` (L9, component)
- **Purpose**: Shows startup script logs with auto-dismiss after 5 seconds when done
- **Deps**: `@/core/alerts/state`, `@/plugins/impl/common/error-banner`

### ❌ REMOVE — alerts/stdin-blocking-alert.tsx (reason: duplicate of root stdin-blocking-alert.tsx, Python stdin blocking)

- **Lines**: 84
- **Exports**: `StdinBlockingAlert` (L32, component)
- **Purpose**: Alert when program is blocked on stdin input (duplicate of root stdin-blocking-alert.tsx — same file)
- **Deps**: `@/core/cells/cells`, `@/utils/Logger`

---

## boundary/

### ⚠️ ADAPT — boundary/ErrorBoundary.tsx (reason: useful error boundary, but remove marimo GitHub issue link, use VT error handling)

- **Lines**: 42
- **Exports**: `ErrorBoundary` (L10, component)
- **Purpose**: React error boundary wrapper with fallback UI showing error message and GitHub issue link
- **Deps**: `@/core/constants`

---

## cell/

### 🔄 ALREADY — cell/CellStatus.tsx (reason: already migrated as cell-status.tsx in Batch 1)

- **Lines**: ~347
- **Exports**: `CellStatusComponentProps` (L19, type), `CellStatusComponent` (L32, component), `ElapsedTime` (L305, component), `formatElapsedTime` (L352, function)
- **Purpose**: Cell execution status display (idle, running, queued, disabled) with elapsed time formatting
- **Deps**: `@/components/icons/multi-icon`, `@/utils/Logger`, `@/utils/time`

### ✅ KEEP — cell/CreateCellButton.tsx

- **Lines**: ~166
- **Exports**: `CreateCellButton` (L25, component)
- **Purpose**: Button to create new cells (Python/Markdown/SQL/AI) with keyboard shortcut hints
- **Deps**: `@/components/editor/inputs/Inputs`, `@/components/shortcuts/renderShortcut`, `@/core/cells/add-missing-import`, `@/core/cells/cells`, `@/core/codemirror/language/LanguageAdapters`, `@/core/codemirror/language/languages/markdown`, `@/core/websocket/types`, `@/utils/cn`

### ✅ KEEP — cell/DeleteButton.tsx

- **Lines**: ~53
- **Exports**: `DeleteButton` (L15, component)
- **Purpose**: Cell delete button with disabled states based on runtime and connection
- **Deps**: `@/core/network/types`, `@/core/websocket/types`, `@/utils/cn`, `@/utils/events`

### ✅ KEEP — cell/PendingDeleteConfirmation.tsx

- **Lines**: ~118
- **Exports**: `PendingDeleteConfirmation` (L13, component)
- **Purpose**: Undo confirmation banner shown after cell deletion with timer countdown
- **Deps**: `@/components/editor/cell/CellStatus`, `@/components/editor/links/cell-link`, `@/components/ui/button`, `@/core/cells/ids`, `@/core/cells/pending-delete-service`, `@/utils/cn`

### ✅ KEEP — cell/RunButton.tsx

- **Lines**: ~102
- **Exports**: `RunButton` (L36, component)
- **Purpose**: Cell run button with play/loading states and keyboard shortcut tooltip
- **Deps**: `@/core/network/types`, `@/core/websocket/types`

### ❌ REMOVE — cell/StagedAICell.tsx (reason: AI staged cell UI, coupled to marimo AI state)

- **Lines**: ~107
- **Exports**: `StagedAICellBackground` (L17, component), `StagedAICellFooter` (L36, component), `acceptStagedCell` (L72, function), `rejectStagedCell` (L92, function)
- **Purpose**: UI for staged AI-generated cell content with accept/reject actions
- **Deps**: `@/core/cells/cells`, `@/core/cells/ids`, `@/core/codemirror/language/utils`, `@/utils/cn`, `@/utils/Logger`

### ✅ KEEP — cell/StopButton.tsx

- **Lines**: ~32
- **Exports**: `StopButton` (L13, component)
- **Purpose**: Cell execution stop/interrupt button
- **Deps**: `@/core/network/requests`, `@/core/network/types`, `@/core/websocket/connection-utils`, `@/core/websocket/types`, `@/utils/functions`

### ⚠️ ADAPT — cell/TinyCode.tsx (reason: useful for collapsed cell preview, adapt theme hook to VT)

- **Lines**: ~46
- **Exports**: `TinyCode` (L29, component)
- **Purpose**: Miniature read-only code preview using CodeMirror (used in collapsed cells)
- **Deps**: `@/theme/useTheme`, `@/utils/cn`

### 🔄 ALREADY — cell/cell-actions.tsx (reason: already migrated as cell-actions-dropdown.tsx in Batch 2)

- **Lines**: ~207
- **Exports**: `CellActionsDropdownHandle` (L54, component), `CellActionsDropdown` (L204, component), `ConnectionCellActionsDropdown` (L208, component)
- **Purpose**: Dropdown menu for cell actions (run, format, copy, delete, etc.) with connection-aware variant
- **Deps**: `@/components/data-table/cell-utils`, `@/components/ui/use-restore-focus`, `@/core/cells/focus`, `@/core/cells/ids`, `@/utils/cn`

### 🔄 ALREADY — cell/cell-context-menu.tsx (reason: already migrated in Batch 2)

- **Lines**: ~255
- **Exports**: `CellActionsContextMenu` (L41, component)
- **Purpose**: Right-click context menu for cells with copy, paste, go-to-definition, send-to-panel actions
- **Deps**: `@/components/shortcuts/renderShortcut`, `@/components/ui/menu-items`, `@/components/ui/tooltip`, `@/components/ui/use-toast`, `@/core/cells/cells`, `@/core/cells/ids`, `@/core/cells/outputs`, `@/core/codemirror/go-to-definition/utils`, `@/core/vscode/vscode-bindings`, `@/utils/copy`, `@/utils/Logger`

### ⚠️ ADAPT — cell/collapse.tsx (reason: cell collapse/expand needed, adapt Jotai atoms to Zustand)

- **Lines**: ~101
- **Exports**: `CollapseToggle` (L27, component), `CollapsedCellBanner` (L61, component)
- **Purpose**: Cell collapse/expand toggle and collapsed state banner showing descendant count
- **Deps**: `@/components/layout/toolbar`, `@/components/ui/button`, `@/components/ui/tooltip`, `@/core/cells/cells`, `@/core/cells/ids`, `@/core/cells/utils`, `@/utils/cn`

### 🔄 ALREADY — cell/toolbar.tsx (reason: already migrated as toolbar-item.tsx in Batch 2)

- **Lines**: ~82
- **Exports**: `ToolbarItem` (L36, component), `Toolbar` (L80, component)
- **Purpose**: Cell toolbar container and individual toolbar item (icon button with tooltip)
- **Deps**: `@/components/ui/tooltip`, `@/utils/cn`, `@/utils/events`

### ⚠️ ADAPT — cell/useAddCell.ts (reason: add-cell logic needed, adapt Jotai atoms and CellId to Zustand/string)

- **Lines**: ~25
- **Exports**: `useAddCodeToNewCell` (L9, hook)
- **Purpose**: Hook to add code to a new cell after the last focused cell
- **Deps**: `@/core/cells/add-missing-import`, `@/core/cells/cells`, `@/core/cells/focus`, `@/core/config/config`

### ⚠️ ADAPT — cell/useDeleteCell.tsx (reason: cell deletion with undo needed, adapt Jotai→Zustand and toast)

- **Lines**: ~79
- **Exports**: `useDeleteCellCallback` (L15, hook), `useDeleteManyCellsCallback` (L55, hook)
- **Purpose**: Cell deletion hooks with undo toast notification
- **Deps**: `@/components/buttons/undo-button`, `@/components/ui/use-toast`, `@/core/cells/ids`, `@/core/network/requests`, `@/core/state/jotai`

### ⚠️ ADAPT — cell/useRunCells.ts (reason: cell execution hooks needed, adapt Jotai→Zustand and remove kernel network calls)

- **Lines**: ~102
- **Exports**: `hasRunAnyCellAtom` (L19, atom), `useRunStaleCells` (L24, hook), `useRunCell` (L33, hook), `useRunAllCells` (L44, hook), `useRunCells` (L53, hook), `runCells` (L74, function)
- **Purpose**: Cell execution hooks — run single, run stale, run all, with language adapter code extraction
- **Deps**: `@/core/cells/ids`, `@/core/cells/utils`, `@/core/codemirror/language/commands`, `@/core/codemirror/language/utils`, `@/core/network/requests`, `@/core/network/types`, `@/utils/Logger`

### ✅ KEEP — cell/useShouldShowInterrupt.ts

- **Lines**: ~23
- **Exports**: `useShouldShowInterrupt` (L10, hook)
- **Purpose**: Hook to determine if interrupt button should show (after cell runs >250ms)

### ⚠️ ADAPT — cell/useSplitCell.tsx (reason: split cell logic needed, adapt Jotai→Zustand and toast)

- **Lines**: ~36
- **Exports**: `useSplitCellCallback` (L10, hook)
- **Purpose**: Split cell at cursor position with undo support
- **Deps**: `@/components/buttons/undo-button`, `@/components/ui/use-toast`, `@/core/cells/cells`, `@/core/cells/ids`, `@/core/codemirror/language/utils`

### ✅ KEEP — cell/code/cell-editor.tsx

- **Lines**: ~529
- **Exports**: `CellEditorProps` (L49, type), `CellEditor` (L565, component)
- **Purpose**: THE MAIN CODE EDITOR. CodeMirror 6 wrapper with completions, AI, RTC, language switching, hotkeys, theme, and pending delete overlay
- **Deps**: `@/components/ui/button`, `@/components/utils/delay-mount`, `@/core/ai/state`, `@/core/cells/add-missing-import`, `@/core/cells/cells`, `@/core/cells/pending-delete-service`, `@/core/cells/types`, `@/core/codemirror/cm`, `@/core/codemirror/language/languages/markdown`, `@/core/codemirror/language/types`, `@/core/config/config`, `@/core/config/config-schema`, `@/core/hotkeys/hotkeys`, `@/core/network/connection`, `@/core/network/requests`, `@/core/rtc/state`, `@/core/saving/save-component`, `@/core/websocket/connection-utils`, `@/theme/useTheme`, `@/utils/cn`, `@/utils/invariant`, `@/utils/mergeRefs`

### ✅ KEEP — cell/code/icons.tsx

- **Lines**: ~28
- **Exports**: `PythonIcon` (L5, component), `MarkdownIcon` (L19, component)
- **Purpose**: Language indicator icons for Python and Markdown

### ⚠️ ADAPT — cell/code/language-toggle.tsx (reason: language switching needed, adapt to VT's supported languages)

- **Lines**: ~130
- **Exports**: `LanguageToggles` (L22, component), `LanguageToggle` (L101, component)
- **Purpose**: Language switching buttons (Python/Markdown/SQL) in cell editor
- **Deps**: `@/components/ui/button`, `@/components/ui/tooltip`, `@/core/codemirror/language/extension`, `@/core/codemirror/language/LanguageAdapters`, `@/core/codemirror/language/types`, `@/utils/functions`

### 🔄 ALREADY — cell/cell-status.css (reason: already migrated as cell-status.css in Batch 1)

- **Lines**: 18
- **Purpose**: Cell status indicator styles (pulse animations, status colors)

### ⚠️ ADAPT — cell/TinyCode.css (reason: styles for TinyCode component, adapt if TinyCode is adapted)

- **Lines**: 9
- **Purpose**: TinyCode component minimal styling

---

## chrome/

### ⚠️ ADAPT — chrome/state.ts (reason: chrome state management needed for lab workspace, convert Jotai→Zustand)

- **Lines**: ~171
- **Exports**: `ChromeState` (L13, type), `PanelLayout` (L24, type), `panelLayoutAtom` (L38, atom), `useChromeState` (L160, hook), `useChromeActions` (L171, hook), `chromeAtom` (L175, atom)
- **Purpose**: Chrome (sidebar/panels/footer) state management with Jotai atoms
- **Deps**: `@/core/cells/cells`, `@/core/config/config-schema`

### ⚠️ ADAPT — chrome/types.ts (reason: panel type registry useful, strip VT-irrelevant panels)

- **Lines**: ~194
- **Exports**: `PanelType` (L28, type), `PanelSection` (L47, type), `PanelDescriptor` (L49, type), `PANELS` (L68, const), `PANEL_MAP` (L182, const), `isPanelHidden` (L190, function)
- **Purpose**: Panel type definitions and registry — maps panel IDs to icons, labels, sections, and visibility rules

### ❌ REMOVE — chrome/panels/cache-panel.tsx (reason: Python kernel cache management)

- **Lines**: ~199
- **Exports**: Cache management panel component
- **Purpose**: Cache inspection and management panel

### ❌ REMOVE — chrome/panels/context-aware-panel/context-aware-panel.tsx (reason: context-aware panel tightly coupled to marimo cell/kernel state)

- **Lines**: ~152
- **Exports**: Context-aware panel component
- **Purpose**: Panel that adapts content based on currently focused cell or selection

### ❌ REMOVE — chrome/panels/context-aware-panel/atoms.ts (reason: atoms for removed context-aware panel)

- **Lines**: ~22
- **Exports**: Context-aware panel atom state
- **Purpose**: Jotai atoms for context-aware panel state

### ❌ REMOVE — chrome/panels/datasources-panel.tsx (reason: Python data sources panel)

- **Lines**: 6
- **Purpose**: Data sources panel (minimal, likely re-exports or placeholder)

### ❌ REMOVE — chrome/panels/dependency-graph-panel.tsx (reason: Python cell dependency graph, VT doesn't have reactive cell deps)

- **Lines**: ~63
- **Exports**: Dependency graph panel component
- **Purpose**: Cell dependency graph visualization panel

### ❌ REMOVE — chrome/panels/documentation-panel.tsx (reason: Python API documentation browser)

- **Lines**: ~26
- **Exports**: Documentation panel component
- **Purpose**: API documentation browser panel

### ⚠️ ADAPT — chrome/panels/empty-state.tsx (reason: generic empty panel state, useful but trivial to rewrite)

- **Lines**: ~28
- **Exports**: Empty state component for panels
- **Purpose**: Placeholder shown when panel has no content

### ❌ REMOVE — chrome/panels/error-panel.tsx (reason: Python kernel error panel)

- **Lines**: ~32
- **Exports**: Error panel component
- **Purpose**: Error list/display panel

### ❌ REMOVE — chrome/panels/file-explorer-panel.tsx (reason: Python file explorer, VT doesn't manage Python files)

- **Lines**: ~33
- **Exports**: File explorer panel wrapper
- **Purpose**: Wraps file-tree/FileExplorer for chrome panel context

### ❌ REMOVE — chrome/panels/logs-panel.tsx (reason: Python kernel runtime logs)

- **Lines**: ~86
- **Exports**: Logs panel component
- **Purpose**: Runtime log viewer panel

### ✅ KEEP — chrome/panels/outline-panel.tsx

- **Lines**: ~35
- **Exports**: Outline panel component
- **Purpose**: Notebook outline/table-of-contents panel

### ✅ KEEP — chrome/panels/outline-panel.css

- **Lines**: 5
- **Purpose**: Outline panel styles

### ✅ KEEP — chrome/panels/outline/floating-outline.tsx

- **Lines**: ~121
- **Exports**: Floating outline component
- **Purpose**: Floating/popover outline navigation

### ⚠️ ADAPT — chrome/panels/outline/useActiveOutline.tsx (reason: useful scroll-tracking, adapt Jotai→Zustand)

- **Lines**: ~151
- **Exports**: `useActiveOutline` hook
- **Purpose**: Tracks which outline item is currently active based on scroll position

### ❌ REMOVE — chrome/panels/packages-panel.tsx (reason: Python pip package manager)

- **Lines**: ~613
- **Exports**: Packages panel component
- **Purpose**: Package manager panel — install, uninstall, search packages with version selection
- **Main exports**:
  - Package list view (~L1-L200)
  - Package search/install (~L200-L400)
  - Package detail (~L400-L613)

### ❌ REMOVE — chrome/panels/packages-utils.ts (reason: helper for removed packages panel)

- **Lines**: ~21
- **Exports**: Package utility functions
- **Purpose**: Helper functions for package management

### ⚠️ ADAPT — chrome/panels/panel-context.tsx (reason: panel context pattern useful, adapt for VT's chrome)

- **Lines**: ~28
- **Exports**: Panel context provider and hook
- **Purpose**: React context for sharing panel state/actions

### ❌ REMOVE — chrome/panels/scratchpad-panel.tsx (reason: scratchpad cell, minimal and not needed in VT)

- **Lines**: 7
- **Exports**: Scratchpad panel component
- **Purpose**: Scratchpad/scratch cell panel (minimal)

### ❌ REMOVE — chrome/panels/secrets-panel.tsx (reason: Python environment secrets manager)

- **Lines**: ~155
- **Exports**: Secrets panel component
- **Purpose**: Environment secrets manager panel

### ❌ REMOVE — chrome/panels/session-panel.tsx (reason: Python kernel session management)

- **Lines**: ~101
- **Exports**: Session panel component
- **Purpose**: Active session information and management panel

### ❌ REMOVE — chrome/panels/snippets-panel.tsx (reason: Python code snippets, VT may build own snippets later)

- **Lines**: ~230
- **Exports**: Snippets panel component
- **Purpose**: Code snippets browser with search and insert

### ❌ REMOVE — chrome/panels/snippets-panel.css (reason: styles for removed snippets panel)

- **Lines**: 10
- **Purpose**: Snippets panel styling

### ❌ REMOVE — chrome/panels/tracing-panel.tsx (reason: Python execution tracing/profiling)

- **Lines**: ~25
- **Exports**: Tracing panel component
- **Purpose**: Execution tracing/profiling panel

### ❌ REMOVE — chrome/panels/variable-panel.tsx (reason: Python variable inspector)

- **Lines**: ~28
- **Exports**: Variable panel component
- **Purpose**: Variable inspector panel

### ❌ REMOVE — chrome/panels/write-secret-modal.tsx (reason: Python environment secrets modal)

- **Lines**: ~182
- **Exports**: Write secret modal component
- **Purpose**: Modal dialog for creating/editing environment secrets

### ❌ REMOVE — chrome/panels/**tests**/write-secret-modal.test.ts (reason: tests for removed secrets modal)

- **Lines**: ~35
- **Purpose**: Tests for write secret modal

### ❌ REMOVE — chrome/components/feedback-button.tsx (reason: marimo-specific user feedback)

- **Lines**: ~99
- **Exports**: Feedback button component
- **Purpose**: User feedback submission button

### ❌ REMOVE — chrome/components/contribute-snippet-button.tsx (reason: marimo community snippet contribution)

- **Lines**: ~53
- **Exports**: Contribute snippet button component
- **Purpose**: Button to contribute code snippets to community

### 🔄 ALREADY — chrome/wrapper/app-chrome.tsx (reason: already migrated as lab-chrome.tsx in Batch 1)

- **Lines**: ~530
- **Exports**: `AppChrome` (L74, component)
- **Purpose**: THE MAIN CHROME WRAPPER. Orchestrates sidebar, footer, panel layout, resizing, drag-to-resize, and panel visibility
- **Main exports**:
  - `AppChrome` (L74-L200): Main chrome layout container
  - Sidebar panel rendering (~L200-L350)
  - Panel resize handling (~L350-L450)
  - Footer integration (~L450-L530)

### 🔄 ALREADY — chrome/wrapper/app-chrome.css (reason: already migrated as app-chrome.css in Batch 1)

- **Lines**: 19
- **Purpose**: App chrome layout and resize handle styles

### ❌ REMOVE — chrome/wrapper/footer.tsx (reason: marimo footer status bar with kernel/LSP/RTC status)

- **Lines**: ~107
- **Exports**: `Footer` (L25, component)
- **Purpose**: Bottom status bar with footer items (runtime status, language server, RTC, machine stats)

### ❌ REMOVE — chrome/wrapper/footer-item.tsx (reason: footer item component for removed footer)

- **Lines**: ~37
- **Exports**: `FooterItem` (L13, component)
- **Purpose**: Individual footer status bar item

### ❌ REMOVE — chrome/wrapper/minimap-state.ts (reason: notebook minimap scrollbar, not needed in VT)

- **Lines**: ~143
- **Exports**: Minimap state atoms and hooks
- **Purpose**: Notebook minimap scrollbar state management

### ❌ REMOVE — chrome/wrapper/panels.tsx (reason: thin wrapper, trivial to recreate if needed)

- **Lines**: 9
- **Exports**: `PanelsWrapper` (L4, component)
- **Purpose**: Thin wrapper for rendering panels container

### ❌ REMOVE — chrome/wrapper/pending-ai-cells.tsx (reason: marimo AI pending cell generation)

- **Lines**: ~94
- **Exports**: `PendingAICells` (L19, component)
- **Purpose**: Displays pending AI cell generation requests in sidebar

### ❌ REMOVE — chrome/wrapper/sidebar.tsx (reason: marimo sidebar with kernel-specific panels, VT has own sidebar)

- **Lines**: ~214
- **Exports**: `Sidebar` (L25, component)
- **Purpose**: Chrome sidebar with panel icon buttons and active panel content

### ❌ REMOVE — chrome/wrapper/storage.ts (reason: marimo chrome state localStorage persistence, VT has own storage)

- **Lines**: ~51
- **Exports**: `storageFn` and related storage utilities
- **Purpose**: Chrome panel state persistence to localStorage

### ❌ REMOVE — chrome/wrapper/useAiPanel.ts (reason: marimo AI panel state)

- **Lines**: ~14
- **Exports**: `useAiPanel` hook
- **Purpose**: Hook for AI panel open/close state

### ❌ REMOVE — chrome/wrapper/useDependencyPanelTab.ts (reason: Python cell dependency panel)

- **Lines**: ~12
- **Exports**: `useDependencyPanelTab` hook
- **Purpose**: Hook for dependency panel tab switching

### ❌ REMOVE — chrome/wrapper/utils.ts (reason: chrome utilities for removed features)

- **Lines**: 7
- **Purpose**: Chrome utility functions

### ❌ REMOVE — chrome/wrapper/footer-items/ai-status.tsx (reason: marimo AI service status)

- **Lines**: ~43
- **Exports**: AI status footer item
- **Purpose**: AI service connection status indicator

### ❌ REMOVE — chrome/wrapper/footer-items/backend-status.tsx (reason: Python kernel connection status)

- **Lines**: ~137
- **Exports**: Backend status footer item
- **Purpose**: Backend kernel connection status with reconnect action

### ❌ REMOVE — chrome/wrapper/footer-items/copilot-status.tsx (reason: GitHub Copilot integration)

- **Lines**: ~140
- **Exports**: Copilot status footer item
- **Purpose**: GitHub Copilot connection status indicator

### ❌ REMOVE — chrome/wrapper/footer-items/lsp-status.tsx (reason: Python LSP connection status)

- **Lines**: ~159
- **Exports**: LSP status footer item
- **Purpose**: Language Server Protocol connection status

### ❌ REMOVE — chrome/wrapper/footer-items/machine-stats.tsx (reason: kernel machine CPU/memory stats)

- **Lines**: ~183
- **Exports**: Machine stats footer item
- **Purpose**: CPU/memory usage display in footer

### ❌ REMOVE — chrome/wrapper/footer-items/rtc-status.tsx (reason: real-time collaboration status)

- **Lines**: ~59
- **Exports**: RTC status footer item
- **Purpose**: Real-time collaboration connection status

### ❌ REMOVE — chrome/wrapper/footer-items/runtime-settings.tsx (reason: Python kernel runtime configuration)

- **Lines**: ~257
- **Exports**: Runtime settings footer item
- **Purpose**: Runtime configuration panel (auto-run, stale mode, on-cell-change behavior)

### ❌ REMOVE — chrome/wrapper/**tests**/minimap-state.test.ts (reason: tests for removed minimap)

- **Lines**: ~199
- **Purpose**: Tests for minimap state management

### ❌ REMOVE — chrome/wrapper/**tests**/storage.test.ts (reason: tests for removed chrome storage)

- **Lines**: ~32
- **Purpose**: Tests for chrome storage persistence

---

## code/

### ❌ REMOVE — code/readonly-diff.tsx (reason: read-only diff view, VT doesn't need run-mode renderers)

- **Lines**: ~50
- **Exports**: `ReadonlyDiff` (L8, component)
- **Purpose**: Read-only code diff viewer using CodeMirror merge view

### ❌ REMOVE — code/readonly-python-code.tsx (reason: read-only Python code display for run mode)

- **Lines**: ~149
- **Exports**: `ReadonlyCode` (L36, component), `HideCodeButton` (L127, component)
- **Purpose**: Read-only Python code display with syntax highlighting and hide-code toggle

---

## columns/

### ⚠️ ADAPT — columns/cell-column.tsx (reason: multi-column layout useful, adapt for VT's cell system)

- **Lines**: ~94
- **Exports**: `Column` (L24, component)
- **Purpose**: Single column container for multi-column notebook layout

### ⚠️ ADAPT — columns/sortable-column.tsx (reason: sortable columns useful, adapt dnd-kit integration)

- **Lines**: ~165
- **Exports**: `SortableColumn` (L175, component)
- **Purpose**: Sortable/draggable column for multi-column layout with dnd-kit

### ❌ REMOVE — columns/storage.ts (reason: column persistence to localStorage, VT has own storage approach)

- **Lines**: ~49
- **Exports**: `storageFn` (L27, function), `reorderColumnSizes` (L52, function)
- **Purpose**: Column size persistence and reordering utilities

### ❌ REMOVE — columns/**tests**/storage.test.ts (reason: tests for removed column storage)

- **Lines**: ~82
- **Purpose**: Tests for column storage and reordering logic

---

## controls/

### ⚠️ ADAPT — controls/Controls.tsx (reason: top control panel pattern useful, strip kernel-specific buttons)

- **Lines**: ~200
- **Exports**: `Controls` (L50, component)
- **Purpose**: Top-right control panel with run-all, command palette, notebook menu, shutdown buttons

### ⚠️ ADAPT — controls/command-palette.tsx (reason: command palette useful for VT lab, adapt actions list)

- **Lines**: ~201
- **Exports**: default export (L211, component — command palette modal)
- **Purpose**: Command palette (Cmd+K) with fuzzy search over all notebook and config actions

### ⚠️ ADAPT — controls/command-palette-button.tsx (reason: button trigger for command palette)

- **Lines**: ~24
- **Exports**: `CommandPaletteButton` (L11, component)
- **Purpose**: Button to open command palette

### ❌ REMOVE — controls/duplicate-shortcut-banner.tsx (reason: niche warning for duplicate shortcuts, VT handles shortcuts differently)

- **Lines**: ~46
- **Exports**: `DuplicateShortcutBanner` (L16, component)
- **Purpose**: Warning banner when duplicate keyboard shortcuts are detected

### ⚠️ ADAPT — controls/keyboard-shortcuts.tsx (reason: keyboard shortcuts dialog useful, adapt to VT's shortcut set)

- **Lines**: ~299
- **Exports**: `keyboardShortcutsAtom` (L31, atom), `KeyboardShortcuts` (L33, component)
- **Purpose**: Keyboard shortcuts dialog showing all available shortcuts organized by category

### ❌ REMOVE — controls/notebook-menu-dropdown.tsx (reason: marimo notebook file operations — download/share/export, heavily kernel-dependent)

- **Lines**: ~148
- **Exports**: `NotebookMenuDropdown` (L32, component)
- **Purpose**: Notebook-level dropdown menu (file operations, export, share, settings)

### ❌ REMOVE — controls/shutdown-button.tsx (reason: Python kernel shutdown)

- **Lines**: ~65
- **Exports**: `ShutdownButton` (L17, component)
- **Purpose**: Kernel shutdown button with confirmation

### ❌ REMOVE — controls/state.ts (reason: command palette atom, will be rebuilt if command palette is adapted)

- **Lines**: 3
- **Exports**: `commandPaletteAtom` (L4, atom)
- **Purpose**: Command palette open/close state atom

---

## database/

### ❌ REMOVE — database/as-code.ts (reason: Python database connection code generation)

- **Lines**: ~825
- **Exports**: `ConnectionLibrary` (L8, enum), `ConnectionDisplayNames` (L20, const), `generateDatabaseCode` (L855, function)
- **Purpose**: Generates Python code for database connections (Postgres, MySQL, SQLite, DuckDB, BigQuery, Snowflake, MariaDB, ClickHouse, Trino, Chroma, Turso)
- **Main exports**:
  - `ConnectionLibrary` (L8): Enum of supported database libraries
  - `ConnectionDisplayNames` (L20): Human-readable library names
  - `generateDatabaseCode` (L855): Main code generation function per library type

### ❌ REMOVE — database/schemas.ts (reason: Python database connection form schemas)

- **Lines**: ~503
- **Exports**: 15+ Zod connection schemas (PostgresConnectionSchema, MySQLConnectionSchema, SQLiteConnectionSchema, DuckDBConnectionSchema, BigQueryConnectionSchema, SnowflakeConnectionSchema, etc.)
- **Purpose**: Zod validation schemas for all database connection form fields

### ❌ REMOVE — database/secrets.ts (reason: Python environment secret handling for database forms)

- **Lines**: ~19
- **Exports**: `SecretPlaceholder` (const), `displaySecret` (function), `isSecret` (function), `prefixSecret` (function), `unprefixSecret` (function)
- **Purpose**: Secret value handling utilities for database connection forms

### ❌ REMOVE — database/add-database-form.tsx (reason: Python database connection dialog)

- **Lines**: ~400
- **Exports**: `AddDatabaseDialog` (L389, component), `AddDatabaseDialogContent` (L402, component)
- **Purpose**: Multi-step database connection dialog with library selection, form fields, and code preview

### ❌ REMOVE — database/form-renderers.tsx (reason: Python database form renderers)

- **Lines**: ~198
- **Exports**: `useSecrets` (L55, hook), `SecretsProvider` (L61, component), `ENV_RENDERER` (L95, const)
- **Purpose**: Form field renderers for database connection forms with environment variable/secret integration

### ❌ REMOVE — database/**tests**/as-code.test.ts (reason: tests for removed database code generation)

- **Lines**: ~635
- **Purpose**: Tests for database code generation

### ❌ REMOVE — database/**tests**/secrets.test.ts (reason: tests for removed secret handling)

- **Lines**: ~34
- **Purpose**: Tests for secret handling utilities

### ❌ REMOVE — database/**tests**/**snapshots**/as-code.test.ts.snap (reason: snapshots for removed database tests)

- **Lines**: ~600
- **Purpose**: Snapshot tests for generated database code

---

## errors/

### ❌ REMOVE — errors/fix-mode.ts (reason: marimo auto-fix mode tied to kernel error handling)

- **Lines**: ~15
- **Exports**: `FixMode` (L7, type), `useFixMode` (L17, hook)
- **Purpose**: Fix mode state (auto-fix vs manual) as Jotai atom

### ❌ REMOVE — errors/auto-fix.tsx (reason: auto-fix and AI fix buttons tied to Python kernel)

- **Lines**: ~165
- **Exports**: `AutoFixButton` (L22, component), `AIFixButton` (L101, component)
- **Purpose**: Auto-fix and AI-assisted fix buttons for cell errors

### ❌ REMOVE — errors/sql-validation-errors.tsx (reason: SQL validation tied to marimo kernel)

- **Lines**: ~35
- **Exports**: `SqlValidationErrorBanner` (L7, component)
- **Purpose**: SQL validation error display banner

---

## file-tree/

### ❌ REMOVE — file-tree/file-explorer.tsx (reason: Python file system explorer, VT doesn't browse Python project files)

- **Lines**: ~709
- **Exports**: `FileExplorer` (L87, component), `filterHiddenTree` (L725, function), `isDirectoryOrFileHidden` (L750, function)
- **Purpose**: Full file explorer with tree view, context menu, rename, delete, create, upload actions
- **Main exports**:
  - `FileExplorer` (L87-L700): Main tree component with toolbar and search
  - `filterHiddenTree` (L725): Filters hidden files from tree
  - `isDirectoryOrFileHidden` (L750): Checks if path matches hidden patterns

### ❌ REMOVE — file-tree/file-viewer.tsx (reason: Python file viewer)

- **Lines**: ~291
- **Exports**: `FileViewer` (L48, component)
- **Purpose**: File content viewer dispatching by type (CSV, image, audio, video, PDF, code, markdown)

### ❌ REMOVE — file-tree/requesting-tree.tsx (reason: lazy-loading file tree for Python backend)

- **Lines**: ~209
- **Exports**: `RequestingTree` (L14, component)
- **Purpose**: Tree view with lazy loading and request-based expansion

### ❌ REMOVE — file-tree/renderers.tsx (reason: file type viewers for Python file explorer)

- **Lines**: ~76
- **Exports**: `CsvViewer` (L18, component), `ImageViewer` (L51, component), `AudioViewer` (L58, component), `VideoViewer` (L65, component), `PdfViewer` (L72, component)
- **Purpose**: File type-specific viewer components

### ❌ REMOVE — file-tree/state.tsx (reason: file tree Jotai state for Python backend)

- **Lines**: ~22
- **Exports**: `treeAtom` (L11, atom), `openStateAtom` (L22, atom), `refreshRoot` (L24, function)
- **Purpose**: File tree state atoms (tree data, open/closed folders)

### ❌ REMOVE — file-tree/types.ts (reason: file type detection for Python file explorer)

- **Lines**: ~113
- **Exports**: `FileType` (L17, type), `guessFileType` (L31, function), `FILE_TYPE_ICONS` (L84, const), `PYTHON_CODE_FOR_FILE_TYPE` (L101, const)
- **Purpose**: File type detection, icon mapping, and Python code generation for file types

### ❌ REMOVE — file-tree/dnd-wrapper.tsx (reason: drag-and-drop for Python file tree)

- **Lines**: ~50
- **Exports**: `useTreeDndManager` (L15, hook), `TreeDndProvider` (L41, component)
- **Purpose**: Drag-and-drop wrapper for file tree operations

### ❌ REMOVE — file-tree/upload.tsx (reason: file upload for Python backend)

- **Lines**: ~116
- **Exports**: `useFileExplorerUpload` (L14, hook)
- **Purpose**: File upload hook for file explorer (drag-drop and button upload)

### ❌ REMOVE — file-tree/**tests**/requesting-tree.test.ts (reason: tests for removed file tree)

- **Lines**: ~290
- **Purpose**: Tests for requesting tree component

### ❌ REMOVE — file-tree/**tests**/file-expolorer.test.ts (reason: tests for removed file explorer)

- **Lines**: ~149
- **Purpose**: Tests for file explorer component (note: filename has typo "expolorer")

---

## header/

### ❌ REMOVE — header/app-header.tsx (reason: marimo app header with filename/status, VT has own layout)

- **Lines**: ~25
- **Exports**: `AppHeader` (L12, component)
- **Purpose**: Top header bar with filename and status indicator

### ❌ REMOVE — header/filename-form.tsx (reason: marimo notebook filename editing)

- **Lines**: ~36
- **Exports**: `FilenameForm` (L9, component)
- **Purpose**: Filename editing form wrapper

### ❌ REMOVE — header/filename-input.tsx (reason: marimo notebook filename input)

- **Lines**: ~216
- **Exports**: `FilenameInput` (L34, component)
- **Purpose**: Editable filename input with file extension handling and save indicator

### ❌ REMOVE — header/status.tsx (reason: marimo save/connection status overlay)

- **Lines**: ~64
- **Exports**: `StatusOverlay` (L12, component)
- **Purpose**: Status overlay showing save state, connection state, and loading indicators

### ❌ REMOVE — header/filename-input.css (reason: styles for removed filename input)

- **Lines**: 17
- **Purpose**: Filename input styling

### ❌ REMOVE — header/**tests**/filename-form.test.tsx (reason: tests for removed filename form)

- **Lines**: ~97
- **Purpose**: Tests for filename form component

---

## inputs/

### ❌ REMOVE — inputs/Inputs.tsx (reason: legacy pre-shadcn styled inputs, VT uses shadcn ui components)

- **Lines**: ~30
- **Exports**: `Button` (L10, component), `Input` (L27, component)
- **Purpose**: Legacy styled button and input components (pre-shadcn)

### ❌ REMOVE — inputs/Inputs.styles.ts (reason: CSS-in-JS for removed legacy inputs)

- **Lines**: ~62
- **Exports**: `button` (L5, style object), `input` (L64, style object)
- **Purpose**: CSS-in-JS style definitions for legacy inputs

### ❌ REMOVE — inputs/Inputs.css (reason: styles for removed legacy inputs)

- **Lines**: ~95
- **Purpose**: Legacy input component styles

---

## links/

### ❌ REMOVE — links/cell-link.tsx (reason: VT doesn't use marimo:// cell links or cross-cell reference navigation)

- **Lines**: ~113
- **Exports**: `CellLink` (L23, component), `CellLinkError` (L62, component), `CellLinkTraceback` (L69, component), `scrollAndHighlightCell` (L93, function)
- **Purpose**: Clickable cell references that scroll-to and highlight target cells

### ❌ REMOVE — links/cell-link-list.tsx (reason: cell link lists for error tracebacks, VT doesn't use marimo links)

- **Lines**: ~69
- **Exports**: `CellLinkList` (L20, component)
- **Purpose**: List of cell links (used in error tracebacks and dependency views)

---

## navigation/

### ✅ KEEP — navigation/navigation.ts

- **Lines**: ~707
- **Exports**: `useCellNavigationProps` (L168, hook), `useCellEditorNavigationProps` (L657, hook), `closeSignatureHelp` (L764, function)
- **Purpose**: Keyboard navigation between cells (up/down/enter/escape), focus management, and signature help integration
- **Main exports**:
  - `useCellNavigationProps` (L168): Cell-level keyboard navigation
  - `useCellEditorNavigationProps` (L657): Editor-level keyboard navigation with CodeMirror integration

### ⚠️ ADAPT — navigation/selection.ts (reason: multi-cell selection needed, convert Jotai→Zustand)

- **Lines**: ~103
- **Exports**: `CellSelectionState` (L8, type), `useCellSelectionState` (L88, hook), `useIsCellSelected` (L90, hook), `useCellSelectionActions` (L101, hook), `getSelectedCells` (L105, function)
- **Purpose**: Multi-cell selection state management (shift+click, ctrl+click)

### ❌ REMOVE — navigation/state.ts (reason: temporarily shown code state for hidden markdown code, not needed in VT)

- **Lines**: ~56
- **Exports**: `useTemporarilyShownCode` (L60, hook), `temporarilyShownCodeAtom` (atom), `useTemporarilyShownCodeActions` (L65, hook)
- **Purpose**: Temporarily shown code state (hover to reveal hidden code)

### ⚠️ ADAPT — navigation/clipboard.ts (reason: cell clipboard ops needed, convert Jotai→Zustand)

- **Lines**: ~174
- **Exports**: `useCellClipboard` (L36, hook)
- **Purpose**: Cell-level clipboard operations (cut, copy, paste cells)

### ✅ KEEP — navigation/focus-utils.ts

- **Lines**: ~51
- **Exports**: `focusCellEditor` (L8, function), `focusCell` (L22, function), `raf2` (L35, function), `isAnyCellFocused` (L44, function), `tryFocus` (L51, function)
- **Purpose**: DOM focus utilities for cell and editor elements

### ❌ REMOVE — navigation/vim-bindings.ts (reason: Vim mode keybindings, VT doesn't support vim mode)

- **Lines**: ~77
- **Exports**: `handleVimKeybinding` (L23, function)
- **Purpose**: Vim mode keybinding handler for cell navigation

### ⚠️ ADAPT — navigation/multi-cell-action-toolbar.tsx (reason: multi-select toolbar useful, adapt Jotai→Zustand and strip kernel actions)

- **Lines**: ~467
- **Exports**: `useMultiCellActionButtons` (L114, hook), `MultiCellActionToolbar` (L339, component)
- **Purpose**: Floating toolbar for multi-cell selection actions (run, delete, merge, copy, format)

### ❌ REMOVE — navigation/vim-bindings.test.ts (reason: tests for removed vim bindings)

- **Lines**: ~96
- **Purpose**: Tests for vim keybinding handler

### ✅ KEEP — navigation/**tests**/navigation.test.ts

- **Lines**: ~1506
- **Purpose**: Comprehensive tests for cell navigation

### ⚠️ ADAPT — navigation/**tests**/selection.test.ts (reason: tests for adapted selection module)

- **Lines**: ~155
- **Purpose**: Tests for multi-cell selection

### ⚠️ ADAPT — navigation/**tests**/clipboard.test.ts (reason: tests for adapted clipboard module)

- **Lines**: ~371
- **Purpose**: Tests for cell clipboard operations

### ❌ REMOVE — navigation/**tests**/state.test.ts (reason: tests for removed temporarily shown code state)

- **Lines**: ~63
- **Purpose**: Tests for temporarily shown code state

### ✅ KEEP — navigation/**tests**/focus-utils.test.ts

- **Lines**: ~14
- **Purpose**: Tests for focus utility functions

---

## output/

### ⚠️ ADAPT — output/ConsoleOutput.tsx (reason: console output useful for cell execution feedback, adapt channel model)

- **Lines**: ~277
- **Exports**: `ConsoleOutput` (L37, component)
- **Purpose**: Console output renderer with stdin, stdout, stderr channels and ANSI color support

### ❌ REMOVE — output/MarimoErrorOutput.tsx (reason: marimo-specific error output with kernel auto-fix and pip install)

- **Lines**: ~597
- **Exports**: `MarimoErrorOutput` (L57, component)
- **Purpose**: Rich error output with traceback, auto-fix suggestions, AI fix button, and pip install actions
- **Main exports**:
  - `MarimoErrorOutput` (L57-L200): Main error display
  - Error detail rendering (~L200-L400)
  - Fix action buttons (~L400-L597)

### ❌ REMOVE — output/MarimoTracebackOutput.tsx (reason: Python traceback rendering with marimo cell links)

- **Lines**: ~252
- **Exports**: `MarimoTracebackOutput` (L59, component), `replaceTracebackFilenames` (L201, function), `replaceTracebackPrefix` (L251, function)
- **Purpose**: Python traceback rendering with cell links, filename replacement, and collapsible frames

### ✅ KEEP — output/JsonOutput.tsx

- **Lines**: ~426
- **Exports**: `JsonOutput` (L100, component), `getCopyValue` (L431, function), `determineMaxDisplayLength` (L448, function)
- **Purpose**: Interactive JSON viewer with expandable tree, search, copy, and truncation for large values

### ✅ KEEP — output/HtmlOutput.tsx

- **Lines**: ~23
- **Exports**: `HtmlOutput` (L13, component)
- **Purpose**: HTML output renderer (sanitized HTML display)

### ✅ KEEP — output/TextOutput.tsx

- **Lines**: ~36
- **Exports**: `TextOutput` (L14, component)
- **Purpose**: Plain text output with ANSI color and URL link rendering

### ✅ KEEP — output/ImageOutput.tsx

- **Lines**: ~22
- **Exports**: `ImageOutput` (L13, component)
- **Purpose**: Image output renderer (base64 or URL images)

### ✅ KEEP — output/VideoOutput.tsx

- **Lines**: 9
- **Exports**: `VideoOutput` (L9, component)
- **Purpose**: Video output renderer

### ❌ REMOVE — output/CalloutOutput.tsx (reason: marimo callout/admonition output type)

- **Lines**: ~17
- **Exports**: `CalloutOutput` (L12, component)
- **Purpose**: Callout/admonition output (info, warning, error boxes)

### ❌ REMOVE — output/CalloutOutput.styles.ts (reason: styles for removed callout output)

- **Lines**: ~21
- **Exports**: `calloutStyles` (L4, style object)
- **Purpose**: Callout output CSS-in-JS styles

### ❌ REMOVE — output/EmotionCacheProvider.tsx (reason: Emotion CSS cache for shadow DOM, VT doesn't use Emotion)

- **Lines**: ~29
- **Exports**: `EmotionCacheProvider` (L11, component)
- **Purpose**: Emotion CSS cache provider for shadow DOM output isolation

### ✅ KEEP — output/ansi-reduce.ts

- **Lines**: ~375
- **Exports**: `Cursor` (L4, type), `TerminalBuffer` (L13, class), `AnsiParser` (L186, class), `AnsiReducer` (L217, class), `StringOutputMessage` (L360, type), `StatefulOutputMessage` (L368, type)
- **Purpose**: Full ANSI terminal emulator — parses escape codes, maintains cursor/buffer state, supports stateful output for console rendering

### ❌ REMOVE — output/useWrapText.ts (reason: text wrapping preference Jotai atom, trivial to rebuild)

- **Lines**: ~15
- **Exports**: `useWrapText` (L16, hook)
- **Purpose**: Hook for text wrapping preference state

### 🔄 ALREADY — output/Outputs.css (reason: already migrated as outputs.css in Batch 1)

- **Lines**: ~84
- **Purpose**: Output area styles (`.output-area`, `.console-output`, ANSI color classes)

### ⚠️ ADAPT — output/console/ConsoleOutput.tsx (reason: console output variant, adapt channel model and Jotai→Zustand)

- **Lines**: ~277
- **Exports**: `ConsoleOutput` (L37, component)
- **Purpose**: Console output with stdin/stdout/stderr channels (same as parent ConsoleOutput or console-specific variant)

### ✅ KEEP — output/console/text-rendering.tsx

- **Lines**: ~287
- **Exports**: `cleanAnsiCodes` (L15, function), `processTextForUrls` (L94, function), `pipInstallReplacer` (L181, function), `urlReplacer` (L265, function), `composeReplacers` (L293, function), `renderTextWithReplacers` (L308, function), `RenderTextWithLinks` (L326, component)
- **Purpose**: Text processing pipeline — ANSI cleaning, URL detection, pip install link replacement, composable text transformers

### ✅ KEEP — output/console/process-output.ts

- **Lines**: ~15
- **Exports**: `processOutput` (L7, function)
- **Purpose**: Output message processing/normalization

### ❌ REMOVE — output/console/**tests**/ConsoleOutput.test.tsx (reason: tests for console output, rewrite after adaptation)

- **Lines**: ~44
- **Purpose**: Tests for console output component

### ✅ KEEP — output/console/**tests**/text-rendering.test.tsx

- **Lines**: ~231
- **Purpose**: Tests for text rendering utilities

### ❌ REMOVE — output/**tests**/traceback.test.tsx (reason: tests for removed traceback output)

- **Lines**: ~96
- **Purpose**: Tests for traceback output rendering

### ✅ KEEP — output/**tests**/HtmlOutput.test.tsx

- **Lines**: ~125
- **Purpose**: Tests for HTML output component

### ❌ REMOVE — output/**tests**/JsonOutput-mimetype.test.tsx (reason: mimetype dispatch tests tied to removed Output.tsx)

- **Lines**: ~38
- **Purpose**: Tests for JSON output mime type handling

### ✅ KEEP — output/**tests**/json-output.test.ts

- **Lines**: ~301
- **Purpose**: Tests for JSON output component

### ✅ KEEP — output/**tests**/ansi.test.ts

- **Lines**: ~34
- **Purpose**: Tests for ANSI parsing

### ✅ KEEP — output/**tests**/ansi-reduce.test.ts

- **Lines**: ~554
- **Purpose**: Comprehensive tests for ANSI terminal emulator

---

## renderers/

### ❌ REMOVE — renderers/types.ts (reason: renderer plugin system for run-mode layouts, VT doesn't need multiple layout renderers)

- **Lines**: ~62
- **Exports**: `ICellRendererProps` (L11, interface), `LayoutType` (L40, type), `LAYOUT_TYPES` (L44, const), `OVERRIDABLE_LAYOUT_TYPES` (L49, const), `ICellRendererPlugin` (L59, interface)
- **Purpose**: Renderer plugin interface — defines contract for layout renderers (vertical, grid, slides)

### ❌ REMOVE — renderers/plugins.ts (reason: plugin registry for removed layout renderers)

- **Lines**: ~28
- **Exports**: `cellRendererPlugins` (L11, const), `deserializeLayout` (L17, function)
- **Purpose**: Plugin registry for layout renderers

### ❌ REMOVE — renderers/cell-array.tsx (reason: cell array renderer with multi-column, VT has own cell list in lab-workspace)

- **Lines**: ~347
- **Exports**: `CellArray` (L64, component)
- **Purpose**: Core cell array renderer — renders ordered list of cells with drag-and-drop, create-cell buttons, and multi-column support
- **Main exports**:
  - `CellArray` (L64-L347): Main cell list with SortableContext, gap markers, and column layout

### ❌ REMOVE — renderers/cells-renderer.tsx (reason: top-level cells renderer dispatching to layout plugins)

- **Lines**: ~84
- **Exports**: `CellsRenderer` (L27, component), `PluginCellRenderer` (L78, component)
- **Purpose**: Top-level cells renderer that dispatches to layout plugin (vertical/grid/slides)

### ❌ REMOVE — renderers/layout-select.tsx (reason: layout type selector for run mode)

- **Lines**: ~79
- **Exports**: `LayoutSelect` (L26, component), `getLayoutIcon` (L70, function), `displayLayoutName` (L84, function)
- **Purpose**: Layout type selector dropdown (vertical, grid, slides)

### ❌ REMOVE — renderers/vertical-layout/vertical-layout.tsx (reason: vertical layout plugin for run mode)

- **Lines**: ~459
- **Exports**: `VerticalLayoutPlugin` (L457, const), `groupCellsByColumn` (L470, function), `shouldHideCode` (L495, function)
- **Purpose**: Default vertical (top-to-bottom) cell layout with column grouping and code visibility rules
- **Main exports**:
  - `VerticalLayoutPlugin` (L457): Plugin object implementing ICellRendererPlugin
  - `groupCellsByColumn` (L470): Groups cells into columns for multi-column layout
  - `shouldHideCode` (L495): Determines if code should be hidden (app mode, markdown, user preference)

### ❌ REMOVE — renderers/vertical-layout/vertical-layout-wrapper.tsx (reason: layout wrapper for run mode)

- **Lines**: ~47
- **Exports**: `VerticalLayoutWrapper` (L13, component)
- **Purpose**: Wrapper adding padding, max-width, and centering for vertical layout

### ❌ REMOVE — renderers/vertical-layout/useDelayVisibility.ts (reason: visibility delay for run mode rendering)

- **Lines**: ~27
- **Exports**: `useDelayVisibility` hook
- **Purpose**: Delays visibility of cells to prevent layout jank during initial render

### ❌ REMOVE — renderers/vertical-layout/useFocusFirstEditor.ts (reason: auto-focus first editor, VT handles focus differently)

- **Lines**: ~96
- **Exports**: `useFocusFirstEditor` hook
- **Purpose**: Auto-focuses first cell editor on notebook load

### ❌ REMOVE — renderers/vertical-layout/sidebar/sidebar.tsx (reason: vertical layout sidebar for run mode)

- **Lines**: ~28
- **Exports**: Sidebar component for vertical layout
- **Purpose**: Optional sidebar in vertical layout mode

### ❌ REMOVE — renderers/vertical-layout/sidebar/wrapped-with-sidebar.tsx (reason: sidebar wrapper for run mode)

- **Lines**: ~32
- **Exports**: Sidebar-wrapped layout component
- **Purpose**: Wraps vertical layout with optional sidebar

### ❌ REMOVE — renderers/vertical-layout/sidebar/sidebar-slot.tsx (reason: sidebar slot for run mode)

- **Lines**: 8
- **Exports**: Sidebar slot component
- **Purpose**: Slot for sidebar content injection

### ❌ REMOVE — renderers/vertical-layout/sidebar/sheet-sidebar.tsx (reason: sheet sidebar for run mode)

- **Lines**: ~29
- **Exports**: Sheet sidebar component
- **Purpose**: Sheet/drawer-style sidebar variant

### ❌ REMOVE — renderers/vertical-layout/sidebar/toggle.tsx (reason: sidebar toggle for run mode)

- **Lines**: ~22
- **Exports**: Sidebar toggle button
- **Purpose**: Button to show/hide sidebar

### ❌ REMOVE — renderers/vertical-layout/sidebar/state.ts (reason: sidebar state for run mode)

- **Lines**: ~40
- **Exports**: `CLOSED_WIDTH` (const), `normalizeWidth` (function), `sidebarAtom` (atom)
- **Purpose**: Sidebar open/close and width state

### ❌ REMOVE — renderers/vertical-layout/sidebar/sidebar.css (reason: styles for removed sidebar)

- **Lines**: 17
- **Purpose**: Sidebar layout styles

### ❌ REMOVE — renderers/grid-layout/grid-layout.tsx (reason: grid/dashboard layout for run mode)

- **Lines**: ~636
- **Exports**: `GridLayoutRenderer` (L55, component)
- **Purpose**: Grid/dashboard layout renderer with react-grid-layout integration, drag-and-drop cell rearrangement

### ❌ REMOVE — renderers/grid-layout/plugin.tsx (reason: grid layout plugin for run mode)

- **Lines**: ~132
- **Exports**: `GridLayoutPlugin` (plugin object)
- **Purpose**: Grid layout plugin implementing ICellRendererPlugin

### ❌ REMOVE — renderers/grid-layout/types.ts (reason: types for removed grid layout)

- **Lines**: ~75
- **Exports**: Grid layout type definitions
- **Purpose**: TypeScript types for grid layout configuration and state

### ❌ REMOVE — renderers/grid-layout/styles.css (reason: styles for removed grid layout)

- **Lines**: 25
- **Purpose**: Grid layout styles (react-grid-layout overrides)

### ❌ REMOVE — renderers/slides-layout/slides-layout.tsx (reason: slides/presentation layout for run mode)

- **Lines**: ~66
- **Exports**: `SlidesLayoutRenderer` (L17, component)
- **Purpose**: Slides/presentation layout renderer (one cell per slide)

### ❌ REMOVE — renderers/slides-layout/plugin.tsx (reason: slides plugin for run mode)

- **Lines**: ~24
- **Exports**: `SlidesLayoutPlugin` (L11, plugin object)
- **Purpose**: Slides layout plugin implementing ICellRendererPlugin

### ❌ REMOVE — renderers/slides-layout/types.ts (reason: types for removed slides layout)

- **Lines**: ~11
- **Exports**: Slides layout type definitions
- **Purpose**: TypeScript types for slides layout configuration

### ❌ REMOVE — renderers/vertical-layout/**tests**/vertical-layout.test.ts (reason: tests for removed vertical layout)

- **Lines**: ~150
- **Purpose**: Tests for vertical layout and column grouping

### ❌ REMOVE — renderers/vertical-layout/**tests**/useDelayVisibility.test.ts (reason: tests for removed delay visibility)

- **Lines**: ~67
- **Purpose**: Tests for delay visibility hook

### ❌ REMOVE — renderers/vertical-layout/**tests**/useFocusFirstEditor.test.ts (reason: tests for removed focus first editor)

- **Lines**: ~126
- **Purpose**: Tests for focus first editor hook

### ❌ REMOVE — renderers/vertical-layout/sidebar/**tests**/sidebar.test.tsx (reason: tests for removed sidebar)

- **Lines**: ~49
- **Purpose**: Tests for sidebar component

---

## Summary Statistics

| Subdirectory | Files                | Total Lines (approx) |
| ------------ | -------------------- | -------------------- |
| Root         | 15 + 3 tests         | ~3,500               |
| actions/     | 8                    | ~1,543               |
| ai/          | 6 + 1 test           | ~1,785               |
| alerts/      | 4                    | ~298                 |
| boundary/    | 1                    | ~42                  |
| cell/        | 20 + 2 CSS           | ~2,595               |
| chrome/      | ~48 + 3 tests        | ~5,357               |
| code/        | 2                    | ~199                 |
| columns/     | 3 + 1 test           | ~390                 |
| controls/    | 8                    | ~986                 |
| database/    | 5 + 3 tests          | ~3,214               |
| errors/      | 3                    | ~215                 |
| file-tree/   | 8 + 2 tests          | ~2,025               |
| header/      | 4 + 1 CSS + 1 test   | ~455                 |
| inputs/      | 2 + 1 CSS            | ~187                 |
| links/       | 2                    | ~182                 |
| navigation/  | 7 + 6 tests          | ~3,840               |
| output/      | 15 + 7 tests + 1 CSS | ~3,908               |
| renderers/   | 17 + 4 tests + 3 CSS | ~2,766               |
| **TOTAL**    | **~220**             | **~33,487**          |

### Critical Path Files (>400 lines)

| File                                            | Lines | Migration Priority              |
| ----------------------------------------------- | ----- | ------------------------------- |
| `notebook-cell.tsx`                             | 1219  | HIGHEST — main cell component   |
| `database/as-code.ts`                           | 825   | LOW — database code generation  |
| `file-tree/file-explorer.tsx`                   | 709   | MEDIUM — file explorer          |
| `navigation/navigation.ts`                      | 707   | HIGH — cell keyboard navigation |
| `package-alert.tsx`                             | 663   | LOW — package management        |
| `renderers/grid-layout/grid-layout.tsx`         | 636   | LOW — grid layout               |
| `chrome/panels/packages-panel.tsx`              | 613   | LOW — package panel             |
| `output/MarimoErrorOutput.tsx`                  | 597   | HIGH — error display            |
| `actions/useNotebookActions.tsx`                | 574   | MEDIUM — notebook actions       |
| `chrome/wrapper/app-chrome.tsx`                 | 530   | HIGH — chrome layout            |
| `cell/code/cell-editor.tsx`                     | 529   | HIGHEST — code editor           |
| `Output.tsx`                                    | 523   | HIGHEST — output rendering      |
| `database/schemas.ts`                           | 503   | LOW — database schemas          |
| `navigation/multi-cell-action-toolbar.tsx`      | 467   | MEDIUM — multi-select toolbar   |
| `renderers/vertical-layout/vertical-layout.tsx` | 459   | HIGH — default layout           |
| `actions/useCellActionButton.tsx`               | 448   | MEDIUM — cell action menu       |
| `ai/ai-completion-editor.tsx`                   | 446   | MEDIUM — AI editor              |
| `ai/add-cell-with-ai.tsx`                       | 442   | MEDIUM — AI cell creation       |
| `output/JsonOutput.tsx`                         | 426   | MEDIUM — JSON viewer            |
| `database/add-database-form.tsx`                | 400   | LOW — database form             |
| `output/ansi-reduce.ts`                         | 375   | HIGH — ANSI terminal            |
| `renderers/cell-array.tsx`                      | 347   | HIGH — cell list                |
| `cell/CellStatus.tsx`                           | 347   | HIGH — cell status              |
