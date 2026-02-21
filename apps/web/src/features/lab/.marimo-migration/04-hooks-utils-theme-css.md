# 04 — hooks/ + utils/ + theme/ + css/ + root

> Marimo frontend source inventory for migration reference.
> Source: `/Users/vx/WebstormProjects/marimo/frontend/src/`

---

## hooks/

### ✅ KEEP — `hooks/debug.ts`

- **Lines**: 117
- **Exports**: `useDebugMounting`, `usePropsDidChange`, `useMemoDebugChanges`
- **Purpose**: Development-only hooks for debugging component mounting, prop changes, and memo dependency changes
- **Dependencies**: `@/utils/Logger`, `dequal`

### ✅ KEEP — `hooks/useAsyncData.ts`

- **Lines**: 393
- **Exports**: `useAsyncData` (hook), `combineAsyncData`, `AsyncDataResult` (type), `AsyncData` (type)
- **Purpose**: Generic async data fetching hook with loading/error/data states and combinators
- **Dependencies**: `react-use-event-hook`, `@/utils/invariant`

### ❌ REMOVE — `hooks/useAudioRecorder.ts` (reason: no audio recording use case in VT)

- **Lines**: 90
- **Exports**: `useAudioRecorder`
- **Purpose**: Hook for recording audio via MediaRecorder API with start/stop/timer
- **Dependencies**: `@/utils/Logger`, `./useLifecycle`, `./useTimer`

### ✅ KEEP — `hooks/useAutoGrowInputProps.ts`

- **Lines**: 57
- **Exports**: `useAutoGrowInputProps`
- **Purpose**: Hook that returns props for an input element to auto-grow with its content
- **Dependencies**: `./useLifecycle`

### ✅ KEEP — `hooks/useBoolean.ts`

- **Lines**: 27
- **Exports**: `useBoolean`
- **Purpose**: Simple boolean state hook with toggle/setTrue/setFalse helpers
- **Dependencies**: (none)

### ✅ KEEP — `hooks/useCellRenderCount.ts`

- **Lines**: 17
- **Exports**: `useCellRenderCount`
- **Purpose**: Dev utility hook tracking component render count via ref
- **Dependencies**: (none)

### ✅ KEEP — `hooks/useDebounce.ts`

- **Lines**: 91
- **Exports**: `useDebounce`, `useDebounceControlledState`, `useDebouncedCallback`
- **Purpose**: Debounce hooks for values and callbacks with configurable delay
- **Dependencies**: `lodash-es`, `react-use-event-hook`

### ✅ KEEP — `hooks/useDeepCompareMemoize.ts`

- **Lines**: 23
- **Exports**: `useDeepCompareMemoize`
- **Purpose**: Hook returning a memoized ref that only updates on deep equality change
- **Dependencies**: `dequal`

### ❌ REMOVE — `hooks/useDuplicateShortcuts.ts` (reason: tied to Marimo hotkey registry infrastructure)

- **Lines**: 146
- **Exports**: `findDuplicateShortcuts`, `useDuplicateShortcuts`, `normalizeShortcutKey`
- **Purpose**: Detect and report duplicate keyboard shortcuts in the hotkey registry
- **Dependencies**: `@/core/hotkeys/hotkeys`

### ✅ KEEP — `hooks/useEffectSkipFirstRender.ts`

- **Lines**: 25
- **Exports**: `useEffectSkipFirstRender`
- **Purpose**: useEffect variant that skips execution on initial mount
- **Dependencies**: (none)

### ✅ KEEP — `hooks/useElapsedTime.ts`

- **Lines**: 26
- **Exports**: `useElapsedTime`
- **Purpose**: Hook returning elapsed time since a given timestamp, updating every second
- **Dependencies**: `@/utils/time`

### ✅ KEEP — `hooks/useEvent.ts`

- **Lines**: 3
- **Exports**: `useEvent` (re-export)
- **Purpose**: Re-exports useEvent from react-use-event-hook for stable callback references
- **Dependencies**: `react-use-event-hook`

### 🔄 ALREADY — `hooks/useEventListener.ts`

- **Lines**: 69
- **Exports**: `useEventListener`, `HTMLElementNotDerivedFromRef` (type), `isRefObject`
- **Purpose**: Type-safe hook for adding/removing DOM event listeners with ref or element target
- **Dependencies**: (none)

### ❌ REMOVE — `hooks/useFormatting.ts` (reason: VT has its own format.ts in lib/; react-aria dependency not needed)

- **Lines**: 98
- **Exports**: `usePrettyNumber`, `usePrettyScientificNumber`, `usePrettyEngineeringNumber`, `usePrettyDate`, `useTimeAgo`, `useShortTimeZone`
- **Purpose**: Locale-aware formatting hooks for numbers, dates, and timezones via react-aria
- **Dependencies**: `react-aria`, `@/utils/dates`, `@/utils/numbers`

### ❌ REMOVE — `hooks/useHotkey.ts` (reason: tied to Marimo hotkey registry and jotai config infrastructure)

- **Lines**: 86
- **Exports**: `useHotkey`, `useKeydownOnElement`
- **Purpose**: Hotkey binding hooks integrated with marimo's hotkey registry and config
- **Dependencies**: `jotai`, `@/core/config/config`, `@/core/hotkeys/hotkeys`, `@/utils/functions`, `@/utils/Logger`, `@/utils/objects`, `../core/hotkeys/actions`, `../core/hotkeys/shortcuts`, `./useEvent`, `./useEventListener`

