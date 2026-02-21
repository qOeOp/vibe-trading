# 03 — core/

> Migration inventory of `marimo/frontend/src/core/` — ~258 non-test source files.
> Each entry: Lines | Exports (with line ranges) | Purpose | Internal deps.

---

## Root-level files (6 files)

### ❌ REMOVE — `MarimoApp.tsx` — 121 lines (reason: VT has its own app shell)

- **Exports**: `FORCE_TW_CLASSES`, `preloadPage`, `MarimoApp`
- **Purpose**: Root app component — renders edit or run mode based on `initialModeAtom`
- **Deps**: `./edit-app`, `./run-app`, `./mode`, `./config/config`, `./state/jotai`

### ❌ REMOVE — `edit-app.tsx` — 192 lines (reason: VT has its own app shell)

- **Exports**: `EditApp`
- **Purpose**: Edit-mode app shell — sets up kernel connection, providers, hotkeys, and renders the notebook editor
- **Deps**: `./kernel/session`, `./network/requests`, `./config/config`, `./websocket/useMarimoKernelConnection`, `./hotkeys/hotkeys`, `./cells/cells`

### ❌ REMOVE — `run-app.tsx` — 102 lines (reason: VT doesn't need read-only mode)

- **Exports**: `RunApp`
- **Purpose**: Read-only app mode — renders notebook outputs without editor, supports presenting mode
- **Deps**: `./cells/cells`, `./layout/layout`, `./network/requests`, `./config/config`

### ⚠️ ADAPT — `constants.ts` — 63 lines

- **Exports**: `Constants`, `KnownQueryParams`, `CSSClasses`
- **Purpose**: App-wide constants — session header names, query param keys, CSS class names
- **Deps**: none

### ✅ KEEP — `mime.ts` — 10 lines

- **Exports**: `isErrorMime()`
- **Purpose**: MIME type check for error outputs (`application/vnd.marimo+error`)
- **Deps**: none

### ⚠️ ADAPT — `mode.ts` — 82 lines

- **Exports**: `AppMode`, `viewStateAtom`, `initialModeAtom`, `kioskModeAtom`, `toggleAppMode`, `runDuringPresentMode`, `getInitialAppMode`
- **Purpose**: App mode state (edit/read/present) — Jotai atoms + query param detection
- **Deps**: `./constants`, `./state/jotai`

---

## cells/ (18 files)

### ✅ KEEP — `cells/ids.ts` — 128 lines

- **Exports**: `CellId`, `HTMLCellId`, `UIElementId`, `CellOutputId`, `findCellId`, `SCRATCH_CELL_ID`, `SETUP_CELL_ID`
- **Purpose**: Cell ID types and utilities — `CellId` is a 4-letter random `TypedString`, with HTML-id converters and special sentinel IDs
- **Deps**: `../../utils/typed`

### ⚠️ ADAPT — `cells/types.ts` — 129 lines

- **Exports**: `CellData`, `CellRuntimeState`, `WithResponse<T>`, `createCell()`, `createCellConfig()`, `createCellRuntimeState()`
- **Purpose**: Cell data structures — defines shape of cell data (code, name, config) and runtime state (output, status, console)
- **Deps**: `./ids`, `../network/types`

### ✅ KEEP — `cells/cell.ts` — 243 lines

- **Exports**: `transitionCell()`, `prepareCellForExecution()`, `outputIsLoading()`, `outputIsStale()`, `outputToTracebackInfo()`
- **Purpose**: Cell state transitions — pure functions that advance cell lifecycle (queued → running → idle) and compute derived state
- **Deps**: `./types`, `./ids`, `../network/types`

### ⚠️ ADAPT — `cells/cells.ts` — 1782 lines

- **Exports**: `NotebookState`, `notebookAtom`, cell actions (`createNewCell`, `deleteCell`, `moveCell`, `updateCellCode`, `runCell`, etc.), derived atoms (`cellIdsAtom`, `notebookIsRunningAtom`, `cellDataAtom`, `cellRuntimeAtom`, `staleCellIdsAtom`, `autoInstantiateAtom`, `cellErrorsAtom`, etc.), hooks (`useCellActions`, `useCellData`, `useCellRuntime`), imperative getters (`getNotebook`, `getCells`, `getAllEditorViews`)
- **Purpose**: **THE CENTRAL FILE** — `NotebookState` reducer + Jotai atoms for all cell state. Contains the complete notebook state machine with ~40 action handlers
- **Deps**: `./ids`, `./types`, `./cell`, `./utils`, `./names`, `../network/types`, `../state/jotai`, `../config/config`, `../layout/layout`

### ✅ KEEP — `cells/actions.ts` — 22 lines

- **Exports**: `notebookScrollToRunning()`
- **Purpose**: Side-effect action — scrolls to first running cell
- **Deps**: `./cells`, `./scrollCellIntoView`

### ✅ KEEP — `cells/effects.ts` — 43 lines

- **Exports**: `CellEffects.onCellIdsChange`
- **Purpose**: Side effects triggered by cell ID changes (DOM cleanup)
- **Deps**: `./ids`

### ⚠️ ADAPT — `cells/focus.ts` — 130 lines

- **Exports**: `CellFocusState`, `cellFocusAtom`, `lastFocusedCellAtom`, `useCellFocusActions`
- **Purpose**: Cell focus tracking — which cell has focus, last focused cell for actions
- **Deps**: `./ids`, `../state/jotai`

### ⚠️ ADAPT — `cells/logs.ts` — 126 lines

- **Exports**: `CellLog`, `getCellLogsForMessage()`, `formatLogTimestamp()`
- **Purpose**: Console log parsing — converts kernel stdout/stderr messages into structured CellLog entries
- **Deps**: `../network/types`

### ✅ KEEP — `cells/names.ts` — 108 lines

- **Exports**: `DEFAULT_CELL_NAME`, `normalizeName()`, `getValidName()`, `displayCellName()`
- **Purpose**: Cell naming utilities — validation, normalization, display formatting for cell names
- **Deps**: `./ids`

### ✅ KEEP — `cells/outline.ts` — 31 lines

- **Exports**: `OutlineItem`, `Outline`
- **Purpose**: Type definitions for cell outline (heading hierarchy extracted from markdown/output)
- **Deps**: none

### ⚠️ ADAPT — `cells/outputs.ts` — 35 lines

- **Exports**: `useExpandedOutput()`, `isOutputEmpty()`
- **Purpose**: Output expansion state (fullscreen toggle) and emptiness check
- **Deps**: `./ids`, `../network/types`

### ✅ KEEP — `cells/pending-delete-service.ts` — 184 lines

- **Exports**: `usePendingDeleteService()`, `usePendingDelete()`
- **Purpose**: Undo-able cell deletion — holds deleted cells in pending state with undo timeout
- **Deps**: `./cells`, `./ids`

### ⚠️ ADAPT — `cells/runs.ts` — 200 lines

- **Exports**: `RunId`, `CellRun`, `Run`, `RunsState`, `runsAtom`, `useRunsActions`
- **Purpose**: Run history tracking — records each cell execution run with timing, status, and trace info
- **Deps**: `./ids`, `../state/jotai`, `../network/types`

### 🔄 ALREADY — `cells/scrollCellIntoView.ts` — 159 lines

- **Exports**: `focusAndScrollCellIntoView()`, `scrollToBottom()`, `scrollToTop()`
- **Purpose**: Cell scroll/focus utilities — smooth scroll to cell with focus management
- **Deps**: `./ids`

### ❌ REMOVE — `cells/session.ts` — 294 lines (reason: session resumption is for Python kernel reconnection)

- **Exports**: `notebookStateFromSession()`
- **Purpose**: Session resumption — merges session cell data with existing notebook state using edit-distance algorithm
- **Deps**: `./ids`, `./types`, `./cells`, `../network/types`

### ✅ KEEP — `cells/utils.ts` — 142 lines

- **Exports**: `notebookIsRunning()`, `staleCellIds()`, `disabledCellIds()`, `enabledCellIds()`
- **Purpose**: Notebook-level derived queries — pure functions on NotebookState
- **Deps**: `./ids`, `./types`, `./cell`

### ❌ REMOVE — `cells/add-missing-import.ts` — 132 lines (reason: Python import auto-insertion, not needed for VT)

- **Exports**: `maybeAddMissingImport()`, `maybeAddMarimoImport()`, `maybeAddAltairImport()`
- **Purpose**: Auto-import insertion — detects missing `import marimo as mo` etc. and inserts into cell code
- **Deps**: none (operates on strings)

### ✅ KEEP — `cells/collapseConsoleOutputs.tsx` — 124 lines

- **Exports**: `collapseConsoleOutputs()`, `maybeMakeOutputStateful()`
- **Purpose**: Console output compression — collapses repeated stdout/stderr lines into count badges
- **Deps**: `../network/types`

---

## config/ (6 files)

### ⚠️ ADAPT — `config/config-schema.ts` — 338 lines

- **Exports**: `UserConfigSchema`, `AppConfigSchema`, `UserConfig`, `AppConfig`, `AiConfig`, `CompletionConfig`, `KeymapConfig`, `PackageManagerConfig`, `FormattingConfig`, `RuntimeConfig`, `DisplayConfig`, `ServerConfig`
- **Purpose**: Zod schemas for all configuration — user preferences, app config, AI config, runtime config
- **Deps**: none (pure Zod)

### ⚠️ ADAPT — `config/config.ts` — 132 lines

- **Exports**: `userConfigAtom`, `resolvedMarimoConfigAtom`, `appConfigAtom`, `aiEnabledAtom`, `useUserConfig()`, `useAppConfig()`, `useResolvedMarimoConfig()`, `getAppConfig()`
- **Purpose**: Configuration Jotai atoms and hooks — reactive access to user/app config
- **Deps**: `./config-schema`, `../state/jotai`

### ⚠️ ADAPT — `config/capabilities.ts` — 17 lines

