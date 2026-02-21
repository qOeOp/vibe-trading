# 02 — components/ (excluding editor/)

> Inventory of all `.ts`, `.tsx`, `.css` files under `marimo/frontend/src/components/`
> excluding the `editor/` subdirectory. **270 files total.**
>
> Generated: 2026-02-19

---

## ai/

### ⚠️ ADAPT — ai/ai-model-dropdown.tsx

**Lines**: 391
**Exports**: AIModelDropdown (L50-L205), AiModelInfoDisplay (L326-L382), getProviderLabel (L384-L390)
**Purpose**: Dropdown component for selecting AI models, grouped by provider with nested sub-menus
**Dependencies**: core/ai/config, core/ai/ids/ids, core/ai/model-registry, core/config/config, ./ai-provider-icon, ./display-helpers, ../app-config/state, ../ui/dropdown-menu, ../ui/tooltip

### ⚠️ ADAPT — ai/ai-provider-icon.tsx

**Lines**: 65
**Exports**: AiProviderIconProps (L39), AiProviderIcon (L45-L64)
**Purpose**: Renders provider-specific SVG icons (OpenAI, Anthropic, Google, etc.) for AI model UI
**Dependencies**: core/ai/ids/ids, @/utils/cn, ../chat/acp/state

### ⚠️ ADAPT — ai/ai-utils.ts

**Lines**: 104
**Exports**: getConfiguredProvider (L34-L53), getRecommendedModel (L55-L63), AutoPopulateResult (L65), autoPopulateModels (L76-L103)
**Purpose**: Utility functions to detect configured AI providers and auto-populate model selections
**Dependencies**: core/ai/ids/ids, core/ai/model-registry, core/config/config-schema

### ⚠️ ADAPT — ai/display-helpers.tsx

**Lines**: 33
**Exports**: getTagColour (L5-L17), getCurrentRoleTooltip (L19-L32)
**Purpose**: Helper functions for AI role tag colors and tooltip text
**Dependencies**: @marimo-team/llm-info (types only)

### ❌ REMOVE — ai/**tests**/ai-utils.test.ts (reason: tests for marimo-specific AI config)

**Lines**: 277
**Purpose**: Tests for getConfiguredProvider, getRecommendedModel, autoPopulateModels
**Dependencies**: ../ai-utils

---

## app-config/

### ❌ REMOVE — app-config/ai-config.tsx (reason: VT will have its own AI config UI)

**Lines**: 1784
**Exports**: AiProviderTitle (L101), ApiKey (L123), BaseUrl (L191), ModelSelector (L245), ProviderSelect (L332), AiCodeCompletionConfig (L532), CustomProvidersConfig (L593), AiProvidersConfig (L850), AiAssistConfig (L1211), AiModelDisplayConfig (L1380), AddModelForm (L1502), AiSettingsSubTab (L1734), AiConfig (L1740)
**Purpose**: Comprehensive AI configuration UI: provider credentials, model selection, code completion, custom providers, model display settings
**Dependencies**: core/ai/config, core/ai/ids/ids, core/ai/model-registry, core/codemirror/copilot/copilot-config, core/config/config-schema, core/wasm/utils, @/utils/cn, @/utils/events, @/utils/strings, ../ai/_, ../ui/_, ./common, ./constants, ./incorrect-model-id, ./is-overridden, ./mcp-config, ./state

### ❌ REMOVE — app-config/app-config-button.tsx (reason: VT has its own settings architecture)

**Lines**: 101
**Exports**: ConfigButton (L30-L100)
**Purpose**: Settings button that opens a popover with AppConfigForm and a dialog for UserConfigForm
**Dependencies**: ./app-config-form, ../ui/popover, ../editor/inputs/Inputs, ../ui/button, ../ui/dialog, ../ui/tooltip, ./state, ./user-config-form

### ❌ REMOVE — app-config/app-config-form.tsx (reason: VT has its own notebook settings)

**Lines**: 322
**Exports**: AppConfigForm (L39-L306)
**Purpose**: Notebook-level settings form (width, title, CSS file, SQL output type, auto-download)
**Dependencies**: core/config/config, core/config/widths, core/network/requests, @/hooks/useDebounce, @/utils/arrays, core/config/config-schema, ../ui/\*, ./common

### ✅ KEEP — app-config/common.tsx

**Lines**: 63
**Exports**: formItemClasses (L7), SettingTitle (L9), SettingSubtitle (L17), SettingDescription (L35), SettingGroup (L41), SQL_OUTPUT_SELECT_OPTIONS (L53)
**Purpose**: Shared layout primitives and constants for settings forms
**Dependencies**: core/config/config-schema, @/utils/cn

### ❌ REMOVE — app-config/constants.ts (reason: AWS Bedrock regions not needed in VT)

**Lines**: 38
**Exports**: AWS_REGIONS (L6)
**Purpose**: AWS region list for Bedrock configuration
**Dependencies**: none

### ❌ REMOVE — app-config/data-form.tsx (reason: VT has its own data layer config)

**Lines**: 272
**Exports**: DataForm (L26)
**Purpose**: User config form section for data/database settings (SQL output, discovery, dataframes)
**Dependencies**: ../ui/form, ../ui/native-select, ../ui/number-field, core/config/config-schema, ../ui/checkbox, ./common, ./is-overridden

### ❌ REMOVE — app-config/incorrect-model-id.tsx (reason: marimo-specific AI model validation)

**Lines**: 38
**Exports**: IncorrectModelId (L11)
**Purpose**: Warning banner when a model ID doesn't match the expected provider/model format
**Dependencies**: core/ai/ids/ids

### ✅ KEEP — app-config/is-overridden.tsx

**Lines**: 111
**Exports**: DisableIfOverridden (L38), IsOverridden (L73)
**Purpose**: Components to detect and display when a config field is overridden by environment or TOML
**Dependencies**: core/config/config-schema, @/utils/cn

### ❌ REMOVE — app-config/mcp-config.tsx (reason: VT doesn't need MCP protocol config)

**Lines**: 156
**Exports**: MCPConfig (L48)
**Purpose**: MCP (Model Context Protocol) server configuration form
**Dependencies**: ../ui/\*, ../mcp/hooks, ./common

### ❌ REMOVE — app-config/optional-features.tsx (reason: Python package management not needed in VT)

**Lines**: 242
**Exports**: OptionalFeatures (L108)
**Purpose**: UI for checking and installing optional Python packages (e.g., altair, polars)
**Dependencies**: core/config/config, core/network/requests, core/wasm/utils, @/hooks/useAsyncData, @/plugins/impl/common/error-banner, @/utils/cn, ./common

### ❌ REMOVE — app-config/state.ts (reason: marimo-specific settings state)

**Lines**: 24
**Exports**: aiSettingsSubTabAtom (L9), settingDialogAtom (L11), useOpenSettingsToTab (L13)
**Purpose**: Jotai atoms for AI settings sub-tab and settings dialog open state
**Dependencies**: ./ai-config (type)

### ❌ REMOVE — app-config/user-config-form.tsx (reason: VT has its own settings page)

**Lines**: 1427
**Exports**: getDirtyValues (L68), applyManualInjections (L147), SettingCategoryId (L205), activeUserConfigCategoryAtom (L207), UserConfigForm (L214)
**Purpose**: Full user-level settings form with sidebar navigation (Editor, Display, AI, Server, Keymap, Package Management, etc.)
**Dependencies**: core/config/config, core/config/config-schema, core/network/requests, @/hooks/useDebounce, @/utils/cn, ../ui/\*, ./ai-config, ./common, ./data-form, ./is-overridden, ./optional-features

### ❌ REMOVE — app-config/**tests**/get-dirty-values.test.ts (reason: tests for removed component)

**Lines**: 98
**Purpose**: Tests for getDirtyValues utility
**Dependencies**: ../user-config-form

---

## audio/

### ❌ REMOVE — audio/audio-recorder.tsx (reason: VT doesn't need audio recording)

**Lines**: 59
**Exports**: AudioRecorder (L17)
**Purpose**: Audio recording component with start/stop/clear controls using MediaRecorder API
**Dependencies**: @/utils/cn

---

## buttons/

### ✅ KEEP — buttons/clear-button.tsx

**Lines**: 20
**Exports**: ClearButton (L11)
**Purpose**: Small "clear" icon button (XCircle) for resetting form values
**Dependencies**: none (lucide only)

### ✅ KEEP — buttons/undo-button.tsx

**Lines**: 31
**Exports**: UndoButton (L11)
**Purpose**: "Undo" icon button (Undo2) for reverting to last saved value
**Dependencies**: none (lucide only)

---

## charts/

### ❌ REMOVE — charts/lazy.tsx (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 5
**Exports**: LazyVegaEmbed (L5)
**Purpose**: Lazy-loaded Vega-Embed component for chart rendering
**Dependencies**: none (React.lazy import)

### ❌ REMOVE — charts/tooltip.ts (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 5
**Exports**: tooltipHandler (L5)
**Purpose**: Singleton Vega tooltip handler instance
**Dependencies**: vega-tooltip

### ❌ REMOVE — charts/types.ts (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 7
**Exports**: SignalListener (L5)
**Purpose**: TypeScript interface for Vega signal listener callbacks
**Dependencies**: vega (types only)

---

## chat/

### ⚠️ ADAPT — chat/chat-components.tsx

**Lines**: 172
**Exports**: (internal chat UI components used by chat-panel)
**Purpose**: Chat message rendering components: ChatMessage, UserMessage, AssistantMessage, file attachments
**Dependencies**: @/utils/cn, ../markdown/markdown-renderer, ../ui/\*, ./reasoning-accordion, ./tool-call-accordion

### ⚠️ ADAPT — chat/chat-display.tsx

**Lines**: 89
**Exports**: (ChatDisplay component)
**Purpose**: Scrollable chat message list with auto-scroll to bottom
**Dependencies**: ../ui/scroll-area

### ⚠️ ADAPT — chat/chat-history-popover.tsx

**Lines**: 118
**Exports**: (ChatHistoryPopover)
**Purpose**: Popover showing chat conversation history with ability to restore previous sessions
**Dependencies**: ./chat-history-utils, ../ui/popover

