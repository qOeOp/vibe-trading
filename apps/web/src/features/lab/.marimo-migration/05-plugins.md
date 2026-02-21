# 05 — plugins/

Migration inventory of `marimo/frontend/src/plugins/`. Total: ~153 files across root, core/, impl/, and layout/ subdirectories.

---

## Root

### ❌ REMOVE — `plugins.ts` (reason: VT has its own output rendering system, no marimo plugin registry needed)

- **Lines**: 118
- **Exports**: `UI_PLUGINS` (L57–91), `LAYOUT_PLUGINS` (L94–108), `initializePlugins()` (L110–118)
- **Purpose**: Central plugin registry — 31 stateful UI plugins + 13 stateless layout plugins; calls `registerReactComponent` on all
- **Dependencies**: `../core/dom/ui-element`, `./core/registerReactComponent`, `./core/sidebar-element`, all impl/ and layout/ plugin classes

### ❌ REMOVE — `types.ts` (reason: marimo plugin interface contract, VT doesn't use web-component-based plugin system)

- **Lines**: 82
- **Exports**: `Setter<S>` (L11), `IPluginProps<S,D,F>` (L16–43), `StringifiedPluginData<D>` (L48–50), `IPlugin<S,D,F>` (L57–82)
- **Purpose**: Core type definitions — plugin interface contract (`tagName`, `validator`, `render`), plugin props, state setter
- **Dependencies**: `zod`, `./core/rpc`

### ❌ REMOVE — `stateless-plugin.ts` (reason: marimo stateless plugin variant, not needed in VT)

- **Lines**: 29
- **Exports**: `IStatelessPluginProps<D>` (L6–21), `IStatelessPlugin<D>` (L23–29)
- **Purpose**: Stateless plugin variant — omits `value`/`setValue`/`functions` from IPlugin for layout/output plugins
- **Dependencies**: `./types`

---

## core/

### ❌ REMOVE — `core/BadPlugin.tsx` (reason: marimo plugin validation error display, VT has own error handling)

- **Lines**: 73
- **Exports**: `BadPlugin` (component)
- **Purpose**: Error display for ZodError validation failures — renders formatted error messages when plugin data fails validation
- **Dependencies**: `zod`

### ⚠️ ADAPT — `core/RenderHTML.tsx` (reason: VT may need HTML rendering in cell outputs, but must strip marimo-specific element handling)

- **Lines**: 271
- **Exports**: `renderHTML()`, `RenderHTML` (component)
- **Purpose**: HTML-to-React parser — handles iframe sandboxing, script execution, codehilite blocks, DOMPurify sanitization with custom marimo element allowlist
- **Dependencies**: `./sanitize`, `@/core/islands/utils`, `@/core/static/download-html`, `html-react-parser`

### ❌ REMOVE — `core/builder.ts` (reason: marimo fluent plugin builder pattern, VT doesn't use this plugin architecture)

- **Lines**: 59
- **Exports**: `createPlugin(tagName)` (L16–59)
- **Purpose**: Fluent plugin builder — `.withData(validator).withFunctions(schemas).renderer(fn)` pattern; returns IPlugin
- **Dependencies**: `./rpc`, `../types`

### ❌ REMOVE — `core/registerReactComponent.tsx` (reason: web component factory for marimo custom elements, VT uses standard React components)

- **Lines**: 630
- **Exports**: `registerReactComponent()` (L~20), `PluginSlot` (internal)
- **Purpose**: Web Component factory — creates custom HTML elements with Shadow DOM, React 19 root management, value synchronization, CSS injection, data attribute parsing, function registration
- **Dependencies**: `./BadPlugin`, `./RenderHTML`, `../types`, `../stateless-plugin`, `@/core/cells/ids`, `@/core/dom/htmlUtils`, `@/core/dom/marimo-tag`, `@/theme/useTheme`, `@/utils/functions`, `@/utils/json/json-parser`

### ❌ REMOVE — `core/rpc.ts` (reason: marimo plugin-to-kernel RPC schema builder, VT doesn't have kernel RPC)

- **Lines**: 56
- **Exports**: `rpc` builder object, `FunctionSchemas<F>`, `PluginFunctions` types
- **Purpose**: RPC schema builder — `rpc.input(zodSchema).output(zodSchema)` for defining plugin-to-kernel function contracts
- **Dependencies**: `zod`

### ⚠️ ADAPT — `core/sanitize.ts` (reason: HTML sanitization utility could be useful if VT renders HTML output, strip marimo-specific allowlists)

- **Lines**: 89
- **Exports**: `sanitizeHTML()`, `sanitizeText()`
- **Purpose**: DOMPurify sanitization — custom marimo element/attribute allowlisting, iconify support, SVG handling
- **Dependencies**: `dompurify`, `@/core/dom/marimo-tag`

### ❌ REMOVE — `core/sidebar-element.tsx` (reason: marimo-sidebar custom web element, VT has own sidebar)

- **Lines**: 105
- **Exports**: `initializeSidebarElement()`
- **Purpose**: Custom `marimo-sidebar` web element — portals content to React-managed sidebar via createRoot
- **Dependencies**: `react-dom/client`

### ❌ REMOVE — `core/__test__/RenderHTML.test.ts` (reason: test for removed/adapted component)

- **Lines**: ~221
- **Exports**: (test file)
- **Purpose**: Tests for renderHTML — script handling, iframe sandboxing, sanitization
- **Dependencies**: `../RenderHTML`

### ❌ REMOVE — `core/__test__/registerReactComponent.test.ts` (reason: test for removed web component factory)

- **Lines**: ~205
- **Exports**: (test file)
- **Purpose**: Tests for web component registration — custom element lifecycle, value sync
- **Dependencies**: `../registerReactComponent`

### ❌ REMOVE — `core/__test__/renderHTML-sanitization.test.tsx` (reason: test for removed/adapted component)

- **Lines**: ~132
- **Exports**: (test file)
- **Purpose**: Tests for HTML sanitization edge cases — XSS prevention, marimo element allowlisting
- **Dependencies**: `../RenderHTML`, `../sanitize`

### ❌ REMOVE — `core/__test__/sanitize.test.ts` (reason: test for removed/adapted component)

- **Lines**: ~508
- **Exports**: (test file)
- **Purpose**: Comprehensive sanitize tests — DOMPurify configuration, custom element handling
- **Dependencies**: `../sanitize`

---

## impl/ (top-level files)

### ❌ REMOVE — `impl/ButtonPlugin.tsx` (reason: Python form widget, VT has own button components)

- **Lines**: 96
- **Exports**: `ButtonPlugin` class
- **Purpose**: Button widget — `marimo-button` tag, click counter state, optional tooltip/label, configurable intent variant
- **Dependencies**: `../core/rpc`, `../types`, `./common/intent`, `./common/labeled`, `@/components/ui/button`, `@/components/ui/tooltip`

### ❌ REMOVE — `impl/CheckboxPlugin.tsx` (reason: Python form widget)

- **Lines**: 57
- **Exports**: `CheckboxPlugin` class
- **Purpose**: Checkbox widget — `marimo-checkbox` tag, boolean state, label support
- **Dependencies**: `../types`, `@/components/ui/checkbox`, `@/components/ui/label`

### ❌ REMOVE — `impl/CodeEditorPlugin.tsx` (reason: Python code editor widget, VT has own CodeMirror integration)

- **Lines**: 120
- **Exports**: `CodeEditorPlugin` class
- **Purpose**: Code editor widget — `marimo-code-editor` tag, CodeMirror with language detection, min-height config
- **Dependencies**: `../types`, `./code/LazyAnyLanguageCodeMirror`

### ❌ REMOVE — `impl/DataEditorPlugin.tsx` (reason: Glide Data Grid spreadsheet editor for Python, VT uses TanStack Table)

