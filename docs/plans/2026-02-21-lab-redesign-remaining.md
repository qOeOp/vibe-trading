# Lab Redesign — Remaining Priorities Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the Factor Lab redesign (P0/P1/P2/P3/P5) — activate dead CSS, wire up floating panels, add magnetic snap, Data Catalog, and polish.

**Architecture:** The lab uses two chrome shells in parallel. `AppChrome` (641L) is the active render path; it already switches to floating dock + floating panels when `labMode='active'`. The collapsed topbar/sidebar from commit `23f3482` handle P1 (Chrome Morph) — already done. The critical P2 fix is adding `data-slot="lab-fullscreen"` to the DOM to activate ~180 lines of dead CSS in `cell.css` that implement shine border, stale indicator, controls show/hide, separator, progressive blur, and empty cell hints.

**Tech Stack:** React 19, Next.js 15, Tailwind v4, Framer Motion, Zustand, Jotai, react-resizable-panels

**Key Discovery:** P1 (Chrome Morph) is ALREADY COMPLETE — `lab-collapsed-topbar.tsx` and `lab-collapsed-sidebar.tsx` implement all design doc §4/§5 features. The plan skips P1 entirely.

---

## Status Summary

| Priority | Scope | Status |
|----------|-------|--------|
| P0 | 基础清理 | **Not started** — Pyodide files + PANELS config |
| P1 | Chrome Morph | **✅ DONE** — commit `23f3482` |
| P2 | Cell 体验 | **CSS written, not activated** — `data-slot="lab-fullscreen"` never set |
| P3 | 面板系统 | **Partially done** — `FloatingPanels` works, Data Catalog missing |
| P4 | ConnectScreen | **✅ DONE** — this session |
| P5 | 收尾 | **Partially done** — progressive blur in CSS, welcome hint in CSS |

---

## Task 1: Activate Lab Fullscreen CSS (P2 — Critical)

**Problem:** `cell.css` has ~180 lines of lab-mode styles scoped to `[data-slot='lab-fullscreen']`, but no component ever renders that attribute. All these features are dead:
- Cell separator (thin dashed line between cells)
- Controls show/hide (hidden by default, shown on focus)
- Run button repositioned to left gutter
- Actions button hidden
- Stale indicator (amber breathing animation)
- Left accent bar on focused cell (teal)
- Shine border sweep (success=green, error=red)
- Progressive blur at editor bottom
- Empty cell welcome hint
- Insert button centered between cells

**Files:**
- Modify: `apps/web/src/features/lab/components/editor/chrome/wrapper/app-chrome.tsx`

**Step 1: Find where AppChrome renders the editor content area in lab mode**

Read `app-chrome.tsx` and find the `appBodyPanel` div that wraps `{children}` when `labMode === 'active'`. This is the element that needs `data-slot="lab-fullscreen"`.

In lab-active mode, the children are rendered inside a `<Panel>` element. Look for the `PanelGroup` that contains the main editor area. The wrapper around `{children}` (or a new wrapper div) needs:

```tsx
<div data-slot="lab-fullscreen" className="flex-1 flex flex-col overflow-hidden">
  {children}
</div>
```

**Step 2: Add `data-slot="lab-fullscreen"` to the editor wrapper**

Find the exact location where `{children}` is rendered in the lab-active branch of `AppChrome`. Wrap it (or add the attribute to an existing wrapper) so that all cell CSS rules activate.

**Important:** The `LabFullscreenContext.Provider` is never rendered — don't bother with it. The CSS only needs the DOM attribute `data-slot="lab-fullscreen"` on an ancestor of the cells. The context was for JS-side checks (`useLabFullscreen()` in `Controls.tsx` and `sidebar.tsx`) but those components already handle lab mode differently via `useLabModeStore`.

**Step 3: Verify CSS activates**

Run: `npx nx run web:serve --port=4200`