### ⚠️ ADAPT — chat/chat-history-utils.ts

**Lines**: 60
**Exports**: (chat history storage utilities)
**Purpose**: Functions for saving/loading/managing chat history in localStorage
**Dependencies**: @/utils/storage/typed

### ⚠️ ADAPT — chat/chat-panel.tsx

**Lines**: 694
**Exports**: (ChatPanel main component)
**Purpose**: Main chat panel with message input, file attachments, model selection, and AI completion integration
**Dependencies**: core/ai/_, core/config/config, core/network/requests, @/hooks/_, ../ai/_, ../ui/_, ./chat-components, ./chat-display, ./chat-utils

### ⚠️ ADAPT — chat/chat-utils.ts

**Lines**: 210
**Exports**: PROVIDERS_THAT_SUPPORT_ATTACHMENTS (L21), and various chat utility functions
**Purpose**: Chat utility functions: file state management, tool invocation, message formatting, attachment handling
**Dependencies**: core/ai/ids/ids, core/ai/tools/base, core/ai/tools/registry, core/network/types, @/utils/fileToBase64, @/utils/Logger, ../editor/ai/completion-utils, ../ui/use-toast

### ⚠️ ADAPT — chat/reasoning-accordion.tsx

**Lines**: 47
**Exports**: (ReasoningAccordion)
**Purpose**: Expandable accordion to show AI reasoning/thinking steps
**Dependencies**: ../ui/accordion

### ⚠️ ADAPT — chat/tool-call-accordion.tsx

**Lines**: 224
**Exports**: (ToolCallAccordion)
**Purpose**: Expandable accordion displaying AI tool call details (name, args, result)
**Dependencies**: ../ui/accordion, ../markdown/markdown-renderer

### ❌ REMOVE — chat/**tests**/useFileState.test.tsx (reason: tests for marimo-specific chat hooks)

**Lines**: 71
**Purpose**: Tests for useFileState hook
**Dependencies**: ../chat-utils

---

## chat/acp/ (Agent Communication Protocol)

### ❌ REMOVE — chat/acp/agent-docs.tsx (reason: VT doesn't use ACP protocol)

**Lines**: 105
**Exports**: AgentDocs (L92)
**Purpose**: Documentation panel for external AI agents (Claude, Gemini, etc.) with setup instructions
**Dependencies**: ../ui/links

### ❌ REMOVE — chat/acp/agent-panel.tsx (reason: VT doesn't use ACP protocol)

**Lines**: 1143
**Exports**: AgentPanel (L1143, default)
**Purpose**: Main agent chat panel with session management, message threading, model selection, and ACP protocol integration
**Dependencies**: @zed-industries/agent-client-protocol, core/ai/_, @/utils/_, ./state, ./types, ./blocks, ./thread, ./session-tabs, ./agent-selector, ./model-selector, ./common, ./scroll-to-bottom-button

### ❌ REMOVE — chat/acp/agent-panel.css (reason: VT doesn't use ACP protocol)

**Lines**: 5
**Purpose**: CSS for agent panel animations (typing indicator)

### ❌ REMOVE — chat/acp/agent-selector.tsx (reason: VT doesn't use ACP protocol)

**Lines**: 163
**Exports**: (AgentSelector)
**Purpose**: Dropdown to select between external AI agents (Claude, Gemini, Codex, OpenCode)
**Dependencies**: ../ai/ai-provider-icon, ./state, ./types

### ❌ REMOVE — chat/acp/blocks.tsx (reason: VT doesn't use ACP protocol)

**Lines**: 724
**Exports**: (ContentBlockRenderer and sub-components)
**Purpose**: Renders different content block types from ACP protocol: text, tool_use, tool_result, resource_link, plan, thought
**Dependencies**: ../markdown/markdown-renderer, ../ui/\*, @/utils/cn

### ❌ REMOVE — chat/acp/common.tsx (reason: VT doesn't use ACP protocol)

**Lines**: 195
**Exports**: SimpleAccordion (L34), ConnectionStatus (L99), PermissionRequest (L158)
**Purpose**: Shared UI components for ACP panel: expandable accordion, connection status indicator, permission request dialog
**Dependencies**: ../ui/\*, @/utils/cn

### ❌ REMOVE — chat/acp/context-utils.ts (reason: VT doesn't use ACP protocol)

**Lines**: 110
**Exports**: ContextParseResult (L10), convertFilesToResourceLinks (L18), and other context conversion utilities
**Purpose**: Converts files and notebook context into ACP content blocks for agent communication
**Dependencies**: core/ai/context/context, core/state/jotai, @/utils/fileToBase64, @/utils/Logger

### ❌ REMOVE — chat/acp/model-selector.tsx (reason: VT doesn't use ACP protocol)

**Lines**: 68
**Exports**: (ModelSelector for ACP)
**Purpose**: Model selection dropdown specific to ACP agents
**Dependencies**: ../ai/ai-model-dropdown, ./state

### ❌ REMOVE — chat/acp/prompt.ts (reason: VT doesn't use ACP protocol)

**Lines**: 285
**Exports**: getAgentPrompt (L3)
**Purpose**: System prompt template for AI agents including marimo fundamentals, cell editing rules, and available tools
**Dependencies**: none

### ❌ REMOVE — chat/acp/scroll-to-bottom-button.tsx (reason: VT doesn't use ACP protocol)

**Lines**: 50
**Exports**: ScrollToBottomButton (L50, default)
**Purpose**: Floating button that scrolls chat to the latest message
**Dependencies**: none (lucide only)

### ❌ REMOVE — chat/acp/session-tabs.tsx (reason: VT doesn't use ACP protocol)

**Lines**: 124
**Exports**: SessionTabs (L102)
**Purpose**: Tab bar for managing multiple agent chat sessions
**Dependencies**: ./state, ./types

### ❌ REMOVE — chat/acp/state.ts (reason: VT doesn't use ACP protocol)

**Lines**: 275
**Exports**: TabId (L13), ExternalAgentId (L14), AgentSession (L20), and many Jotai atoms for agent state management
**Purpose**: Jotai state atoms for agent sessions, tab management, selected agents, and session persistence
**Dependencies**: core/hotkeys/shortcuts, @/utils/storage/jotai, @/utils/typed, @/utils/uuid, ./types

### ❌ REMOVE — chat/acp/thread.tsx (reason: VT doesn't use ACP protocol)

**Lines**: 125
**Exports**: AgentThread (L24)
**Purpose**: Renders a thread of agent messages with content blocks and timestamps
**Dependencies**: ./blocks, ./common, ./types

### ❌ REMOVE — chat/acp/types.ts (reason: VT doesn't use ACP protocol)

**Lines**: 75
**Exports**: SessionMode (L11), NotificationEvent (L13), AvailableCommands (L17), AgentConnectionState (L21), AgentPendingPermission (L25), ErrorNotificationEvent (L31), ConnectionChangeNotificationEvent (L35), SessionNotificationEvent (L39), SessionNotificationEventData (L46), various content block types (L56-L75), SessionSupportType (L74), ExternalAgentSessionId (L75)
**Purpose**: TypeScript type definitions for ACP protocol events, sessions, and content blocks
**Dependencies**: @zed-industries/agent-client-protocol (types)

### ❌ REMOVE — chat/acp/utils.ts (reason: VT doesn't use ACP protocol)

**Lines**: 40
**Exports**: (utility functions for ACP)
**Purpose**: Helper functions for ACP: message formatting, timestamp, connection state checks
**Dependencies**: ./types

### ❌ REMOVE — chat/acp/**tests**/atoms.test.ts (reason: tests for removed ACP module)

**Lines**: 47
**Purpose**: Tests for ACP state atoms
**Dependencies**: ../state

### ❌ REMOVE — chat/acp/**tests**/context-utils.test.ts (reason: tests for removed ACP module)

**Lines**: 178
**Purpose**: Tests for context conversion utilities
**Dependencies**: ../context-utils

### ❌ REMOVE — chat/acp/**tests**/prompt.test.ts (reason: tests for removed ACP module)

**Lines**: 9
**Purpose**: Snapshot tests for agent prompt generation
**Dependencies**: ../prompt

### ❌ REMOVE — chat/acp/**tests**/state.test.ts (reason: tests for removed ACP module)

**Lines**: 681
**Purpose**: Comprehensive tests for agent session state management
**Dependencies**: ../state

---

## data-table/

### ❌ REMOVE — data-table/data-table.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 353
**Exports**: DataTable (L353)
**Purpose**: Main DataTable component wrapping TanStack Table with sorting, filtering, pagination, selection, and custom features
**Dependencies**: @tanstack/react-table, ./columns, ./pagination, ./renderers, ./filters, ./types, ./cell-selection/feature, ./cell-styling/feature, ./column-formatting/feature, ./column-wrapping/feature, ./copy-column/feature, ./focus-row/feature, ./cell-hover-text/feature, ./cell-hover-template/feature

### ❌ REMOVE — data-table/columns.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 584
**Exports**: (column definition helpers, createColumns, etc.)
**Purpose**: Column definition factory for DataTable: handles data types, formatting, selection columns, index columns
**Dependencies**: @tanstack/react-table, ./types, ./filters, ./cell-utils, ./mime-cell, ./url-detector, ./column-formatting/feature

### ❌ REMOVE — data-table/column-header.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 631
**Exports**: DataTableColumnHeader (L75), DataTableColumnHeaderWithSummary (L147), renderMenuItemFilter (L172)
**Purpose**: Column header component with sort controls, filter menus, column summary, and context menu
**Dependencies**: @tanstack/react-table, ../ui/dropdown-menu, ../ui/tooltip, ./filters, ./header-items, ./column-summary/column-summary

### ❌ REMOVE — data-table/context-menu.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 123
**Exports**: DataTableContextMenu (L23), CellContextMenu (L69)
**Purpose**: Right-click context menu for data table cells (copy, filter, paste)
**Dependencies**: @/utils/copy, @/utils/Logger, ../ui/context-menu, ./cell-utils, ./filters, ./range-focus/atoms, ./utils

### ❌ REMOVE — data-table/TableActions.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 186
**Exports**: TableActions (L45)
**Purpose**: Toolbar above data table with search, filter pills, download, chart, column explorer buttons
**Dependencies**: ./SearchBar, ./filter-pills, ./download-actions, ./charts/lazy-chart, ./column-explorer-panel/column-explorer