- **Lines**: 182
- **Exports**: `DataEditorPlugin` (createPlugin)
- **Purpose**: Spreadsheet editor — `marimo-data-editor` tag, lazy-loads GlideDataGrid, tracks cell/row/column edits
- **Dependencies**: `../core/builder`, `./data-editor/types`

### ⚠️ ADAPT — `impl/DataTablePlugin.tsx` (reason: VT may want data table rendering in cell output; could adapt for displaying tabular results without marimo RPC)

- **Lines**: 1034
- **Exports**: `DataTablePlugin` (createPlugin)
- **Purpose**: Rich data table — `marimo-table` tag, TanStack Table with column search, sorting, filtering, pagination, selection, download, row actions; RPC functions for column values/summaries
- **Dependencies**: `../core/builder`, `../core/rpc`, `@/components/data-table/*`, `@/core/kernel/messages`, `@/hooks/*`

### ❌ REMOVE — `impl/DatePickerPlugin.tsx` (reason: Python form widget)

- **Lines**: 75
- **Exports**: `DatePickerPlugin` class
- **Purpose**: Date picker — `marimo-date-picker` tag, ISO date string state, min/max/label support
- **Dependencies**: `../types`, `@/components/ui/date-picker`

### ❌ REMOVE — `impl/DateRangePlugin.tsx` (reason: Python form widget)

- **Lines**: 83
- **Exports**: `DateRangePickerPlugin` class
- **Purpose**: Date range picker — `marimo-date-range` tag, [start, end] tuple state
- **Dependencies**: `../types`, `@/components/ui/date-range-picker`

### ❌ REMOVE — `impl/DateTimePickerPlugin.tsx` (reason: Python form widget)

- **Lines**: 79
- **Exports**: `DateTimePickerPlugin` class
- **Purpose**: DateTime picker — `marimo-datetime-picker` tag, ISO datetime string state
- **Dependencies**: `../types`, `@/components/ui/date-picker`

### ❌ REMOVE — `impl/DictPlugin.tsx` (reason: Python dictionary/form rendering widget)

- **Lines**: 81
- **Exports**: `DictPlugin` class
- **Purpose**: Dictionary/form — `marimo-dict` tag, key-value child rendering with labels
- **Dependencies**: `../types`

### ❌ REMOVE — `impl/DropdownPlugin.tsx` (reason: Python form widget)

- **Lines**: 103
- **Exports**: `DropdownPlugin` class
- **Purpose**: Dropdown select — `marimo-dropdown` tag, single-select with searchable options, label support
- **Dependencies**: `../types`, `./SearchableSelect`, `./common/labeled`

### ❌ REMOVE — `impl/FileBrowserPlugin.tsx` (reason: Python file browser widget, VT has no server filesystem browsing)

- **Lines**: 524
- **Exports**: `FileBrowserPlugin` (createPlugin)
- **Purpose**: File browser — `marimo-file-browser` tag, directory navigation with bread crumbs, file/folder CRUD, selection mode; RPC functions for list/open/create/delete
- **Dependencies**: `../core/builder`, `../core/rpc`, `@/components/ui/*`, `@/components/icons/*`

### ❌ REMOVE — `impl/FileUploadPlugin.tsx` (reason: Python file upload widget)

- **Lines**: 301
- **Exports**: `FileUploadPlugin` class
- **Purpose**: File upload — `marimo-file` tag, drag-and-drop multi-file upload with base64 encoding, mime type filtering
- **Dependencies**: `../types`, `@/components/ui/button`

### ❌ REMOVE — `impl/FormPlugin.tsx` (reason: Python form wrapper widget)

- **Lines**: 297
- **Exports**: `FormPlugin` (createPlugin)
- **Purpose**: Form wrapper — `marimo-form` tag, wraps child elements as form with submit/clear, validates before sending, debounce, bordered layout
- **Dependencies**: `../core/builder`, `@/core/dom/htmlUtils`, `@/components/ui/button`

### ❌ REMOVE — `impl/MicrophonePlugin.tsx` (reason: Python audio recording widget, not relevant for quant trading)

- **Lines**: 59
- **Exports**: `MicrophonePlugin` class
- **Purpose**: Audio recorder — `marimo-microphone` tag, base64 audio capture via MediaRecorder API
- **Dependencies**: `../types`

### ❌ REMOVE — `impl/MultiselectPlugin.tsx` (reason: Python form widget)

- **Lines**: 208
- **Exports**: `MultiselectPlugin` class
- **Purpose**: Multi-select — `marimo-multiselect` tag, searchable multi-select with chip display, max selections
- **Dependencies**: `../types`, `./SearchableSelect`, `./common/labeled`, `@/components/ui/badge`

### ❌ REMOVE — `impl/NumberPlugin.tsx` (reason: Python form widget)

- **Lines**: 99
- **Exports**: `NumberPlugin` class
- **Purpose**: Number input — `marimo-number` tag, numeric input with min/max/step validation, debounced updates
- **Dependencies**: `../types`, `./common/labeled`, `@/components/ui/input`

### ❌ REMOVE — `impl/RadioPlugin.tsx` (reason: Python form widget)

- **Lines**: 78
- **Exports**: `RadioPlugin` class
- **Purpose**: Radio group — `marimo-radio` tag, single selection from options list, label support
- **Dependencies**: `../types`, `./common/labeled`, `@/components/ui/radio-group`

### ❌ REMOVE — `impl/RangeSliderPlugin.tsx` (reason: Python form widget)

- **Lines**: 166
- **Exports**: `RangeSliderPlugin` class
- **Purpose**: Range slider — `marimo-range-slider` tag, dual-thumb slider with [min, max] tuple state, step/orientation config
- **Dependencies**: `../types`, `./common/labeled`, `@/components/ui/slider`

### ❌ REMOVE — `impl/RefreshPlugin.tsx` (reason: Python auto-refresh timer widget)

- **Lines**: 159
- **Exports**: `RefreshPlugin` class
- **Purpose**: Auto-refresh timer — `marimo-refresh` tag, configurable interval with play/pause, manual refresh button
- **Dependencies**: `../types`, `@/components/ui/button`

### ❌ REMOVE — `impl/SearchableSelect.tsx` (reason: shared primitive for marimo dropdown/multiselect plugins, VT has own combobox)

- **Lines**: 123
- **Exports**: `SearchableSelect` component
- **Purpose**: Shared searchable select primitive — Combobox with fuzzy search, used by Dropdown and Multiselect plugins
- **Dependencies**: `@/components/ui/combobox`

### ❌ REMOVE — `impl/SliderPlugin.tsx` (reason: Python form widget)

- **Lines**: 173
- **Exports**: `SliderPlugin` class
- **Purpose**: Slider — `marimo-slider` tag, single-thumb slider with min/max/step, debounce, orientation config
- **Dependencies**: `../types`, `./common/labeled`, `@/components/ui/slider`

### ❌ REMOVE — `impl/SwitchPlugin.tsx` (reason: Python form widget)

- **Lines**: 49
- **Exports**: `SwitchPlugin` class
- **Purpose**: Toggle switch — `marimo-switch` tag, boolean state
- **Dependencies**: `../types`, `@/components/ui/switch`

### ❌ REMOVE — `impl/TabsPlugin.tsx` (reason: Python tabs layout widget)

- **Lines**: 84
- **Exports**: `TabsPlugin` class
- **Purpose**: Tabs container — `marimo-tabs` tag, indexed child rendering with tab labels
- **Dependencies**: `../types`, `@/components/ui/tabs`

### ❌ REMOVE — `impl/TextAreaPlugin.tsx` (reason: Python form widget)

- **Lines**: 132
- **Exports**: `TextAreaPlugin` class
- **Purpose**: Textarea — `marimo-text-area` tag, multiline text input with auto-grow, max-length, debounced updates
- **Dependencies**: `../types`, `./common/labeled`, `@/components/ui/textarea`