- **Exports**: `capabilitiesAtom`, `hasCapability()`
- **Purpose**: Server capability flags (e.g., can_save, can_run, has_ai)
- **Deps**: `../state/jotai`

### ✅ KEEP — `config/feature-flag.tsx` — 57 lines

- **Exports**: `ExperimentalFeatures`, `getFeatureFlag()`, `FeatureFlagged`
- **Purpose**: Feature flag system — reads from URL params or config, renders conditionally
- **Deps**: `./config`

### ❌ REMOVE — `config/if-capability.tsx` — 20 lines (reason: server capability checks for Python kernel)

- **Exports**: `IfCapability`
- **Purpose**: Conditional render component based on server capabilities
- **Deps**: `./capabilities`

### ⚠️ ADAPT — `config/widths.ts` — 6 lines

- **Exports**: `getAppWidths()`
- **Purpose**: Returns app column width classes based on config
- **Deps**: `./config`

---

## network/ (12 files)

### ❌ REMOVE — `network/types.ts` — re-export (reason: VT has no backend network requests to Python)

- **Exports**: Re-exports all API types from `@marimo-team/marimo-api`
- **Purpose**: Central type barrel — `OutputMessage`, `CellStatus`, `RunRequests`, `EditRequests`, etc.
- **Deps**: `@marimo-team/marimo-api`

### ❌ REMOVE — `network/api.ts` — ~80 lines (reason: VT has no backend network requests to Python)

- **Exports**: `API.post()`, `API.openUrl()`
- **Purpose**: HTTP API wrapper — adds XSRF token, session ID, server token headers to all requests
- **Deps**: `./types`, `../constants`, `../kernel/session`, `../meta/globals`

### ❌ REMOVE — `network/requests.ts` — 25 lines (reason: VT has no backend network requests to Python)

- **Exports**: `requestClientAtom`, `useRequestClient()`, `getRequestClient()`
- **Purpose**: Jotai atom holding the resolved request client instance
- **Deps**: `../state/jotai`

### ❌ REMOVE — `network/requests-network.ts` — ~60 lines (reason: VT has no backend network requests to Python)

- **Exports**: `createNetworkRequests()`
- **Purpose**: Creates request client that sends HTTP requests to the marimo server
- **Deps**: `./api`, `./types`, `./DeferredRequestRegistry`

### ❌ REMOVE — `network/requests-lazy.ts` — 195 lines (reason: VT has no backend network requests to Python)

- **Exports**: `createLazyRequests()`
- **Purpose**: Lazy request wrapper — wraps another client, queues requests until kernel ready
- **Deps**: `./types`

### ❌ REMOVE — `network/requests-static.ts` — ~40 lines (reason: VT has no backend network requests to Python)

- **Exports**: `createStaticRequests()`
- **Purpose**: Static/read-only request client — returns no-ops for all mutating operations
- **Deps**: `./types`

### ❌ REMOVE — `network/requests-toasting.tsx` — ~50 lines (reason: VT has no backend network requests to Python)

- **Exports**: `createErrorToastingRequests()`
- **Purpose**: Decorator that wraps request client with error toast notifications
- **Deps**: `./types`

### ❌ REMOVE — `network/resolve.ts` — 25 lines (reason: VT has no backend network requests to Python)

- **Exports**: `resolveRequestClient()`
- **Purpose**: Chooses request client implementation: PyodideBridge (WASM), static, or network+lazy
- **Deps**: `./requests-network`, `./requests-static`, `./requests-lazy`, `../wasm/utils`, `../static/static-state`

### ❌ REMOVE — `network/connection.ts` — ~40 lines (reason: VT has no WebSocket kernel connection)

- **Exports**: `connectionAtom`, `isConnectingAtom`, `isConnectedAtom`
- **Purpose**: WebSocket connection state atoms
- **Deps**: `../state/jotai`, `../websocket/types`

### ❌ REMOVE — `network/auth.ts` — 14 lines (reason: VT has no backend network requests to Python)

- **Exports**: `cleanupAuthQueryParams()`
- **Purpose**: Removes auth-related query params from URL after login
- **Deps**: none

### ❌ REMOVE — `network/CachingRequestRegistry.ts` — ~60 lines (reason: VT has no backend network requests to Python)

- **Exports**: `CachingRequestRegistry`
- **Purpose**: LRU cache layer on top of `DeferredRequestRegistry`
- **Deps**: `./DeferredRequestRegistry`

### ❌ REMOVE — `network/DeferredRequestRegistry.ts` — ~80 lines (reason: VT has no backend network requests to Python)

- **Exports**: `DeferredRequestRegistry`
- **Purpose**: Core async pattern — sends HTTP request, returns Promise resolved when matching WebSocket response arrives
- **Deps**: `./api`

---

## kernel/ (6 files)

### ❌ REMOVE — `kernel/messages.ts` — 64 lines (reason: VT has no Python kernel)

- **Exports**: `OperationMessage`, `CellMessage`, `KernelReady`, `CompletedRun`, `ModelLifecycle`, and all message union types
- **Purpose**: WebSocket message type definitions — all message shapes the kernel can send
- **Deps**: `../network/types` (re-exports from API schema)

### ❌ REMOVE — `kernel/handlers.ts` — ~120 lines (reason: VT has no Python kernel)

- **Exports**: `buildCellData()`
- **Purpose**: Message handlers — processes kernel messages and dispatches state updates
- **Deps**: `./messages`, `../cells/cells`, `../cells/types`, `../network/types`

### ❌ REMOVE — `kernel/session.ts` — 51 lines (reason: VT has no Python kernel)

- **Exports**: `SessionId`, `generateSessionId()`, `getSessionId()`
- **Purpose**: Session ID management — generates unique session IDs, persists in sessionStorage
- **Deps**: none

### ❌ REMOVE — `kernel/RuntimeState.ts` — ~80 lines (reason: VT has no Python kernel)

- **Exports**: `RuntimeState`
- **Purpose**: Singleton tracking kernel runtime state — installed packages, connected data sources
- **Deps**: `../network/types`

### ❌ REMOVE — `kernel/state.ts` — 18 lines (reason: VT has no Python kernel)

- **Exports**: `KernelState`, `kernelStateAtom`
- **Purpose**: Kernel lifecycle state atom (starting/running/stopped)
- **Deps**: `../state/jotai`

### ❌ REMOVE — `kernel/queryParamHandlers.ts` — 40 lines (reason: VT has no Python kernel)

- **Exports**: `handleQueryParams()`
- **Purpose**: Processes URL query params on startup (auto-run, kiosk mode, etc.)
- **Deps**: `../constants`

---

## state/ (2 files)

### ⚠️ ADAPT — `state/jotai.ts` — 70 lines

- **Exports**: `store`, `JotaiStore`, `waitFor()`, `useJotaiEffect()`, `createDeepEqualAtom()`
- **Purpose**: Jotai store singleton and utilities — the global atom store, deep-equal derived atoms, effect hook
- **Deps**: none (pure Jotai)

### ✅ KEEP — `state/observable.ts` — 24 lines

- **Exports**: `Observable<T>`, `createObservable()`
- **Purpose**: Simple pub/sub observable — subscribe/notify pattern for non-Jotai reactive values
- **Deps**: none

---

## variables/ (2 files)

### ⚠️ ADAPT — `variables/state.ts` — 82 lines

- **Exports**: `variablesAtom`, `useVariables()`, `useVariablesActions()`
- **Purpose**: Variable state — tracks all Python variables (name, declaredBy, usedBy, value, dataType) via Jotai
- **Deps**: `./types`, `../state/jotai`, `../cells/ids`

### ✅ KEEP — `variables/types.ts` — 23 lines

- **Exports**: `VariableName`, `Variable`, `Variables`
- **Purpose**: Variable type definitions — `VariableName` is a TypedString, `Variable` has name/declaredBy/usedBy/value/dataType
- **Deps**: `../../utils/typed`, `../cells/ids`

---

## dom/ (6 files)

### ⚠️ ADAPT — `dom/events.ts` — 95 lines

- **Exports**: `MarimoValueInputEvent`, `MarimoValueUpdateEvent`, `MarimoValueReadyEvent`, custom event creators and dispatchers
- **Purpose**: Custom DOM events for UI element value communication between marimo widgets and React
- **Deps**: none

### ⚠️ ADAPT — `dom/uiregistry.ts` — ~50 lines

- **Exports**: `UIElementRegistry`
- **Purpose**: Singleton registry mapping UI element IDs to their React components and state
- **Deps**: `../cells/ids`

### ✅ KEEP — `dom/outline.ts` — 142 lines

- **Exports**: `parseOutline()`, `mergeOutlines()`
- **Purpose**: Parses heading structure from cell HTML output into outline tree, merges across cells
- **Deps**: `../cells/outline`

### ✅ KEEP — `dom/htmlUtils.ts` — ~30 lines

- **Exports**: `parseAttrValue()`, `parseDataset()`
- **Purpose**: HTML attribute parsing utilities for marimo custom elements
- **Deps**: none

### ✅ KEEP — `dom/defineCustomElement.ts` — 24 lines

- **Exports**: `defineCustomElement()`
- **Purpose**: Safe `customElements.define()` wrapper — skips if already defined
- **Deps**: none

### ⚠️ ADAPT — `dom/ui-element.ts` — ~40 lines

- **Exports**: `initializeUIElement()`
- **Purpose**: Initializes a marimo UI element — registers in UIElementRegistry, sets up event listeners
- **Deps**: `./events`, `./uiregistry`, `../cells/ids`

---

## errors/ (3 files)

### ⚠️ ADAPT — `errors/errors.ts` — ~60 lines

- **Exports**: `AutoFix`, `getAutoFixes()`
- **Purpose**: Error auto-fix suggestions — maps Python error types to actionable fixes (install package, add import)
- **Deps**: `../cells/add-missing-import`, `../network/types`

### ✅ KEEP — `errors/state.ts` — 51 lines