### ❌ REMOVE — `hooks/useIframeCapabilities.ts` (reason: VT is not embedded in iframes)

- **Lines**: 15
- **Exports**: `useIframeCapabilities`
- **Purpose**: Hook returning iframe capability flags (localStorage, sessionStorage, etc.)
- **Dependencies**: `@/utils/capabilities`

### ✅ KEEP — `hooks/useInputHistory.ts`

- **Lines**: 104
- **Exports**: `useInputHistory`
- **Purpose**: Hook managing input history with up/down arrow navigation (like a shell)
- **Dependencies**: (none)

### ✅ KEEP — `hooks/useInternalStateWithSync.ts`

- **Lines**: 27
- **Exports**: `useInternalStateWithSync`
- **Purpose**: useState wrapper that syncs with an external value prop on change
- **Dependencies**: (none)

### ✅ KEEP — `hooks/useInterval.ts`

- **Lines**: 76
- **Exports**: `useInterval`
- **Purpose**: Hook for running a callback at regular intervals with start/stop/reset controls
- **Dependencies**: `./useEventListener`

### ✅ KEEP — `hooks/useIsDragging.tsx`

- **Lines**: 40
- **Exports**: `useIsDragging`
- **Purpose**: Hook tracking global mouse drag state via mousedown/mouseup listeners
- **Dependencies**: (none)

### ✅ KEEP — `hooks/useLifecycle.ts`

- **Lines**: 21
- **Exports**: `useOnMount`, `useOnUnmount`
- **Purpose**: Simple mount/unmount lifecycle hooks
- **Dependencies**: (none)

### ✅ KEEP — `hooks/useLocalStorage.ts`

- **Lines**: 23
- **Exports**: `useLocalStorage`
- **Purpose**: Hook wrapping TypedLocalStorage for persistent state
- **Dependencies**: `@/utils/storage/typed`

### ✅ KEEP — `hooks/useNonce.ts`

- **Lines**: 10
- **Exports**: `useNonce`
- **Purpose**: Hook returning an incrementing nonce value to force re-renders
- **Dependencies**: (none)

### ❌ REMOVE — `hooks/usePackageMetadata.ts` (reason: PyPI-specific, no Python packages in VT)

- **Lines**: 53
- **Exports**: `usePackageMetadata`, `PyPiPackageResponse` (type)
- **Purpose**: Hook fetching PyPI package metadata with caching via TimedCache
- **Dependencies**: `zod`, `@/utils/timed-cache`, `@/utils/versions`, `./useAsyncData`

### ❌ REMOVE — `hooks/useRecentCommands.ts` (reason: tied to Marimo command palette infrastructure)

- **Lines**: 26
- **Exports**: `useRecentCommands`
- **Purpose**: Hook persisting recently used command palette commands in localStorage
- **Dependencies**: `@/core/hotkeys/hotkeys`, `./useLocalStorage`

### ✅ KEEP — `hooks/useResizeHandle.ts`

- **Lines**: 114
- **Exports**: `useResizeHandle`
- **Purpose**: Hook for drag-to-resize UI panels with min/max constraints
- **Dependencies**: (none)

### ✅ KEEP — `hooks/useResizeObserver.ts`

- **Lines**: 102
- **Exports**: `useResizeObserver`
- **Purpose**: Hook wrapping ResizeObserver for tracking element dimensions
- **Dependencies**: (none)

### ✅ KEEP — `hooks/useScript.ts`

- **Lines**: 91
- **Exports**: `useScript`
- **Purpose**: Hook for dynamically loading external script tags with status tracking
- **Dependencies**: (none)

### ✅ KEEP — `hooks/useSelectAllContent.ts`

- **Lines**: 43
- **Exports**: `useSelectAllContent`
- **Purpose**: Hook providing Cmd+A select-all behavior within a container element
- **Dependencies**: (none)

### ✅ KEEP — `hooks/useTimer.ts`

- **Lines**: 52
- **Exports**: `useTimer`
- **Purpose**: Timer hook with start/stop/reset and elapsed time tracking
- **Dependencies**: `react-aria`, `react-use-event-hook`

---

## utils/

### ✅ KEEP — `utils/Deferred.ts`

- **Lines**: 42
- **Exports**: `Deferred` (class)
- **Purpose**: Promise wrapper exposing resolve/reject externally for manual promise control
- **Dependencies**: (none)

### ⚠️ ADAPT — `utils/Logger.ts` (adapt to use console directly or VT's own logging pattern)

- **Lines**: 91
- **Exports**: `Logger` (singleton), `ConsoleLogger` (class), `DisabledLogger` (class)
- **Purpose**: Pluggable logging facade with console and disabled implementations
- **Dependencies**: `./functions`

### ✅ KEEP — `utils/arrays.ts`

- **Lines**: 130
- **Exports**: `arrayDelete`, `arrayInsert`, `arrayMove`, `arrayInsertMany`, `arrayShallowEquals`, `Arrays` (namespace), `arrayToggle`, `uniqueBy`, `uniqueByTakeLast`, `getNextIndex`
- **Purpose**: Immutable array manipulation utilities (insert, delete, move, dedupe, toggle)
- **Dependencies**: `./invariant`, `./math`

### ✅ KEEP — `utils/assertExists.ts`

- **Lines**: 13
- **Exports**: `assertExists`
- **Purpose**: Runtime assertion that a value is not null/undefined, returns narrowed type
- **Dependencies**: (none)