### ❌ REMOVE — `impl/TextInputPlugin.tsx` (reason: Python form widget)

- **Lines**: 170
- **Exports**: `TextInputPlugin` class
- **Purpose**: Text input — `marimo-text-input` tag, single-line text with max-length, debounce, placeholder, label
- **Dependencies**: `../types`, `./common/labeled`, `@/components/ui/input`

### ❌ REMOVE — `impl/multiselectFilterFn.tsx` (reason: TanStack Table filter function for marimo multiselect plugin)

- **Lines**: 23
- **Exports**: `multiselectFilterFn`
- **Purpose**: TanStack Table filter function for multiselect columns — checks if row value is in selected set
- **Dependencies**: (none)

### ❌ REMOVE — `impl/__tests__/DataTablePlugin.test.tsx` (reason: test for removed plugin)

- **Lines**: ~200
- **Exports**: (test file)
- **Purpose**: DataTablePlugin rendering and interaction tests
- **Dependencies**: `../DataTablePlugin`

### ❌ REMOVE — `impl/__tests__/DateTimePickerPlugin.test.tsx` (reason: test for removed plugin)

- **Lines**: ~100
- **Exports**: (test file)
- **Purpose**: DateTimePicker validation and state tests
- **Dependencies**: `../DateTimePickerPlugin`

### ❌ REMOVE — `impl/__tests__/DropdownPlugin.test.tsx` (reason: test for removed plugin)

- **Lines**: ~100
- **Exports**: (test file)
- **Purpose**: Dropdown rendering and selection tests
- **Dependencies**: `../DropdownPlugin`

### ❌ REMOVE — `impl/__tests__/MultiSelectPlugin.test.ts` (reason: test for removed plugin)

- **Lines**: ~100
- **Exports**: (test file)
- **Purpose**: MultiSelect state management tests
- **Dependencies**: `../MultiselectPlugin`

### ❌ REMOVE — `impl/__tests__/NumberPlugin.test.tsx` (reason: test for removed plugin)

- **Lines**: ~100
- **Exports**: (test file)
- **Purpose**: NumberPlugin validation and boundary tests
- **Dependencies**: `../NumberPlugin`

---

## impl/anywidget/

### ❌ REMOVE — `impl/anywidget/AnyWidgetPlugin.tsx` (reason: Python AnyWidget AFM protocol, VT doesn't support ipywidgets)

- **Lines**: 255
- **Exports**: `useAnyWidgetModule` (hook), `useMountCss` (hook), `AnyWidgetPlugin` (createPlugin)
- **Purpose**: AnyWidget AFM plugin entry — `marimo-anywidget` tag, dynamically loads ESM widget modules, manages CSS injection into Shadow DOM, model lifecycle
- **Dependencies**: `../../core/builder`, `./model`, `./widget-binding`, `@/core/cells/ids`, `@/core/websocket/useMarimoWebSocket`

### ❌ REMOVE — `impl/anywidget/model.ts` (reason: Python AnyWidget model layer)

- **Lines**: 427
- **Exports**: `ModelManager` class, `Model<T>` class, `handleWidgetMessage()`
- **Purpose**: Widget model layer — async model registry with timeouts (Deferred pattern), implements AnyModel AFM interface (get/set/save_changes/on/off/send), handles open/update/custom/close lifecycle messages
- **Dependencies**: `./types`, `./schemas`, `./serialization`, `@/utils/Deferred`

### ❌ REMOVE — `impl/anywidget/schemas.ts` (reason: Python AnyWidget wire message schemas)

- **Lines**: 33
- **Exports**: `AnyWidgetMessageSchema` (Zod discriminated union)
- **Purpose**: Wire message validation — open/update/custom/echo_update/close message types with Zod schemas
- **Dependencies**: `zod`

### ❌ REMOVE — `impl/anywidget/serialization.ts` (reason: Python AnyWidget binary serialization)

- **Lines**: 121
- **Exports**: `serializeBuffersToBase64()`, `decodeFromWire()`
- **Purpose**: Binary serialization — DataView buffer handling for widget state wire format, base64 encode/decode with path-based buffer nesting
- **Dependencies**: (none, pure utility)

### ❌ REMOVE — `impl/anywidget/types.ts` (reason: Python AnyWidget type definitions)

- **Lines**: 28
- **Exports**: `EventHandler`, `WidgetModelId`, `ModelState`, `WireFormat<T>`
- **Purpose**: AnyWidget type definitions — model identity, event handler signatures, wire format generics
- **Dependencies**: (none)

### ❌ REMOVE — `impl/anywidget/widget-binding.ts` (reason: Python AnyWidget lifecycle management)

- **Lines**: 217
- **Exports**: `WidgetDefRegistry` class, `WidgetBinding` class, `BindingManager` class
- **Purpose**: Widget lifecycle management — ESM import cache by jsHash, connects Model to AnyWidget definition (initialize/render), maps modelId to active bindings
- **Dependencies**: `./model`, `./types`

### ❌ REMOVE — `impl/anywidget/__tests__/AnyWidgetPlugin.test.tsx` (reason: test for removed plugin)

- **Lines**: ~150
- **Exports**: (test file)
- **Purpose**: AnyWidget plugin integration tests
- **Dependencies**: `../AnyWidgetPlugin`

### ❌ REMOVE — `impl/anywidget/__tests__/model.test.ts` (reason: test for removed plugin)

- **Lines**: ~200
- **Exports**: (test file)
- **Purpose**: Model class and ModelManager tests — lifecycle, events, timeouts
- **Dependencies**: `../model`

### ❌ REMOVE — `impl/anywidget/__tests__/serialization.test.ts` (reason: test for removed plugin)

- **Lines**: ~100
- **Exports**: (test file)
- **Purpose**: Buffer serialization round-trip tests
- **Dependencies**: `../serialization`

### ❌ REMOVE — `impl/anywidget/__tests__/widget-binding.test.ts` (reason: test for removed plugin)

- **Lines**: ~150
- **Exports**: (test file)
- **Purpose**: Widget binding lifecycle tests
- **Dependencies**: `../widget-binding`

---

## impl/chat/

### ❌ REMOVE — `impl/chat/ChatPlugin.tsx` (reason: Python chat widget with kernel RPC, VT has own LLM integration plans)

- **Lines**: 93
- **Exports**: `ChatPlugin` (createPlugin)
- **Purpose**: Chat widget entry — `marimo-chatbot` tag, RPC functions: get_chat_history, delete_chat_history, delete_chat_message, send_prompt
- **Dependencies**: `../../core/builder`, `../../core/rpc`, `./chat-ui`

### ❌ REMOVE — `impl/chat/chat-ui.tsx` (reason: Python chat UI with marimo kernel streaming, VT will build own chat UI)

- **Lines**: 844
- **Exports**: `ChatUI` component
- **Purpose**: Full chat UI — uses `useChat` from `@ai-sdk/react`, streaming via ReadableStream, config controls (model/temperature/max_tokens), prompt templates with `{{variable}}` interpolation, file attachments, markdown rendering
- **Dependencies**: `./types`, `@ai-sdk/react`, `@/components/ui/*`, `@/plugins/core/RenderHTML`

### ❌ REMOVE — `impl/chat/types.ts` (reason: Python chat type definitions)

- **Lines**: 28
- **Exports**: `ChatRole`, `ChatMessage`, `ChatConfig`, `SendMessageRequest`
- **Purpose**: Chat type definitions — message structure, role union, config interface
- **Dependencies**: (none)

---

## impl/code/

### ❌ REMOVE — `impl/code/LazyAnyLanguageCodeMirror.tsx` (reason: marimo plugin code editor lazy wrapper, VT has own CodeMirror setup)