- **Exports**: `kernelStartupErrorAtom`, `bannersAtom`, `useBanners()`
- **Purpose**: Error/banner state — kernel startup errors and dismissible notification banners
- **Deps**: `../state/jotai`

### ✅ KEEP — `errors/utils.ts` — 68 lines

- **Exports**: `wrapInFunction()`
- **Purpose**: Python AST utility — wraps code in `def _():\n  ...` using @lezer/python parser for indentation-aware transform
- **Deps**: `@lezer/python`

---

## alerts/ (1 file)

### ❌ REMOVE — `alerts/state.ts` — 144 lines (reason: package alert state is for Python package management)

- **Exports**: `MissingPackageAlert`, `InstallingPackageAlert`, `alertAtom`, `useAlerts()`, `useAlertActions()`
- **Purpose**: Package alert state — tracks missing/installing packages with Jotai reducer
- **Deps**: `../state/jotai`, `../cells/ids`

---

## cache/ (1 file)

### ❌ REMOVE — `cache/requests.ts` — 6 lines (reason: cache status for Python kernel requests)

- **Exports**: `cacheInfoAtom`
- **Purpose**: Simple Jotai atom for cache status display
- **Deps**: `../state/jotai`

---

## datasets/ (5 files)

### ⚠️ ADAPT — `datasets/types.ts` — 39 lines

- **Exports**: `QualifiedColumn`, `ColumnPreviewSummary`, `DatasetsState`
- **Purpose**: Dataset type definitions — column references with table qualification, preview summaries
- **Deps**: `../network/types`

### ⚠️ ADAPT — `datasets/state.ts` — 144 lines

- **Exports**: `datasetsAtom`, `useDatasets()`, `useDatasetsActions()`, `datasetTablesAtom`
- **Purpose**: Dataset state management — tracks available tables and their columns via Jotai
- **Deps**: `./types`, `../state/jotai`, `../network/types`

### ⚠️ ADAPT — `datasets/engines.ts` — 12 lines

- **Exports**: `ConnectionName`, `DUCKDB_ENGINE`, `INTERNAL_SQL_ENGINES`
- **Purpose**: SQL engine constants — DuckDB and internal engine names
- **Deps**: none

### ❌ REMOVE — `datasets/request-registry.ts` — 58 lines (reason: deferred request pattern for Python kernel)

- **Exports**: `PreviewSQLTable`, `PreviewSQLTableList`, `ValidateSQL`
- **Purpose**: Deferred request registries for SQL operations (table preview, validation)
- **Deps**: `../network/DeferredRequestRegistry`

### ⚠️ ADAPT — `datasets/data-source-connections.ts` — 344 lines

- **Exports**: `DataSourceConnection`, `DataSourceState`, `dataSourceConnectionsAtom`, `allTablesAtom`, `getTableType()`
- **Purpose**: Data source connection management — tracks database connections, merges tables from kernel and SQL engines
- **Deps**: `./types`, `./engines`, `../state/jotai`, `../network/types`

---

## debugger/ (1 file)

### ❌ REMOVE — `debugger/state.ts` — 11 lines (reason: VT doesn't need Python debugger)

- **Exports**: `debuggerAtom`
- **Purpose**: Debugger state atom — tracks active breakpoints
- **Deps**: `../state/jotai`

---

## documentation/ (3 files)

### ⚠️ ADAPT — `documentation/state.ts` — 14 lines

- **Exports**: `documentationAtom`
- **Purpose**: Documentation panel state — current symbol being documented
- **Deps**: `../state/jotai`

### ❌ REMOVE — `documentation/doc-lookup.ts` — 51 lines (reason: fetches Python docstrings via kernel)

- **Exports**: `requestOutputDocumentation()`
- **Purpose**: Fetches Python docstring/help for a symbol via kernel request
- **Deps**: `../network/requests`, `../network/DeferredRequestRegistry`

### ⚠️ ADAPT — `documentation/DocHoverTarget.tsx` — 24 lines

- **Exports**: `DocHoverTarget`
- **Purpose**: React component — wraps element with hover-to-show-docs behavior
- **Deps**: `./state`

---

## export/ (1 file)

### ❌ REMOVE — `export/hooks.ts` — 230 lines (reason: VT doesn't export static HTML)

- **Exports**: `useAutoExport()`, `captureTracker`, `useEnrichCellOutputs()`, `updateCellOutputsWithScreenshots()`
- **Purpose**: Auto-export hooks — captures cell output screenshots for HTML export enrichment
- **Deps**: `../cells/cells`, `../config/config`, `../network/requests`

---

## functions/ (1 file)

### ❌ REMOVE — `functions/FunctionRegistry.ts` — 19 lines (reason: related to Python function definitions)

- **Exports**: `FUNCTIONS_REGISTRY`
- **Purpose**: Deferred request registry for Python function calls from frontend
- **Deps**: `../network/DeferredRequestRegistry`

---

## hotkeys/ (3 files)

### ✅ KEEP — `hotkeys/hotkeys.ts` — 545 lines

- **Exports**: `Hotkey`, `HotkeyAction`, `HotkeyProvider`, `OverridingHotkeyProvider`, `DEFAULT_HOT_KEY`, `getDefaultHotkey()`
- **Purpose**: Hotkey system — defines all keyboard shortcuts, provides context-aware hotkey resolution, supports vim/emacs keymaps
- **Deps**: `./shortcuts`, `../config/config`

### ✅ KEEP — `hotkeys/shortcuts.ts` — 179 lines

- **Exports**: `isPlatformMac()`, `isPlatformWindows()`, `parseShortcut()`, `Platform`, `resolvePlatform()`, `duplicateWithCtrlModifier()`
- **Purpose**: Keyboard shortcut parsing — platform detection, shortcut string parsing, modifier key handling
- **Deps**: none

### ✅ KEEP — `hotkeys/actions.ts` — 39 lines

- **Exports**: `useRegisteredActions()`, `useSetRegisteredAction()`
- **Purpose**: Action registry hooks — components register callable actions that hotkeys can trigger
- **Deps**: none (pure React hooks)

---

## i18n/ (2 files)

### ❌ REMOVE — `i18n/locale-provider.tsx` — 36 lines (reason: VT doesn't need internationalization)

- **Exports**: `LocaleProvider`
- **Purpose**: Locale context provider — wraps app with DayPicker/date locale
- **Deps**: none (pure React context)

### ❌ REMOVE — `i18n/with-locale.tsx` — 13 lines (reason: VT doesn't need internationalization)

- **Exports**: `WithLocale`
- **Purpose**: HOC that wraps a component with `LocaleProvider`
- **Deps**: `./locale-provider`

---

## layout/ (2 files)

### ⚠️ ADAPT — `layout/layout.ts` — 100 lines

- **Exports**: `LayoutState`, `layoutStateAtom`, `useLayoutState()`, `useLayoutActions()`, `getSerializedLayout()`
- **Purpose**: Layout state — tracks grid/column layout configuration, serializes for saving
- **Deps**: `../state/jotai`, `../cells/ids`

### ⚠️ ADAPT — `layout/useTogglePresenting.ts` — 95 lines

- **Exports**: `useTogglePresenting()`
- **Purpose**: Presentation mode toggle — enters/exits fullscreen presenting mode with layout switching
- **Deps**: `../mode`, `./layout`

---

## lsp/ (1 file)

### ⚠️ ADAPT — `lsp/transport.ts` — 204 lines

- **Exports**: `ReconnectingWebSocketTransport`
- **Purpose**: LSP WebSocket transport — reconnecting WebSocket for Language Server Protocol communication
- **Deps**: none

---

## meta/ (2 files)

### ❌ REMOVE — `meta/globals.ts` — 26 lines (reason: reads marimo-specific global state)

- **Exports**: `getMarimoVersion()`, `getMarimoServerToken()`, `getMarimoCode()`
- **Purpose**: Reads global `__MARIMO_STATIC__` and meta tags for version/token/code
- **Deps**: none

### ❌ REMOVE — `meta/state.ts` — 26 lines (reason: marimo-specific meta state)

- **Exports**: `marimoVersionAtom`, `showCodeInRunModeAtom`, `serverTokenAtom`
- **Purpose**: Meta state atoms — version, server token, show-code toggle
- **Deps**: `../state/jotai`

---

## packages/ (3 files)

### ❌ REMOVE — `packages/package-input-utils.ts` — 37 lines (reason: VT doesn't manage Python packages)

- **Exports**: `stripPackageManagerPrefix()`
- **Purpose**: Strips `pip install ` / `uv add ` prefixes from package input strings
- **Deps**: none

### ❌ REMOVE — `packages/toast-components.tsx` — 89 lines (reason: VT doesn't manage Python packages)

- **Exports**: `showAddPackageToast()`, `showUpgradePackageToast()`, `showRemovePackageToast()`
- **Purpose**: Package management toast notifications with install/cancel actions
- **Deps**: `../network/requests`

### ❌ REMOVE — `packages/useInstallPackage.ts` — 47 lines (reason: VT doesn't manage Python packages)

- **Exports**: `useInstallPackages()`
- **Purpose**: Hook to install Python packages via kernel request
- **Deps**: `../network/requests`, `../cells/cells`

---

## rtc/ (1 file)

### ❌ REMOVE — `rtc/state.ts` — 26 lines (reason: VT doesn't need real-time collaboration)

- **Exports**: `usernameAtom`, `isRtcEnabled()`
- **Purpose**: Real-time collaboration state — username for presence, RTC feature check
- **Deps**: `../state/jotai`, `../config/config`

---

## runtime/ (4 files)

### ❌ REMOVE — `runtime/types.ts` — 22 lines (reason: VT has no Python runtime management)

- **Exports**: `RuntimeConfig`
- **Purpose**: Runtime configuration type — URL, auth headers, environment
- **Deps**: none

### ❌ REMOVE — `runtime/config.ts` — 65 lines (reason: VT has no Python runtime management)