### ✅ KEEP — `utils/assertNever.ts`

- **Lines**: 21
- **Exports**: `assertNever`, `logNever`
- **Purpose**: Exhaustiveness checking utilities for switch/if-else chains
- **Dependencies**: `./invariant`, `./Logger`

### ❌ REMOVE — `utils/async-capture-tracker.ts` (reason: tied to Marimo kernel output batching infrastructure)

- **Lines**: 169
- **Exports**: `AsyncCaptureTracker` (class), `CaptureHandle` (interface)
- **Purpose**: Tracks async operations with ordered capture/release semantics for output batching
- **Dependencies**: `./Deferred`

### ✅ KEEP — `utils/batch-requests.ts`

- **Lines**: 29
- **Exports**: `batch`
- **Purpose**: Batches multiple async calls into a single debounced request
- **Dependencies**: (none)

### ✅ KEEP — `utils/blob.ts`

- **Lines**: 33
- **Exports**: `serializeBlob`, `deserializeBlob`
- **Purpose**: Serialize/deserialize Blobs to/from base64 JSON-safe format
- **Dependencies**: `./json/base64`

### ❌ REMOVE — `utils/capabilities.ts` (reason: iframe capability detection not needed in VT)

- **Lines**: 115
- **Exports**: `IframeCapabilities` (type), `getIframeCapabilities`
- **Purpose**: Detect browser/iframe capabilities (localStorage, cookies, clipboard, etc.)
- **Dependencies**: `./Logger`, `./once`

### ❌ REMOVE — `utils/cell-urls.ts` (reason: tied to Marimo cell deep-link URL format)

- **Lines**: 32
- **Exports**: `createCellLink`, `extractCellNameFromHash`, `canLinkToCell`
- **Purpose**: Generate and parse marimo cell deep-link URLs with hash fragments
- **Dependencies**: `@/core/cells/names`

### ❌ REMOVE — `utils/cn.ts` (reason: VT already has cn() in @/lib/utils)

- **Lines**: 9
- **Exports**: `cn`
- **Purpose**: clsx + tailwind-merge utility for conditional class merging
- **Dependencies**: `clsx`, `tailwind-merge`

### ⚠️ ADAPT — `utils/copy.ts` (adapt to use navigator.clipboard directly, remove Logger dep)

- **Lines**: 24
- **Exports**: `copyToClipboard`
- **Purpose**: Copy text to clipboard via navigator.clipboard API with fallback
- **Dependencies**: `./Logger`

### ❌ REMOVE — `utils/createReducer.ts` (reason: jotai-based reducer factory, VT uses Zustand)

- **Lines**: 134
- **Exports**: `createReducer`, `createReducerAndAtoms`
- **Purpose**: Redux-style reducer factory integrated with jotai atoms for state management
- **Dependencies**: `jotai`, `@/utils/Logger`

### ✅ KEEP — `utils/dates.ts`

- **Lines**: 151
- **Exports**: `prettyDate`, `exactDateTime`, `getShortTimeZone`, `timeAgo`, `getDateFormat`, `supportedDateFormats`
- **Purpose**: Date formatting and relative time utilities using date-fns
- **Dependencies**: `@date-fns/tz`, `date-fns`, `./Logger`

### ✅ KEEP — `utils/dereference.ts`

- **Lines**: 11
- **Exports**: `derefNotNull`
- **Purpose**: Dereference a React ref, throwing if null
- **Dependencies**: (none)

### ✅ KEEP — `utils/dom.ts`

- **Lines**: 56
- **Exports**: `parseHtmlContent`, `ansiToPlainText`
- **Purpose**: Parse HTML strings and strip ANSI escape codes from terminal output
- **Dependencies**: `ansi_up`, `./Logger`

### ❌ REMOVE — `utils/download.ts` (reason: heavily tied to Marimo cell/network/toast infrastructure)

- **Lines**: 220
- **Exports**: `withLoadingToast`, `getImageDataUrlForCell`, `downloadCellOutputAsImage`, `downloadHTMLAsImage`, `downloadByURL`, `downloadBlob`, `downloadAsPDF`, `ADD_PRINTING_CLASS`
- **Purpose**: Download utilities for images, PDFs, and arbitrary blobs with toast feedback
- **Dependencies**: `@/components/ui/use-toast`, `@/core/cells/ids`, `@/core/network/requests`, many utils

### ✅ KEEP — `utils/edit-distance.ts`

- **Lines**: 144
- **Exports**: `editDistanceGeneral`, `editDistance`, `applyOperationsWithStub`, `mergeArray`, `OperationType`
- **Purpose**: Edit distance algorithm for diff-based array reconciliation
- **Dependencies**: (none)

### ❌ REMOVE — `utils/errors.ts` (reason: CellNotInitializedError/NoKernelConnectedError are Marimo-specific)

- **Lines**: 80
- **Exports**: `prettyError`, `CellNotInitializedError`, `NoKernelConnectedError`
- **Purpose**: Error formatting and custom error classes for kernel/cell errors
- **Dependencies**: `zod`

### ✅ KEEP — `utils/events.ts`

- **Lines**: 87
- **Exports**: `Events` (object: `stopPropagation`, `onEnter`, `preventFocus`, `fromInput`, `fromCodeMirror`, `shouldIgnoreKeyboardEvent`, `hasModifier`, `isMetaOrCtrl`)
- **Purpose**: DOM event helper utilities for common patterns (stop propagation, enter key, modifiers)
- **Dependencies**: (none)