- **Lines**: 7
- **Exports**: `LazyAnyLanguageCodeMirror` (lazy component)
- **Purpose**: Lazy wrapper — React.lazy import of any-language-editor for code splitting
- **Dependencies**: (dynamic import of `./any-language-editor`)

### ❌ REMOVE — `impl/code/any-language-editor.tsx` (reason: marimo plugin code editor, VT has own CodeMirror integration)

- **Lines**: 88
- **Exports**: default export `AnyLanguageCodeMirror` component
- **Purpose**: CodeMirror editor with dynamic language loading — imports language extensions from `@uiw/codemirror-extensions-langs` based on `language` prop
- **Dependencies**: `@uiw/react-codemirror`, `@uiw/codemirror-extensions-langs`, `@/core/codemirror/theme`

### ❌ REMOVE — `impl/code/__tests__/language.test.ts` (reason: test for removed plugin)

- **Lines**: ~50
- **Exports**: (test file)
- **Purpose**: Language detection and loading tests
- **Dependencies**: `../any-language-editor`

---

## impl/common/

### ❌ REMOVE — `impl/common/error-banner.tsx` (reason: marimo plugin error/warning banner, VT has own error display patterns)

- **Lines**: 119
- **Exports**: `ErrorBanner` component, `Banner` component
- **Purpose**: Error/warning display — `ErrorBanner` is clickable with AlertDialog detail view; `Banner` is CVA-styled with info/warn/danger variants
- **Dependencies**: `@/components/ui/alert-dialog`, `@/components/ui/button`, `class-variance-authority`

### ❌ REMOVE — `impl/common/intent.ts` (reason: marimo plugin intent type, trivial to recreate if needed)

- **Lines**: 19
- **Exports**: `Intent` type, `zodIntent` validator
- **Purpose**: Intent type union — "danger" | "warn" | "success" | "neutral" with Zod validation
- **Dependencies**: `zod`

### ❌ REMOVE — `impl/common/labeled.tsx` (reason: marimo plugin label wrapper for form widgets)

- **Lines**: 70
- **Exports**: `Labeled` component
- **Purpose**: Label wrapper — wraps children with HTML `<label>`, supports top/left/right alignment via `label-placement` prop
- **Dependencies**: (none)

---

## impl/data-editor/

### ❌ REMOVE — `impl/data-editor/components.tsx` (reason: Glide Data Grid column management UI for Python data editor)

- **Lines**: 180
- **Exports**: `RenameColumnSub`, `AddColumnSub` components
- **Purpose**: Column management UI — dropdown menu sub-components for renaming and adding columns in the data editor
- **Dependencies**: `@/components/ui/dropdown-menu`, `@/components/ui/input`

### ❌ REMOVE — `impl/data-editor/data-utils.ts` (reason: column CRUD for Python data editor)

- **Lines**: 124
- **Exports**: `removeColumn()`, `insertColumn()`, `renameColumn()`, `modifyColumnFields()`
- **Purpose**: Column CRUD operations — immutable transformations on column arrays for data editor state
- **Dependencies**: `./types`

### ❌ REMOVE — `impl/data-editor/glide-data-editor.tsx` (reason: Glide Data Grid spreadsheet for Python, VT uses TanStack Table)

- **Lines**: 668
- **Exports**: `GlideDataEditorWrapper` component
- **Purpose**: Full spreadsheet component — Glide Data Grid integration with cell editing, column resize, paste handling, search, row append/delete, column add/rename/delete
- **Dependencies**: `@glideapps/glide-data-grid`, `./data-utils`, `./glide-utils`, `./themes`, `./types`, `./components`

### ❌ REMOVE — `impl/data-editor/glide-utils.ts` (reason: Glide Data Grid utilities for Python data editor)

- **Lines**: 201
- **Exports**: `getCell()`, `handlePaste()`, `isEditableCell()`, other grid cell utilities
- **Purpose**: Grid cell type mapping — converts between marimo data types and Glide Data Grid cell types, paste handler, edit type guards
- **Dependencies**: `@glideapps/glide-data-grid`, `./types`

### ❌ REMOVE — `impl/data-editor/themes.ts` (reason: Glide Data Grid theming for Python data editor)

- **Lines**: 50
- **Exports**: `getGlideTheme()`
- **Purpose**: Glide Data Grid theming — light/dark theme object for grid colors, borders, fonts
- **Dependencies**: `@glideapps/glide-data-grid`

### ❌ REMOVE — `impl/data-editor/types.ts` (reason: data editor type definitions for Python data editor)

- **Lines**: 47
- **Exports**: `PositionalEdit`, `BulkEdit`, `RowEdit`, `ColumnEdit`, `Edits`, `ModifiedGridColumn`, `DataEditorProps`
- **Purpose**: Data editor type definitions — edit operation discriminated unions, grid column metadata
- **Dependencies**: (none)

### ❌ REMOVE — `impl/data-editor/__tests__/data-utils.test.ts` (reason: test for removed plugin)

- **Lines**: ~100
- **Exports**: (test file)
- **Purpose**: Column CRUD operation tests
- **Dependencies**: `../data-utils`

### ❌ REMOVE — `impl/data-editor/__tests__/glide-utils.test.ts` (reason: test for removed plugin)

- **Lines**: ~100
- **Exports**: (test file)
- **Purpose**: Grid cell mapping and paste handler tests
- **Dependencies**: `../glide-utils`

---

## impl/data-explorer/

### ❌ REMOVE — `impl/data-explorer/DataExplorerPlugin.tsx` (reason: Python data explorer with compassql/Vega, VT has own chart system)

- **Lines**: 32
- **Exports**: `DataExplorerPlugin` (createPlugin)
- **Purpose**: Data explorer entry — `marimo-data-explorer` tag, lazy-loads ConnectedDataExplorerComponent
- **Dependencies**: `../../core/builder`

### ❌ REMOVE — `impl/data-explorer/ConnectedDataExplorerComponent.tsx` (reason: Python data explorer chart spec management)

- **Lines**: 273
- **Exports**: `ConnectedDataExplorerComponent` component
- **Purpose**: Chart spec management — Jotai store for chart state, Vega chart rendering via compassql recommendations, horizontal carousel for related views
- **Dependencies**: `./state/reducer`, `./state/types`, `./encoding`, `./queries/queries`, `@/plugins/impl/vega/vega-component`

### ❌ REMOVE — `impl/data-explorer/encoding.ts` (reason: compassql encoding channel definitions for Python data explorer)

- **Lines**: 108
- **Exports**: `EncodingChannel` type, `FieldDefinition` interface, `toFieldQuery()`, `fromFieldQuery()`
- **Purpose**: Encoding channel definitions — converts between internal FieldDefinition and compassql FieldQuery format
- **Dependencies**: `compassql`, `./functions/types`

### ❌ REMOVE — `impl/data-explorer/marks.ts` (reason: chart mark type definitions for Python data explorer)

- **Lines**: 22
- **Exports**: `SpecMark` type, `MARKS` constant array
- **Purpose**: Chart mark type definitions — point, bar, line, area, tick, rect, circle, square, text
- **Dependencies**: (none)

### ❌ REMOVE — `impl/data-explorer/spec.ts` (reason: compassql spec converter for Python data explorer)

- **Lines**: 29
- **Exports**: `toSpecQuery()`
- **Purpose**: Spec converter — transforms ChartSpec to compassql SpecQuery for recommendation engine
- **Dependencies**: `compassql`, `./state/types`, `./encoding`

### ❌ REMOVE — `impl/data-explorer/state/reducer.ts` (reason: Jotai chart state management for Python data explorer)