- **Exports**: `DEFAULT_RUNTIME_CONFIG`, `runtimeConfigAtom`, `useRuntimeManager()`, `useConnectToRuntime()`, `getRuntimeManager()`, `asRemoteURL()`
- **Purpose**: Runtime configuration state — manages connection to marimo kernel process
- **Deps**: `./types`, `./runtime`, `../state/jotai`

### ❌ REMOVE — `runtime/runtime.ts` — 299 lines (reason: VT has no Python runtime management)

- **Exports**: `RuntimeManager`
- **Purpose**: Runtime manager class — constructs URLs (HTTP, WebSocket, LSP), manages auth headers, health checks
- **Deps**: `./types`, `./utils`, `../constants`

### ❌ REMOVE — `runtime/utils.ts` — 10 lines (reason: VT has no Python runtime management)

- **Exports**: `urlJoin()`
- **Purpose**: URL path joining utility
- **Deps**: none

---

## saving/ (5 files)

### ❌ REMOVE — `saving/state.ts` — 52 lines (reason: VT has its own file handling)

- **Exports**: `LastSavedNotebook`, `lastSavedNotebookAtom`, `needsSaveAtom`
- **Purpose**: Save state tracking — last saved notebook snapshot, dirty detection
- **Deps**: `../state/jotai`, `../cells/cells`

### ❌ REMOVE — `saving/filename.ts` — 56 lines (reason: VT has its own file handling)

- **Exports**: `useFilename()`, `useUpdateFilename()`
- **Purpose**: Filename management hooks — read/update the notebook filename
- **Deps**: `./file-state`, `../network/requests`

### ❌ REMOVE — `saving/file-state.ts` — 16 lines (reason: VT has its own file handling)

- **Exports**: `filenameAtom`, `codeAtom`
- **Purpose**: File state atoms — current filename and serialized code
- **Deps**: `../state/jotai`

### ❌ REMOVE — `saving/save-component.tsx` — 285 lines (reason: VT has its own file handling)

- **Exports**: `SaveComponent`, `useSaveNotebook()`, `isNamedPersistentFile()`, `useAutoSaveNotebook()`
- **Purpose**: Save UI and logic — save button, auto-save, filename dialog, keyboard shortcut handler
- **Deps**: `./state`, `./filename`, `../cells/cells`, `../network/requests`, `../config/config`

### ❌ REMOVE — `saving/useAutoSave.ts` — 69 lines (reason: VT has its own file handling)

- **Exports**: `useAutoSave()`
- **Purpose**: Auto-save hook — debounced save on notebook changes
- **Deps**: `./state`, `./save-component`

---

## secrets/ (1 file)

### ❌ REMOVE — `secrets/request-registry.ts` — 17 lines (reason: VT doesn't manage Python secrets)

- **Exports**: `SECRETS_REGISTRY`
- **Purpose**: Deferred request registry for secrets/environment variable operations
- **Deps**: `../network/DeferredRequestRegistry`

---

## slots/ (1 file)

### ✅ KEEP — `slots/slots.ts` — 10 lines

- **Exports**: `slotsController`, `SlotNames`
- **Purpose**: Named slot system — allows injecting React content into predefined layout positions
- **Deps**: none

---

## static/ (5 files)

### ❌ REMOVE — `static/types.ts` — 11 lines (reason: VT doesn't need static mode)

- **Exports**: `StaticVirtualFiles`, `MarimoStaticState`
- **Purpose**: Type definitions for static notebook mode — virtual file map and static state shape
- **Deps**: `../../utils/json/base64`, `../kernel/messages`

### ❌ REMOVE — `static/static-state.ts` — 25 lines (reason: VT doesn't need static mode)

- **Exports**: `isStaticNotebook()`, `getStaticVirtualFiles()`, `getStaticModelNotifications()`
- **Purpose**: Static state access — reads `window.__MARIMO_STATIC__` global for exported notebooks
- **Deps**: `./types`

### ❌ REMOVE — `static/files.ts` — 181 lines (reason: VT doesn't need static mode)

- **Exports**: `patchFetch()`, `patchVegaLoader()`, `resolveVirtualFileURL()`
- **Purpose**: Virtual file resolution — patches `fetch()` and Vega loader to resolve `/@file/` URLs from embedded data URLs
- **Deps**: `./static-state`, `./types`

### ❌ REMOVE — `static/download-html.ts` — 60 lines (reason: VT doesn't need static mode)

- **Exports**: `downloadAsHTML()`
- **Purpose**: HTML export — downloads current notebook as self-contained HTML file
- **Deps**: `../network/requests`

### ❌ REMOVE — `static/virtual-file-tracker.ts` — 84 lines (reason: VT doesn't need static mode)

- **Exports**: `VirtualFileTracker`, `findVirtualFiles()`
- **Purpose**: Tracks virtual file references in cell outputs — scans HTML for `/@file/` URLs
- **Deps**: none

---

## vscode/ (2 files)

### ❌ REMOVE — `vscode/is-in-vscode.ts` — 10 lines (reason: VT is not a VSCode extension)

- **Exports**: `isInVscodeExtension()`
- **Purpose**: Detects if running inside VS Code webview via query param
- **Deps**: `../constants`

### ❌ REMOVE — `vscode/vscode-bindings.ts` — 177 lines (reason: VT is not a VSCode extension)

- **Exports**: `isEmbedded`, `maybeRegisterVSCodeBindings()`, `sendToPanelManager()`, `VscodeMessage`
- **Purpose**: VS Code integration — forwards keyboard events (copy/cut/paste), external links, and context menu to VS Code parent frame
- **Deps**: `../constants`, `../hotkeys/shortcuts`, `../wasm/utils`

---

## websocket/ (6 files)

### ❌ REMOVE — `websocket/connection-utils.ts` — 68 lines (reason: VT has no WebSocket kernel connection)

- **Exports**: `isAppClosed()`, `isAppConnecting()`, `isAppConnected()`, `isAppClosing()`, `isAppNotStarted()`, `isAppInteractionDisabled()`, `getConnectionTooltip()`
- **Purpose**: Connection state predicates and tooltip text for UI
- **Deps**: `./types`

### ❌ REMOVE — `websocket/types.ts` — 45 lines (reason: VT has no WebSocket kernel connection)

- **Exports**: `WebSocketState`, `WebSocketClosedReason`, `ConnectionStatus`
- **Purpose**: WebSocket connection type definitions
- **Deps**: none

### ❌ REMOVE — `websocket/useMarimoKernelConnection.tsx` — 451 lines (reason: VT has no WebSocket kernel connection)

- **Exports**: `useMarimoKernelConnection()`
- **Purpose**: **Main connection hook** — establishes WebSocket, processes all kernel messages, dispatches state updates to Jotai atoms
- **Deps**: `./types`, `../kernel/messages`, `../kernel/handlers`, `../cells/cells`, `../network/connection`, `../config/config`, `../state/jotai`

### ❌ REMOVE — `websocket/useWebSocket.tsx` — 88 lines (reason: VT has no WebSocket kernel connection)

- **Exports**: `useConnectionTransport()`
- **Purpose**: Low-level WebSocket hook — manages transport lifecycle (connect/disconnect/reconnect)
- **Deps**: `./types`, `./transports/transport`

### ❌ REMOVE — `websocket/transports/transport.ts` — 61 lines (reason: VT has no WebSocket kernel connection)

- **Exports**: `ConnectionEvent`, `IConnectionTransport`, `ConnectionSubscriptions`
- **Purpose**: Transport interface — abstract WebSocket transport with open/close/message events
- **Deps**: none

### ❌ REMOVE — `websocket/transports/basic.ts` — 95 lines (reason: VT has no WebSocket kernel connection)

- **Exports**: `BasicTransport`
- **Purpose**: Default WebSocket transport implementation — wraps native WebSocket with reconnect logic
- **Deps**: `./transport`

---

## ai/ (22 files)

### ⚠️ ADAPT — `ai/chat-utils.ts` — 51 lines

- **Exports**: `replaceMessagesInChat()`
- **Purpose**: Chat message manipulation — replaces messages in chat history
- **Deps**: `./state`

### ⚠️ ADAPT — `ai/config.ts` — 78 lines

- **Exports**: `SupportedRole`, `useModelChange()`
- **Purpose**: AI model selection hook — handles model switching with config persistence
- **Deps**: `./state`, `../config/config`

### ⚠️ ADAPT — `ai/state.ts` — 99 lines

- **Exports**: `ChatId`, `AiCompletionCell`, `aiCompletionCellAtom`, `includeOtherCellsAtom`, `Message`, `Chat`, `ChatState`, `chatStateAtom`, `activeChatAtom`
- **Purpose**: AI chat state — chat sessions, active chat tracking, completion cell state
- **Deps**: `../state/jotai`, `../cells/ids`

### ⚠️ ADAPT — `ai/model-registry.ts` — 232 lines

- **Exports**: `AiModel`, `getKnownModelMaps()`, `AiModelRegistry`
- **Purpose**: AI model registry — catalogs known models (OpenAI, Anthropic, Google, etc.) with capabilities and pricing
- **Deps**: `./ids/ids`

### ⚠️ ADAPT — `ai/staged-cells.ts` — 294 lines

- **Exports**: `Edit`, `StagedAICells`, `useStagedCells()`, `stagedAICellsAtom`
- **Purpose**: AI-generated cell staging — holds AI-proposed code changes before user accepts/rejects
- **Deps**: `../state/jotai`, `../cells/ids`, `../cells/cells`

### ⚠️ ADAPT — `ai/context/context.ts` — 36 lines

- **Exports**: `getAIContextRegistry()`, `getFileContextProvider()`
- **Purpose**: AI context registry access — singleton pattern for context provider registry
- **Deps**: `./registry`

### ⚠️ ADAPT — `ai/context/registry.ts` — 259 lines

- **Exports**: `ContextLocatorId`, `AIContextItem`, `AIContextProvider`, `AIContextRegistry`
- **Purpose**: AI context provider registry — manages context providers that supply relevant code/data to AI prompts
- **Deps**: `../state`