1. Start marimo kernel: `marimo edit --headless --port 2728 --no-token --allow-origins "http://localhost:4200"`
2. Navigate to `http://localhost:4200/factor/lab`
3. Wait for auto-connect
4. Verify in DevTools:
   - `[data-slot="lab-fullscreen"]` exists in DOM
   - Cells have thin dashed separators between them
   - Focus a cell → left teal accent bar appears
   - Focus a cell → Run button appears in left gutter
   - Unfocus → controls hide
   - Bottom of editor has progressive blur gradient

**Step 4: Also provide LabFullscreenContext for JS consumers**

Wrap the same div with the context provider so `useLabFullscreen()` returns `{ isFullscreen: true }` for `Controls.tsx` and `sidebar.tsx`:

```tsx
import { LabFullscreenContext } from '../../lab-fullscreen-context';

// In lab-active branch:
<LabFullscreenContext.Provider value={{ isFullscreen: true, onExit: null }}>
  <div data-slot="lab-fullscreen" className="flex-1 flex flex-col overflow-hidden">
    {children}
  </div>
</LabFullscreenContext.Provider>
```

**Step 5: Commit**

```bash
git add apps/web/src/features/lab/components/editor/chrome/wrapper/app-chrome.tsx
git commit -m "fix(lab): activate cell.css lab-mode styles by adding data-slot='lab-fullscreen'"
```

---

## Task 2: Delete Pyodide Dead Code (P0)

**Files:**
- Delete: `apps/web/src/features/lab/lib/pyodide-worker-singleton.ts` (43 lines)
- Modify: `apps/web/src/features/lab/hooks/use-cell-execution.ts` (268 lines) — remove Pyodide imports/usage

**Step 1: Check if `use-cell-execution.ts` is imported anywhere active**

```bash
cd /Users/vx/WebstormProjects/vibe-trading-lab-floating
grep -r "use-cell-execution" apps/web/src/ --include="*.ts" --include="*.tsx" | grep -v node_modules
```

If it's imported by other files, those need cleanup too. If it's only self-contained, safe to delete entirely.

**Step 2: Delete the Pyodide files**

If `use-cell-execution.ts` is only used for Pyodide execution:
```bash
rm apps/web/src/features/lab/lib/pyodide-worker-singleton.ts
rm apps/web/src/features/lab/hooks/use-cell-execution.ts
```

If `use-cell-execution.ts` has non-Pyodide exports used elsewhere, only remove the Pyodide-specific code.

**Step 3: Verify build**

```bash
npx nx run web:build
```

Expected: No import errors. If build fails, follow the error trail to remove dangling imports.

**Step 4: Commit**

```bash
git add -u
git commit -m "chore(lab): remove Pyodide dead code — singleton worker + cell execution hook"
```

---

## Task 3: Reduce PANELS Config from 16 → 7 (P0)

**Files:**
- Modify: `apps/web/src/features/lab/components/editor/chrome/types.ts`
- Modify: `apps/web/src/features/lab/components/editor/chrome/wrapper/sidebar.tsx` (if needed)

**Step 1: Read current PANELS and identify which to keep**

Per design doc §6.1, keep these 7:

| # | Panel | PanelType | Existing? |
|---|-------|-----------|-----------|
| 1 | Files | `files` | Yes |
| 2 | Variables | `variables` | Yes |
| 3 | Packages | `packages` | Yes |
| 4 | AI | `ai` | Yes (placeholder) |
| 5 | Data Catalog | `snippets` → rename | Yes (repurpose) |
| 6 | Errors | `errors` | Yes |
| 7 | Validation | `validation` | Yes (VT-specific) |

Remove: `outline`, `dependencies`, `documentation`, `scratchpad`, `tracing`, `secrets`, `logs`, `terminal`, `cache`

**Step 2: Update PANELS array**

In `types.ts`, remove the 9 deleted panel entries from the `PANELS` array. Keep the `PanelType` union type but remove the deleted members.

**Step 3: Update `snippets` label to "Data Catalog"**