- **Lines**: 93
- **Exports**: `chartSpecAtom`, `relatedChartSpecsAtom`, action atoms (setSchema, setMark, setEncoding, set)
- **Purpose**: Chart state management — Jotai atoms for chart spec, encoding modifications, and related chart recommendations
- **Dependencies**: `jotai`, `../encoding`, `./types`

### ❌ REMOVE — `impl/data-explorer/state/types.ts` (reason: chart spec types for Python data explorer)

- **Lines**: 29
- **Exports**: `ChartSpec` interface
- **Purpose**: Chart spec type — mark, encoding map, config, schema fields
- **Dependencies**: `../encoding`, `../marks`

### ❌ REMOVE — `impl/data-explorer/functions/function.ts` (reason: aggregate/temporal function converters for Python data explorer)

- **Lines**: 83
- **Exports**: `toAggregateFunction()`, `toTemporalFunction()`, `fromFunction()`
- **Purpose**: Aggregate/temporal function converters — maps between FieldFunction and compassql FieldQuery aggregate/timeUnit properties
- **Dependencies**: `compassql`, `./types`

### ❌ REMOVE — `impl/data-explorer/functions/types.ts` (reason: function type definitions for Python data explorer)

- **Lines**: 84
- **Exports**: `isAggregateOp()`, `TimeUnitOp`, `FieldFunction` types, `AGGREGATE_OPS`, `TIME_UNIT_OPS`
- **Purpose**: Function type definitions — aggregate operations (count, sum, mean, etc.) and temporal operations (year, month, etc.)
- **Dependencies**: (none)

### ❌ REMOVE — `impl/data-explorer/components/query-form.tsx` (reason: chart encoding config UI for Python data explorer)

- **Lines**: 297
- **Exports**: `QueryForm` component
- **Purpose**: Chart encoding configuration UI — field selects for x/y/color/size channels, mark type selector, aggregate/temporal function dropdowns
- **Dependencies**: `../encoding`, `../marks`, `../functions/types`, `../state/reducer`, `@/components/ui/select`

### ❌ REMOVE — `impl/data-explorer/components/column-summary.tsx` (reason: column summary for Python data explorer)

- **Lines**: ~100
- **Exports**: `ColumnSummary` component
- **Purpose**: Column summary display — shows field type, distribution, and statistics for data columns
- **Dependencies**: `../encoding`, `../queries/types`

### ❌ REMOVE — `impl/data-explorer/components/icons.tsx` (reason: data type icons for Python data explorer)

- **Lines**: ~50
- **Exports**: `PrimitiveTypeIcon` component
- **Purpose**: Data type icon mapping — renders appropriate icon for each primitive field type (string, number, date, boolean)
- **Dependencies**: `lucide-react`

### ❌ REMOVE — `impl/data-explorer/queries/field-suggestion.ts` (reason: compassql queries for Python data explorer)

- **Lines**: ~80
- **Exports**: `fieldSuggestion()` query creator
- **Purpose**: Field suggestion queries — generates compassql queries for field-level chart recommendations
- **Dependencies**: `compassql`, `./types`

### ❌ REMOVE — `impl/data-explorer/queries/histograms.ts` (reason: compassql queries for Python data explorer)

- **Lines**: ~60
- **Exports**: `histograms()` query creator
- **Purpose**: Histogram queries — generates compassql queries for histogram chart recommendations
- **Dependencies**: `compassql`, `./types`

### ❌ REMOVE — `impl/data-explorer/queries/queries.ts` (reason: compassql query execution for Python data explorer)

- **Lines**: ~80
- **Exports**: `getRelatedCharts()`, `runQuery()`
- **Purpose**: Query execution — runs compassql recommend() and converts results to Vega-Lite specs
- **Dependencies**: `compassql`, `./types`, `./field-suggestion`, `./histograms`, `./utils`

### ❌ REMOVE — `impl/data-explorer/queries/removeUndefined.ts` (reason: trivial utility for Python data explorer)

- **Lines**: ~15
- **Exports**: `removeUndefined()`
- **Purpose**: Object cleanup — removes undefined values from objects before passing to compassql
- **Dependencies**: (none)

### ❌ REMOVE — `impl/data-explorer/queries/types.ts` (reason: query types for Python data explorer)

- **Lines**: ~40
- **Exports**: `QueryCreator`, `ResultingCharts`, query-related types
- **Purpose**: Query type definitions — query creator function signatures, chart result types
- **Dependencies**: `compassql`, `vega-lite`

### ❌ REMOVE — `impl/data-explorer/queries/utils.ts` (reason: query utilities for Python data explorer)

- **Lines**: ~50
- **Exports**: `getEncodingChannel()`, other query utility functions
- **Purpose**: Query utilities — encoding channel extraction, field query helpers for compassql integration
- **Dependencies**: `compassql`

---

## impl/data-frames/

### ❌ REMOVE — `impl/data-frames/DataFramePlugin.tsx` (reason: Python DataFrame manipulation UI, VT doesn't have kernel-side DataFrame ops)

- **Lines**: ~200
- **Exports**: `DataFramePlugin` (createPlugin)
- **Purpose**: DataFrame manipulation UI — `marimo-data-frame` tag, RPC functions for column operations (sort, filter, group_by, aggregate, select, rename, sample, shuffle), lazy-loads panel with data table
- **Dependencies**: `../../core/builder`, `../../core/rpc`, `./schema`, `./types`

### ❌ REMOVE — `impl/data-frames/panel.tsx` (reason: Python DataFrame operation panel)

- **Lines**: ~300
- **Exports**: `DataFramePanel` component
- **Purpose**: DataFrame operation panel — form-based UI for building column transformations, displays operation history, preview results
- **Dependencies**: `./forms/renderers`, `./forms/context`, `./types`, `./schema`, `@/components/ui/*`

### ❌ REMOVE — `impl/data-frames/schema.ts` (reason: Python DataFrame operation schemas)

- **Lines**: ~200
- **Exports**: Zod schemas for all DataFrame operations
- **Purpose**: Operation schema definitions — Zod validators for sort, filter, group_by, aggregate, select, rename, sample operations
- **Dependencies**: `zod`, `@/components/forms/options`, `@/core/kernel/messages`

### ❌ REMOVE — `impl/data-frames/types.ts` (reason: Python DataFrame type definitions)

- **Lines**: ~80
- **Exports**: `ColumnDataTypes`, `ColumnId`, `DataFrameOperation`, operation types
- **Purpose**: DataFrame type definitions — column metadata, operation discriminated unions, operation history
- **Dependencies**: `@/core/kernel/messages`

### ❌ REMOVE — `impl/data-frames/forms/context.ts` (reason: Python DataFrame form context)

- **Lines**: ~10
- **Exports**: `ColumnInfoContext` (React context)
- **Purpose**: Column info context — provides column data types to form renderers
- **Dependencies**: `../types`

### ❌ REMOVE — `impl/data-frames/forms/datatype-icon.tsx` (reason: Python DataFrame data type icons)

- **Lines**: ~60
- **Exports**: `DataTypeIcon` component
- **Purpose**: Data type icon component — renders icons for DataFrame column types (int, float, str, bool, datetime, etc.)
- **Dependencies**: `lucide-react`, `@/core/kernel/messages`

### ❌ REMOVE — `impl/data-frames/forms/renderers.tsx` (reason: Python DataFrame operation form renderers)

- **Lines**: ~500
- **Exports**: `OperationFormRenderer` component, individual operation form components
- **Purpose**: Operation form renderers — React Hook Form-based UIs for each DataFrame operation type (filter, sort, group, etc.)
- **Dependencies**: `@hookform/resolvers/zod`, `react-hook-form`, `../schema`, `../types`, `./context`, `@/components/ui/*`

### ❌ REMOVE — `impl/data-frames/forms/__tests__/form.test.tsx` (reason: test for removed plugin)