### ❌ REMOVE — data-table/SearchBar.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 60
**Exports**: SearchBar (L18)
**Purpose**: Global search input for filtering data table rows
**Dependencies**: ../ui/input, @/utils/cn

### ❌ REMOVE — data-table/renderers.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 267
**Exports**: renderTableHeader (L32), DataTableBody (L84)
**Purpose**: Table header and body rendering with virtualization support, pinned columns, cell styling
**Dependencies**: @tanstack/react-table, ./cell-utils, ./range-focus/\*, ./cell-styling/feature, ./column-wrapping/feature

### ❌ REMOVE — data-table/pagination.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 326
**Exports**: DataTablePagination (L37), PageSelector (L245), prettifyRowCount (L322), prettifyRowColumnCount (L326)
**Purpose**: Pagination controls with page size selector, page navigation, row count display
**Dependencies**: ../ui/button, ../ui/native-select, @/utils/cn

### ❌ REMOVE — data-table/filter-pills.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 115
**Exports**: FilterPills (L21)
**Purpose**: Displays active column filters as removable pill badges
**Dependencies**: ../ui/badge, ./filters, ./types

### ❌ REMOVE — data-table/filters.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 205
**Exports**: FilterType (L22), Filter (L32), ColumnFilterValue (L76), ColumnFilterForType (L79), filterToFilterCondition (L83)
**Purpose**: Filter type definitions and filter-to-condition conversion logic for DataTable
**Dependencies**: core/kernel/messages (types)

### ❌ REMOVE — data-table/types.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 97
**Exports**: ColumnName (L6), ColumnHeaderStatsKeys (L8), ColumnHeaderStatsKey (L24), ColumnHeaderStats (L25), FieldTypesWithExternalType (L30), FieldTypes (L34), toFieldTypes (L36), BinValues (L51), ValueCounts (L57), SELECT_COLUMN_ID (L59), INDEX_COLUMN_NAME (L61), TOO_MANY_ROWS (L63), TooManyRows (L64), DataTableSelection (L66), extractTimezone (L73)
**Purpose**: Core type definitions for data table: column types, stats, selection, field types
**Dependencies**: core/kernel/messages (types)

### ❌ REMOVE — data-table/schemas.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 17
**Exports**: DownloadAsArgs (L6), DownloadAsSchema (L10)
**Purpose**: Zod schema for download-as-format RPC (csv/json/parquet)
**Dependencies**: @/plugins/core/rpc

### ❌ REMOVE — data-table/utils.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 79
**Exports**: loadTableData (L13), getStableRowId (L42), getPageIndexForRow (L56), stringifyUnknownValue (L76)
**Purpose**: Data loading, row ID extraction, and value stringification utilities
**Dependencies**: core/network/requests, @/utils/Logger

### ❌ REMOVE — data-table/cell-utils.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 14
**Exports**: DATA_CELL_ID (L5), getCellDomProps (L7), DATA_FOR_CELL_ID (L13), getCellForDomProps (L15)
**Purpose**: DOM attribute helpers for cell identification in data tables
**Dependencies**: core/cells/ids (types)

### ❌ REMOVE — data-table/loading-table.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 53
**Exports**: LoadingTable (L18)
**Purpose**: Skeleton loading state for data tables with animated pulse rows
**Dependencies**: @/utils/cn

### ❌ REMOVE — data-table/url-detector.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 110
**Exports**: isMarkdown (L55), MarkdownUrlDetector (L83), UrlDetector (L96)
**Purpose**: Detects URLs and markdown in cell values and renders them as clickable links
**Dependencies**: ../markdown/markdown-renderer, @/utils/events

### ❌ REMOVE — data-table/mime-cell.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 58
**Exports**: MimeCell (L16), isMimeValue (L31), getMimeValues (L40)
**Purpose**: Renders MIME-typed cell values (HTML, images, etc.) within data table cells
**Dependencies**: @/plugins/core/mime (types)

### ❌ REMOVE — data-table/uniformSample.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 18
**Exports**: uniformSample (L6)
**Purpose**: Utility to uniformly sample N items from an array
**Dependencies**: none

### ❌ REMOVE — data-table/date-popover.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 138
**Exports**: DatePopover (L12)
**Purpose**: Date picker popover for filtering date/datetime columns
**Dependencies**: ../ui/date-picker, ../ui/popover, ./types

### ❌ REMOVE — data-table/download-actions.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 210
**Exports**: (DownloadActions component)
**Purpose**: Download dropdown with format options (CSV, JSON, Parquet) and copy-to-clipboard
**Dependencies**: ../ui/dropdown-menu, @/utils/copy, ./schemas

### ❌ REMOVE — data-table/header-items.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 345
**Exports**: renderFormatOptions (L35), renderColumnWrapping (L89), renderColumnPinning (L114), renderCopyColumn (L146), renderSorts (L166), renderSortFilterIcon (L245), renderDataType (L269), ClearFilterMenuItem (L285), renderFilterByValues (L296), FilterButtons (L327)
**Purpose**: Reusable menu item renderers for column header dropdown (sort, filter, format, pin, copy, wrap)
**Dependencies**: @tanstack/react-table, ../ui/\*, ../datasets/icons, ./column-formatting/types, ./column-wrapping/feature, ./copy-column/feature, ./filters, ./types

### ❌ REMOVE — data-table/hooks/use-column-pinning.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 45
**Exports**: useColumnPinning (L15)
**Purpose**: Hook for managing column pinning state with persistence
**Dependencies**: @tanstack/react-table

### ❌ REMOVE — data-table/hooks/use-panel-ownership.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 88
**Exports**: usePanelOwnership (L19)
**Purpose**: Hook to manage which cell "owns" an open side panel (column explorer, row viewer)
**Dependencies**: core/cells/ids

### ❌ REMOVE — data-table/cell-selection/feature.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 110
**Exports**: (CellSelectionFeature - TanStack Table feature)
**Purpose**: Table feature plugin for cell-level row selection with single/multi-row support
**Dependencies**: @tanstack/react-table, ./types

### ❌ REMOVE — data-table/cell-selection/types.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 39
**Exports**: (CellSelectionState, CellSelectionOptions, CellSelectionInstance interfaces)
**Purpose**: Type definitions for cell selection feature
**Dependencies**: @tanstack/react-table

### ❌ REMOVE — data-table/cell-selection/**tests**/feature.test.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 154
**Purpose**: Tests for cell selection feature
**Dependencies**: ../feature

### ❌ REMOVE — data-table/cell-styling/feature.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 36
**Exports**: CellStylingFeature (L20)
**Purpose**: Table feature plugin for per-cell background/text color styling
**Dependencies**: @tanstack/react-table, ./types

### ❌ REMOVE — data-table/cell-styling/types.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 21
**Exports**: CellStyleState (L5), CellStylingTableState (L10), CellStylingCell (L14)
**Purpose**: Type definitions for cell styling feature (color, background per cell)
**Dependencies**: none

### ❌ REMOVE — data-table/cell-hover-text/feature.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 36
**Exports**: CellHoverTextFeature (L20)
**Purpose**: Table feature plugin for showing hover text on cells
**Dependencies**: @tanstack/react-table, ./types

### ❌ REMOVE — data-table/cell-hover-text/types.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 18
**Exports**: CellHoverTextState (L6), CellHoverTextTableState (L8), CellHoverTextCell (L12)
**Purpose**: Type definitions for cell hover text feature
**Dependencies**: none

### ❌ REMOVE — data-table/cell-hover-template/feature.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 12
**Exports**: (CellHoverTemplateFeature)
**Purpose**: Table feature plugin for templated hover content on cells
**Dependencies**: @tanstack/react-table, ./types

### ❌ REMOVE — data-table/cell-hover-template/types.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 9
**Exports**: (CellHoverTemplateState, CellHoverTemplateTableState interfaces)
**Purpose**: Type definitions for cell hover template feature
**Dependencies**: none

### ❌ REMOVE — data-table/column-formatting/feature.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 264
**Exports**: ColumnFormattingFeature (L27), getFormatters (L90), applyFormat (L126), formattingExample (L224)
**Purpose**: Table feature plugin for column number/date formatting (integer, float, percent, currency, scientific, date, etc.)
**Dependencies**: core/kernel/messages, @/utils/assertNever, @/utils/once, ./types

### ❌ REMOVE — data-table/column-formatting/types.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 48
**Exports**: formatOptions (L8), FormatOptions (L20), FormatOption (L21), ColumnFormattingState (L24), ColumnFormattingTableState (L25), ColumnFormattingOptions (L30), ColumnFormattingInstance (L37)
**Purpose**: Type definitions and format option constants for column formatting
**Dependencies**: core/kernel/messages (types)

### ❌ REMOVE — data-table/column-wrapping/feature.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 58
**Exports**: COLUMN_WRAPPING_STYLES (L16), ColumnWrappingFeature (L18)
**Purpose**: Table feature plugin for toggling column text wrapping
**Dependencies**: @tanstack/react-table, ./types

### ❌ REMOVE — data-table/column-wrapping/types.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 23
**Exports**: ColumnWrappingState (L5), ColumnWrappingTableState (L6), ColumnWrappingOptions (L10), ColumnWrappingInstance (L15)
**Purpose**: Type definitions for column wrapping feature
**Dependencies**: none

### ❌ REMOVE — data-table/copy-column/feature.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 25
**Exports**: CopyColumnFeature (L10)
**Purpose**: Table feature plugin for copying entire column values to clipboard
**Dependencies**: @tanstack/react-table, ./types

### ❌ REMOVE — data-table/copy-column/types.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 15
**Exports**: CopyColumnOptions (L5), CopyColumnInstance (L9)
**Purpose**: Type definitions for copy column feature
**Dependencies**: none

### ❌ REMOVE — data-table/focus-row/feature.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 36
**Exports**: FocusRowFeature (L12)
**Purpose**: Table feature plugin for highlighting/focusing a specific row
**Dependencies**: @tanstack/react-table, ./types