### ⚠️ ADAPT — `ai/context/utils.ts` — 54 lines

- **Exports**: `AiContextPayload`, `contextToXml()`
- **Purpose**: Serializes AI context items to XML format for prompt construction
- **Deps**: none

### ⚠️ ADAPT — `ai/context/providers/cell-output.ts` — 385 lines

- **Exports**: `CellOutputContextProvider`, `getAttachmentsForOutputs()`, `getCellContextData()`
- **Purpose**: Provides cell output content (HTML, images, errors) as AI context
- **Deps**: `../../state`, `../../../cells/cells`, `../../../network/types`

### ⚠️ ADAPT — `ai/context/providers/common.ts` — 22 lines

- **Exports**: `Boosts`, `Sections`
- **Purpose**: Constants for AI context — boost weights and section names
- **Deps**: none

### ⚠️ ADAPT — `ai/context/providers/datasource.ts` — 166 lines

- **Exports**: `DatasourceContextProvider`, `getDatasourceContext()`
- **Purpose**: Provides database schema/table info as AI context
- **Deps**: `../../../datasets/state`, `../../../datasets/data-source-connections`

### ⚠️ ADAPT — `ai/context/providers/error.ts` — 174 lines

- **Exports**: `ErrorContextProvider`
- **Purpose**: Provides cell error tracebacks as AI context for debugging assistance
- **Deps**: `../../../cells/cells`, `../../../network/types`

### ⚠️ ADAPT — `ai/context/providers/file.ts` — 292 lines

- **Exports**: `FileContextProvider`
- **Purpose**: Provides file system context (open files, directory structure) to AI
- **Deps**: `../../../network/requests`

### ⚠️ ADAPT — `ai/context/providers/tables.ts` — 248 lines

- **Exports**: `TableContextProvider`
- **Purpose**: Provides dataframe/table schema as AI context
- **Deps**: `../../../datasets/state`

### ⚠️ ADAPT — `ai/context/providers/variable.ts` — 82 lines

- **Exports**: `VariableContextProvider`
- **Purpose**: Provides Python variable names/types as AI context
- **Deps**: `../../../variables/state`

### ⚠️ ADAPT — `ai/ids/ids.ts` — 81 lines

- **Exports**: `KNOWN_PROVIDERS`, `KnownProviderId`, `ProviderId`, `ShortModelId`, `QualifiedModelId`, `AiModelId`, `isKnownAIProvider()`
- **Purpose**: AI provider/model ID types — typed strings for OpenAI, Anthropic, Google, etc.
- **Deps**: none

### ⚠️ ADAPT — `ai/tools/base.ts` — 122 lines

- **Exports**: `StatusValue`, `ToolExecutionError`, `ToolOutputBase`, `ToolDescription`, `ToolNotebookContext`, `AiTool`
- **Purpose**: AI tool base types — abstract interface for frontend-executed AI tools
- **Deps**: none

### ⚠️ ADAPT — `ai/tools/registry.ts` — 143 lines

- **Exports**: `FrontendToolRegistry`, `FRONTEND_TOOL_REGISTRY`, `FrontendToolDefinition`
- **Purpose**: Tool registry — registers and resolves AI tools by name
- **Deps**: `./base`

### ⚠️ ADAPT — `ai/tools/edit-notebook-tool.ts` — 295 lines

- **Exports**: `EditNotebookTool`, `EditType`
- **Purpose**: AI tool — edits notebook cells (add/update/delete code) based on AI instructions
- **Deps**: `./base`, `../../cells/cells`

### ⚠️ ADAPT — `ai/tools/run-cells-tool.ts` — 267 lines

- **Exports**: `RunStaleCellsTool`
- **Purpose**: AI tool — runs stale cells after AI makes code changes
- **Deps**: `./base`, `../../cells/cells`, `../../network/requests`

### ⚠️ ADAPT — `ai/tools/sample-tool.ts` — 74 lines

- **Exports**: `TestFrontendTool`
- **Purpose**: Test/sample AI tool — used for development/testing of tool framework
- **Deps**: `./base`

### ⚠️ ADAPT — `ai/tools/utils.ts` — 23 lines

- **Exports**: `formatToolDescription()`
- **Purpose**: Formats tool descriptions for AI prompt injection
- **Deps**: none

---

## wasm/ (20 files)

### ❌ REMOVE — `wasm/PyodideLoader.tsx` — 72 lines (reason: VT doesn't run Python in browser)

- **Exports**: `PyodideLoader`, `WasmSpinner`
- **Purpose**: Loading UI for WASM/Pyodide initialization — shows spinner with progress
- **Deps**: `./state`

### ❌ REMOVE — `wasm/bridge.ts` — 612 lines (reason: VT doesn't run Python in browser)

- **Exports**: `PyodideBridge`, `createPyodideConnection()`
- **Purpose**: **WASM bridge** — implements `RunRequests` + `EditRequests` by forwarding to Pyodide worker via RPC. Main orchestrator for browser-only mode
- **Deps**: `./rpc`, `./state`, `./store`, `../network/types`, `../cells/cells`, `../kernel/session`

### ❌ REMOVE — `wasm/router.ts` — 39 lines (reason: VT doesn't run Python in browser)

- **Exports**: `PyodideRouter`
- **Purpose**: Client-side router for WASM mode — handles URL routing without server
- **Deps**: none

### ❌ REMOVE — `wasm/rpc.ts` — 32 lines (reason: VT doesn't run Python in browser)

- **Exports**: `ParentSchema`, `getWorkerRPC()`
- **Purpose**: RPC setup between main thread and Pyodide Web Worker
- **Deps**: `./worker/types`

### ❌ REMOVE — `wasm/share.ts` — 15 lines (reason: VT doesn't run Python in browser)

- **Exports**: `createShareableLink()`
- **Purpose**: Creates shareable URL with notebook code encoded in hash
- **Deps**: none

### ❌ REMOVE — `wasm/state.ts` — 21 lines (reason: VT doesn't run Python in browser)

- **Exports**: `wasmInitializationAtom`, `hasAnyOutputAtom`
- **Purpose**: WASM initialization state atoms
- **Deps**: `../state/jotai`

### ❌ REMOVE — `wasm/store.ts` — 137 lines (reason: VT doesn't run Python in browser)

- **Exports**: `FileStore`, `localStorageFileStore`, `domElementFileStore`, `mountConfigFileStore`, `CompositeFileStore`, `notebookFileStore`, `fallbackFileStore`
- **Purpose**: File storage adapters for WASM — localStorage, DOM element, mount config, composite pattern
- **Deps**: none

### ❌ REMOVE — `wasm/utils.ts` — 12 lines (reason: VT doesn't run Python in browser)

- **Exports**: `isWasm()`
- **Purpose**: Detects WASM mode via query param
- **Deps**: `../constants`

### ❌ REMOVE — `wasm/worker/bootstrap.ts` — 225 lines (reason: VT doesn't run Python in browser)

- **Exports**: `DefaultWasmController`
- **Purpose**: Pyodide bootstrap — loads Pyodide, installs marimo wheel, initializes Python environment in worker
- **Deps**: `./types`, `./fs`, `./getMarimoWheel`, `./getPyodideVersion`

### ❌ REMOVE — `wasm/worker/constants.ts` — 2 lines (reason: VT doesn't run Python in browser)

- **Exports**: `TRANSPORT_ID`
- **Purpose**: Transport identifier constant for worker communication
- **Deps**: none

### ❌ REMOVE — `wasm/worker/fs.ts` — 90 lines (reason: VT doesn't run Python in browser)

- **Exports**: `WasmFileSystem`
- **Purpose**: Virtual filesystem for Pyodide — reads/writes files in Pyodide's in-memory FS
- **Deps**: `./types`

### ❌ REMOVE — `wasm/worker/getController.ts` — 16 lines (reason: VT doesn't run Python in browser)

- **Exports**: `getController()`
- **Purpose**: Returns the WASM controller instance (lazy initialization)
- **Deps**: `./types`

### ❌ REMOVE — `wasm/worker/getFS.ts` — 9 lines (reason: VT doesn't run Python in browser)

- **Exports**: `getFS()`
- **Purpose**: Returns the WasmFileSystem instance
- **Deps**: `./fs`

### ❌ REMOVE — `wasm/worker/getMarimoWheel.ts` — 15 lines (reason: VT doesn't run Python in browser)

- **Exports**: `getMarimoWheel()`
- **Purpose**: Fetches the marimo Python wheel URL for Pyodide installation
- **Deps**: none

### ❌ REMOVE — `wasm/worker/getPyodideVersion.ts` — 10 lines (reason: VT doesn't run Python in browser)

- **Exports**: `getPyodideVersion()`
- **Purpose**: Returns the Pyodide version string
- **Deps**: none

### ❌ REMOVE — `wasm/worker/message-buffer.ts` — 33 lines (reason: VT doesn't run Python in browser)

- **Exports**: `MessageBuffer`
- **Purpose**: Buffers messages while worker is initializing — flushes on ready
- **Deps**: none

### ❌ REMOVE — `wasm/worker/save-worker.ts` — 107 lines (reason: VT doesn't run Python in browser)

- **Exports**: `SaveWorkerSchema`
- **Purpose**: Worker-side save handler — serializes notebook and writes to virtual FS
- **Deps**: `./types`, `./fs`

### ❌ REMOVE — `wasm/worker/tracer.ts` — 7 lines (reason: VT doesn't run Python in browser)

- **Exports**: `t` (Tracer instance)
- **Purpose**: Performance tracing utility for WASM operations
- **Deps**: none

### ❌ REMOVE — `wasm/worker/types.ts` — 108 lines (reason: VT doesn't run Python in browser)

- **Exports**: `WasmController`, `RawBridge`, `BridgePayload`, `SerializedBridge`
- **Purpose**: Type definitions for WASM worker — controller interface, bridge payload shapes
- **Deps**: `../../network/types`