- **Lines**: ~150
- **Exports**: (test file)
- **Purpose**: Operation form rendering and validation tests
- **Dependencies**: `../renderers`

### ❌ REMOVE — `impl/data-frames/utils/getEffectiveColumns.ts` (reason: Python DataFrame column resolution)

- **Lines**: ~40
- **Exports**: `getEffectiveColumns()`
- **Purpose**: Column resolution — computes effective column list after applying pending operations
- **Dependencies**: `../types`

### ❌ REMOVE — `impl/data-frames/utils/operators.ts` (reason: Python DataFrame filter operators)

- **Lines**: ~80
- **Exports**: `getOperators()`, `getFilterOperators()`
- **Purpose**: Operator definitions — available filter/comparison operators per data type (==, !=, >, <, contains, etc.)
- **Dependencies**: `zod`, `@/core/kernel/messages`, `@/components/forms/options`

### ❌ REMOVE — `impl/data-frames/utils/__tests__/getEffectiveColumns.test.ts` (reason: test for removed plugin)

- **Lines**: ~50
- **Exports**: (test file)
- **Purpose**: Effective column computation tests
- **Dependencies**: `../getEffectiveColumns`

### ❌ REMOVE — `impl/data-frames/utils/__tests__/operators.test.ts` (reason: test for removed plugin)

- **Lines**: ~80
- **Exports**: (test file)
- **Purpose**: Operator mapping tests
- **Dependencies**: `../operators`

---

## impl/image-comparison/

### ❌ REMOVE — `impl/image-comparison/ImageComparisonComponent.tsx` (reason: image comparison slider, not relevant for quant trading)

- **Lines**: ~80
- **Exports**: `ImageComparisonComponent`, `ImageComparisonData` type
- **Purpose**: Image comparison slider — uses `@img-comparison-slider/react` for before/after image comparison
- **Dependencies**: `@img-comparison-slider/react`

---

## impl/panel/

### ❌ REMOVE — `impl/panel/PanelPlugin.tsx` (reason: Python Bokeh/Panel integration, VT doesn't use Bokeh)

- **Lines**: ~80
- **Exports**: `PanelPlugin` (createPlugin)
- **Purpose**: Bokeh/Panel integration — `marimo-panel` tag, renders Panel/Bokeh HTML output with script execution
- **Dependencies**: `../../core/builder`, `./utils`

### ❌ REMOVE — `impl/panel/utils.ts` (reason: Python Bokeh/Panel utilities)

- **Lines**: ~40
- **Exports**: `MessageSchema`, `executeScripts()`
- **Purpose**: Panel utilities — Zod schema for Panel messages, script execution helper for Bokeh widget initialization
- **Dependencies**: `zod`

### ❌ REMOVE — `impl/panel/__tests__/utils.test.ts` (reason: test for removed plugin)

- **Lines**: ~50
- **Exports**: (test file)
- **Purpose**: Panel utility tests — script execution, message parsing
- **Dependencies**: `../utils`

---

## impl/plotly/

### ❌ REMOVE — `impl/plotly/PlotlyPlugin.tsx` (reason: Python Plotly chart renderer, VT uses ngx-charts/visx/Recharts)

- **Lines**: ~100
- **Exports**: `PlotlyPlugin` class
- **Purpose**: Plotly chart plugin — `marimo-vega` tag (shared tag name), imports plotly.css and mapbox.css, lazy-loads Plot component
- **Dependencies**: `../../types`, `./Plot`

### ❌ REMOVE — `impl/plotly/Plot.tsx` (reason: Python Plotly chart wrapper)

- **Lines**: ~200
- **Exports**: `Plot` component
- **Purpose**: Plotly.js chart wrapper — renders interactive Plotly charts with react-plotly.js, handles resize, click/selection events, template parsing
- **Dependencies**: `plotly.js`, `react-plotly.js`, `./parse-from-template`, `./usePlotlyLayout`

### ❌ REMOVE — `impl/plotly/parse-from-template.ts` (reason: Plotly template parser)

- **Lines**: ~80
- **Exports**: `parseFromTemplate()`
- **Purpose**: Template parser — extracts Plotly layout/data from template strings with lodash `get()` path resolution
- **Dependencies**: `lodash-es`, `plotly.js` types

### ❌ REMOVE — `impl/plotly/usePlotlyLayout.ts` (reason: Plotly layout management hook)

- **Lines**: ~100
- **Exports**: `usePlotlyLayout()` hook
- **Purpose**: Layout management — merges default Plotly layout with user overrides, handles theme-aware styling, previous-state diffing to avoid unnecessary re-renders
- **Dependencies**: `@uidotdev/usehooks`, `lodash-es`, `plotly.js` types

### ❌ REMOVE — `impl/plotly/plotly.css` (reason: Plotly custom styles)

- **Lines**: ~30
- **Exports**: (CSS)
- **Purpose**: Plotly custom styles — overrides for Plotly.js chart container sizing and modebar
- **Dependencies**: (none)

### ❌ REMOVE — `impl/plotly/mapbox.css` (reason: Plotly Mapbox styles)

- **Lines**: ~20
- **Exports**: (CSS)
- **Purpose**: Mapbox styles — overrides for Plotly mapbox integration
- **Dependencies**: (none)

### ❌ REMOVE — `impl/plotly/__tests__/parse-from-template.test.ts` (reason: test for removed plugin)

- **Lines**: ~80
- **Exports**: (test file)
- **Purpose**: Template parsing tests
- **Dependencies**: `../parse-from-template`

### ❌ REMOVE — `impl/plotly/__tests__/usePlotlyLayout.test.ts` (reason: test for removed plugin)

- **Lines**: ~100
- **Exports**: (test file)
- **Purpose**: Layout hook tests — merge behavior, theme application
- **Dependencies**: `../usePlotlyLayout`

---

## impl/vega/

### ❌ REMOVE — `impl/vega/VegaPlugin.tsx` (reason: Python Vega/Vega-Lite chart plugin, VT uses ngx-charts/visx)

- **Lines**: ~80
- **Exports**: `VegaPlugin` class
- **Purpose**: Vega/Vega-Lite chart plugin — `marimo-vega` tag, lazy-loads vega-component, handles chart-selection state
- **Dependencies**: `../../types`, `./vega-component`

### ❌ REMOVE — `impl/vega/vega-component.tsx` (reason: Python Vega-Lite rendering)

- **Lines**: ~250
- **Exports**: `VegaComponent` component
- **Purpose**: Vega-Lite rendering — uses `useVegaEmbed` from react-vega, signal listeners for interactivity, theme-aware spec injection, selection state management
- **Dependencies**: `react-vega`, `./loader`, `./make-selectable`, `./resolve-data`, `./types`, `./utils`

### ❌ REMOVE — `impl/vega/batched.ts` (reason: batched Arrow data loading for Python Vega)

- **Lines**: ~60
- **Exports**: `batchedLoadData()`
- **Purpose**: Batched data loading — groups multiple IPC data requests using `@uwdata/flechette` Arrow table deserialization
- **Dependencies**: `@uwdata/flechette`, `@/utils/batch-requests`

### ❌ REMOVE — `impl/vega/encodings.ts` (reason: Vega-Lite encoding extraction for Python data explorer)

- **Lines**: ~80
- **Exports**: `getEncodings()`, `flattenEncodings()`
- **Purpose**: Encoding extraction — walks Vega-Lite spec tree to extract all encoding channels and their field definitions
- **Dependencies**: `./marks`, `./params`, `./types`

### ❌ REMOVE — `impl/vega/fix-relative-url.ts` (reason: URL resolution for marimo server)

- **Lines**: ~30
- **Exports**: `fixRelativeUrl()`
- **Purpose**: URL resolution — converts relative URLs in Vega specs to absolute URLs using marimo server base
- **Dependencies**: `@/core/runtime/config`