### ✅ KEEP — `utils/fileToBase64.ts`

- **Lines**: 46
- **Exports**: `blobToString`, `filesToBase64`
- **Purpose**: Convert File/Blob objects to base64 strings via FileReader
- **Dependencies**: (none)

### ✅ KEEP — `utils/filenames.ts`

- **Lines**: 33
- **Exports**: `Filenames` (object)
- **Purpose**: Filename manipulation utilities (extension extraction, stem, etc.)
- **Dependencies**: (none)

### ✅ KEEP — `utils/formatting.ts`

- **Lines**: 52
- **Exports**: `formatBytes`, `formatTime`
- **Purpose**: Human-readable byte size and time duration formatters
- **Dependencies**: `./numbers`

### ✅ KEEP — `utils/functions.ts`

- **Lines**: 25
- **Exports**: `Functions` (object: `NOOP`, `ASYNC_NOOP`, `THROW`, `asUpdater`, `identity`), `throwNotImplemented`
- **Purpose**: Function utility constants and helpers (no-op, identity, throw)
- **Dependencies**: (none)

### ❌ REMOVE — `utils/html-to-image.ts` (reason: html-to-image export not a VT lab requirement)

- **Lines**: 184
- **Exports**: `toPng`, `defaultHtmlToImageOptions`, `necessaryStyleProperties`
- **Purpose**: Wrapper around html-to-image with style preservation and retry logic
- **Dependencies**: `html-to-image`, `./Logger`

### ❌ REMOVE — `utils/id-tree.tsx` (reason: tied to Marimo multi-column cell layout and cell ID system)

- **Lines**: 1043
- **Exports**: `TreeNode` (class), `CollapsibleTree` (class), `MultiColumn` (class), `CellColumnIndex` (type), `CellColumnId` (type), `CellIndex` (type)
- **Purpose**: Tree data structure for managing cell layout in single/multi-column notebook views
- **Dependencies**: `typescript-memoize`, `@/components/editor/columns/storage`, `@/core/cells/ids`, `./arrays`, `./Logger`

### ✅ KEEP — `utils/idle.ts`

- **Lines**: 20
- **Exports**: `onIdle`
- **Purpose**: Schedule callback via requestIdleCallback with setTimeout fallback
- **Dependencies**: (none)

### ❌ REMOVE — `utils/iframe.ts` (reason: iframe content capture for export not needed in VT)

- **Lines**: 136
- **Exports**: `captureExternalIframes`
- **Purpose**: Capture and serialize iframe content for screenshot/export purposes
- **Dependencies**: (none)

### ✅ KEEP — `utils/invariant.ts`

- **Lines**: 38
- **Exports**: `invariant`
- **Purpose**: Runtime assertion function (throws if condition is false)
- **Dependencies**: (none)

### ✅ KEEP — `utils/lazy.ts`

- **Lines**: 31
- **Exports**: `reactLazyWithPreload`
- **Purpose**: React.lazy wrapper with preload() method for eager loading
- **Dependencies**: (none)

### ❌ REMOVE — `utils/links.ts` (reason: opens Marimo notebook files, not applicable to VT)

- **Lines**: 12
- **Exports**: `openNotebook`
- **Purpose**: Open a notebook file in a new browser tab
- **Dependencies**: `./url`

### ✅ KEEP — `utils/lru.ts`

- **Lines**: 73
- **Exports**: `LRUCache` (class)
- **Purpose**: Least-recently-used cache with configurable max size
- **Dependencies**: `./invariant`

### ✅ KEEP — `utils/maps.ts`

- **Lines**: 66
- **Exports**: `Maps` (object: `keyBy`, `collect`, `filterMap`, `mapValues`)
- **Purpose**: Map data structure utilities (key-by, collect, filter, transform)
- **Dependencies**: `./Logger`

### ✅ KEEP — `utils/math.ts`

- **Lines**: 7
- **Exports**: `clamp`
- **Purpose**: Numeric clamp function
- **Dependencies**: (none)

### ✅ KEEP — `utils/mergeRefs.ts`

- **Lines**: 15
- **Exports**: `mergeRefs`
- **Purpose**: Merge multiple React refs into a single callback ref
- **Dependencies**: (none)

### ❌ REMOVE — `utils/mime-types.ts` (reason: MIME type rendering config tied to Marimo cell output system)

- **Lines**: 182
- **Exports**: `MimeTypeConfig` (type), `createMimeConfig`, `getDefaultMimeConfig`, `applyHidingRules`, `sortByPrecedence`, `processMimeBundle`
- **Purpose**: MIME type precedence and rendering configuration for cell output display
- **Dependencies**: `@/components/editor/Output`, `./once`

### ✅ KEEP — `utils/multi-map.ts`

- **Lines**: 72
- **Exports**: `MultiMap` (class)
- **Purpose**: Map allowing multiple values per key (1:N mapping)
- **Dependencies**: (none)

### ✅ KEEP — `utils/numbers.ts`

- **Lines**: 150
- **Exports**: `prettyNumber`, `prettyScientificNumber`, `prettyEngineeringNumber`, `maxFractionalDigits`
- **Purpose**: Locale-aware number formatting with scientific/engineering notation
- **Dependencies**: `./Logger`, `./once`

### ✅ KEEP — `utils/objects.ts`