### ❌ REMOVE — `wasm/worker/worker.ts` — 380 lines (reason: VT doesn't run Python in browser)

- **Exports**: `WorkerSchema`
- **Purpose**: **Main Pyodide worker** — receives RPC calls, executes Python via Pyodide, sends results back
- **Deps**: `./types`, `./bootstrap`, `./fs`, `./save-worker`, `./message-buffer`

---

## islands/ (10 files)

### ❌ REMOVE — `islands/bridge.ts` — 220 lines (reason: VT doesn't use islands architecture)

- **Exports**: `IslandsPyodideBridge`
- **Purpose**: Islands-mode bridge — lightweight version of PyodideBridge for embedding marimo outputs in static pages
- **Deps**: `../wasm/rpc`, `../wasm/state`, `../network/types`

### ❌ REMOVE — `islands/main.ts` — 228 lines (reason: VT doesn't use islands architecture)

- **Exports**: `initialize()`
- **Purpose**: Islands entry point — parses HTML for marimo islands, initializes Pyodide, renders outputs
- **Deps**: `./parse`, `./bridge`, `./state`, `../wasm/bridge`

### ❌ REMOVE — `islands/parse.ts` — 159 lines (reason: VT doesn't use islands architecture)

- **Exports**: `MarimoIslandApp`, `parseMarimoIslandApps()`, `createMarimoFile()`, `parseIslandEditor()`, `parseIslandCode()`, `extractIslandCodeFromEmbed()`
- **Purpose**: HTML parser — extracts marimo island definitions from `<marimo-island>` custom elements
- **Deps**: none (DOM parsing)

### ❌ REMOVE — `islands/state.ts` — 30 lines (reason: VT doesn't use islands architecture)

- **Exports**: `islandsInitializedAtom`, `userTriedToInteractWithIslandsAtom`, `shouldShowIslandsWarningIndicatorAtom`
- **Purpose**: Islands initialization state — tracks loading and user interaction
- **Deps**: `../state/jotai`

### ❌ REMOVE — `islands/toast.ts` — 41 lines (reason: VT doesn't use islands architecture)

- **Exports**: `toastIslandsLoading()`, `dismissIslandsLoadingToast()`
- **Purpose**: Toast notifications for islands loading progress
- **Deps**: none

### ❌ REMOVE — `islands/utils.ts` — 5 lines (reason: VT doesn't use islands architecture)

- **Exports**: `isIslands()`
- **Purpose**: Detects islands mode
- **Deps**: none

### ❌ REMOVE — `islands/components/output-wrapper.tsx` — 154 lines (reason: VT doesn't use islands architecture)

- **Exports**: `MarimoOutputWrapper`
- **Purpose**: React wrapper for island output — renders cell output with loading/error states
- **Deps**: `../state`, `../../cells/ids`

### ❌ REMOVE — `islands/components/web-components.tsx` — 123 lines (reason: VT doesn't use islands architecture)

- **Exports**: `MarimoIslandElement`
- **Purpose**: Custom element `<marimo-island>` — Web Component that renders marimo output
- **Deps**: `../parse`, `./output-wrapper`

### ❌ REMOVE — `islands/worker/controller.ts` — 52 lines (reason: VT doesn't use islands architecture)

- **Exports**: `ReadonlyWasmController`
- **Purpose**: Read-only WASM controller for islands — no editing, only output rendering
- **Deps**: `../../wasm/worker/types`

### ❌ REMOVE — `islands/worker/worker.tsx` — 178 lines (reason: VT doesn't use islands architecture)

- **Exports**: `WorkerSchema`
- **Purpose**: Islands worker — lightweight Pyodide worker for rendering island outputs
- **Deps**: `../../wasm/worker/types`, `../../wasm/worker/bootstrap`

---

## codemirror/ (87 files, ~14,606 lines total)

### Core files

#### ✅ KEEP — `codemirror/cm.ts` — 272 lines

- **Exports**: `setupCodeMirror()`, `reconfigureLanguageExtension()`
- **Purpose**: Main CodeMirror setup — creates EditorState with all extensions, keymaps, and language configuration
- **Deps**: `./extensions`, `./facet`, `./keymaps/keymaps`, `./language/extension`, `../config/config`

#### ✅ KEEP — `codemirror/extensions.ts` — 105 lines

- **Exports**: `getExtensions()`, `getReadonlyExtensions()`
- **Purpose**: Extension bundles — assembles all CodeMirror extensions (completion, find-replace, copilot, etc.)
- **Deps**: `./completion/*`, `./find-replace/*`, `./copilot/*`, `./editing/*`, `./misc/*`, `./placeholder/*`

#### ✅ KEEP — `codemirror/facet.ts` — 22 lines

- **Exports**: `cellIdFacet`, `completionConfigFacet`, `movementCallbacksFacet`
- **Purpose**: Custom CodeMirror facets for cell-specific configuration
- **Deps**: none

#### ⚠️ ADAPT — `codemirror/format.ts` — 215 lines

- **Exports**: `formatEditorViews()`, `formatOnSave()`
- **Purpose**: Code formatting — sends code to kernel for Black/ruff formatting, applies diff
- **Deps**: `../network/requests`

#### ✅ KEEP — `codemirror/replace-editor-content.ts` — 89 lines

- **Exports**: `replaceEditorContent()`
- **Purpose**: Replaces editor content with diff-based transaction to preserve cursor/selection
- **Deps**: none

#### ✅ KEEP — `codemirror/types.ts` — 5 lines

- **Exports**: `MovementCallbacks`
- **Purpose**: Type for cell navigation callbacks (focus up/down/create)
- **Deps**: none

#### ✅ KEEP — `codemirror/utils.ts` — 103 lines

- **Exports**: `getEditorCodeAsSingleExpression()`, `isAtEndOfEditor()`, `isAtStartOfEditor()`, various cursor utilities
- **Purpose**: Editor state query utilities
- **Deps**: none

### ai/ (3 files)

#### ⚠️ ADAPT — `codemirror/ai/request.ts` — 72 lines

- **Exports**: `sendAiCompletionRequest()`
- **Purpose**: Sends inline AI completion request to kernel
- **Deps**: `../../network/requests`

#### ⚠️ ADAPT — `codemirror/ai/resources.ts` — 143 lines

- **Exports**: `getAiCompletionResources()`
- **Purpose**: Gathers editor context (code, cursor, variables) for AI completion
- **Deps**: `../../cells/cells`, `../../variables/state`

#### ✅ KEEP — `codemirror/ai/state.ts` — 12 lines

- **Exports**: `aiCompletionStateField`
- **Purpose**: CodeMirror state field for inline AI completion ghost text
- **Deps**: none

### cells/ (3 files)

#### ✅ KEEP — `codemirror/cells/extensions.ts` — 390 lines

- **Exports**: `cellMovementBundle()`, `cellCodeEditingBundle()`
- **Purpose**: Cell-level CodeMirror extensions — movement between cells, cell-specific editing behavior
- **Deps**: `../facet`, `../../cells/ids`

#### ✅ KEEP — `codemirror/cells/state.ts` — 32 lines

- **Exports**: `cellStateField`
- **Purpose**: CodeMirror state field tracking cell metadata
- **Deps**: none

#### ✅ KEEP — `codemirror/cells/traceback-decorations.ts` — 154 lines

- **Exports**: `tracebackDecorations()`
- **Purpose**: Error traceback line decorations — highlights lines referenced in Python tracebacks
- **Deps**: none

### compat/ (1 file)

#### ✅ KEEP — `codemirror/compat/jupyter.tsx` — 233 lines

- **Exports**: `JupyterShortcuts`
- **Purpose**: Jupyter-compatible keyboard shortcuts overlay
- **Deps**: `../facet`

### completion/ (6 files)

#### ⚠️ ADAPT — `codemirror/completion/Autocompleter.ts` — 172 lines

- **Exports**: `Autocompleter`
- **Purpose**: Completion source — sends completion requests to kernel, returns CodeMirror completions
- **Deps**: `../../network/requests`, `../facet`

#### ✅ KEEP — `codemirror/completion/completer.ts` — 58 lines

- **Exports**: `completer()`
- **Purpose**: Top-level completion function — combines kernel completions with variable completions
- **Deps**: `./Autocompleter`, `./variable-completions`

#### ✅ KEEP — `codemirror/completion/hints.ts` — 155 lines

- **Exports**: `hintTooltip()`, `getCompletionInfo()`
- **Purpose**: Completion tooltip rendering — displays docstrings and type info
- **Deps**: none

#### ✅ KEEP — `codemirror/completion/keymap.ts` — 70 lines

- **Exports**: `completionKeymap()`
- **Purpose**: Custom keymap for completion — Tab/Enter/Escape behavior
- **Deps**: none

#### ✅ KEEP — `codemirror/completion/utils.ts` — 18 lines

- **Exports**: `isCompletionOpen()`
- **Purpose**: Checks if completion popup is visible
- **Deps**: none

#### ⚠️ ADAPT — `codemirror/completion/variable-completions.ts` — 100 lines

- **Exports**: `variableCompletionSource()`
- **Purpose**: Local variable completion — completes from known Python variables
- **Deps**: `../../variables/state`

### config/ (2 files)

#### ✅ KEEP — `codemirror/config/extension.ts` — 66 lines

- **Exports**: `configExtension()`
- **Purpose**: Configuration-driven extension — applies user preferences (line numbers, word wrap, etc.)
- **Deps**: `../../config/config`

#### ✅ KEEP — `codemirror/config/types.ts` — 10 lines

- **Exports**: `CodemirrorConfig`
- **Purpose**: Editor configuration type
- **Deps**: none

### copilot/ (10 files)

#### ⚠️ ADAPT — `codemirror/copilot/client.ts` — 65 lines

- **Exports**: `CopilotClient`
- **Purpose**: GitHub Copilot client — communicates with Copilot language server
- **Deps**: `../../network/requests`

#### ⚠️ ADAPT — `codemirror/copilot/copilot-config.tsx` — 313 lines