In the PANELS array, find the `snippets` entry and change:
- `label: 'Snippets'` → `label: 'Data Catalog'`
- `tooltip: 'Snippets'` → `tooltip: 'Data Catalog'`
- Keep `type: 'snippets'` for now (rename is internal)

**Step 4: Verify the collapsed sidebar filter still works**

`lab-collapsed-sidebar.tsx:15` already filters PANELS to 7 entries:
```ts
const EDITOR_PANELS = PANELS.filter(
  (p) => ['files', 'variables', 'packages', 'ai', 'errors', 'validation'].includes(p.type) || p.type === 'snippets',
);
```

After reducing PANELS to 7, this filter becomes a no-op (which is fine — it's now defensive).

**Step 5: Build check**

```bash
npx nx run web:build
```

Fix any TypeScript errors from removed PanelType members being referenced. Search for each removed type string in the codebase:
```bash
grep -r "'outline'\|'dependencies'\|'documentation'\|'scratchpad'\|'tracing'\|'secrets'\|'logs'\|'terminal'\|'cache'" apps/web/src/features/lab/ --include="*.ts" --include="*.tsx"
```

For each reference: either remove the code block or add a comment `// Panel removed in lab redesign`.

**Step 6: Commit**

```bash
git add -u
git commit -m "chore(lab): reduce panel config from 16 to 7 per design spec"
```

---

## Task 4: Magnetic Snap — Shared Line Numbers (P2)

**Problem:** Currently each cell has independent line numbers starting at 1. Design doc §7.1 says pure-code cells should share continuous line numbers, like one long file.

**Files:**
- Modify: `apps/web/src/features/lab/components/editor/cell/` — find where CodeMirror instances are created
- Potentially modify: `apps/web/src/features/lab/core/codemirror/` — CodeMirror extensions

**Step 1: Research CodeMirror `firstLineNumber`**

CodeMirror 6 supports `EditorState.lineSeparator` and the `lineNumbers()` extension accepts a `formatNumber` option. The approach:
- Compute cumulative line count for each cell based on the cells above it
- Pass this offset to each CodeMirror instance via `firstLineNumber` in the EditorView config

**Step 2: Find where CodeMirror EditorView is created**

Search for `EditorView` or `useCodeMirror` in the lab feature:
```bash
grep -r "EditorView\|new Editor" apps/web/src/features/lab/core/codemirror/ --include="*.ts" --include="*.tsx" -l
```

Also search for where the cell code editor component is rendered:
```bash
grep -r "CellEditor\|CodeEditor\|useEditor" apps/web/src/features/lab/components/editor/cell/ --include="*.ts" --include="*.tsx" -l
```

**Step 3: Implement cumulative line number offset**

This requires:
1. A Jotai atom or derived state that computes `cumulativeLineCount` for each cellId based on cell order and code length
2. Each cell editor receives its offset and passes it to CodeMirror

The implementation depends heavily on how cells are stored (likely `notebookAtom` → `CellData[]`). Each cell has a `code` field — count `\n` occurrences to get line count.

**Step 4: Wire offset into CodeMirror**

In the CodeMirror setup, add:
```ts
EditorView.baseConfiguration.of([
  lineNumbers({ formatNumber: (n) => String(n + offset) })
])
```

Or use CodeMirror's `firstLineNumber` facet if available.

**Step 5: Verify**

1. Create a notebook with 3 cells, each with 5 lines of code
2. Cell 1 shows lines 1-5
3. Cell 2 shows lines 6-10
4. Cell 3 shows lines 11-15
5. Add a line to cell 1 → cell 2 updates to 6-11, cell 3 to 12-16

**Step 6: Commit**

```bash
git commit -m "feat(lab): magnetic snap — shared continuous line numbers across cells"
```

---

## Task 5: Data Catalog Panel (P3)

**Problem:** Design doc §6.2 — a new panel replacing Snippets that shows categorized data sources with schema preview, sample table, and "Insert Code" buttons.

**Files:**
- Create: `apps/web/src/features/lab/components/editor/chrome/panels/data-catalog/data-catalog-panel.tsx`
- Create: `apps/web/src/features/lab/components/editor/chrome/panels/data-catalog/mock-data.ts`
- Modify: `apps/web/src/features/lab/components/editor/chrome/wrapper/floating-panels.tsx` (or wherever snippets panel is rendered) — replace snippets with Data Catalog

**Step 1: Create mock data**

```ts
// mock-data.ts
export interface DataSource {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  category: 'market' | 'fundamental' | 'factor' | 'alternative' | 'reference';
  schema: { column: string; type: string; example: string }[];
  sampleCode: string;
}

export const MOCK_DATA_SOURCES: DataSource[] = [
  {
    id: 'stock_zh_a_hist',
    name: 'stock_zh_a_hist',
    nameZh: 'A股历史行情',
    description: '获取A股个股历史K线数据',
    category: 'market',
    schema: [
      { column: 'date', type: 'str', example: '2024-01-02' },
      { column: 'open', type: 'float64', example: '9.82' },
      { column: 'close', type: 'float64', example: '9.91' },
      { column: 'high', type: 'float64', example: '9.95' },
      { column: 'low', type: 'float64', example: '9.78' },
      { column: 'volume', type: 'int64', example: '1234567' },
    ],
    sampleCode: `df = ak.stock_zh_a_hist("000001", period="daily", adjust="qfq")`,
  },
  // ... 4-5 more mock sources across categories
];
```

**Step 2: Create DataCatalogPanel component**

Use the Mine design system:
- Category tree on left (collapsible sections with icons)
- Each data source: name + description + schema table + "Insert Code" button
- "Insert Code" button pushes code to the active cell (use Marimo's cell insertion API)
- Style: `DetailSection`-like layout with `text-[10px]` labels, `font-mono` for code

**Step 3: Wire into panel system**

Replace the snippets panel render path with DataCatalogPanel. In `floating-panels.tsx`, the `sidebarPanels` prop maps `PanelType` → `ReactNode`. Find where `'snippets'` is mapped and replace with `<DataCatalogPanel />`.

**Step 4: Verify**

1. Open lab, connect to kernel
2. Click Data Catalog icon in sidebar
3. Floating card appears with categorized data sources
4. Expand a category → see schema + sample code
5. Click "Insert Code" → code appears in active cell

**Step 5: Commit**

```bash
git add apps/web/src/features/lab/components/editor/chrome/panels/data-catalog/
git commit -m "feat(lab): Data Catalog panel with categorized data sources and Insert Code"
```

---

## Task 6: Status Dock Redesign (P5)

**Problem:** Design doc §10 — the floating footer dock needs to show: kernel status, issue count, Run All/Stop, Save, keyboard shortcuts reference.

**Current state:** The footer in `footer.tsx` already has a lab-active floating dock (glassmorphism pill, centered at bottom). It shows: DockFileTabs, BackendConnectionStatus, MachineStats, error/warning toggle, RuntimeSettings, AI status, Copilot status, RTC status.

**Files:**
- Modify: `apps/web/src/features/lab/components/editor/chrome/wrapper/footer.tsx`

**Step 1: Audit what's in the current dock vs what the design doc wants**

Current dock has (in lab mode):
- ✅ Kernel status (BackendConnectionStatus)
- ✅ Error count (error/warning toggle button)
- ❌ Missing: Run All / Stop buttons
- ❌ Missing: Keyboard shortcuts reference button
- ❌ Has but not needed: DockFileTabs (single notebook, always same file)
- ❌ Has but not needed: MachineStats, AI/Copilot/RTC status

**Step 2: Simplify the dock for lab mode**

Remove: DockFileTabs, MachineStats, AIStatusIcon, CopilotStatusIcon, RTCStatus from lab-active render path.

Add:
- Run All button (`PlayCircle` icon, calls `runAll` action)
- Stop button (`Square` icon, calls `interrupt` action)
- Keyboard shortcuts button (small `⌨` icon, opens shortcuts panel or shows tooltip)

**Step 3: Verify**

1. Open lab editor
2. Floating dock at bottom shows: [Kernel status] [Issue count] [Run All] [Stop] [⌨]
3. Click Run All → all cells execute
4. Click Stop → execution interrupted
5. Click ⌨ → shortcuts reference appears

**Step 4: Commit**

```bash
git add apps/web/src/features/lab/components/editor/chrome/wrapper/footer.tsx
git commit -m "feat(lab): streamline status dock — Run All, Stop, keyboard shortcuts"
```

---

## Task 7: Welcome Template for Empty Notebooks (P5)

**Problem:** Design doc §9.2 — new notebooks should show a low-opacity hint with keyboard shortcuts, not a blank cell.

**Current state:** `cell.css` already has empty cell hint styles:
```css
[data-slot='lab-fullscreen'] .cm-editor .cm-placeholder::after {
  content: '⌘K command palette · ⇧⌘Enter run all';
  /* styling... */
}
```

This activates automatically once Task 1 (data-slot fix) is done. Verify it works after Task 1.

**Files:** None new — this is covered by Task 1's CSS activation.

**Step 1: Verify after Task 1**

After `data-slot="lab-fullscreen"` is added:
1. Open lab, connect
2. Create a new empty cell or open empty notebook
3. Empty cell should show placeholder text with keyboard shortcuts
4. Text should be low-opacity and disappear when typing

If the CSS `::after` approach doesn't work (CodeMirror placeholder might not support `::after`), implement as a React overlay instead.

**Step 2: Commit (if changes needed)**

```bash
git commit -m "feat(lab): empty cell welcome hint with keyboard shortcuts"
```

---

## Task 8: Command Palette Polish (P5)

**Problem:** Design doc §11 — Cmd+K trigger, styled per blocks.so/command-menu reference.

**Current state:** Command palette already works (`command-palette.tsx`, 211 lines). Uses `CommandDialog` (shadcn/Radix cmdk). Triggered by `global.commandPalette` hotkey.

**Files:**
- Modify: `apps/web/src/features/lab/components/editor/controls/command-palette.tsx` (if styling needs update)

**Step 1: Verify Cmd+K works**

1. Open lab editor
2. Press Cmd+K
3. Command palette should open
4. Type a command → results filter
5. Press Enter → command executes

If Cmd+K already works, check if styling matches the blocks.so reference (clean, minimal, centered modal with search + grouped results).

**Step 2: Style adjustments (if needed)**

The current `CommandDialog` likely uses shadcn defaults. If visual polish is needed:
- Center vertically in viewport (not top-aligned)
- Max width 520px
- Subtle backdrop blur
- Grouped sections with `text-mine-muted` headers

**Step 3: Remove command palette button from toolbar**

Per design doc: "不做单独的 UI 入口按钮". If the `CommandPaletteButton` is rendered in any toolbar, remove it — Cmd+K is the only entry point.

**Step 4: Commit**

```bash
git commit -m "feat(lab): polish command palette styling, Cmd+K only entry point"
```

---

## Execution Notes

**Task dependencies:**
- Task 1 (CSS activation) is the highest-impact, lowest-effort change — do first
- Task 2 + 3 (P0 cleanup) are independent, can be done in any order
- Task 4 (magnetic snap) is complex and independent
- Task 5 (Data Catalog) depends on Task 3 (panel config cleanup)
- Task 6 (Status Dock) is independent
- Task 7 (Welcome template) depends on Task 1
- Task 8 (Command palette) is independent

**Recommended execution order:** 1 → 2 → 3 → 7 → 5 → 6 → 8 → 4

Task 4 (magnetic snap) is the riskiest — it requires deep CodeMirror integration. Save it for last so other improvements ship first.