### ❌ REMOVE — data-table/focus-row/types.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 25
**Exports**: FocusRowState (L7), FocusRowTableState (L8), FocusRowOptions (L13), FocusRowInstance (L19)
**Purpose**: Type definitions for focus row feature
**Dependencies**: @tanstack/react-table

### ❌ REMOVE — data-table/column-summary/column-summary.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 163
**Exports**: ColumnChartContext (L15), TableColumnSummary (L27)
**Purpose**: Column summary popover with histogram/bar chart for data distribution visualization
**Dependencies**: ./chart-spec-model, ./chart-skeleton, ./utils, ../charts/lazy, ../charts/tooltip

### ❌ REMOVE — data-table/column-summary/chart-spec-model.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 735
**Exports**: ColumnChartSpecModel (L37)
**Purpose**: Generates Vega-Lite chart specs for column summaries (numeric histograms, temporal charts, boolean/categorical bars)
**Dependencies**: ./legacy-chart-spec, ./utils, ../types

### ❌ REMOVE — data-table/column-summary/chart-skeleton.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 53
**Exports**: ChartSkeleton (L42)
**Purpose**: SVG skeleton loading animation for column summary charts
**Dependencies**: none

### ❌ REMOVE — data-table/column-summary/legacy-chart-spec.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 328
**Exports**: getLegacyNumericSpec (L20), getLegacyTemporalSpec (L95), getLegacyBooleanSpec (L192), getDataSpecAndSourceName (L261), getScale (L309)
**Purpose**: Legacy Vega-Lite spec generators for column summary charts
**Dependencies**: none (vega-lite types only)

### ❌ REMOVE — data-table/column-summary/utils.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 119
**Exports**: getPartialTimeTooltip (L9), calculateBinStep (L87)
**Purpose**: Utilities for column summary: time tooltip formatting, bin step calculation
**Dependencies**: none

### ❌ REMOVE — data-table/column-explorer-panel/column-explorer.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 211
**Exports**: (ColumnExplorer component)
**Purpose**: Side panel for exploring column metadata, stats, and distributions
**Dependencies**: ../column-header, ../column-summary/column-summary, ../../datasets/icons, ../types

### ❌ REMOVE — data-table/row-viewer-panel/row-viewer.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 343
**Exports**: (RowViewer component)
**Purpose**: Side panel for viewing a single row's data in a vertical key-value layout
**Dependencies**: ../ui/\*, ../types, ../utils, ../mime-cell

### ❌ REMOVE — data-table/row-viewer-panel/**tests**/row-viewer.test.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 51
**Purpose**: Tests for RowViewer component
**Dependencies**: ../row-viewer

### ❌ REMOVE — data-table/row-viewer-panel/**tests**/filter-rows.test.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 72
**Purpose**: Tests for row filtering in viewer
**Dependencies**: ../row-viewer

### ❌ REMOVE — data-table/range-focus/atoms.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 383
**Exports**: SelectedCell (L9), SelectedCells (L15), CellSelectionState (L17), useCellSelectionReducerActions (L327), cellSelectionStateAtom (L327), selectedCellsAtom (L336), copiedCellsAtom (L339), selectedStartCellAtom (L342), focusedCellAtom (L345), isSelectingAtom (L348), createCellSelectedAtom (L353), createCellCopiedAtom (L359), createCellStateAtom (L365), clearTextSelection (L376)
**Purpose**: Jotai atoms and reducer for cell range selection state (Excel-like cell selection)
**Dependencies**: @/utils/createReducer

### ❌ REMOVE — data-table/range-focus/provider.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 12
**Exports**: CellSelectionProvider (L5)
**Purpose**: React context provider for cell selection state
**Dependencies**: ./atoms

### ❌ REMOVE — data-table/range-focus/cell-selection-indicator.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 31
**Exports**: CellRangeSelectionIndicator (L13)
**Purpose**: Visual overlay showing selected cell range boundaries
**Dependencies**: ./atoms

### ❌ REMOVE — data-table/range-focus/use-cell-range-selection.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 112
**Exports**: UseCellRangeSelectionProps (L8), useCellRangeSelection (L16)
**Purpose**: Hook for mouse-driven cell range selection (click, shift+click, drag)
**Dependencies**: ./atoms, ./utils

### ❌ REMOVE — data-table/range-focus/use-scroll-into-view.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 40
**Exports**: useScrollIntoViewOnFocus (L15)
**Purpose**: Hook to scroll focused cells into the visible viewport
**Dependencies**: ./atoms

### ❌ REMOVE — data-table/range-focus/utils.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 86
**Exports**: getCellValues (L11), getTabSeparatedValues (L42), getCellsBetween (L49)
**Purpose**: Utilities for extracting and formatting cell values from range selections
**Dependencies**: @tanstack/react-table

### ❌ REMOVE — data-table/range-focus/**tests**/atoms.test.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 750
**Purpose**: Comprehensive tests for cell selection state atoms and reducer
**Dependencies**: ../atoms

### ❌ REMOVE — data-table/range-focus/**tests**/utils.test.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 271
**Purpose**: Tests for cell range utility functions
**Dependencies**: ../utils

### ❌ REMOVE — data-table/charts/charts.tsx (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 498
**Exports**: (Charts panel component)
**Purpose**: Main chart creation panel with form, Vega-Lite preview, and Altair code generation
**Dependencies**: ./schemas, ./types, ./context, ./storage, ./components/_, ./forms/_, ../charts/lazy

### ❌ REMOVE — data-table/charts/lazy-chart.tsx (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 53
**Exports**: LazyChart (L12)
**Purpose**: Lazy-loaded chart renderer with error boundary
**Dependencies**: ../../charts/lazy, ../../charts/tooltip

### ❌ REMOVE — data-table/charts/schemas.ts (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 130
**Exports**: (ChartSchema Zod schema)
**Purpose**: Zod validation schema for chart configuration form
**Dependencies**: zod

### ❌ REMOVE — data-table/charts/types.ts (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 105
**Exports**: (ChartType enum, ChartSchemaType, various chart type definitions)
**Purpose**: Type definitions for chart types, aggregations, color schemes, data types, marks
**Dependencies**: none

### ❌ REMOVE — data-table/charts/constants.ts (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 167
**Exports**: COUNT_FIELD (L30), DEFAULT_COLOR_SCHEME (L31), DEFAULT_TIME_UNIT (L32), DEFAULT_MAX_BINS_FACET (L33), EMPTY_VALUE (L36), CHART_TYPE_ICON (L38), DEFAULT_AGGREGATION (L47), AGGREGATION_TYPE_ICON (L48), AGGREGATION_TYPE_DESCRIPTIONS (L67), COLOR_SCHEMES (L86), SCALE_TYPE_DESCRIPTIONS (L139), TIME_UNIT_DESCRIPTIONS (L145)
**Purpose**: Constants for chart configuration: icons, defaults, descriptions, color schemes
**Dependencies**: ./types

### ❌ REMOVE — data-table/charts/context.ts (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 21
**Exports**: ChartFormContext (L8), useChartFormContext (L18)
**Purpose**: React context for chart form state (fields, save function, chart type)
**Dependencies**: ./components/form-fields, ./types

### ❌ REMOVE — data-table/charts/storage.ts (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 78
**Exports**: TabName (L13), KEY (L14), and storage management functions
**Purpose**: Persistent storage for chart tabs per cell using localStorage
**Dependencies**: core/cells/ids, @/utils/Logger, @/utils/storage/typed, ./schemas, ./types

### ❌ REMOVE — data-table/charts/chart-spec/spec.ts (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 311
**Exports**: ErrorMessage (L50), X_AXIS_REQUIRED (L51), Y_AXIS_REQUIRED (L52), createSpecWithoutData (L54), augmentSpecWithData (L151), getAxisEncoding (L161), getFacetEncoding (L197), isFieldSet (L302)
**Purpose**: Vega-Lite spec generation from chart form values (bar, line, scatter, area, heatmap, pie)
**Dependencies**: ./encodings, ./tooltips, ./types, ./utils, ../types, ../constants

### ❌ REMOVE — data-table/charts/chart-spec/encodings.ts (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 157
**Exports**: getBinEncoding (L27), getColorInScale (L64), getColorEncoding (L78), getOffsetEncoding (L138), getAggregate (L153)
**Purpose**: Vega-Lite encoding helpers for bins, colors, offsets, and aggregations
**Dependencies**: ../types, ../constants

### ❌ REMOVE — data-table/charts/chart-spec/tooltips.ts (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 151
**Exports**: getTooltips (L31)
**Purpose**: Tooltip encoding generation for Vega-Lite charts
**Dependencies**: ../types, ../constants

### ❌ REMOVE — data-table/charts/chart-spec/types.ts (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 72
**Exports**: BaseSpec (L9), convertDataTypeToVega (L23), convertDataTypeToSelectable (L45), convertChartTypeToMark (L66)
**Purpose**: Type conversions between data types, Vega-Lite types, and chart marks
**Dependencies**: ../types

### ❌ REMOVE — data-table/charts/chart-spec/utils.ts (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 22
**Exports**: escapeFieldName (L14)
**Purpose**: Utility to escape special characters in Vega-Lite field names
**Dependencies**: none

### ❌ REMOVE — data-table/charts/chart-spec/altair-generator.ts (reason: VT doesn't use Python Altair)

**Lines**: 139
**Exports**: generateAltairChart (L16), generateAltairChartSnippet (L139)
**Purpose**: Generates Python Altair code from chart configuration for embedding in notebooks
**Dependencies**: ../types, ../constants

### ❌ REMOVE — data-table/charts/components/chart-items.tsx (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 338
**Exports**: ChartTypeSelect (L134), XAxis (L174), YAxis (L223), ColorByAxis (L275), Facet (L297)
**Purpose**: Chart form field components: chart type selector, axis selectors, color/facet controls
**Dependencies**: ../context, ../types, ../constants, ./form-fields

### ❌ REMOVE — data-table/charts/components/chart-states.tsx (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 33
**Exports**: (ChartStates - loading/error/empty states)
**Purpose**: Visual state components for chart panel (loading, error, no data)
**Dependencies**: ../../icons/spinner

