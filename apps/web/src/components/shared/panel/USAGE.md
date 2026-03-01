# Panel System — Usage Guide

## Mandatory Rules

1. **ALL panels** (sidebar, detail, bottom) MUST use PanelFrame + PanelFrameHeader + PanelFrameBody
2. **ALL content sections** MUST be wrapped in PanelSection — never hand-write `border-b` dividers
3. **ALL text** inside panels MUST use PanelText or a panel primitive — never hardcode font sizes
4. **ALL numeric values** MUST use `<PanelText variant="value">` or PanelStatItem/PanelKV
5. **ALL section titles** come from PanelSection's `title` prop — never write label typography manually

## Decision Tree

Need to display data in a panel? Follow this:

1. Multiple KPI numbers in a grid? → `PanelStatGrid` + `PanelStatItem`
2. Key-value pairs (label: value)? → `PanelKV`
3. Clickable list items? → `PanelRow` (+ `PanelActions` for hover buttons)
4. A chart/visualization? → `PanelChartBox`
5. No data yet? → `PanelEmpty`
6. Inline count/status? → `PanelBadge` or `PanelBadgeTag`
7. Free-form text? → `PanelText` with appropriate variant

## Typography — Use the 4 Semantic Roles

| Role    | When                         | Example                                      |
| ------- | ---------------------------- | -------------------------------------------- |
| `label` | Annotating what something IS | Section titles, stat labels, KV labels       |
| `body`  | Primary readable content     | Descriptions, explanations                   |
| `value` | Data that changes            | Numbers, variable names, code                |
| `hint`  | Secondary context            | Timestamps, parameter descriptions, suffixes |

Never hardcode: `text-[10px] font-medium text-mine-muted uppercase tracking-wider`
Instead use: `<PanelText variant="label">` or reference `PANEL_TYPOGRAPHY.label`

## Anti-Patterns (BANNED)

```tsx
// ❌ Hand-written section divider
<div className="border-b border-mine-border/50">

// ✅ Use PanelSection (border-b built in)
<PanelSection title="Statistics">

// ❌ Hardcoded font spec
<span className="text-[10px] text-mine-muted uppercase tracking-wider font-medium">

// ✅ Use PanelText or let PanelSection handle it
<PanelText variant="label">

// ❌ Hand-written stat display
<div className="text-sm font-bold font-mono tabular-nums">+0.022</div>

// ✅ Use PanelStatItem or PanelText variant="value"
<PanelStatItem label="IC" value="+0.022" color="down" />

// ❌ Hand-written KV pair
<div className="flex justify-between">
  <span className="text-[10px] text-mine-muted">Label</span>
  <span className="text-[11px] font-mono">Value</span>
</div>

// ✅ Use PanelKV
<PanelKV label="Label" value="Value" />
```
