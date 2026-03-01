# Unified Panel System Design

> Date: 2026-03-01
> Status: Approved

## Problem

Three separate panel primitive systems coexist:
- **Lab panels**: `panel-primitives/` — PanelBar, PanelBody, PanelSection, PanelRow, PanelText
- **Library detail**: `detail-panel/` — DetailPanel, DetailSection, DetailStatGrid, DetailKV
- **Mining**: No primitives — hand-written styles throughout

Typography specs are hardcoded independently per component (9px/10px/11px/14px scattered without semantic mapping). V1/V2 toggle system exists solely for preview and should be removed.

## Design Decisions

| # | Decision | Resolution |
|---|----------|------------|
| 1 | Frame direction | Single-track: PanelSlot → PanelFrame → Header + Body |
| 2 | Frame naming | PanelFrame (replaces ContentFrame) |
| 3 | Header composition | Title + SubTitle badge (optional) + Actions slot + red close dot |
| 4 | Header font | 10px uppercase tracking-wider (label role) |
| 5 | Body structure | toolbar (fixed top) + scrollable PanelSection list |
| 6 | Section dividers | border-b border-mine-border/50, last:border-b-0 |
| 7 | Section title | Optional; shown when provided |
| 8 | Section collapsible | Built-in `collapsible` prop with chevron + animation |
| 9 | Content primitives | PanelStatGrid/StatItem, PanelKV, PanelRow, PanelChartBox, PanelEmpty, PanelBadge/BadgeTag, PanelActionButton, PanelSearchBar |
| 10 | Typography system | 4 semantic roles (label/body/value/hint) + size axis (sm/base/lg), CVA |
| 11 | Component location | `components/shared/panel/`, L2 layer, replaces `detail-panel/` |
| 12 | V1/V2 toggle | Remove entirely |

## Component Hierarchy

```
PanelSlot (positioning, animation, resize — existing, unchanged)
  └── PanelFrame (gray bg, rounded-[20px] container)
        ├── PanelFrameHeader (title + subtitle badge + actions + red close dot)
        └── PanelFrameBody (white bg, toolbar fixed top + scrollable content)
              ├── PanelSection (optional title + border-b divider + collapsible)
              │     └── Content primitives (free composition)
              ├── PanelSection
              └── ...
```

## Typography System

4 semantic roles, unified across all components via CVA:

| Role | Semantics | Spec |
|------|-----------|------|
| **label** | Annotative text — section titles, stat labels, KV labels | font-medium, mine-muted, uppercase, tracking-wider. Default 10px |
| **body** | Primary content — descriptions, text | mine-text. Default 11px |
| **value** | Data values — numbers, variables, code | font-mono, tabular-nums, mine-text. Default 11px |
| **hint** | Secondary info — suffixes, timestamps, context | mine-muted. Default 10px |

Size axis: `sm` (9px), `base` (default per role), `lg` (14px + bold).

```tsx
const panelTextVariants = cva('', {
  variants: {
    variant: {
      label:  'font-medium text-mine-muted uppercase tracking-wider',
      body:   'text-mine-text',
      value:  'font-mono tabular-nums text-mine-text',
      hint:   'text-mine-muted',
    },
    size: {
      sm:   'text-[9px]',
      base: 'text-[11px]',
      lg:   'text-sm font-bold',
    }
  },
  defaultVariants: { size: 'base' },
  compoundVariants: [
    { variant: 'label', size: 'base', className: 'text-[10px]' },
    { variant: 'hint',  size: 'base', className: 'text-[10px]' },
  ]
})
```

All panel components reference `PANEL_TYPOGRAPHY` map internally — no hardcoded font specs.

## File Structure

```
components/shared/panel/
├── panel-frame.tsx           # Gray bg rounded container
├── panel-frame-header.tsx    # Title + subtitle badge + actions + close dot
├── panel-frame-body.tsx      # White bg, fixed toolbar + scrollable area
├── panel-section.tsx         # Content segment (title + border-b + collapsible)
├── panel-stat-grid.tsx       # KPI grid (2/3/4 columns)
├── panel-stat-item.tsx       # Single KPI (value-lg + label)
├── panel-kv.tsx              # Key-value row (label left, value right)
├── panel-row.tsx             # Interactive row (hover + onPress)
├── panel-chart-box.tsx       # Chart container (mine-bg rounded)
├── panel-empty.tsx           # Empty state placeholder
├── panel-text.tsx            # Unified text (4 variants + size axis)
├── panel-badge.tsx           # Inline badge + capsule tag
├── panel-action-button.tsx   # Small icon button
├── panel-search-bar.tsx      # Search input (for toolbar)
├── panel-typography.ts       # PANEL_TYPOGRAPHY map (single source of truth)
└── index.ts                  # Named exports
```