### ❌ REMOVE — data-table/charts/components/form-fields.tsx (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 896
**Exports**: FieldName (L69), Field (L71), Tooltip (L76), ColumnSelector (L82), SelectField (L192), InputField (L240), NumberField (L269), BooleanField (L309), SliderField (L351), ColorArrayField (L409), TimeUnitSelect (L486), DataTypeSelect (L565), AggregationSelect (L633), TooltipSelect (L761), SortField (L815), BinFields (L846)
**Purpose**: Comprehensive chart form field components: column selectors, type selectors, aggregation, tooltips, bins, sorting
**Dependencies**: ../context, ../types, ../constants, ../../../datasets/icons, ../../../ui/\*

### ❌ REMOVE — data-table/charts/components/layouts.tsx (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 108
**Exports**: (ChartLayout components)
**Purpose**: Layout components for chart form arrangement (sidebar + preview)
**Dependencies**: none

### ❌ REMOVE — data-table/charts/forms/common-chart.tsx (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 183
**Exports**: (CommonChartForm)
**Purpose**: Shared chart configuration form for bar/line/scatter/area chart types
**Dependencies**: ../components/chart-items, ../components/form-fields, ../context

### ❌ REMOVE — data-table/charts/forms/heatmap.tsx (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 39
**Exports**: (HeatmapForm)
**Purpose**: Chart configuration form specific to heatmap chart type
**Dependencies**: ../components/chart-items, ../components/form-fields, ../context

### ❌ REMOVE — data-table/charts/forms/pie.tsx (reason: VT uses ngx-charts/xycharts, not Vega)

**Lines**: 61
**Exports**: (PieChartForm)
**Purpose**: Chart configuration form specific to pie chart type
**Dependencies**: ../components/chart-items, ../components/form-fields, ../context

### ❌ REMOVE — data-table/charts/**tests**/altair-generator.test.ts (reason: tests for removed Vega/Altair)

**Lines**: 523
**Purpose**: Tests for Altair Python code generation
**Dependencies**: ../chart-spec/altair-generator

### ❌ REMOVE — data-table/charts/**tests**/renderer.test.ts (reason: tests for removed Vega charts)

**Lines**: 16
**Purpose**: Tests for chart rendering
**Dependencies**: ../charts

### ❌ REMOVE — data-table/charts/**tests**/spec.test.ts (reason: tests for removed Vega charts)

**Lines**: 1031
**Purpose**: Comprehensive tests for Vega-Lite spec generation
**Dependencies**: ../chart-spec/spec

### ❌ REMOVE — data-table/charts/**tests**/spec-snapshot.test.ts (reason: tests for removed Vega charts)

**Lines**: 75
**Purpose**: Snapshot tests for chart spec output
**Dependencies**: ../chart-spec/spec

### ❌ REMOVE — data-table/charts/**tests**/storage.test.ts (reason: tests for removed Vega charts)

**Lines**: 96
**Purpose**: Tests for chart tab storage
**Dependencies**: ../storage

### ❌ REMOVE — data-table/**tests**/chart-spec-model.test.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 632
**Purpose**: Tests for ColumnChartSpecModel
**Dependencies**: ../column-summary/chart-spec-model

### ❌ REMOVE — data-table/**tests**/column_formatting.test.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 121
**Purpose**: Tests for column formatting feature
**Dependencies**: ../column-formatting/feature

### ❌ REMOVE — data-table/**tests**/columns.test.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 657
**Purpose**: Tests for column definition generation
**Dependencies**: ../columns

### ❌ REMOVE — data-table/**tests**/data-table.test.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 162
**Purpose**: Integration tests for DataTable component
**Dependencies**: ../data-table

### ❌ REMOVE — data-table/**tests**/header-items.test.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 127
**Purpose**: Tests for header menu item renderers
**Dependencies**: ../header-items

### ❌ REMOVE — data-table/**tests**/pagination.test.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 144
**Purpose**: Tests for pagination component and row count formatting
**Dependencies**: ../pagination

### ❌ REMOVE — data-table/**tests**/types.test.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 39
**Purpose**: Tests for type utilities (extractTimezone, toFieldTypes)
**Dependencies**: ../types

### ❌ REMOVE — data-table/**tests**/url-detector.test.tsx (reason: VT has its own data-table at lib/data-table/)

**Lines**: 173
**Purpose**: Tests for URL detection and markdown detection
**Dependencies**: ../url-detector

### ❌ REMOVE — data-table/**tests**/useColumnPinning.test.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 65
**Purpose**: Tests for useColumnPinning hook
**Dependencies**: ../hooks/use-column-pinning

### ❌ REMOVE — data-table/**tests**/utils.test.ts (reason: VT has its own data-table at lib/data-table/)

**Lines**: 63
**Purpose**: Tests for data table utilities
**Dependencies**: ../utils

---

## databases/

### ❌ REMOVE — databases/display.tsx (reason: VT has its own data layer)

**Lines**: 66
**Exports**: (DatabaseDisplay component)
**Purpose**: Renders database connection info with icon and schema/table tree
**Dependencies**: ./icon, ./namespace-icons

### ❌ REMOVE — databases/engine-variable.tsx (reason: VT has its own data layer)

**Lines**: 47
**Exports**: (EngineVariable component)
**Purpose**: Renders database engine variable with icon and connection status
**Dependencies**: ./icon, core/datasets/engines

### ❌ REMOVE — databases/icon.tsx (reason: VT has its own data layer)

**Lines**: 85
**Exports**: (DatabaseIcon component)
**Purpose**: Maps database engine names to their SVG icons (DuckDB, PostgreSQL, MySQL, etc.)
**Dependencies**: ./icons/\*.svg

### ❌ REMOVE — databases/namespace-icons.ts (reason: VT has its own data layer)

**Lines**: 11
**Exports**: (namespace icon mappings)
**Purpose**: Re-exports database namespace icons (schema, table, column, view)
**Dependencies**: lucide-react

---

## datasets/

### ❌ REMOVE — datasets/icons.tsx (reason: VT has its own data layer and icon system)

**Lines**: 52
**Exports**: DATA_TYPE_ICON (L20), getDataTypeColor (L33)
**Purpose**: Maps data types (integer, string, boolean, date, etc.) to Lucide icons and colors
**Dependencies**: core/kernel/messages, ../data-table/charts/types

---

## datasources/

### ❌ REMOVE — datasources/datasources.tsx (reason: VT has its own data sources)

**Lines**: 781
**Exports**: (Datasources panel component)
**Purpose**: Main data sources panel: tree view of databases, tables, columns with SQL generation and code insertion
**Dependencies**: core/datasets/_, core/cells/_, core/codemirror/_, ../ui/_, ../databases/\*, ./components, ./column-preview, ./utils

### ❌ REMOVE — datasources/components.tsx (reason: VT has its own data sources)

**Lines**: 97
**Exports**: (DataSourceItem, ColumnItem components)
**Purpose**: Tree item components for data source and column display
**Dependencies**: ../datasets/icons, ../ui/tooltip

### ❌ REMOVE — datasources/column-preview.tsx (reason: VT has its own data sources)

**Lines**: 248
**Exports**: (ColumnPreview component)
**Purpose**: Column detail preview panel with stats, data type, and sample values
**Dependencies**: ../data-table/column-summary/\*, ../datasets/icons

### ❌ REMOVE — datasources/utils.ts (reason: VT has its own data sources)

**Lines**: 148
**Exports**: (SQL code formatting utilities, isSchemaless, SqlCodeFormatter)
**Purpose**: SQL dialect-aware code formatters for generating SELECT/FROM statements
**Dependencies**: @marimo-team/codemirror-sql, core/codemirror/language/languages/sql/utils, core/datasets/\*, core/kernel/messages, ../data-table/types

### ❌ REMOVE — datasources/install-package-button.tsx (reason: VT has its own data sources)

**Lines**: 41
**Exports**: (InstallPackageButton)
**Purpose**: Button to install missing database driver packages
**Dependencies**: core/network/requests, ../ui/button, ../ui/tooltip

### ❌ REMOVE — datasources/**tests**/utils.test.ts (reason: tests for removed data sources)

**Lines**: 341
**Purpose**: Tests for SQL code formatting utilities
**Dependencies**: ../utils

### ❌ REMOVE — datasources/**tests**/install-package-button.test.tsx (reason: tests for removed data sources)

**Lines**: 73
**Purpose**: Tests for InstallPackageButton component
**Dependencies**: ../install-package-button

---

## debug/

### ✅ KEEP — debug/indicator.tsx

**Lines**: 18
**Exports**: TailwindIndicator (L2)
**Purpose**: Dev-only indicator showing current Tailwind breakpoint (sm/md/lg/xl/2xl)
**Dependencies**: none

---

## debugger/

### ❌ REMOVE — debugger/debugger-code.tsx (reason: VT doesn't need Python debugger)

**Lines**: 217
**Exports**: Debugger (L29), DebuggerControls (L150)
**Purpose**: Python debugger UI with code display, breakpoint highlighting, and step/continue/quit controls
**Dependencies**: core/codemirror/\*, ../ui/button, ../ui/tooltip

### ❌ REMOVE — debugger/debugger-code.css (reason: VT doesn't need Python debugger)

**Lines**: 3
**Purpose**: CSS for debugger code highlighting (active line)

### ❌ REMOVE — debugger/**tests**/debugger-code.test.tsx (reason: tests for removed debugger)

**Lines**: 118
**Purpose**: Tests for Debugger component
**Dependencies**: ../debugger-code

---

## dependency-graph/

### ✅ KEEP — dependency-graph/dependency-graph.tsx

**Lines**: 43
**Exports**: DependencyGraph (L30)
**Purpose**: Wrapper component for cell dependency graph visualization using ReactFlow
**Dependencies**: ./dependency-graph-tree, ./custom-node, ./types

### ✅ KEEP — dependency-graph/dependency-graph-tree.tsx

**Lines**: 179
**Exports**: (DependencyGraphTree)
**Purpose**: ReactFlow-based interactive dependency graph with auto-layout, edge animations, and cell navigation
**Dependencies**: @xyflow/react, ./custom-node, ./elements, ./panels, ./types, ./utils/\*

### ✅ KEEP — dependency-graph/custom-node.tsx

