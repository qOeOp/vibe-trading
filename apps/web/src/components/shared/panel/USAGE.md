# Panel System — Usage Guide

## Mandatory Rules

1. **ALL panels** (sidebar, detail, bottom) MUST use PanelFrame + PanelFrameHeader + PanelFrameBody
2. **ALL content sections** MUST be wrapped in PanelSection — never hand-write `border-b` dividers
3. **ALL text** inside panels MUST use `panel-*` CSS classes or panel primitive components — never hardcode font specs
4. **ALL numeric values** MUST use `panel-value` class or PanelStatItem/PanelKV
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

## Typography — CSS Utility Classes

Each role is a single CSS class defined via `@utility` in `globals.css`. Use them directly in `className`:

| Class            | Role                          | When to use                     |
| ---------------- | ----------------------------- | ------------------------------- |
| `panel-label`    | Section titles, frame headers | Annotating what something IS    |
| `panel-body`     | Primary readable content      | Descriptions, explanations      |
| `panel-value`    | Data that changes             | Numbers, variable names         |
| `panel-hint`     | Secondary context             | KV labels, timestamps, suffixes |
| `panel-label-sm` | Compact labels                | StatItem labels, badge text     |
| `panel-value-sm` | Compact values                | Badge numbers, inline counts    |
| `panel-value-lg` | KPI headline                  | Large prominent numbers         |

## Anti-Patterns (BANNED)

```tsx
// ❌ Hand-written section divider
<div className="border-b border-mine-border/50">

// ✅ Use PanelSection (border-b built in)
<PanelSection title="Statistics">

// ❌ Hardcoded font spec
<span className="text-[10px] text-mine-muted uppercase tracking-wider font-medium">

// ✅ Use CSS utility class
<span className="panel-label">

// ❌ Hand-written stat display
<div className="text-sm font-bold font-mono tabular-nums">+0.022</div>

// ✅ Use PanelStatItem
<PanelStatItem label="IC" value="+0.022" color="down" />

// ❌ Hand-written KV pair
<div className="flex justify-between">
  <span className="text-[10px] text-mine-muted">Label</span>
  <span className="text-[11px] font-mono">Value</span>
</div>

// ✅ Use PanelKV
<PanelKV label="Label" value="Value" />

// ❌ JS constant for typography
cn(PANEL_TYPOGRAPHY.label, 'extra-class')

// ✅ CSS class directly
cn('panel-label', 'extra-class')
```