## Composition Examples

### Simple: Lab Variables Panel (1 section)

```tsx
<PanelFrame>
  <PanelFrameHeader title="变量" onClose={...} />
  <PanelFrameBody>
    <PanelSection>
      {vars.map(v => (
        <PanelRow key={v.name} onPress={() => jump(v.cellId)}>
          <PanelText variant="value">{v.name}</PanelText>
          <PanelText variant="value" className="text-mine-accent-teal">{v.cellName}</PanelText>
        </PanelRow>
      ))}
    </PanelSection>
  </PanelFrameBody>
</PanelFrame>
```

### Medium: Mining Task Detail (4 sections)

```tsx
<PanelFrame>
  <PanelFrameHeader
    title="#20260228_008"
    subtitle={<PanelBadgeTag>自主因子发现</PanelBadgeTag>}
    actions={<button>停止</button>}
    onClose={...}
  />
  <PanelFrameBody>
    <PanelSection title="运行进度" suffix="Loop 3/10">
      <ProgressBar value={30} />
      <PanelStatGrid columns={3}>
        <PanelStatItem label="已发现" value="12" />
        <PanelStatItem label="已接受" value="3" color="down" />
        <PanelStatItem label="最佳 IC" value="+0.042" color="down" />
      </PanelStatGrid>
    </PanelSection>
    <PanelSection title="实时日志">...</PanelSection>
    <PanelSection title="研究假设" collapsible>...</PanelSection>
    <PanelSection title="发现因子">...</PanelSection>
  </PanelFrameBody>
</PanelFrame>
```

### Toolbar: Data Catalog (search + collapsible sections)

```tsx
<PanelFrame>
  <PanelFrameHeader title="数据目录" onClose={...} />
  <PanelFrameBody toolbar={<PanelSearchBar placeholder="搜索..." />}>
    <PanelSection title="行情数据" badge="8" collapsible defaultOpen>
      {items.map(...)}
    </PanelSection>
    <PanelSection title="基本面" badge="5" collapsible>
      {items.map(...)}
    </PanelSection>
  </PanelFrameBody>
</PanelFrame>
```

### Complex: Factor Detail (12+ sections)

```tsx
<PanelFrame>
  <PanelFrameHeader
    title="momentum_20d"
    subtitle={<PanelBadgeTag color="teal">动量因子</PanelBadgeTag>}
    onClose={...}
  />
  <PanelFrameBody>
    <PanelSection title="综合概览">
      <VScoreIndicator />
      <RadarChart />
    </PanelSection>
    <PanelSection title="核心指标" suffix="全A · Rank IC · 5日调仓">
      <PanelStatGrid columns={3}>
        <PanelStatItem label="IC" value="+0.022" color="down" />
        <PanelStatItem label="IR" value="0.78" />
        <PanelStatItem label="t-stat" value="1.75" />
      </PanelStatGrid>
    </PanelSection>
    <PanelSection title="IC 衰减" suffix="Lag T+1 ~ T+20">
      <PanelChartBox>
        <ICDecayChart data={data} />
      </PanelChartBox>
    </PanelSection>
    <PanelSection title="IC 统计详情" collapsible defaultOpen={false}>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <PanelKV label="均值" value="+0.0198" color="up" />
        <PanelKV label="标准差" value="0.0342" />
      </div>
    </PanelSection>
    {/* ... more sections */}
  </PanelFrameBody>
</PanelFrame>
```

## Migration Plan

1. **Build**: Create `components/shared/panel/` with all primitives
2. **Verify**: Apply to one Lab panel (variables) + one section of factor detail to validate API
3. **Migrate Lab panels**: Replace `panel-primitives/` usage, remove V1/V2 toggle system
4. **Migrate factor detail**: Replace `detail-panel/` usage
5. **Migrate mining**: Replace hand-written styles
6. **Cleanup**: Delete `panel-primitives/`, `detail-panel/`, `use-panel-v2.ts`
7. **Guard**: Add `USAGE.md` in `components/shared/panel/` with enforcement rules

## AI Discipline (Post-Implementation)

Add `components/shared/panel/USAGE.md` with:
1. Mandatory rules: all panels must use PanelFrame + PanelSection
2. Decision tree: what primitive to use for each data type
3. Anti-patterns: common violations to avoid
4. Typography: reference PANEL_TYPOGRAPHY, never hardcode font specs

Update `CLAUDE.md` and `component-design-system.md` to reference the new panel system.