**Lines**: 96
**Exports**: EdgeMarkerContext (L25), CustomNode (L35), nodeTypes (L96)
**Purpose**: Custom ReactFlow node component showing cell name, code preview, and status
**Dependencies**: @xyflow/react, ./elements, ./types, core/cells/\*

### ✅ KEEP — dependency-graph/elements.ts

**Lines**: 181
**Exports**: NodeData (L12), CustomNodeProps (L16), getNodeHeight (L18), OUTPUTS_HANDLE_ID (L24), INPUTS_HANDLE_ID (L25), VerticalElementsBuilder (L37), TreeElementsBuilder (L113)
**Purpose**: Graph element builders: convert cell data into ReactFlow nodes and edges with layout
**Dependencies**: @xyflow/react, core/cells/\*

### ✅ KEEP — dependency-graph/panels.tsx

**Lines**: 272
**Exports**: (GraphPanels component)
**Purpose**: Control panels for dependency graph: layout direction, settings, legend, and cell detail
**Dependencies**: @xyflow/react, ../ui/\*, ./types

### ✅ KEEP — dependency-graph/minimap-content.tsx

**Lines**: 389
**Exports**: (MinimapContent component)
**Purpose**: Minimap/overview panel for dependency graph with cell listing and search
**Dependencies**: @xyflow/react, ../ui/_, ./types, core/cells/_

### ✅ KEEP — dependency-graph/types.ts

**Lines**: 22
**Exports**: LayoutDirection (L4), GraphSelection (L6), GraphSettings (L18)
**Purpose**: Type definitions for dependency graph (layout direction, node/edge selection, settings)
**Dependencies**: core/cells/ids

### ✅ KEEP — dependency-graph/dependency-graph.css

**Lines**: 13
**Purpose**: CSS overrides for ReactFlow graph styling

### ✅ KEEP — dependency-graph/utils/changes.ts

**Lines**: 47
**Exports**: (applyChanges utility)
**Purpose**: Applies ReactFlow node/edge changes to the graph state
**Dependencies**: @xyflow/react

### ✅ KEEP — dependency-graph/utils/layout.ts

**Lines**: 39
**Exports**: (layout utility functions)
**Purpose**: Graph auto-layout using dagre algorithm
**Dependencies**: @dagrejs/dagre, @xyflow/react

### ✅ KEEP — dependency-graph/utils/useFitToViewOnDimensionChange.ts

**Lines**: 22
**Exports**: (useFitToViewOnDimensionChange hook)
**Purpose**: Hook that auto-fits the graph view when container dimensions change
**Dependencies**: @xyflow/react

---

## find-replace/

### ✅ KEEP — find-replace/find-replace.tsx

**Lines**: 290
**Exports**: FindReplace (L41)
**Purpose**: Global find-and-replace panel for notebook cells with regex, case-sensitivity, and whole-word options
**Dependencies**: core/codemirror/find-replace/state, core/cells/_, ../ui/_, @/hooks/\*

---

## forms/

### ❌ REMOVE — forms/form.tsx (reason: VT doesn't render Python form widgets)

**Lines**: 788
**Exports**: FormRenderer (L50), ZodForm (L67), renderZodSchema (L82)
**Purpose**: Dynamic form renderer from Zod schemas: auto-generates form fields based on schema shape (strings, numbers, booleans, arrays, objects, unions)
**Dependencies**: ../ui/_, @/hooks/_, ./form-utils, ./options, ./switchable-multi-select

### ❌ REMOVE — forms/form-utils.ts (reason: VT doesn't render Python form widgets)

**Lines**: 104
**Exports**: maybeUnwrap (L7), getDefaults (L17), getUnionLiteral (L86)
**Purpose**: Zod schema utilities: unwrap optionals/defaults, extract default values, get union literal options
**Dependencies**: zod

### ❌ REMOVE — forms/options.ts (reason: VT doesn't render Python form widgets)

**Lines**: 58
**Exports**: FieldOptions (L2, interface), FieldOptions (L39, static methods), randomNumber (L58)
**Purpose**: Field option generators for form widgets (slider ranges, text constraints, random values)
**Dependencies**: none

### ❌ REMOVE — forms/switchable-multi-select.tsx (reason: VT doesn't render Python form widgets)

**Lines**: 124
**Exports**: SwitchableMultiSelect (L27), TextAreaMultiSelect (L96), ensureStringArray (L123)
**Purpose**: Multi-select component that can switch between combobox and textarea input modes
**Dependencies**: ../ui/combobox, ../ui/textarea, ../ui/button

### ❌ REMOVE — forms/**tests**/form-utils.test.ts (reason: tests for removed forms module)

**Lines**: 249
**Purpose**: Tests for Zod schema utilities
**Dependencies**: ../form-utils

---

## home/

### ❌ REMOVE — home/components.tsx (reason: VT has its own routing and home page)

**Lines**: 183
**Exports**: OpenTutorialDropDown (L72), ResourceLinks (L149), Header (L175)
**Purpose**: Home page UI components: tutorial dropdown, documentation links, page header
**Dependencies**: ../ui/\*, core/network/requests

### ❌ REMOVE — home/state.ts (reason: VT has its own routing and home page)

**Lines**: 27
**Exports**: RunningNotebooksMap (L9), RunningNotebooksContext (L11), WorkspaceRootContext (L18), includeMarkdownAtom (L20), expandedFoldersAtom (L26)
**Purpose**: React contexts and Jotai atoms for home page state (running notebooks, workspace root, folder expansion)
**Dependencies**: core/network/types

---

## icons/

### ✅ KEEP — icons/spinner.tsx

**Lines**: 38
**Exports**: Spinner (L38)
**Purpose**: Animated loading spinner SVG component with size variants
**Dependencies**: @/utils/cn

### ✅ KEEP — icons/copy-icon.tsx

**Lines**: 62
**Exports**: CopyClipboardIcon (L20)
**Purpose**: Copy-to-clipboard button with success checkmark animation
**Dependencies**: @/utils/copy, ../ui/tooltip

### ❌ REMOVE — icons/github-copilot.tsx (reason: marimo-specific branding icon)

**Lines**: 16
**Exports**: GitHubCopilotIcon (L4)
**Purpose**: GitHub Copilot SVG icon component
**Dependencies**: none

### ✅ KEEP — icons/large-spinner.tsx

**Lines**: 35
**Exports**: LargeSpinner (L7)
**Purpose**: Full-page centered loading spinner with optional title
**Dependencies**: ./spinner

### ✅ KEEP — icons/loading-ellipsis.tsx

**Lines**: 46
**Exports**: LoadingEllipsis (L46)
**Purpose**: Animated three-dot loading indicator
**Dependencies**: none

### ✅ KEEP — icons/multi-icon.tsx

**Lines**: 27
**Exports**: MultiIcon (L14)
**Purpose**: Stacked icon component showing primary icon with a smaller secondary icon overlay
**Dependencies**: @/utils/cn, ./multi-icon.css

### ✅ KEEP — icons/multi-icon.css

**Lines**: 7
**Purpose**: CSS for multi-icon positioning

---

## layout/

### ✅ KEEP — layout/toolbar.tsx

**Lines**: 24
**Exports**: Toolbar (L14)
**Purpose**: Generic horizontal toolbar container with left/right slot alignment
**Dependencies**: @/utils/cn

---

## markdown/

### ✅ KEEP — markdown/markdown-renderer.tsx

**Lines**: 186
**Exports**: MarkdownRenderer (L186)
**Purpose**: Markdown-to-React renderer using react-markdown with syntax highlighting, math (KaTeX), and custom link handling
**Dependencies**: react-markdown, rehype-katex, remark-math, remark-gfm, ../ui/links

### ✅ KEEP — markdown/markdown-renderer.css

**Lines**: 44
**Purpose**: CSS for markdown rendering (code blocks, tables, blockquotes, math)

---

## mcp/

### ❌ REMOVE — mcp/hooks.ts (reason: VT doesn't need MCP protocol)

**Lines**: 42
**Exports**: MCPStatus (L9), MCPRefreshResponse (L10), useMCPStatus (L15), useMCPRefresh (L24)
**Purpose**: React hooks for fetching MCP server status and triggering refresh
**Dependencies**: @marimo-team/marimo-api, core/network/requests, @/hooks/useAsyncData

### ❌ REMOVE — mcp/mcp-status-indicator.tsx (reason: VT doesn't need MCP protocol)

**Lines**: 138
**Exports**: MCPStatusIndicator (L16), McpStatusText (L118)
**Purpose**: Status badge showing MCP server connection state (connected, error, no servers)
**Dependencies**: ../ui/badge, ../ui/tooltip, ./hooks

---

## modal/

### ✅ KEEP — modal/ImperativeModal.tsx

**Lines**: 180
**Exports**: ModalProvider (L29), useImperativeModal (L51)
**Purpose**: Imperative modal system: provider + hook for programmatically opening dialogs with alert/confirm/prompt patterns
**Dependencies**: ../ui/dialog, ../ui/button, ../ui/input

---

## pages/

### ❌ REMOVE — pages/edit-page.tsx (reason: VT has its own page structure)

**Lines**: 41
**Exports**: EditPage (L41, default)
**Purpose**: Main edit mode page layout wrapper
**Dependencies**: ../editor/\* (lazy imports)

### ❌ REMOVE — pages/run-page.tsx (reason: VT has its own page structure)

**Lines**: 50
**Exports**: RunPage (L50, default)
**Purpose**: Run/app mode page layout wrapper
**Dependencies**: ../editor/\* (lazy imports)

### ❌ REMOVE — pages/home-page.tsx (reason: VT has its own page structure)

**Lines**: 530
**Exports**: HomePage (L530, default)
**Purpose**: Home page with notebook file browser, recent files, running notebooks, and create/open actions
**Dependencies**: core/network/_, ../home/_, ../ui/_, @/hooks/_

### ❌ REMOVE — pages/gallery-page.tsx (reason: VT has its own page structure)

**Lines**: 189
**Exports**: GalleryPage (L189, default)
**Purpose**: Gallery page displaying example/template notebooks in a grid layout
**Dependencies**: core/network/_, ../ui/_, ../home/\*

---

## scratchpad/