- **Exports**: `CopilotConfig`, `useCopilotStatus()`
- **Purpose**: Copilot configuration UI and state management
- **Deps**: `../../config/config`, `../facet`

#### ✅ KEEP — `codemirror/copilot/extension.ts` — 285 lines

- **Exports**: `copilotExtension()`
- **Purpose**: CodeMirror extension for Copilot inline suggestions — ghost text, accept/reject
- **Deps**: `./client`, `./getCodes`, `./state`

#### ✅ KEEP — `codemirror/copilot/getCodes.ts` — 130 lines

- **Exports**: `getCodes()`
- **Purpose**: Gathers surrounding cell code for Copilot context
- **Deps**: `../../cells/cells`

#### ⚠️ ADAPT — `codemirror/copilot/language-server.ts` — 349 lines

- **Exports**: `CopilotLanguageServer`
- **Purpose**: LSP client for GitHub Copilot — handles completion requests and responses
- **Deps**: `../../network/requests`, `../facet`

#### ✅ KEEP — `codemirror/copilot/state.ts` — 75 lines

- **Exports**: `copilotStateField`, `copilotSuggestion()`
- **Purpose**: CodeMirror state field for Copilot suggestions
- **Deps**: none

#### ⚠️ ADAPT — `codemirror/copilot/transport.ts` — 221 lines

- **Exports**: `CopilotTransport`
- **Purpose**: WebSocket transport for Copilot LSP communication
- **Deps**: `../../lsp/transport`

#### ✅ KEEP — `codemirror/copilot/trim-utils.ts` — 33 lines

- **Exports**: `trimPrefixMatch()`, `trimSuffixMatch()`
- **Purpose**: String trimming for Copilot suggestion deduplication
- **Deps**: none

#### ✅ KEEP — `codemirror/copilot/types.ts` — 48 lines

- **Exports**: Copilot LSP types (`CopilotSignInInitiateParams`, `CopilotCompletionParams`, etc.)
- **Purpose**: Type definitions for Copilot protocol messages
- **Deps**: none

### editing/ (3 files)

#### ✅ KEEP — `codemirror/editing/commands.ts` — 26 lines

- **Exports**: `toggleMarkdownHeading()`
- **Purpose**: Markdown heading toggle command
- **Deps**: none

#### ❌ REMOVE — `codemirror/editing/debugging.ts` — 58 lines (reason: VT doesn't need Python debugger)

- **Exports**: `debuggerBundle()`
- **Purpose**: CodeMirror extension for breakpoint gutters and debug actions
- **Deps**: `../../debugger/state`

#### ✅ KEEP — `codemirror/editing/extensions.ts` — 4 lines

- **Exports**: (re-exports)
- **Purpose**: Barrel file for editing extensions
- **Deps**: `./commands`, `./debugging`

### find-replace/ (5 files)

#### ✅ KEEP — `codemirror/find-replace/extension.ts` — 41 lines

- **Exports**: `findReplaceExtension()`
- **Purpose**: Custom find/replace panel extension
- **Deps**: `./state`, `./search-highlight`

#### ✅ KEEP — `codemirror/find-replace/navigate.ts` — 221 lines

- **Exports**: `FindReplacePanel`
- **Purpose**: Find/replace navigation UI — React component rendered in CodeMirror panel
- **Deps**: `./state`, `./query`

#### ✅ KEEP — `codemirror/find-replace/query.ts` — 31 lines

- **Exports**: `createSearchQuery()`
- **Purpose**: Creates CodeMirror search query from panel state
- **Deps**: none

#### ✅ KEEP — `codemirror/find-replace/search-highlight.ts` — 150 lines

- **Exports**: `searchHighlight()`
- **Purpose**: Custom search match highlighting with decorations
- **Deps**: `./state`

#### ✅ KEEP — `codemirror/find-replace/state.ts` — 167 lines

- **Exports**: `findReplaceStateField`, `openFindReplace()`, `closeFindReplace()`
- **Purpose**: State field for find/replace panel visibility and query state
- **Deps**: none

### go-to-definition/ (4 files)

#### ✅ KEEP — `codemirror/go-to-definition/commands.ts` — 80 lines

- **Exports**: `goToDefinition()`
- **Purpose**: Go-to-definition command — resolves symbol and navigates to defining cell
- **Deps**: `../../variables/state`, `../../cells/cells`

#### ✅ KEEP — `codemirror/go-to-definition/extension.ts` — 23 lines

- **Exports**: `goToDefinitionBundle()`
- **Purpose**: Extension bundle for go-to-definition (command + underline + keymap)
- **Deps**: `./commands`, `./underline`

#### ✅ KEEP — `codemirror/go-to-definition/underline.ts` — 223 lines

- **Exports**: `definitionUnderline()`
- **Purpose**: Cmd+hover underline decoration for clickable symbol definitions
- **Deps**: `./utils`, `../../variables/state`

#### ✅ KEEP — `codemirror/go-to-definition/utils.ts` — 126 lines

- **Exports**: `getWordAtPosition()`, `isDefinitionResolvable()`
- **Purpose**: Utilities for extracting word at cursor and checking if it maps to a known variable
- **Deps**: `../../variables/state`

### keymaps/ (3 files)

#### ✅ KEEP — `codemirror/keymaps/keymaps.ts` — 163 lines

- **Exports**: `keymapBundle()`
- **Purpose**: Master keymap assembly — merges default, cell movement, and user-configured keymaps
- **Deps**: `../facet`, `../../hotkeys/hotkeys`

#### ⚠️ ADAPT — `codemirror/keymaps/vim.ts` — 360 lines

- **Exports**: `vimKeymapExtension()`
- **Purpose**: Vim mode extension — custom Ex commands (:w, :q), visual mode tweaks, cell navigation
- **Deps**: `../../cells/cells`, `../../saving/save-component`

#### ✅ KEEP — `codemirror/keymaps/vimrc.ts` — 149 lines

- **Exports**: `parseVimrc()`, `applyVimrc()`
- **Purpose**: Parses user .vimrc-style configuration for vim keybindings
- **Deps**: none

### language/ (22 files)

#### ✅ KEEP — `codemirror/language/LanguageAdapters.ts` — 29 lines

- **Exports**: `LanguageAdapters`
- **Purpose**: Map of language adapters (Python, Markdown, SQL)
- **Deps**: `./languages/python`, `./languages/markdown`, `./languages/sql/sql`

#### ✅ KEEP — `codemirror/language/commands.ts` — 59 lines

- **Exports**: `toggleComment()`, `addCellComment()`
- **Purpose**: Language-aware comment commands
- **Deps**: `./types`

#### ✅ KEEP — `codemirror/language/extension.ts` — 334 lines

- **Exports**: `languageExtension()`, `reconfigureLanguage()`
- **Purpose**: Language extension setup — configures syntax highlighting, completion, and language-specific behavior
- **Deps**: `./types`, `./LanguageAdapters`, `../../config/config`

#### ✅ KEEP — `codemirror/language/metadata.ts` — 71 lines

- **Exports**: `LanguageMetadata`, `parseCellMetadata()`
- **Purpose**: Parses cell header comments for language metadata (`# @sql`, `# @markdown`)
- **Deps**: none

#### ✅ KEEP — `codemirror/language/types.ts` — 41 lines

- **Exports**: `LanguageAdapter`, `LanguageAdapterType`
- **Purpose**: Interface for language adapters — defines how each language integrates with CodeMirror
- **Deps**: none

#### ✅ KEEP — `codemirror/language/utils.ts` — 73 lines

- **Exports**: `getCurrentLanguageAdapter()`, `getLanguageAdapterType()`
- **Purpose**: Resolves current language adapter from editor state
- **Deps**: `./types`, `./metadata`

#### ✅ KEEP — `codemirror/language/utils/indentOneTab.ts` — 9 lines

- **Exports**: `indentOneTab()`
- **Purpose**: Indentation helper
- **Deps**: none

#### ✅ KEEP — `codemirror/language/embedded/embedded-python.ts` — 131 lines

- **Exports**: `embeddedPython()`
- **Purpose**: Embedded Python in SQL — highlights Python expressions inside SQL f-strings
- **Deps**: none

#### ✅ KEEP — `codemirror/language/embedded/latex.ts` — 257 lines

- **Exports**: `latexSyntax()`
- **Purpose**: LaTeX math syntax highlighting within Python strings
- **Deps**: none

#### ✅ KEEP — `codemirror/language/languages/markdown.ts` — 134 lines

- **Exports**: `MarkdownLanguageAdapter`
- **Purpose**: Markdown language adapter — configures CodeMirror for markdown cells
- **Deps**: `../types`

#### ✅ KEEP — `codemirror/language/languages/python.ts` — 423 lines

- **Exports**: `PythonLanguageAdapter`
- **Purpose**: Python language adapter — syntax highlighting, completion, auto-indent, run shortcuts
- **Deps**: `../types`, `../../completion/completer`

#### ⚠️ ADAPT — `codemirror/language/languages/sql/sql.ts` — 518 lines

- **Exports**: `SQLLanguageAdapter`
- **Purpose**: SQL language adapter — SQL syntax, schema completion, query execution
- **Deps**: `../../types`, `./completion-sources`, `./renderers`, `../../../datasets/state`

#### ⚠️ ADAPT — `codemirror/language/languages/sql/banner-validation-errors.ts` — 85 lines

- **Exports**: `sqlValidationBanner()`
- **Purpose**: SQL validation error banner above editor
- **Deps**: `../../../datasets/request-registry`

#### ⚠️ ADAPT — `codemirror/language/languages/sql/completion-builder.ts` — 160 lines

- **Exports**: `buildSQLCompletions()`
- **Purpose**: Builds SQL completion items from schema (tables, columns, keywords)
- **Deps**: `../../../datasets/state`

#### ⚠️ ADAPT — `codemirror/language/languages/sql/completion-sources.tsx` — 105 lines

