# Unified Panel System Design

> Date: 2026-02-25
> Status: Approved

## Problem

Left sidebar (file tree) and right sidebar (SidePanel) are built as separate systems with different DOM structures, animation wrappers, and state management. This causes persistent visual inconsistencies and duplicated code across 3+ files.

## Solution

One panel system drives all three slots (left, right, bottom). A single `PANELS` config array defines every panel. One `PanelSlot` component renders the animated shell. One `PanelButton` component renders icon bar buttons.

## Data Model

```ts
type PanelDef = {
  id: string;
  icon: LucideIcon;
  label: string;
  side: 'left' | 'right' | 'bottom';
  size: number | string;      // px for left/right, CSS value for bottom
  group?: string;              // button group separator
  connectedOnly?: boolean;     // disabled when disconnected
};

const PANELS: PanelDef[] = [
  { id: 'files',          icon: FolderOpen,       label: 'Files',     side: 'left',   size: 280 },
  { id: 'variables-mine', icon: Variable,         label: '变量',      side: 'right',  size: 280, group: 'mine' },
  { id: 'components',     icon: Box,              label: '组件',      side: 'right',  size: 320 },
  { id: 'ai',             icon: Bot,              label: 'AI 助手',   side: 'right',  size: 360 },
  { id: 'snippets-mine',  icon: SquareDashedBottomCode, label: '代码片段', side: 'right', size: 300 },
  { id: 'experiments',    icon: FlaskConical,     label: '实验',      side: 'right',  size: 340 },
  { id: 'variables',      icon: Package,          label: '变量检查器', side: 'right', size: 280, group: 'data' },
  { id: 'packages',       icon: Box,              label: '包管理',    side: 'right',  size: 280 },
  { id: 'snippets',       icon: Database,         label: '数据目录',  side: 'right',  size: 320 },
  { id: 'errors',         icon: AlertCircle,      label: '错误',      side: 'right',  size: 300, group: 'dev' },
  { id: 'validation',     icon: FlaskConical,     label: '因子验证',  side: 'right',  size: 340 },
  { id: 'terminal',       icon: TerminalSquare,   label: '终端',      side: 'bottom', size: '30%', connectedOnly: true },
];

const MUTEX_GROUPS: string[][] = [
  ['files', 'terminal'],
];
```

## State (use-lab-mode-store)

```ts
leftPanel: string | null;
rightPanel: string | null;
bottomPanel: string | null;

togglePanel(id: string) {
  const def = PANELS.find(p => p.id === id);
  if (def.connectedOnly && mode !== 'active') return;

  const slotKey = `${def.side}Panel`;
  const current = get()[slotKey];
  const next = current === id ? null : id;

  const updates = { [slotKey]: next };

  // Mutex: close other members of the same mutex group
  if (next !== null) {
    for (const group of MUTEX_GROUPS) {
      if (group.includes(id)) {
        for (const otherId of group) {
          if (otherId !== id) {
            const otherDef = PANELS.find(p => p.id === otherId);
            if (otherDef) updates[`${otherDef.side}Panel`] = null;
          }
        }
      }
    }
  }

  set(updates);
}
```

Replaces: `fileTreeVisible`, `terminalOpen`, `activePanel`, `toggleFileTree`, `toggleTerminal`, `openTerminal`, `closeTerminal`.

## Components

### PanelSlot — unified animated shell

```
<AnimatePresence>
  <motion.div>           ← animation wrapper (width or height)
    <PanelShell>          ← white card + header (skipped for bottom)
      <PanelContent />    ← routed content
    </PanelShell>
  </motion.div>
</AnimatePresence>
```

- Left/right: width animation, PanelShell with title + close button
- Bottom: height animation, no PanelShell (terminal has its own dark chrome)
- Bottom slot: mount-once pattern (keep mounted after first open, animate height to 0)

### PanelContent — unified content router

```
Connected:
  files     → ConnectedFileTreeInner (with MARIMO_TO_MINE_VARS wrapper)
  terminal  → LazyTerminal
  variables → LazySessionPanel (wrapped in jotai Provider)
  packages  → LazyPackagesPanel
  snippets  → LazyDataCatalogPanel
  errors    → LazyErrorsPanel
  validation → LazyValidationPanel
  others    → falls through to Disconnected

Disconnected:
  files     → DisconnectedFileTree (static Mine-styled tree)
  variables → LiteVariablePanel
  errors    → LiteErrorPanel
  others    → PlaceholderPanel
```

### PanelButton — shared icon bar button

36×36px, GlowingEffect, BUTTON_SHADOW/BUTTON_INSET, active/inactive/disabled states.
Bottom panels use `rounded-full`, left/right use `rounded-[9px]`.

### LeftBar / ActivityBar — thin wrappers

LeftBar renders `PANELS.filter(side === 'left')` at top + `PANELS.filter(side === 'bottom')` at bottom.
ActivityBar renders `PANELS.filter(side === 'right')` + MoreHorizontal footer button.
Both use PanelButton for each item.

## Layout (lab-page.tsx)

```
<LeftBar />
<PanelSlot side="left" panelId={leftPanel} />
<EditorArea>
  {editor content}
  <PanelSlot side="bottom" panelId={bottomPanel} />
</EditorArea>
<PanelSlot side="right" panelId={rightPanel} />
<ActivityBar />
```

## File Changes

| Op | File | Notes |
|----|------|-------|
| NEW | `shell/panels.ts` | PANELS config, PanelDef type, MUTEX_GROUPS |
| NEW | `shell/panel-slot.tsx` | Unified shell: AnimatePresence + motion.div + PanelShell |
| NEW | `shell/panel-content.tsx` | Unified content router |
| NEW | `shell/panel-button.tsx` | Shared button component |
| REWRITE | `shell/left-bar.tsx` | Consume PANELS + PanelButton |
| REWRITE | `shell/activity-bar.tsx` | Consume PANELS + PanelButton, keep error badge logic |
| DELETE | `shell/side-panel.tsx` | Replaced by PanelSlot |
| SLIM | `shell/mine-file-tree.tsx` | Content only, remove PanelShell wrapping |
| REWRITE | `shell/mine-app-chrome.tsx` | Replace hand-written file tree/terminal with PanelSlot |
| REWRITE | `lab-page.tsx` | Replace StaticFileTree + SidePanel with PanelSlot |
| MODIFY | `store/use-lab-mode-store.ts` | leftPanel/rightPanel/bottomPanel + togglePanel() |
| KEEP | `shell/panel-shell.tsx` | Unchanged, used by PanelSlot |
| UPDATE | `__tests__/panel-shell.test.tsx` | Add PanelSlot, PanelButton tests |

## Migration Notes

- `fileTreeVisible` → `leftPanel === 'files'`
- `terminalOpen` → `bottomPanel === 'terminal'`
- `activePanel` → `rightPanel`
- All consumers of `toggleFileTree`/`toggleTerminal` → `togglePanel('files')`/`togglePanel('terminal')`
- `useTerminalCommands.openTerminal()` → `togglePanel('terminal')` (in terminal/hooks.ts)