### ❌ REMOVE — `impl/vega/formats.ts` (reason: Arrow data format handling for Python Vega)

- **Lines**: ~60
- **Exports**: `vegaLoadData()` (Arrow table loader)
- **Purpose**: Data format handling — loads Arrow IPC data into Vega-compatible format using flechette
- **Dependencies**: `@uwdata/flechette`

### ❌ REMOVE — `impl/vega/loader.ts` (reason: Vega data loader for Python)

- **Lines**: ~100
- **Exports**: `vegaLoadData()`, `DataType`, `FieldTypes`
- **Purpose**: Data loading with type parsing — loads data from various formats, detects field types for Vega-Lite type inference, Arrow support
- **Dependencies**: `@uwdata/flechette`

### ❌ REMOVE — `impl/vega/make-selectable.ts` (reason: Vega-Lite interactivity injection for Python)

- **Lines**: ~150
- **Exports**: `makeSelectable()`
- **Purpose**: Interactivity injection — adds selection parameters (point/interval) to Vega-Lite specs for click/brush selection support
- **Dependencies**: `./encodings`, `./marks`, `./params`, `./types`

### ❌ REMOVE — `impl/vega/marks.ts` (reason: Vega mark type utilities for Python)

- **Lines**: ~40
- **Exports**: `Marks` object, `isInteractiveMark()`
- **Purpose**: Mark type utilities — non-interactive mark set (boxplot, errorband, errorbar), mark type classification
- **Dependencies**: `./types`

### ❌ REMOVE — `impl/vega/params.ts` (reason: Vega-Lite selection parameters for Python)

- **Lines**: ~100
- **Exports**: `ParamNames`, `getParams()`, `addSelectionParams()`
- **Purpose**: Selection parameter management — creates Vega-Lite selection parameters for point/interval interactivity
- **Dependencies**: `vega-lite`, `./types`

### ❌ REMOVE — `impl/vega/resolve-data.ts` (reason: Vega data resolution for Python)

- **Lines**: ~80
- **Exports**: `resolveData()`
- **Purpose**: Data resolution — resolves data references in Vega specs, handles inline data, URL data, and named data sources
- **Dependencies**: `@/core/runtime/config`, `./loader`, `./types`

### ❌ REMOVE — `impl/vega/types.ts` (reason: Vega type definitions for Python)

- **Lines**: ~60
- **Exports**: `VegaLiteSpec`, `AnyMark`, `Mark`, `VegaDataType`, field/encoding types
- **Purpose**: Vega type definitions — spec types, mark enum, encoding interfaces, data type unions
- **Dependencies**: `vega-lite`

### ❌ REMOVE — `impl/vega/utils.ts` (reason: Vega utilities for Python)

- **Lines**: ~40
- **Exports**: `getFieldTypes()`, other Vega utility functions
- **Purpose**: Vega utilities — field type extraction from data, spec manipulation helpers
- **Dependencies**: `./vega-loader`

### ❌ REMOVE — `impl/vega/vega-loader.ts` (reason: Vega loader adapter for Python)

- **Lines**: ~30
- **Exports**: `vegaLoader`, `DataType`, `DataFormat`
- **Purpose**: Vega loader adapter — wraps vega-loader library for data format detection and loading
- **Dependencies**: `vega-loader`

### ❌ REMOVE — `impl/vega/vega.css` (reason: Vega chart styles for Python)

- **Lines**: ~40
- **Exports**: (CSS)
- **Purpose**: Vega chart styles — container sizing, canvas overflow handling, tooltip positioning
- **Dependencies**: (none)

### ❌ REMOVE — `impl/vega/__tests__/encodings.test.ts` (reason: test for removed plugin)

- **Lines**: ~80
- **Exports**: (test file)
- **Purpose**: Encoding extraction tests
- **Dependencies**: `../encodings`

### ❌ REMOVE — `impl/vega/__tests__/loader.test.ts` (reason: test for removed plugin)

- **Lines**: ~60
- **Exports**: (test file)
- **Purpose**: Data loader tests
- **Dependencies**: `../loader`

### ❌ REMOVE — `impl/vega/__tests__/make-selectable.test.ts` (reason: test for removed plugin)

- **Lines**: ~100
- **Exports**: (test file)
- **Purpose**: Selection interactivity injection tests
- **Dependencies**: `../make-selectable`

### ❌ REMOVE — `impl/vega/__tests__/params.test.ts` (reason: test for removed plugin)

- **Lines**: ~80
- **Exports**: (test file)
- **Purpose**: Selection parameter tests
- **Dependencies**: `../params`

### ❌ REMOVE — `impl/vega/__tests__/resolve-data.test.ts` (reason: test for removed plugin)

- **Lines**: ~60
- **Exports**: (test file)
- **Purpose**: Data resolution tests
- **Dependencies**: `../resolve-data`

### ❌ REMOVE — `impl/vega/__tests__/vega.test.ts` (reason: test for removed plugin)

- **Lines**: ~100
- **Exports**: (test file)
- **Purpose**: End-to-end Vega rendering tests
- **Dependencies**: `../VegaPlugin`, `../vega-component`

---

## layout/

### ❌ REMOVE — `layout/AccordionPlugin.tsx` (reason: Python layout widget, VT has own accordion via Radix)

- **Lines**: ~60
- **Exports**: `AccordionPlugin` class
- **Purpose**: Accordion layout — `marimo-accordion` tag, IStatelessPlugin, uses Radix Accordion for collapsible sections with child content
- **Dependencies**: `../stateless-plugin`, `@radix-ui/react-accordion`

### ❌ REMOVE — `layout/CalloutPlugin.tsx` (reason: Python callout/admonition widget)

- **Lines**: ~40
- **Exports**: `CalloutPlugin` class
- **Purpose**: Callout/admonition — `marimo-callout` tag, IStatelessPlugin, delegates to CalloutOutput component for info/warn/danger styled blocks
- **Dependencies**: `../stateless-plugin`, `../../components/editor/output/CalloutOutput`

### ❌ REMOVE — `layout/carousel/CarouselPlugin.tsx` (reason: Python content carousel, not needed in quant trading)

- **Lines**: ~80
- **Exports**: `CarouselPlugin` class
- **Purpose**: Image/content carousel — `marimo-carousel` tag, IStatelessPlugin, Swiper.js integration for horizontal sliding content
- **Dependencies**: `../stateless-plugin`, `swiper`

### ❌ REMOVE — `layout/DownloadPlugin.tsx` (reason: Python download button widget)

- **Lines**: ~80
- **Exports**: `DownloadPlugin` (createPlugin)
- **Purpose**: Download button — `marimo-download` tag, provides file download with configurable filename, data (base64 or URL), disabled state
- **Dependencies**: `../../core/builder`

### ❌ REMOVE — `layout/ImageComparisonPlugin.tsx` (reason: Python image comparison layout, not needed)

- **Lines**: ~40
- **Exports**: `ImageComparisonPlugin` class
- **Purpose**: Image comparison layout — `marimo-image-comparison` tag, IStatelessPlugin, lazy-loads ImageComparisonComponent
- **Dependencies**: `../stateless-plugin`, `../impl/image-comparison/ImageComparisonComponent`

### ❌ REMOVE — `layout/JsonOutputPlugin.tsx` (reason: Python JSON viewer widget, VT can render JSON natively if needed)

- **Lines**: ~50
- **Exports**: `JsonOutputPlugin` class
- **Purpose**: JSON viewer — `marimo-json-output` tag, IStatelessPlugin, renders JSON with EmotionCacheProvider for Shadow DOM style isolation
- **Dependencies**: `../stateless-plugin`, `../../components/editor/output/EmotionCacheProvider`

### ❌ REMOVE — `layout/LazyPlugin.tsx` (reason: Python lazy loading with kernel RPC)