### ❌ REMOVE — scratchpad/scratchpad.tsx (reason: VT doesn't need scratchpad)

**Lines**: 287
**Exports**: ScratchPad (L52)
**Purpose**: Scratchpad panel for quick code experiments with CodeMirror editor and run button
**Dependencies**: core/codemirror/_, core/cells/_, core/network/requests, ./scratchpad-history

### ❌ REMOVE — scratchpad/scratchpad-history.ts (reason: VT doesn't need scratchpad)

**Lines**: 29
**Exports**: scratchpadHistoryAtom (L10), historyVisibleAtom (L17), addToHistoryAtom (L20)
**Purpose**: Jotai atoms for scratchpad execution history storage
**Dependencies**: jotai, jotai/utils

---

## shortcuts/

### ✅ KEEP — shortcuts/renderShortcut.tsx

**Lines**: 194
**Exports**: renderShortcut (L12), KeyboardHotkeys (L31), renderMinimalShortcut (L62), MinimalShortcut (L66), MinimalHotkeys (L76), prettyPrintHotkey (L105)
**Purpose**: Components and utilities for rendering keyboard shortcut badges (Ctrl+S, Cmd+K, etc.)
**Dependencies**: core/hotkeys/shortcuts, ../ui/kbd

---

## slides/

### ❌ REMOVE — slides/slides-component.tsx (reason: VT doesn't need presentation mode)

**Lines**: 143
**Exports**: SlidesComponent (L143, default)
**Purpose**: Presentation/slides mode renderer that paginates notebook outputs as full-screen slides
**Dependencies**: core/cells/_, @/hooks/_

### ❌ REMOVE — slides/slides.css (reason: VT doesn't need presentation mode)

**Lines**: 92
**Purpose**: CSS for slides layout and transitions

---

## sort/

### 🔄 ALREADY — sort/SortableCellsProvider.tsx

**Lines**: 234
**Exports**: SortableCellsProvider (L234)
**Purpose**: DnD context provider for drag-and-drop cell reordering using @dnd-kit
**Dependencies**: @dnd-kit/core, @dnd-kit/modifiers, @dnd-kit/sortable, core/cells/\*, @/utils/arrays, @/utils/id-tree

---

## static-html/

### ❌ REMOVE — static-html/static-banner.tsx (reason: VT doesn't need static HTML export)

**Lines**: 153
**Exports**: StaticBanner (L26)
**Purpose**: Banner displayed in static HTML exports with "Open in marimo" button and notebook info
**Dependencies**: core/config/config, core/dom/htmlUtils, core/islands/utils, ../ui/\*

### ❌ REMOVE — static-html/share-modal.tsx (reason: VT doesn't need static HTML export)

**Lines**: 168
**Exports**: ShareStaticNotebookModal (L24)
**Purpose**: Modal for sharing/exporting notebook as static HTML with download and cloud publishing options
**Dependencies**: core/network/requests, ../ui/_, ../icons/_

---

## terminal/

### ❌ REMOVE — terminal/terminal.tsx (reason: VT doesn't need terminal)

**Lines**: 431
**Exports**: TerminalComponent (L431, default)
**Purpose**: XTerm.js-based terminal emulator with websocket connection, fit addon, and search
**Dependencies**: xterm, xterm-addon-fit, xterm-addon-search, ./state, ./theme, ./xterm.css

### ❌ REMOVE — terminal/state.ts (reason: VT doesn't need terminal)

**Lines**: 66
**Exports**: TerminalCommand (L7), TerminalState (L12), and reducer/atoms
**Purpose**: Jotai state management for terminal: pending commands queue, ready state
**Dependencies**: @/utils/createReducer, @/utils/uuid

### ❌ REMOVE — terminal/hooks.ts (reason: VT doesn't need terminal)

**Lines**: 36
**Exports**: useTerminalCommands (L26)
**Purpose**: Hook for sending commands to the terminal and managing terminal lifecycle
**Dependencies**: ./state, core/network/requests

### ❌ REMOVE — terminal/theme.tsx (reason: VT doesn't need terminal)

**Lines**: 55
**Exports**: createTerminalTheme (L5)
**Purpose**: Creates XTerm.js theme from application theme tokens (light/dark)
**Dependencies**: @/theme/useTheme

### ❌ REMOVE — terminal/xterm.css (reason: VT doesn't need terminal)

**Lines**: 3
**Purpose**: Minimal CSS override for xterm terminal container

### ❌ REMOVE — terminal/**tests**/state.test.ts (reason: tests for removed terminal)

**Lines**: 157
**Purpose**: Tests for terminal state reducer
**Dependencies**: ../state

---

## tracing/

### ❌ REMOVE — tracing/tracing.tsx (reason: VT doesn't need cell execution tracing)

**Lines**: 362
**Exports**: (Tracing component)
**Purpose**: Cell execution tracing/profiling visualization with Vega-Lite Gantt chart
**Dependencies**: ../charts/lazy, ../charts/types, ./tracing-spec, ./utils, core/cells/\*

### ❌ REMOVE — tracing/tracing-spec.ts (reason: VT doesn't need cell execution tracing)

**Lines**: 114
**Exports**: REACT_HOVERED_CELLID (L9), VEGA_HOVER_SIGNAL (L10), ChartPosition (L12), ChartValues (L13), createGanttBaseSpec (L28)
**Purpose**: Vega-Lite spec generator for cell execution Gantt chart
**Dependencies**: core/cells/ids, core/cells/runs, @/theme/useTheme

### ❌ REMOVE — tracing/utils.ts (reason: VT doesn't need cell execution tracing)

**Lines**: 17
**Exports**: (utility functions for tracing)
**Purpose**: Helper to format execution time durations
**Dependencies**: none

### ❌ REMOVE — tracing/tracing.test.tsx (reason: tests for removed tracing)

**Lines**: 61
**Purpose**: Tests for tracing visualization
**Dependencies**: ./tracing

---

## ui/ (shadcn/Radix primitives)

### ✅ KEEP — ui/accordion.tsx

**Lines**: 64
**Exports**: Accordion, AccordionItem, AccordionTrigger, AccordionContent (L64)
**Purpose**: Radix Accordion component with chevron animation
**Dependencies**: @radix-ui/react-accordion, @/utils/cn

### ✅ KEEP — ui/alert.tsx

**Lines**: 59
**Exports**: Alert, AlertTitle, AlertDescription
**Purpose**: Alert banner component with destructive/default variants
**Dependencies**: @/utils/cn, class-variance-authority

### ✅ KEEP — ui/alert-dialog.tsx

**Lines**: 165
**Exports**: AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel (L165)
**Purpose**: Radix AlertDialog for confirmation dialogs
**Dependencies**: @radix-ui/react-alert-dialog, @/utils/cn

### ✅ KEEP — ui/aria-popover.tsx

**Lines**: 43
**Exports**: Popover, PopoverTrigger, PopoverDialog (L43)
**Purpose**: React Aria-based popover (alternative to Radix popover)
**Dependencies**: react-aria-components

### ✅ KEEP — ui/badge.tsx

**Lines**: 35
**Exports**: Badge (via CVA)
**Purpose**: Badge/tag component with variants (default, secondary, destructive, outline)
**Dependencies**: @/utils/cn, class-variance-authority

### ✅ KEEP — ui/button.tsx

**Lines**: 158
**Exports**: ButtonProps (L94), Button (L158), buttonVariants (L158)
**Purpose**: Button component with size/variant/color system and loading state
**Dependencies**: @radix-ui/react-slot, @/utils/cn, class-variance-authority

### ✅ KEEP — ui/calendar.tsx

**Lines**: 217
**Exports**: Calendar (and sub-components)
**Purpose**: Date calendar component using react-aria DatePicker
**Dependencies**: react-aria-components, @/utils/cn

### ✅ KEEP — ui/card.tsx

**Lines**: 76
**Exports**: Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent (L76)
**Purpose**: Card container components
**Dependencies**: @/utils/cn

### ✅ KEEP — ui/checkbox.tsx

**Lines**: 33
**Exports**: Checkbox (L33)
**Purpose**: Radix Checkbox with checkmark icon
**Dependencies**: @radix-ui/react-checkbox, @/utils/cn

### ✅ KEEP — ui/combobox.tsx

**Lines**: 259
**Exports**: (Combobox component)
**Purpose**: Searchable combobox/autocomplete with multi-select support
**Dependencies**: ../ui/command, ../ui/popover, @/utils/cn

### ✅ KEEP — ui/command.tsx

**Lines**: 148
**Exports**: Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator, CommandShortcut
**Purpose**: Command palette component (cmdk wrapper)
**Dependencies**: cmdk, @/utils/cn

### ✅ KEEP — ui/confirmation-button.tsx

**Lines**: 79
**Exports**: ConfirmationButton (L48)
**Purpose**: Button that requires a second click to confirm (e.g., delete actions)
**Dependencies**: ./button, ./tooltip

### ✅ KEEP — ui/context-menu.tsx

**Lines**: 191
**Exports**: ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuGroup, ContextMenuPortal, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuRadioGroup (L188)
**Purpose**: Radix Context Menu (right-click menu)
**Dependencies**: @radix-ui/react-context-menu, @/utils/cn, ./menu-items

### ✅ KEEP — ui/date-input.tsx

**Lines**: 119
**Exports**: (DateInput component)
**Purpose**: Date input field with calendar popover using react-aria
**Dependencies**: react-aria-components, @/utils/cn

### ✅ KEEP — ui/date-picker.tsx

**Lines**: 188
**Exports**: DatePicker, DatePickerContent, DateRangePicker, DatePickerProps, DateRangePickerProps (L187-L188)
**Purpose**: Date picker and date range picker with popover calendar
**Dependencies**: react-aria-components, ./calendar, ./popover, @/utils/cn

### ✅ KEEP — ui/dialog.tsx

**Lines**: 142
**Exports**: Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose
**Purpose**: Radix Dialog (modal) component
**Dependencies**: @radix-ui/react-dialog, @/utils/cn

### ✅ KEEP — ui/draggable-popover.tsx

**Lines**: 61
**Exports**: DraggablePopover (L13)
**Purpose**: Popover that can be dragged/repositioned by the user
**Dependencies**: @dnd-kit/core, @/utils/cn