- **Lines**: 109
- **Exports**: `Objects` (object: `EMPTY`, `mapValues`, `fromEntries`, `entries`, `keys`, `size`, `keyBy`, `collect`, `groupBy`, `filter`, `omit`)
- **Purpose**: Type-safe object manipulation utilities
- **Dependencies**: (none)

### ✅ KEEP — `utils/once.ts`

- **Lines**: 50
- **Exports**: `once`, `memoizeLastValue`
- **Purpose**: Execute-once wrapper and single-value memoization
- **Dependencies**: `./arrays`

### ❌ REMOVE — `utils/pathUtils.ts` (reason: file path parsing for Marimo server file system)

- **Lines**: 77
- **Exports**: `getProtocolAndParentDirectories`, `fileSplit`
- **Purpose**: File path parsing utilities for extracting parent directories and protocol
- **Dependencies**: (none)

### ❌ REMOVE — `utils/paths.ts` (reason: URL path construction for Marimo server endpoints)

- **Lines**: 71
- **Exports**: `Paths` (object), `PathBuilder` (class), `FilePath` (type)
- **Purpose**: URL path construction for marimo server endpoints
- **Dependencies**: `./typed`

### ✅ KEEP — `utils/pluralize.ts`

- **Lines**: 43
- **Exports**: `PluralWord` (class), `PluralWords` (class)
- **Purpose**: English pluralization helpers (e.g., "1 cell" vs "2 cells")
- **Dependencies**: (none)

### ✅ KEEP — `utils/progress.ts`

- **Lines**: 62
- **Exports**: `ProgressState` (class), `ProgressListener` (type)
- **Purpose**: Observable progress state with subscribe/notify pattern for progress bars
- **Dependencies**: (none)

### ❌ REMOVE — `utils/reload-safe.ts` (reason: tied to Marimo toast infrastructure)

- **Lines**: 16
- **Exports**: `reloadSafe`
- **Purpose**: Safe page reload with toast notification
- **Dependencies**: `@/components/ui/use-toast`, `./Logger`

### ❌ REMOVE — `utils/repl.ts` (reason: exposes Marimo internals on window for devtools)

- **Lines**: 24
- **Exports**: `repl`
- **Purpose**: Expose objects on window for browser devtools debugging
- **Dependencies**: `./Logger`

### ❌ REMOVE — `utils/routes.ts` (reason: Marimo URL routing, VT uses Next.js App Router)

- **Lines**: 37
- **Exports**: `TinyRouter` (class)
- **Purpose**: Minimal URL router using path-to-regexp for matching and parameter extraction
- **Dependencies**: `path-to-regexp`

### ✅ KEEP — `utils/scroll.ts`

- **Lines**: 41
- **Exports**: `smartScrollIntoView`
- **Purpose**: Scroll element into view with smart behavior (only scrolls if not already visible)
- **Dependencies**: (none)

### ✅ KEEP — `utils/sets.ts`

- **Lines**: 31
- **Exports**: `Sets` (object: `merge`, `equals`)
- **Purpose**: Set merge and equality utilities
- **Dependencies**: (none)

### ✅ KEEP — `utils/shallow-compare.ts`

- **Lines**: 31
- **Exports**: `shallowCompare`
- **Purpose**: Shallow equality comparison for arrays and objects
- **Dependencies**: `./arrays`, `./objects`

### ✅ KEEP — `utils/staticImplements.ts`

- **Lines**: 8
- **Exports**: `staticImplements`
- **Purpose**: TypeScript decorator for enforcing static interface compliance
- **Dependencies**: (none)

### ✅ KEEP — `utils/strings.ts`

- **Lines**: 65
- **Exports**: `Strings` (object), `decodeUtf8`
- **Purpose**: String utilities (capitalize, snake_case conversion, truncate, UTF-8 decode)
- **Dependencies**: `lodash-es`, `./Logger`

### ✅ KEEP — `utils/time.ts`

- **Lines**: 44
- **Exports**: `Time` (class), `Milliseconds` (type), `Seconds` (type)
- **Purpose**: Type-safe time duration class with branded millisecond/second types
- **Dependencies**: (none)

### ✅ KEEP — `utils/timed-cache.ts`

- **Lines**: 53
- **Exports**: `TimedCache` (class)
- **Purpose**: Cache with TTL expiration for async results
- **Dependencies**: (none)

### ✅ KEEP — `utils/timeout.ts`

- **Lines**: 43
- **Exports**: `retryWithTimeout`
- **Purpose**: Retry an async function until success or timeout
- **Dependencies**: `./Logger`

### ⚠️ ADAPT — `utils/toast-progress.tsx` (adapt to use VT's toast system instead of Marimo's)

- **Lines**: 42
- **Exports**: `ToastProgress` (component)
- **Purpose**: React component rendering a progress bar inside toast notifications
- **Dependencies**: `@/components/ui/progress`, `./progress`

### ❌ REMOVE — `utils/traceback.ts` (reason: Python traceback parsing, not applicable to VT)

- **Lines**: 135
- **Exports**: `matchesSelector`, `elementContainsMarimoCellFile`, `getTracebackInfo`, `extractAllTracebackInfo`, `TracebackInfo` (type)
- **Purpose**: Parse Python traceback HTML to extract cell IDs and line numbers for error navigation
- **Dependencies**: `html-react-parser`, `@/core/cells/ids`

### ✅ KEEP — `utils/tracer.ts`

- **Lines**: 109
- **Exports**: `Tracer` (class)
- **Purpose**: Simple performance tracing with span-based measurement and logging
- **Dependencies**: `./Logger`