- **Lines**: ~80
- **Exports**: `LazyPlugin` (createPlugin)
- **Purpose**: Lazy loading container — `marimo-lazy` tag, uses IntersectionObserver to defer content loading, RPC `load` function to trigger kernel-side evaluation
- **Dependencies**: `../../core/builder`, `../../core/rpc`

### ❌ REMOVE — `layout/MimeRenderPlugin.tsx` (reason: Python MIME type renderer)

- **Lines**: ~40
- **Exports**: `MimeRendererPlugin` class
- **Purpose**: MIME type renderer — `marimo-mime-renderer` tag, IStatelessPlugin, delegates to OutputRenderer for rendering arbitrary MIME types
- **Dependencies**: `../stateless-plugin`, `../../components/editor/output/OutputRenderer`

### ❌ REMOVE — `layout/mermaid/MermaidPlugin.tsx` (reason: Python Mermaid diagram widget, VT unlikely to need diagrams in cell output)

- **Lines**: 27
- **Exports**: `MermaidPlugin` class
- **Purpose**: Mermaid diagram entry — `marimo-mermaid` tag, IStatelessPlugin, lazy-loads mermaid renderer
- **Dependencies**: `../../stateless-plugin`

### ❌ REMOVE — `layout/mermaid/mermaid.tsx` (reason: Mermaid.js rendering for Python output)

- **Lines**: ~100
- **Exports**: `MermaidRenderer` component
- **Purpose**: Mermaid.js rendering — initializes mermaid library with config, renders diagrams to SVG, handles theme and security settings
- **Dependencies**: `mermaid`

### ❌ REMOVE — `layout/NavigationMenuPlugin.tsx` (reason: Python navigation menu widget, VT has own navigation)

- **Lines**: ~100
- **Exports**: `NavigationMenuPlugin` class
- **Purpose**: Navigation menu — `marimo-nav-menu` tag, IStatelessPlugin, renders hierarchical navigation with links, supports orientation and active state
- **Dependencies**: `../stateless-plugin`, `@radix-ui/react-navigation-menu`

### ❌ REMOVE — `layout/navigation-menu.css` (reason: styles for removed navigation menu plugin)

- **Lines**: ~30
- **Exports**: (CSS)
- **Purpose**: Navigation menu styles — custom styles for Radix navigation menu animations and positioning
- **Dependencies**: (none)

### ❌ REMOVE — `layout/OutlinePlugin.tsx` (reason: Python notebook outline widget tied to marimo cell system)

- **Lines**: ~80
- **Exports**: `OutlinePlugin` class
- **Purpose**: Document outline — `marimo-outline` tag, IStatelessPlugin, uses Jotai atom for notebook heading outline, renders clickable TOC
- **Dependencies**: `../stateless-plugin`, `jotai`, `@/core/cells/cells`

### ❌ REMOVE — `layout/ProgressPlugin.tsx` (reason: Python progress bar widget)

- **Lines**: ~60
- **Exports**: `ProgressPlugin` class
- **Purpose**: Progress bar — `marimo-progress` tag, IStatelessPlugin, shows progress with percentage, optional title, humanized duration remaining
- **Dependencies**: `../stateless-plugin`

### ❌ REMOVE — `layout/RoutesPlugin.tsx` (reason: Python client-side routing widget, VT uses Next.js routing)

- **Lines**: 80
- **Exports**: `RoutesPlugin` class
- **Purpose**: Client-side routing — `marimo-routes` tag, IStatelessPlugin, TinyRouter for hash/popstate route matching, renders matched child by index
- **Dependencies**: `../stateless-plugin`, `@/utils/routes`

### ❌ REMOVE — `layout/StatPlugin.tsx` (reason: Python statistic display widget, VT has own stat components via DetailStatItem)

- **Lines**: 131
- **Exports**: `StatPlugin` class, `StatComponent` component
- **Purpose**: Statistic display — `marimo-stat` tag, IStatelessPlugin, shows value/label/caption with direction indicators (up/down arrows), market-style coloring
- **Dependencies**: `../stateless-plugin`, `@/components/data-table/mime-cell`, `@/utils/numbers`, `../core/RenderHTML`

### ❌ REMOVE — `layout/TexPlugin.tsx` (reason: Python LaTeX rendering widget, VT unlikely to need TeX in cell output)

- **Lines**: ~80
- **Exports**: `TexPlugin` class
- **Purpose**: LaTeX rendering — `marimo-tex` tag, IStatelessPlugin, renders TeX/LaTeX math expressions via KaTeX
- **Dependencies**: `../stateless-plugin`, `katex`

### ❌ REMOVE — `layout/__test__/ProgressPlugin.test.ts` (reason: test for removed plugin)

- **Lines**: ~50
- **Exports**: (test file)
- **Purpose**: Progress plugin rendering and duration tests
- **Dependencies**: `../ProgressPlugin`

---

## Summary

| Subdirectory           | Source Files | Test Files | CSS Files | Total   |
| ---------------------- | ------------ | ---------- | --------- | ------- |
| root                   | 3            | —          | —         | 3       |
| core/                  | 7            | 4          | —         | 11      |
| impl/ (top-level)      | 26           | 5          | —         | 31      |
| impl/anywidget/        | 6            | 4          | —         | 10      |
| impl/chat/             | 3            | —          | —         | 3       |
| impl/code/             | 2            | 1          | —         | 3       |
| impl/common/           | 3            | —          | —         | 3       |
| impl/data-editor/      | 6            | 2          | —         | 8       |
| impl/data-explorer/    | 14           | —          | —         | 14      |
| impl/data-frames/      | 9            | 3          | —         | 12      |
| impl/image-comparison/ | 1            | —          | —         | 1       |
| impl/panel/            | 2            | 1          | —         | 3       |
| impl/plotly/           | 4            | 2          | 2         | 8       |
| impl/vega/             | 12           | 6          | 1         | 19      |
| layout/                | 15           | 1          | 1         | 17      |
| **Total**              | **113**      | **29**     | **4**     | **146** |

### Plugin Registration Summary

**UI_PLUGINS (31 stateful)**: Button, Checkbox, DataTable, DatePicker, DateTime, DateRange, Dict, CodeEditor, Dropdown, FileUpload, FileBrowser, Form, Microphone, Multiselect, Number, Radio, Refresh, RangeSlider, Slider, Switch, Tabs, TextArea, TextInput, Vega, Plotly, Chat, DataExplorer, DataFrame, Lazy, Download, AnyWidget, DataEditor, Panel

**LAYOUT_PLUGINS (13 stateless)**: Accordion, Callout, Carousel, ImageComparison, JsonOutput, MimeRenderer, Mermaid, NavigationMenu, Outline, Progress, Routes, Stat, Tex

### Key External Dependencies

| Dependency                         | Used By          | Purpose                     |
| ---------------------------------- | ---------------- | --------------------------- |
| `@glideapps/glide-data-grid`       | data-editor      | Spreadsheet-like editing    |
| `@ai-sdk/react`                    | chat             | Streaming chat UI           |
| `@img-comparison-slider/react`     | image-comparison | Before/after slider         |
| `compassql`                        | data-explorer    | Chart recommendation engine |
| `vega-lite`, `react-vega`          | vega             | Declarative chart rendering |
| `plotly.js`, `react-plotly.js`     | plotly           | Interactive plotting        |
| `swiper`                           | carousel         | Slide-based content         |
| `mermaid`                          | mermaid          | Diagram rendering           |
| `katex`                            | tex              | LaTeX math rendering        |
| `dompurify`                        | core/sanitize    | HTML sanitization           |
| `html-react-parser`                | core/RenderHTML  | HTML-to-React conversion    |
| `@uiw/codemirror-extensions-langs` | code             | Dynamic language loading    |