- **Exports**: `sqlCompletionSource()`
- **Purpose**: CodeMirror completion source for SQL — triggers on dot/keyword
- **Deps**: `./completion-builder`, `./completion-store`

#### ⚠️ ADAPT — `codemirror/language/languages/sql/completion-store.ts` — 183 lines

- **Exports**: `SQLCompletionStore`
- **Purpose**: Caches SQL completions per connection/schema
- **Deps**: `./completion-builder`

#### ⚠️ ADAPT — `codemirror/language/languages/sql/renderers.tsx` — 653 lines

- **Exports**: `sqlOutputRenderer()`
- **Purpose**: SQL query result renderer — table output, chart preview, export options
- **Deps**: `../../../datasets/state`, `../../../cells/cells`

#### ✅ KEEP — `codemirror/language/languages/sql/sql-mode.ts` — 25 lines

- **Exports**: `SqlModes`
- **Purpose**: SQL dialect constants
- **Deps**: none

#### ✅ KEEP — `codemirror/language/languages/sql/utils.ts` — 134 lines

- **Exports**: `extractSQLQuery()`, `sanitizeSQL()`
- **Purpose**: SQL string extraction from Python code, sanitization
- **Deps**: none

#### ✅ KEEP — `codemirror/language/panel/markdown.tsx` — 64 lines

- **Exports**: `MarkdownPanel`
- **Purpose**: Markdown preview panel below editor
- **Deps**: none

#### ✅ KEEP — `codemirror/language/panel/panel.tsx` — 201 lines

- **Exports**: `LanguagePanel`
- **Purpose**: Language-specific bottom panel (markdown preview, SQL output)
- **Deps**: `./markdown`, `./sql`

#### ✅ KEEP — `codemirror/language/panel/sql.tsx` — 218 lines

- **Exports**: `SQLPanel`
- **Purpose**: SQL output panel — shows query results in table
- **Deps**: `../languages/sql/renderers`

### lsp/ (6 files)

#### ⚠️ ADAPT — `codemirror/lsp/federated-lsp.ts` — 246 lines

- **Exports**: `FederatedLanguageServerClient`
- **Purpose**: LSP client that federates across multiple language servers (Python, SQL)
- **Deps**: `./types`

#### ✅ KEEP — `codemirror/lsp/lens.ts` — 151 lines

- **Exports**: `lspCodeLens()`
- **Purpose**: CodeMirror extension for LSP code lenses (inline action hints)
- **Deps**: `./types`

#### ⚠️ ADAPT — `codemirror/lsp/notebook-lsp.ts` — 793 lines

- **Exports**: `NotebookLSPClient`
- **Purpose**: **Largest LSP file** — notebook-aware LSP client that maps between cell positions and virtual document positions
- **Deps**: `./types`, `./transports`, `../../cells/cells`, `../../variables/state`

#### ⚠️ ADAPT — `codemirror/lsp/transports.ts` — 28 lines

- **Exports**: `createLSPTransport()`
- **Purpose**: Creates WebSocket transport for LSP communication
- **Deps**: `../../lsp/transport`, `../../runtime/config`

#### ✅ KEEP — `codemirror/lsp/types.ts` — 42 lines

- **Exports**: `LSPPosition`, `LSPRange`, `LSPDiagnostic`
- **Purpose**: LSP protocol type definitions
- **Deps**: none

#### ✅ KEEP — `codemirror/lsp/utils.ts` — 11 lines

- **Exports**: `positionToOffset()`
- **Purpose**: Converts LSP position to CodeMirror offset
- **Deps**: none

### markdown/ (3 files)

#### ✅ KEEP — `codemirror/markdown/commands.ts` — 503 lines

- **Exports**: `markdownKeymap()`
- **Purpose**: Markdown editing commands — bold, italic, heading, list, code block, link shortcuts
- **Deps**: none

#### ✅ KEEP — `codemirror/markdown/completions.ts` — 273 lines

- **Exports**: `markdownCompletionSource()`
- **Purpose**: Markdown completion — emoji, heading, code fence, link completions
- **Deps**: none

#### ✅ KEEP — `codemirror/markdown/extension.ts` — 106 lines

- **Exports**: `markdownExtension()`
- **Purpose**: Markdown editing extension bundle
- **Deps**: `./commands`, `./completions`

### misc/ (3 files)

#### ✅ KEEP — `codemirror/misc/dnd.ts` — 48 lines

- **Exports**: `dndBundle()`
- **Purpose**: Drag-and-drop extension — handles file drops into editor
- **Deps**: none

#### ✅ KEEP — `codemirror/misc/paste.ts` — 185 lines

- **Exports**: `pasteBundle()`
- **Purpose**: Smart paste — handles pasting code, URLs, images with language-aware formatting
- **Deps**: `../../cells/cells`

#### ✅ KEEP — `codemirror/misc/string-braces.ts` — 37 lines

- **Exports**: `autoCloseBraces()`
- **Purpose**: Auto-close braces in Python f-strings
- **Deps**: none

### placeholder/ (1 file)

#### ✅ KEEP — `codemirror/placeholder/extensions.ts` — 99 lines

- **Exports**: `placeholderExtension()`
- **Purpose**: Custom placeholder text when editor is empty
- **Deps**: `../facet`

### react-dom/ (1 file)

#### ✅ KEEP — `codemirror/react-dom/createPanel.tsx` — 39 lines

- **Exports**: `createPanel()`
- **Purpose**: Renders React component inside CodeMirror panel slot
- **Deps**: none (React portal)

### reactive-references/ (2 files)

#### ✅ KEEP — `codemirror/reactive-references/analyzer.ts` — 608 lines

- **Exports**: `analyzeReactiveReferences()`
- **Purpose**: Static analysis of Python code — extracts variable references, definitions, and reactive dependencies using @lezer/python
- **Deps**: `@lezer/python`

#### ✅ KEEP — `codemirror/reactive-references/extension.ts` — 154 lines

- **Exports**: `reactiveReferencesExtension()`
- **Purpose**: CodeMirror extension — highlights reactive variable references with decorations
- **Deps**: `./analyzer`, `../../variables/state`

### readonly/ (1 file)

#### ✅ KEEP — `codemirror/readonly/extension.ts` — 187 lines

- **Exports**: `readonlyExtension()`
- **Purpose**: Read-only mode extension — prevents editing, adds visual indicators
- **Deps**: none

### rtc/ (4 files)

#### ❌ REMOVE — `codemirror/rtc/extension.ts` — 450 lines (reason: VT doesn't need real-time collaboration)

- **Exports**: `rtcExtension()`
- **Purpose**: Real-time collaboration extension — Loro CRDT integration for multi-user editing
- **Deps**: `./loro/awareness`, `./loro/sync`, `../../rtc/state`

#### ❌ REMOVE — `codemirror/rtc/loro/awareness.ts` — 531 lines (reason: VT doesn't need real-time collaboration)

- **Exports**: `AwarenessManager`, `awarenessExtension()`
- **Purpose**: Loro awareness — remote cursor positions, user presence indicators
- **Deps**: none (pure CodeMirror + Loro)

#### ❌ REMOVE — `codemirror/rtc/loro/colors.ts` — 38 lines (reason: VT doesn't need real-time collaboration)

- **Exports**: `getUserColor()`
- **Purpose**: Assigns consistent colors to RTC users
- **Deps**: none

#### ❌ REMOVE — `codemirror/rtc/loro/sync.ts` — 167 lines (reason: VT doesn't need real-time collaboration)

- **Exports**: `loroSyncExtension()`
- **Purpose**: Loro CRDT sync — bidirectional sync between CodeMirror and Loro document
- **Deps**: none (pure CodeMirror + Loro)

### theme/ (2 files)

#### ✅ KEEP — `codemirror/theme/dark.ts` — 50 lines

- **Exports**: `darkTheme()`
- **Purpose**: Dark CodeMirror theme — syntax highlighting colors for dark mode
- **Deps**: none

#### ✅ KEEP — `codemirror/theme/light.ts` — 58 lines

- **Exports**: `lightTheme()`
- **Purpose**: Light CodeMirror theme — syntax highlighting colors for light mode
- **Deps**: none

### vim/ (1 file)

#### ✅ KEEP — `codemirror/vim/cursor-visibility.ts` — 58 lines

- **Exports**: `vimCursorVisibility()`
- **Purpose**: Ensures vim cursor remains visible during mode transitions
- **Deps**: none

---

## Summary

| Subdirectory   | Files    | Total Lines (approx) |
| -------------- | -------- | -------------------- |
| Root           | 6        | ~570                 |
| cells/         | 18       | ~3,824               |
| config/        | 6        | ~570                 |
| network/       | 12       | ~750                 |
| kernel/        | 6        | ~373                 |
| state/         | 2        | ~94                  |
| variables/     | 2        | ~105                 |
| dom/           | 6        | ~381                 |
| errors/        | 3        | ~179                 |
| alerts/        | 1        | 144                  |
| cache/         | 1        | 6                    |
| datasets/      | 5        | ~597                 |
| debugger/      | 1        | 11                   |
| documentation/ | 3        | ~89                  |
| export/        | 1        | 230                  |
| functions/     | 1        | 19                   |
| hotkeys/       | 3        | ~763                 |
| i18n/          | 2        | ~49                  |
| layout/        | 2        | ~195                 |
| lsp/           | 1        | 204                  |
| meta/          | 2        | ~52                  |
| packages/      | 3        | ~173                 |
| rtc/           | 1        | 26                   |
| runtime/       | 4        | ~396                 |
| saving/        | 5        | ~478                 |
| secrets/       | 1        | 17                   |
| slots/         | 1        | 10                   |
| static/        | 5        | ~361                 |
| vscode/        | 2        | ~187                 |
| websocket/     | 6        | ~808                 |
| ai/            | 22       | ~3,597               |
| wasm/          | 20       | ~2,497               |
| islands/       | 10       | ~1,220               |
| codemirror/    | 87       | ~14,606              |
| **Total**      | **~251** | **~33,570**          |