### ✅ KEEP — `utils/typed.ts`

- **Lines**: 18
- **Exports**: `TypedNumber` (type), `TypedString` (type), `Identified` (type)
- **Purpose**: Branded/phantom type wrappers for compile-time type safety on primitives
- **Dependencies**: (none)

### ✅ KEEP — `utils/url-parser.ts`

- **Lines**: 39
- **Exports**: `parseContent`, `ContentPart` (type)
- **Purpose**: Parse text to detect and categorize URLs and image links
- **Dependencies**: (none)

### ✅ KEEP — `utils/url.ts`

- **Lines**: 13
- **Exports**: `asURL`
- **Purpose**: Safe URL constructor with fallback
- **Dependencies**: (none)

### ❌ REMOVE — `utils/urls.ts` (reason: Marimo notebook URL construction and kernel session deps)

- **Lines**: 154
- **Exports**: `updateQueryParams`, `hasQueryParam`, `newNotebookURL`, `isUrl`, `appendQueryParams`
- **Purpose**: URL query parameter manipulation and notebook URL construction
- **Dependencies**: `@/core/kernel/session`, `./url`

### ✅ KEEP — `utils/uuid.ts`

- **Lines**: 9
- **Exports**: `generateUUID`
- **Purpose**: UUID v4 generation via crypto.randomUUID
- **Dependencies**: (none)

### ❌ REMOVE — `utils/versions.ts` (reason: Python semver sorting and module name normalization)

- **Lines**: 67
- **Exports**: `semverSort`, `reverseSemverSort`, `cleanPythonModuleName`
- **Purpose**: Semver sorting and Python module name normalization
- **Dependencies**: (none)

### ❌ REMOVE — `utils/vitals.ts` (reason: web-vitals reporting, VT can add separately if needed)

- **Lines**: 31
- **Exports**: `reportVitals`
- **Purpose**: Report Core Web Vitals (LCP, FID, CLS, FCP, TTFB) to console in dev mode
- **Dependencies**: `web-vitals`, `./Logger`

### ❌ REMOVE — `utils/waitForWs.ts` (reason: WebSocket readyState polling, tied to Marimo kernel connection)

- **Lines**: 32
- **Exports**: `waitForWs`
- **Purpose**: Wait for WebSocket to reach a specific readyState with polling
- **Dependencies**: (none)

### ✅ KEEP — `utils/zod-utils.ts`

- **Lines**: 20
- **Exports**: `isZodArray`, `isZodPipe`, `isZodTuple`
- **Purpose**: Zod schema type-guard helpers for runtime schema inspection
- **Dependencies**: `zod`

### ⚠️ ADAPT — `utils/json/base64.ts` (keep base64/dataURL utilities, remove kernel message buffer extraction)

- **Lines**: 127
- **Exports**: `JsonString` (type), `Base64String` (type), `DataURLString` (type), `deserializeJson`, `base64ToDataURL`, `isDataURLString`, `extractBase64FromDataURL`, `base64ToUint8Array`, `base64ToDataView`, `uint8ArrayToBase64`, `dataViewToBase64`, `safeExtractSetUIElementMessageBuffers`
- **Purpose**: Base64 encoding/decoding, data URL handling, and binary buffer extraction for kernel messages
- **Dependencies**: `@/core/kernel/messages`, `../typed`

### ✅ KEEP — `utils/json/json-parser.ts`

- **Lines**: 200
- **Exports**: `jsonParseWithSpecialChar`, `jsonToTSV`, `jsonToMarkdown`
- **Purpose**: JSON parsing with special character handling and conversion to TSV/Markdown formats
- **Dependencies**: `./base64`

### ❌ REMOVE — `utils/python-poet/poet.ts` (reason: Python code generation AST, not applicable to VT)

- **Lines**: 212
- **Exports**: `PythonCode` (interface), `Variable` (class), `Literal` (class), `VariableDeclaration` (class), `FunctionArg` (class), `FunctionCall` (class)
- **Purpose**: Python code generation AST for building Python expressions programmatically
- **Dependencies**: (none)

### ❌ REMOVE — `utils/storage/jotai.ts` (reason: jotai storage adapters, VT uses Zustand)

- **Lines**: 51
- **Exports**: `adaptForLocalStorage`, `jotaiJsonStorage`
- **Purpose**: Jotai storage adapters for persisting atoms to localStorage with serialization
- **Dependencies**: `jotai/utils`, `jotai/vanilla/utils/atomWithStorage`, `../Logger`, `./storage`

### ✅ KEEP — `utils/storage/storage.ts`

- **Lines**: 58
- **Exports**: `availableStorage`
- **Purpose**: Best-available Storage implementation (localStorage > sessionStorage > in-memory)
- **Dependencies**: `../capabilities`

### ⚠️ ADAPT — `utils/storage/typed.ts` (keep TypedLocalStorage/ZodLocalStorage, remove NotebookScopedLocalStorage and Marimo deps)

- **Lines**: 145
- **Exports**: `TypedLocalStorage` (class), `ZodLocalStorage` (class), `NotebookScopedLocalStorage` (class)
- **Purpose**: Type-safe localStorage wrappers with Zod validation and notebook-scoped keys
- **Dependencies**: `zod`, `@/core/saving/file-state`, `@/core/state/jotai`, `../Logger`, `./storage`

---

## theme/