### ✅ KEEP — ui/dropdown-menu.tsx

**Lines**: 189
**Exports**: DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup (L184)
**Purpose**: Radix Dropdown Menu component
**Dependencies**: @radix-ui/react-dropdown-menu, @/utils/cn, ./menu-items

### ✅ KEEP — ui/field.tsx

**Lines**: 83
**Exports**: Field, Label, Input, Description (L83)
**Purpose**: React Aria-based form field primitives
**Dependencies**: react-aria-components, @/utils/cn

### ✅ KEEP — ui/form.tsx

**Lines**: 214
**Exports**: FormErrorsBanner (L21), Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField, useFormField (L214)
**Purpose**: React Hook Form integration components with error display
**Dependencies**: @radix-ui/react-label, @radix-ui/react-slot, react-hook-form, @/utils/cn

### ✅ KEEP — ui/fullscreen.tsx

**Lines**: 127
**Exports**: MAX_HEIGHT_OFFSET (L12), useFullScreenElement (L17), withFullScreenAsRoot (L31), withSmartCollisionBoundary (L84)
**Purpose**: Fullscreen utilities and HOCs for making dialogs/popovers use full viewport
**Dependencies**: @radix-ui/react-dialog, core/dom/utils

### ✅ KEEP — ui/input.tsx

**Lines**: 208
**Exports**: InputProps (L14), Input (L208), DebouncedInput (L59), DebouncedNumberInput (L85), SearchInput (L111), OnBlurredInput (L170)
**Purpose**: Input components: basic input, debounced input, search input with icon, on-blur-commit input
**Dependencies**: @/utils/cn, @/hooks/useDebounce

### ✅ KEEP — ui/kbd.tsx

**Lines**: 20
**Exports**: Kbd (via component)
**Purpose**: Keyboard shortcut display badge component
**Dependencies**: @/utils/cn

### ✅ KEEP — ui/label.tsx

**Lines**: 26
**Exports**: Label (L26)
**Purpose**: Radix Label component
**Dependencies**: @radix-ui/react-label, @/utils/cn, class-variance-authority

### ✅ KEEP — ui/links.tsx

**Lines**: 25
**Exports**: ExternalLink (L2)
**Purpose**: External link component with target=\_blank and rel=noopener
**Dependencies**: none

### ✅ KEEP — ui/menu-items.tsx

**Lines**: 97
**Exports**: menuContentCommon (L7), menuSubTriggerVariants (L18), MENU_ITEM_DISABLED (L29), menuControlVariants (L32), menuControlCheckVariants (L40), menuLabelVariants (L47), menuItemVariants (L55), menuSeparatorVariants (L83), MenuShortcut (L90)
**Purpose**: Shared CVA variants for menu items (used by dropdown-menu and context-menu)
**Dependencies**: class-variance-authority, @/utils/cn

### ✅ KEEP — ui/native-select.tsx

**Lines**: 39
**Exports**: selectStyles (L8), NativeSelect (L39)
**Purpose**: Native HTML select element with styled variants
**Dependencies**: @/utils/cn, class-variance-authority

### ✅ KEEP — ui/navigation.tsx

**Lines**: 144
**Exports**: NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport (L144)
**Purpose**: Radix Navigation Menu component
**Dependencies**: @radix-ui/react-navigation-menu, @/utils/cn

### ✅ KEEP — ui/number-field.tsx

**Lines**: 99
**Exports**: NumberField
**Purpose**: Number input with increment/decrement buttons using React Aria
**Dependencies**: react-aria-components, @/utils/cn

### ✅ KEEP — ui/popover.tsx

**Lines**: 71
**Exports**: Popover, PopoverTrigger, PopoverContent, PopoverClose (L71)
**Purpose**: Radix Popover component
**Dependencies**: @radix-ui/react-popover, @/utils/cn

### ✅ KEEP — ui/progress.tsx

**Lines**: 45
**Exports**: Progress (L45)
**Purpose**: Radix Progress bar component
**Dependencies**: @radix-ui/react-progress, @/utils/cn

### ❌ REMOVE — ui/query-param-preserving-link.tsx (reason: marimo-specific routing, VT uses Next.js router)

**Lines**: 42
**Exports**: QueryParamPreservingLink (L12)
**Purpose**: Link component that preserves current URL query parameters when navigating
**Dependencies**: none

### ✅ KEEP — ui/radio-group.tsx

**Lines**: 44
**Exports**: RadioGroup, RadioGroupItem (L44)
**Purpose**: Radix Radio Group component
**Dependencies**: @radix-ui/react-radio-group, @/utils/cn

### ✅ KEEP — ui/range-slider.tsx

**Lines**: 104
**Exports**: RangeSlider (L104)
**Purpose**: Dual-thumb range slider (min/max value selection)
**Dependencies**: @radix-ui/react-slider, @/utils/cn

### ✅ KEEP — ui/reorderable-list.tsx

**Lines**: 313
**Exports**: (ReorderableList component)
**Purpose**: Drag-and-drop reorderable list using @dnd-kit with add/remove/rename capabilities
**Dependencies**: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, ../ui/\*, ./reorderable-list.css

### ✅ KEEP — ui/reorderable-list.css

**Lines**: 3
**Purpose**: CSS for reorderable list drag handle cursor

### ✅ KEEP — ui/scroll-area.tsx

**Lines**: 47
**Exports**: ScrollArea, ScrollBar (L47)
**Purpose**: Radix Scroll Area with custom scrollbar
**Dependencies**: @radix-ui/react-scroll-area, @/utils/cn

### ✅ KEEP — ui/select.tsx

**Lines**: 162
**Exports**: Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator (L162)
**Purpose**: Radix Select component with custom styling
**Dependencies**: @radix-ui/react-select, @/utils/cn

### ✅ KEEP — ui/sheet.tsx

**Lines**: 132
**Exports**: Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription (L132)
**Purpose**: Radix-based side sheet (drawer) component
**Dependencies**: @radix-ui/react-dialog, @/utils/cn, class-variance-authority

### ✅ KEEP — ui/skeleton.tsx

**Lines**: 16
**Exports**: Skeleton (L16)
**Purpose**: Loading skeleton placeholder with pulse animation
**Dependencies**: @/utils/cn

### ✅ KEEP — ui/slider.tsx

**Lines**: 82
**Exports**: Slider (L82)
**Purpose**: Radix Slider component
**Dependencies**: @radix-ui/react-slider, @/utils/cn

### ✅ KEEP — ui/switch.tsx

**Lines**: 51
**Exports**: (Switch component)
**Purpose**: Radix Switch toggle with size variants (sm/default)
**Dependencies**: @radix-ui/react-switch, @/utils/cn

### ✅ KEEP — ui/table.tsx

**Lines**: 113
**Exports**: Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption (L113)
**Purpose**: HTML table components with consistent styling
**Dependencies**: @/utils/cn

### ✅ KEEP — ui/tabs.tsx

**Lines**: 55
**Exports**: Tabs, TabsList, TabsTrigger, TabsContent (L55)
**Purpose**: Radix Tabs component
**Dependencies**: @radix-ui/react-tabs, @/utils/cn

### ✅ KEEP — ui/textarea.tsx

**Lines**: 104
**Exports**: TextareaProps (L9), Textarea (L104), DebouncedTextarea (L39), OnBlurredTextarea (L65)
**Purpose**: Textarea components: basic, debounced, and on-blur-commit variants
**Dependencies**: @/utils/cn, @/hooks/useDebounce

### ✅ KEEP — ui/toast.tsx

**Lines**: 123
**Exports**: ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction (L123)
**Purpose**: Radix Toast notification components
**Dependencies**: @radix-ui/react-toast, @/utils/cn, class-variance-authority

### ✅ KEEP — ui/toaster.tsx

**Lines**: 28
**Exports**: Toaster (L12)
**Purpose**: Toast notification container that renders active toasts
**Dependencies**: ./toast, ./use-toast

### ✅ KEEP — ui/toggle.tsx

**Lines**: 49
**Exports**: Toggle, toggleVariants (L49)
**Purpose**: Radix Toggle button component
**Dependencies**: @radix-ui/react-toggle, @/utils/cn, class-variance-authority

### ✅ KEEP — ui/tooltip.tsx

**Lines**: 87
**Exports**: Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipRoot (L87)
**Purpose**: Radix Tooltip component with custom content wrapper
**Dependencies**: @radix-ui/react-tooltip, @/utils/cn

### ✅ KEEP — ui/typography.tsx

**Lines**: 194
**Exports**: H1, H2, H3, H4, P, BlockQuote, InlineCode, List, Muted, Large, Small, Subtle, A, Code, Pre (L194)
**Purpose**: Typography component library for consistent text styling
**Dependencies**: @/utils/cn

### ✅ KEEP — ui/use-restore-focus.ts

**Lines**: 24
**Exports**: useRestoreFocus (L8)
**Purpose**: Hook that restores focus to the previously focused element on unmount
**Dependencies**: none

### ✅ KEEP — ui/use-toast.ts

**Lines**: 194
**Exports**: toast (function), useToast (hook)
**Purpose**: Toast state management: imperative toast() function and useToast() hook
**Dependencies**: none (self-contained reducer)

---

## utils/

### ✅ KEEP — utils/delay-mount.tsx

**Lines**: 69
**Exports**: DelayMount (L41)
**Purpose**: Component that delays mounting its children until after a specified timeout
**Dependencies**: none

### ✅ KEEP — utils/lazy-mount.tsx

**Lines**: 37
**Exports**: LazyMount (L15), LazyActivity (L31)
**Purpose**: Components that defer mounting children until first visibility or activity
**Dependencies**: none

---

## variables/

### ✅ KEEP — variables/common.tsx

**Lines**: 35
**Exports**: VariableName (L12)
**Purpose**: Component to render a variable name with monospace font and optional click-to-navigate
**Dependencies**: @/utils/cn

### ✅ KEEP — variables/variables-table.tsx

**Lines**: 318
**Exports**: VariableTable (L232)
**Purpose**: Table displaying notebook variables with types, values, and cell references
**Dependencies**: @tanstack/react-table, ../ui/_, ./common, core/cells/_, core/variables/\*