### ⚠️ ADAPT — `theme/ThemeProvider.tsx` (VT has Mine theme; may adapt theme switching infrastructure for lab dark mode)

- **Lines**: 35
- **Exports**: `ThemeProvider` (component), `CssVariables` (component)
- **Purpose**: Root theme provider applying light/dark class to body; CSS variable injection wrapper
- **Dependencies**: `./useTheme`

### ⚠️ ADAPT — `theme/namespace.tsx` (adapt scoping div from "marimo" to VT lab namespace)

- **Lines**: 24
- **Exports**: `StyleNamespace` (component, forwardRef)
- **Purpose**: Wraps children in a div with className="marimo" for CSS scoping
- **Dependencies**: (none)

### ⚠️ ADAPT — `theme/useTheme.ts` (VT has Mine theme system; adapt theme resolution logic, remove jotai/VSCode/islands deps)

- **Lines**: 125
- **Exports**: `Theme` (type), `ResolvedTheme` (type), `THEMES`, `resolvedThemeAtom`, `useTheme`
- **Purpose**: Theme resolution hook supporting system/light/dark with VSCode theme detection and islands mode
- **Dependencies**: `jotai`, `@/core/config/config`, `@/core/islands/utils`, `@/core/state/jotai`

---

## css/

### ⚠️ ADAPT — `css/index.css` (cherry-pick relevant imports for lab; VT uses Tailwind v4)

- **Lines**: 11
- **Exports**: (CSS imports)
- **Purpose**: Master CSS entry point importing all shared stylesheets (globals, codehilite, common, katex, md, admonition, table, progress)
- **Dependencies**: `./globals.css`, `./codehilite.css`, `./common.css`, `./katex-fonts.css`, `./katex.min.css`, `./md.css`, `./md-tooltip.css`, `./admonition.css`, `./table.css`, `./progress.css`

### ❌ REMOVE — `css/globals.css` (reason: VT has its own globals.css with Mine theme and Tailwind v4)

- **Lines**: 194
- **Exports**: (CSS custom properties, Tailwind config)
- **Purpose**: Root CSS: Radix Colors imports, Tailwind v4 setup, CSS custom properties (colors, shadows, fonts, radius), base layer styles, @theme shadow definitions
- **Dependencies**: `@radix-ui/colors/*`, `tailwindcss`, `tailwind.config.cjs`

### ⚠️ ADAPT — `css/common.css` (hover-action patterns and scrollbar-thin utility may be useful)

- **Lines**: 46
- **Exports**: (CSS rules)
- **Purpose**: Hover-action show/hide patterns, fullscreen hide class, dropdown icon utility, scrollbar-thin utility
- **Dependencies**: `./globals.css`

### ⚠️ ADAPT — `css/codehilite.css` (syntax highlighting tokens useful for lab cell output; adapt to Mine color palette)

- **Lines**: 355
- **Exports**: (CSS rules)
- **Purpose**: Pygments/xcode syntax highlighting theme with light-dark CSS custom properties for all token types; special traceback styling
- **Dependencies**: (none, defines `@layer base` vars)

### ❌ REMOVE — `css/admonition.css` (reason: Markdown admonition callouts not used in VT lab)

- **Lines**: 128
- **Exports**: (CSS rules)
- **Purpose**: Markdown admonition callout styles (info, warning, error, tip, important, hint) with colored borders, backgrounds, and Lucide SVG icons
- **Dependencies**: `./globals.css`

### ⚠️ ADAPT — `css/md.css` (markdown rendering styles useful for cell output; adapt to Mine theme)

- **Lines**: 377
- **Exports**: (CSS rules)
- **Purpose**: Markdown rendering styles: paragraphs, headings, links, tabbed content, critic markup, task lists, details/summary, code highlights
- **Dependencies**: `./globals.css`

### ❌ REMOVE — `css/md-tooltip.css` (reason: CSS-only tooltip specific to Marimo markdown content)

- **Lines**: 53
- **Exports**: (CSS rules)
- **Purpose**: CSS-only tooltip using data-tooltip attribute within markdown content
- **Dependencies**: `./globals.css`

### ⚠️ ADAPT — `css/table.css` (dataframe table styling may be useful for lab output; adapt to Mine theme)

- **Lines**: 46
- **Exports**: (CSS rules)
- **Purpose**: Markdown table and pandas dataframe table styling (striped rows, hover, scrollable)
- **Dependencies**: `./globals.css`

### ⚠️ ADAPT — `css/progress.css` (progress bar styling useful for cell execution; adapt to Mine theme)

- **Lines**: 94
- **Exports**: (CSS rules)
- **Purpose**: Progress bar styling for marimo native and IPython tqdm output (container, title, webkit/moz progress element)
- **Dependencies**: `./globals.css`

### ❌ REMOVE — `css/katex-fonts.css` (reason: KaTeX math fonts not needed in VT lab)

- **Lines**: 215
- **Exports**: (@font-face declarations)
- **Purpose**: KaTeX math font-face declarations (AMS, Caligraphic, Fraktur, Main, Math, SansSerif, Script, Size1-4, Typewriter)
- **Dependencies**: `../fonts/KaTeX/*`

### ❌ REMOVE — `css/katex.min.css` (reason: KaTeX math rendering not needed in VT lab)

- **Lines**: 1184
- **Exports**: (CSS rules)
- **Purpose**: KaTeX math rendering stylesheet (adapted from katex@0.16.9 CDN) with font sizing, delimiters, fractions, spacing
- **Dependencies**: (none)

### ⚠️ ADAPT — `css/app/App.css` (cherry-pick cell/codemirror imports; remove Marimo disconnected background)

- **Lines**: 78
- **Exports**: (CSS rules, imports)
- **Purpose**: Top-level app CSS: imports all app-specific stylesheets, responsive font scaling, content width vars, disconnected gradient/noise background
- **Dependencies**: `./reset.css`, `./Cell.css`, `./codemirror.css`, `./fonts.css`, `./Header.css`, `./print.css`, `./codemirror-completions.css`

### ❌ REMOVE — `css/app/reset.css` (reason: VT has its own global reset via Tailwind v4)

- **Lines**: 19
- **Exports**: (CSS rules)
- **Purpose**: Global reset: font family, font smoothing, root element layout, code font
- **Dependencies**: (none)

### ❌ REMOVE — `css/app/fonts.css` (reason: VT uses Inter/Roboto/Geist Mono, not Lora/PT Sans/Fira Mono)

- **Lines**: 51
- **Exports**: (@font-face declarations)
- **Purpose**: App font-face declarations for Lora (heading), PT Sans (text), Fira Mono (code)
- **Dependencies**: `../../fonts/*`

### ⚠️ ADAPT — `css/app/Cell.css` (core cell styling essential for lab; adapt border/focus/hover states to Mine theme)

- **Lines**: 502
- **Exports**: (CSS rules)
- **Purpose**: Core cell component styles: border/focus/hover states, stale/disabled/error/needs-run variants, AI-generated cell glow, dark mode overrides, output area, tray pseudo-elements, CodeMirror editor integration
- **Dependencies**: `../../css/globals.css`

### ❌ REMOVE — `css/app/Header.css` (reason: Marimo running icon animation, VT has its own header)

- **Lines**: 26
- **Exports**: (CSS rules)
- **Purpose**: Running app icon animation (rotate spinner with cubic-bezier timing)
- **Dependencies**: (none)

### ⚠️ ADAPT — `css/app/codemirror.css` (CodeMirror editor styling essential for lab; adapt to Mine theme colors)

- **Lines**: 141
- **Exports**: (CSS rules)
- **Purpose**: CodeMirror editor styling: selection backgrounds, gutters, tooltips, panels, linting, ghost text (AI completions), Codeium integration
- **Dependencies**: `../globals.css`

### ⚠️ ADAPT — `css/app/codemirror-completions.css` (autocomplete popup styling useful for lab; adapt to Mine theme)

- **Lines**: 433
- **Exports**: (CSS rules)
- **Purpose**: CodeMirror autocomplete popup styling: list items, completion icons by type (variable, function, class, module, etc.), signature help tooltip, scrollbar
- **Dependencies**: `../../css/globals.css`

### ❌ REMOVE — `css/app/print.css` (reason: print media styles not needed in VT lab)

- **Lines**: 73
- **Exports**: (CSS rules)
- **Purpose**: Print media styles: full-screen print layout, heading page breaks, removed shadows/trays, visible overflow for panels
- **Dependencies**: `../globals.css`

---

## root src/

### ❌ REMOVE — `src/README.md` (reason: Marimo directory structure overview, not applicable)

- **Lines**: 18
- **Exports**: (documentation)
- **Purpose**: High-level directory structure overview of the Marimo frontend source tree
- **Dependencies**: (none)

### ⚠️ ADAPT — `src/custom.d.ts` (keep stricter Body.json/JSON.parse types and Array.filter narrowing; remove SVG module declaration if VT already has one)

- **Lines**: 27
- **Exports**: (TypeScript declarations)
- **Purpose**: Global type augmentations: SVG module declaration, stricter Body.json/JSON.parse types, Array.filter with BooleanConstructor narrowing
- **Dependencies**: (none)

### ❌ REMOVE — `src/main.tsx` (reason: Marimo app entry point, VT uses Next.js)

- **Lines**: 21
- **Exports**: (entry point, no exports)
- **Purpose**: Application entry point: reads root element and mount config from window, calls mount()
- **Dependencies**: `@/mount`

### ❌ REMOVE — `src/mount.tsx` (reason: Marimo mount function with jotai/kernel/session init, not applicable to VT)

- **Lines**: 360
- **Exports**: `mount`, `visibleForTesting`
- **Purpose**: Main mount function: parses options via Zod schema, initializes jotai store (config, mode, session, networking, runtime), renders MarimoApp in Provider+ThemeProvider; handles static notebook hydration and file stores
- **Dependencies**: `@marimo-team/marimo-api`, `jotai`, `react-dom/client`, `zod`, `@/core/config/config`, `@/core/constants`, `@/core/dom/htmlUtils`, `@/core/meta/globals`, `@/core/meta/state`, `@/utils/Logger`, `./components/editor/boundary/ErrorBoundary`, `./core/cells/cells`, `./core/cells/session`, `./core/config/config-schema`, `./core/MarimoApp`, `./core/mode`, `./core/network/auth`, `./core/network/connection`, `./core/network/requests`, `./core/network/resolve`, `./core/runtime/config`, `./core/saving/file-state`, `./core/state/jotai`, `./core/static/files`, `./core/static/static-state`, `./core/vscode/vscode-bindings`, `./core/wasm/store`, `./core/websocket/types`, `./plugins/impl/anywidget/model`, `./plugins/impl/vega/loader`, `./plugins/plugins`, `./theme/ThemeProvider`, `./utils/vitals`
